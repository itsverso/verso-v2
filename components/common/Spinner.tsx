import React from "react";

type Props = {
	color?: string;
	size?: string;
};

export const Spinner = (props: Props) => {
	const { color, size } = props;

	return (
		<div
			className={`w-4 h-4 fill-${
				props.color ? props.color : "zinc-800"
			} border-${
				props.color ? props.color : "zinc-800"
			} border-2 border-dashed rounded-full animate-spin`}
		/>
	);
};
