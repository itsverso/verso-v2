import React from "react";

type Props = {};

export function CollectionPlaceholder(props: Props) {
	return (
		<div className={`relative w-full aspect-square`}>
			<div className="w-full h-full flex flex-row">
				<div className="h-full w-1/2 bg-zinc-100 border-r-4 border-white"></div>
				<div className="flex flex-col w-1/2 h-full">
					<div className="w-full h-1/2 bg-zinc-100 border-b-4 border-white"></div>
					<div className="w-full h-1/2 bg-zinc-100"></div>
				</div>
			</div>
		</div>
	);
}
