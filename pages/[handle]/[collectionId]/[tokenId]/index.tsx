import { useCallback, useEffect } from "react";
import { NextPage } from "next";
import { Info } from "@/resources/icons";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/router";

const TokenId: NextPage = () => {
	const router = useRouter();

	const handleRedirectBack = useCallback(() => {
		router.back();
	}, []);

	return (
		<main className="flex flex-row min-w-screen min-h-screen">
			<div className="w-2/3 p-10 h-screen flex items-center justify-center bg-zinc-100">
				<img
					className="h-full object-contain shadow-md"
					src="https://images.unsplash.com/photo-1704027115927-9f67ab4e39dc?q=80&w=2864&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
				/>
			</div>
			<div className="relative flex flex-col justify-between w-1/3 h-screen px-10 pt-28 pb-10">
				<div>
					<div className="flex flex-row items-center mb-4">
						<div className="h-6 w-6 rounded-full bg-zinc-200"></div>
						<p className="ml-2 text-xl text-gray-500 font-hedvig">
							username.verso
						</p>
					</div>
					<button
						onClick={handleRedirectBack}
						className="absolute top-10 right-12 h-10 w-10"
					>
						<XMarkIcon color="#646464" />
					</button>
					<p className="text-4xl font-hedvig">
						On the streets where we live
					</p>
					<p className="mt-4 text-zinc-600 font-sans">
						Normally these tiny insects ruined photographs, but this
						bird showed them whats up. Normally these tiny insects
						ruined photographs, but this bird showed them whats up.
						Normally these tiny insects ruined photographs, but this
						bird showed them whats up.
					</p>
				</div>
				<div className="">
					<div className="w-full h-14 bg-zinc-100 mb-4 flex items-center justify-center">
						<p className="">COLLECTED 127 TIMES</p>
					</div>
					<div className="w-full h-14 bg-black flex items-center justify-center">
						<p className="text-white">COLLECT FOR 1.23ETH</p>
					</div>
				</div>
			</div>
		</main>
	);
};

export default TokenId;
