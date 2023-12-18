import React, { useState, useEffect, useContext, useCallback } from "react";
import { AppContext } from "../../context/context";
import Link from "next/link";

type Props = {
	title: string;
	src: string;
	address: string;
	handle: string;
	item: any;
};

export function CollectionCard(props: Props) {
	const { title, src, address, item } = props;
	const { state, dispatch } = useContext(AppContext);
	const [compLoading, setcompLoading] = useState<boolean>(true);
	const [RenderBin, setRenderBin] = useState<boolean>(false);
	const [totalElements, setTotalElements] = useState<number>();

	useEffect(() => {
		// fetchElements();
	}, []);

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
				className={`relative max-w-72 cursor-pointer hover:opacity-90 ${
					compLoading ? "" : null
				}`}
			>
				<img
					src={src}
					onLoad={handleOnLoad}
					className={`w-full h-40 lg:h-72 lg:w-72 object-cover object-center ${
						compLoading ? "bg-slate200" : null
					}`}
				/>

				<div className="py-2">
					<p className="font-lora text-sm lg:text-lg">{title}</p>
					<p className="font-lora text-xs text-zinc500">
						{totalElements} elements
					</p>
				</div>
			</div>
		</Link>
	);
}
