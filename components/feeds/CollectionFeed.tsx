import React from "react";
import dynamic from "next/dynamic";
import { BlogPostCard } from "../main/BlogPostCard";
import useWindowDimension from "@/hooks/useWindowDimensions";

const Layout = dynamic(() => import("react-masonry-list"), {
	ssr: false,
});

type CollectionFeedProps = {
	id: any;
	items: any[];
};

type ImageItemProps = {
	index: any;
	item: any;
};

function ImageItem(props: ImageItemProps) {
	let { index, item } = props;

	return (
		<div
			key={index}
			className="lg:max-h-[80vh] flex flex-col lg:items-center relative"
		>
			<img
				alt=""
				width={0}
				height={0}
				sizes="100%"
				style={{ width: "auto", height: "auto" }}
				src={item?.media[0]?.gateway}
				className={`w-full shadow-xl cursor-pointer object-cover`}
			/>
		</div>
	);
}

export function CollectionFeed(props: CollectionFeedProps) {
	let { items } = props;
	let { width } = useWindowDimension();

	if (!items) {
		return null;
	}

	return (
		<Layout
			minWidth={40}
			colCount={width < 700 ? 1 : 4}
			items={props?.items?.map((item, index) => {
				if (item?.rawMetadata?.mimeType === "application/json") {
					return <BlogPostCard />;
				} else if (item?.rawMetadata?.mimeType?.includes("image")) {
					return <ImageItem index={index} item={item} key={index} />;
				} else {
					return <ImageItem index={index} item={item} key={index} />;
				}
			})}
		/>
	);
}
