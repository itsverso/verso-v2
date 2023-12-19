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
		return (
			<div className="flex flex-col lg:flex-row items-center">
				<div className="w-full grid grid-cols-1 md:grid-cols-4 gap-12">
					{[1, 1, 1, 1].map((item: any, index: any) => (
						<div key={index} className={`animate-pulse `}>
							<div
								className={`h-72 w-72 sm:w-full lg:w-72 bg-slate-100`}
							/>
							<div className="h-20 py-2">
								<div className="h-3 w-32 lg:w-44 rounded-md bg-slate-100 mt-3" />
								<div className="h-1 w-20 lg:w-24 my-2 rounded-md bg-slate-100" />
							</div>
						</div>
					))}
				</div>
			</div>
		);
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
				<div className="w-full grid grid-cols-2 lg:grid md:grid-cols-4 gap-6 lg:gap-12">
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

					{state.user.handle === state.user.handle ? (
						<div
							key={"#e4e4e7"}
							onClick={() => props.openDrawer()}
							className={`lg:h-72 w-full flex flex-col items-center justify-center cursor-pointer hover:opacity-90 bg-zinc-100`}
						>
							<Icons.Plus color={"#e4e4e7"} size={"20"} />
						</div>
					) : null}
				</div>
			</div>
		);
	}
}
