import React from "react";
import { CollectionCard } from "./CollectionCard";
import useGetUserCollections from "@/hooks/useGetUserCollections";
import { EmptyUserGrid } from "./EmptyUserGrid";

type Collection = {
	address: string;
	title: string;
	description: string;
	image: string;
};

type CarouselProps = {
	handle: string;
	isOwner: boolean;
	openDrawer: () => void;
};

export function CollectionsCarousel(props: CarouselProps) {
	const { handle } = props;
	const { data, error, isLoading } = useGetUserCollections(handle);

	if (isLoading) {
		return <div></div>;
	}

	if (!error && data.collections) {
		return (
			<div className="w-full flex flex-col lg:flex-row items-center">
				{data.collections.ownedNfts.length == 0 ? (
					<div>
						<EmptyUserGrid isOwner={props.isOwner} />
					</div>
				) : (
					<div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 lg:gap-12 mt-6">
						{data.collections.ownedNfts.map(
							(item: any, index: any) => (
								<CollectionCard
									key={index}
									item={item}
									handle={props.handle}
									title={item.title}
									address={item.address}
								/>
							)
						)}
					</div>
				)}
			</div>
		);
	}
}
