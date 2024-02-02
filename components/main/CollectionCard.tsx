import React, { useEffect, useCallback } from "react";
import useGetCollectionTokens from "@/hooks/useGetCollectionTokens";
import { useRouter } from "next/router";

type Props = {
	title: string;
	address: string;
	handle: string;
	item: any;
};

export function CollectionCard(props: Props) {
	const router = useRouter();
	const { title, address, item } = props;
	const { data, error, isLoading, mutate } = useGetCollectionTokens(
		item.tokenId
	);

	useEffect(() => {
		console.log("item: ", data);
		console.log("error: ", error);
	}, [data]);

	const handleCollectionRedirect = useCallback(() => {
		router.push(`/${props.handle}/${data?.address}`);
	}, [data]);

	return (
		<div
			onClick={handleCollectionRedirect}
			className={`relative w-full aspect-square cursor-pointer hover:opacity-90`}
		>
			<div className="w-full h-full flex flex-row">
				<div className="h-full w-1/2 bg-zinc-100 border-r-4 border-white">
					{data?.tokens?.nfts[0] ? (
						<img
							src={data?.tokens?.nfts[0]?.media[0]?.gateway}
							className="w-full h-full object-cover"
						/>
					) : null}
				</div>
				<div className="flex flex-col w-1/2 h-full">
					<div className="w-full h-1/2 bg-zinc-100 border-b-4 border-white">
						{data?.tokens?.nfts[1] ? (
							<img
								src={data?.tokens?.nfts[1]?.media[0]?.gateway}
								className="w-full h-full object-cover"
							/>
						) : null}
					</div>
					<div className="w-full h-1/2 bg-zinc-100">
						{data?.tokens?.nfts[2] ? (
							<img
								src={data?.tokens?.nfts[2]?.media[0]?.gateway}
								className="w-full h-full object-cover"
							/>
						) : null}
					</div>
				</div>
			</div>

			<div className="py-2">
				<p className="font-light text-gray-600">
					@{data?.moderators[0].handle} - {title}
				</p>
			</div>
		</div>
	);
}
