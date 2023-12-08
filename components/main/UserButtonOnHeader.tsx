"use client";
import React, { useState, useEffect } from "react";
import { usePrivy, useWallets } from "@privy-io/react-auth";

export function UserButton() {
	const { logout } = usePrivy();
	const { wallets } = useWallets();
	const [address, setAddress] = useState<string>("");
	const [visible, setIsVisible] = useState<boolean>(false);

	useEffect(() => {
		setWalletAndNetwork();
	}, [wallets]);

	const setWalletAndNetwork = async () => {
		if (wallets[0]) {
			let wallet = wallets[0];
			await wallet.switchChain(420);
			setAddress(wallet.address);
		}
	};

	return (
		<div>
			<button
				className="relative h-10 w-10 rounded-md bg-neutral-300 flex items-center justify-center hover:opacity-80"
				onClick={() => setIsVisible(true)}
			>
				<div className="h-6 w-6 rounded-full bg-">
					<img
						className="h-6 w-6 rounded-full object-cover"
						src={
							"https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?q=80&w=2776&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
						}
					/>
				</div>
			</button>
			<div
				onMouseEnter={() => setIsVisible(true)}
				onMouseLeave={() => setIsVisible(false)}
				className={`${
					visible ? "visible" : "hidden"
				} absolute right-10 w-52 bg-white flex flex-col text-base z-50 list-none divide-y divide-gray-100 rounded shadow my-4`}
				id="dropdown"
			>
				<div className="px-4 py-3 flex flex-col items-left hover:bg-neutral-100 cursor-pointer">
					<div className="flex flex-row items-center ">
						<div className="w-1/4 flex items-center justify-center">
							<div className="h-10 w-10 rounded-full bg-white">
								<img
									className="h-10 w-10 rounded-full object-cover"
									src={
										"https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?q=80&w=2776&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
									}
								/>
							</div>
						</div>
						<div className="px-4">
							<p className="text-xl font-bold leading-0">Hugo</p>
							<p className="text-sm font-light text-gray-700">
								bighugs.verso
							</p>
						</div>
					</div>
				</div>
				<button className="h-12 text-left hover:bg-neutral-100 px-4">
					<p className="text-sm font-mono font-light">
						0x29Jh...e928
					</p>
				</button>
				<button className="h-12 text-left hover:bg-neutral-100 px-4">
					<p className="text-sm font-mono font-light">Edit Profile</p>
				</button>
				<button
					onClick={logout}
					className="h-12 text-left hover:bg-neutral-100 px-4"
				>
					<p className="text-sm font-mono font-light">Log out</p>
				</button>
			</div>
		</div>
	);
}
