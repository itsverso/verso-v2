import React, { useContext } from "react";
import { Spinner } from "./Spinner";

type Props = {
	loading: boolean;
	onClick: () => void;
	text: string;
};

export function FormButton(props: Props) {
	return (
		<button
			onClick={props.onClick}
			disabled={props.loading}
			className={`h-12 w-full rounded-md
                ${
					props.loading
						? "bg-zinc-200 cursor-default"
						: "bg-zinc-800 hover:opacity-80 cursor-pointer shadow-lg"
				}  
                flex items-center justify-center text-sm sm:text-lg tracking-wider font-normal text-white`}
		>
			{props.loading ? (
				<div className="flex flex-row">
					<div
						className={`w-4 h-4 fill-zinc-800 border-zinc-800 border-2 border-dashed rounded-full animate-spin`}
					/>
				</div>
			) : (
				<p className="text-lg font-light text-white">{props.text}</p>
			)}
		</button>
	);
}
