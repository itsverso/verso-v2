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
		<div className="flex flex-col mb-6 md:mb-10">
			<Link
				key={index}
				href={route}
				onMouseEnter={() => setMouseOver(true)}
				onMouseLeave={() => setMouseOver(false)}
				className="w-full md:h-96 md:p-4 flex md:flex-col md:items-center md:justify-center"
			>
				<img
					alt=""
					src={src}
					className={`w-full md:h-full cursor-pointer object-contain`}
				/>
			</Link>
		</div>
	);
};
