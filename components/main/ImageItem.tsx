import React, { useState } from "react";
import Link from "next/link";

type Props = {
	index: any;
	route: string;
	src: string;
	item: any;
};

export const ImageItem = (props: Props) => {
	const { index, route, src, item } = props;
	const [mouseOver, setMouseOver] = useState<boolean>();

	return (
		<div className="flex flex-col mb-10">
			<Link
				key={index}
				href={route}
				onMouseEnter={() => setMouseOver(true)}
				onMouseLeave={() => setMouseOver(false)}
				className="w-full h-96 p-4 relative flex flex-col items-center justify-center"
			>
				<img
					alt=""
					src={src}
					className={`h-full cursor-pointer object-contain`}
				/>
			</Link>
			<div className="h-10">
				{mouseOver ? (
					<div className="relative flex flex-row justify-center">
						<p className="text-gray-600 font-light">
							{item.rawMetadata.title}
						</p>
					</div>
				) : null}
			</div>
		</div>
	);
};
