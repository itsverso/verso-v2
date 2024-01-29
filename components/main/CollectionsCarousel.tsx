import React, { useContext, useEffect } from "react";
import { CollectionCard } from "./CollectionCard";
import { CollectionPlaceholder } from "./CollectionPlaceholder";
import { AppContext } from "../../context/context";
import * as Icons from "../../resources/icons";
import { UserActionTypes } from "@/reducers/userReducer";
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
	const { state, dispatch } = useContext(AppContext);
	const { data, error, isLoading, mutate } = useGetUserCollections(handle);

	// Simple use effect to refetch collections
	useEffect(() => {
		if (state.user.fetch) {
			mutate();
			dispatch({
				type: UserActionTypes.FETCH,
				payload: { fetch: false },
			});
		}
		console.log("Hello: ", data);
	}, [state.user.fetch]);

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
					<div className="w-full grid grid-cols-2 lg:grid md:grid-cols-3 gap-6 lg:gap-12 mt-6">
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
