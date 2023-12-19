"use client";
import React, { useState, useCallback } from "react";

import { PencilIcon, PhotoIcon, PlusIcon } from "@heroicons/react/24/solid";

export function AddMediaButton() {
	const [renderButtons, setRenderButtons] = useState<boolean>(false);

	const handleRenderButtons = useCallback(() => {
		setRenderButtons(!renderButtons);
	}, [renderButtons]);

	return (
		<div className="fixed bottom-10 right-12 flex flex-col items-center">
			{renderButtons ? (
				<>
					<div className="my-1 flex items-center justify-center  h-10 w-10 rounded-full bg-black hover:opacity-90 cursor-pointer shadow-2xl">
						<PhotoIcon className="w-4 h-4 text-white" />
					</div>

					<div className="my-1 flex items-center justify-center  h-10 w-10 rounded-full bg-black hover:opacity-90 cursor-pointer shadow-2xl">
						<PencilIcon className="w-4 h-4 text-white" />
					</div>
				</>
			) : null}

			<button
				onClick={handleRenderButtons}
				className="my-1 flex items-center justify-center  h-14 w-14 rounded-full bg-black hover:opacity-90 cursor-pointer shadow-2xl"
			>
				<PlusIcon className="w-6 h-6 text-white" />
			</button>
		</div>
	);
}
