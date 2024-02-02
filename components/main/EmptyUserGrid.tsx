import React, { useState, useCallback } from "react";
import * as Icons from "../../resources/icons";
import { CollectionPlaceholder } from "./CollectionPlaceholder";
import { useRouter } from "next/router";
import useWindowDimension from "@/hooks/useWindowDimensions";

export function EmptyUserGrid(props: any) {
	let router = useRouter();
	const { width } = useWindowDimension();

	const handleRedirect = () => {
		router.push("/create");
	};
	return (
		<div className="w-full gird grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 lg:gap-12 mt-6">
			{width > 600 ? <CollectionPlaceholder /> : null}
			<div className={`relative w-full aspect-square`}>
				<div className="w-full h-full p-20 flex flex-col items-center justify-center bg-[#EAFFEB]">
					{props.isOwner ? (
						<>
							<Icons.Plus color="#28772C" size={"32"} />
							<p className="font-hedvig text-3xl text-[#28772C] text-center my-6">
								We are eager to see your first collection on
								Verso
							</p>
							<button
								onClick={handleRedirect}
								className="py-3 px-4 rounded-md bg-[#56FE5F] mt-4"
							>
								<p>Create collection</p>
							</button>
						</>
					) : (
						<div>
							<p className="font-hedvig text-3xl text-[#28772C] text-center my-6">
								This user has no collections yet.
							</p>
						</div>
					)}
				</div>
			</div>
			<CollectionPlaceholder />
			<CollectionPlaceholder />
			<CollectionPlaceholder />
			<CollectionPlaceholder />
		</div>
	);
}
