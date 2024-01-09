import React, { useContext, useEffect } from "react";
import { CollectionCard } from "./CollectionCard";
import { AppContext } from "../../context/context";
import * as Icons from "../../resources/icons";
import { UserActionTypes } from "@/reducers/userReducer";
import useGetUserCollections from "@/hooks/useGetUserCollections";

type Collection = {
	address: string;
	title: string;
	description: string;
	image: string;
};

type CarouselProps = {
	handle: string;
	collections: Collection[];
	openDrawer: () => void;
	onClick: () => void;
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
	}, [state.user.fetch]);

	if (isLoading) {
		return <div></div>;
	}

	if (!error && data.collections) {
		return (
			<div className="w-full flex flex-col lg:flex-row items-center">
				{props.collections.length ? (
					<div className="h-full w-full flex items-center justify-center pt-6">
						<p className="text-zinc500 text-base">
							This user has no collections yet.
						</p>
					</div>
				) : null}
				<div className="w-full grid grid-cols-2 lg:grid md:grid-cols-2 gap-6 lg:gap-12">
					{data.collections.ownedNfts.map((item: any, index: any) => (
						<CollectionCard
							key={index}
							item={item}
							handle={props.handle}
							title={item.title}
							src={item.media[0].gateway}
							address={item.address}
						/>
					))}
				</div>
			</div>
		);
	}
}
