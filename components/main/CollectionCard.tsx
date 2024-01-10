import React, { useState, useEffect, useContext, useCallback } from "react";
import { AppContext } from "../../context/context";
import useGetCollectionTokens from "@/hooks/useGetCollectionTokens";
import Link from "next/link";

type Props = {
	title: string;
	address: string;
	handle: string;
	item: any;
};

export function CollectionCard(props: Props) {
	const { title, address, item } = props;
	const { data, error, isLoading, mutate } = useGetCollectionTokens(
		item.tokenId
	);

	const { state, dispatch } = useContext(AppContext);
	const [compLoading, setcompLoading] = useState<boolean>(true);
	const [RenderBin, setRenderBin] = useState<boolean>(false);
	const [totalElements, setTotalElements] = useState<number>();

	useEffect(() => {
		console.log("item: ", data);
		console.log("error: ", error);
		// fetchElements();
	}, [data]);

	const fetchElements = async () => {
		let url = process.env.NEXT_PUBLIC_BASE_URL + "/get-collection-tokens";
		let res = await fetch(url, {
			method: "POST",
			body: JSON.stringify({ collection: address }),
		});
		let data = await res.json();
		setTotalElements(data.tokens.totalCount);
	};

	const handleOnLoad = useCallback(() => {
		setcompLoading(false);
	}, []);

	return (
		<Link
			href={`${props.handle}/${item.tokenId}`}
			style={{ textDecoration: "none" }}
		>
			<div
				onMouseEnter={() => setRenderBin(true)}
				onMouseLeave={() => setRenderBin(false)}
				className={`relative w-full aspect-square cursor-pointer hover:opacity-90 ${
					compLoading ? "" : null
				}`}
			>
				{true ? (
					<div className="w-full h-full flex flex-row">
						<div className="h-full w-1/2 bg-zinc-100">
							{data?.tokens?.nfts[0] ? (
								<img
									src={
										data?.tokens?.nfts[0]?.media[0]?.gateway
									}
									className="w-full h-full object-cover"
								/>
							) : null}
						</div>
						<div className="flex flex-col w-1/2 h-full">
							<div className="w-full h-1/2 bg-zinc-300">
								{data?.tokens?.nfts[1] ? (
									<img
										src={
											data?.tokens?.nfts[1]?.media[0]
												?.gateway
										}
										className="w-full h-full object-cover"
									/>
								) : null}
							</div>
							<div className="w-full h-1/2 bg-zinc-200">
								{data?.tokens?.nfts[2] ? (
									<img
										src={
											data?.tokens?.nfts[2]?.media[0]
												?.gateway
										}
										className="w-full h-full object-cover"
									/>
								) : null}
							</div>
						</div>
					</div>
				) : (
					<img
						onLoad={handleOnLoad}
						className={`w-full aspect-square object-cover object-center ${
							compLoading ? "bg-slate200" : null
						}`}
					/>
				)}

				<div className="py-2">
					<p className="font-lora text-sm lg:text-lg">{title}</p>
					<p className="font-lora text-xs text-zinc500">
						{data?.tokens?.nfts?.length || 0} elements
					</p>
				</div>
			</div>
		</Link>
	);
}
