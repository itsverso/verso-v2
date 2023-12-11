"use client";
import React, { useState, useEffect } from "react";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import * as Icons from "../../resources/icons";
import { ethers } from "ethers";

export function UserDropDown() {
	const { logout } = usePrivy();
	const { wallets } = useWallets();
	const [wallet, setWallet] = useState<any>(null);
	const [address, setAddress] = useState<string>("");
	const [balance, setBalance] = useState<string>("");
	const [visible, setIsVisible] = useState<boolean>(false);
	const [hasCopied, setHasCopied] = useState<boolean>(false);

	useEffect(() => {
		setWalletAndNetwork();
	}, [wallets]);

	useEffect(() => {
		getWalletBalance();
	}, [wallet]);

	// Get wallet instance and set state
	const setWalletAndNetwork = async () => {
		if (wallets[0]) {
			let wallet = wallets[0];
			setWallet(wallet);
			setAddress(wallet.address);
		}
	};

	// Get wallet balance, only triggered on mount.
	const getWalletBalance = async () => {
		if (wallet) {
			let provider = await wallet.getEthersProvider();
			let bigNumber = await provider.getBalance(address);
			let balance = ethers.utils.formatEther(bigNumber);
			setBalance(balance.slice(0, 5));
		}
	};

	// Copy address to clipboard
	const handleClickOnCopy = async () => {
		navigator.clipboard.writeText(address);
		setHasCopied(true);
		setTimeout(() => {
			setHasCopied(false);
		}, 1200);
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
				} absolute right-10 w-72 bg-white flex flex-col text-base z-50 list-none divide-y divide-gray-100 rounded shadow my-4`}
				id="dropdown"
			>
				<div className="px-4 py-8 flex flex-col items-left hover:bg-neutral-100 cursor-pointer">
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
							<p className="text-sm italic font-light text-gray-700">
								bighugs.verso
							</p>
						</div>
					</div>
				</div>
				<button
					onClick={handleClickOnCopy}
					className="flex flex-col justify-center items-left h-16 text-left hover:bg-neutral-100 px-4"
				>
					<p className="text-xs text-zinc-400">
						{hasCopied ? "Copied!" : "Wallet"}
					</p>
					<div className="flex flex-row">
						<p className="text-base font-extralight mr-4">
							{address.slice(0, 6) +
								"..." +
								address.slice(36, 42)}
						</p>
						{hasCopied ? (
							<Icons.CopyFull size="4" />
						) : (
							<Icons.Copy size="4" />
						)}
					</div>
				</button>

				<div className="flex flex-col justify-center items-left h-16 text-left hover:bg-neutral-100 px-4">
					<p className="text-xs text-zinc-400">Balance</p>
					<div className="flex flex-row">
						<p className="text-base font-extralight mr-4">
							{balance + " ETH"}
						</p>
					</div>
				</div>

				<button className="h-16 text-left hover:bg-neutral-100 px-4">
					<p className="text-sm font-light">Edit Profile</p>
				</button>
				<button
					onClick={logout}
					className="h-16 text-left hover:bg-neutral-100 px-4"
				>
					<p className="text-sm font-light">Log out</p>
				</button>
			</div>
		</div>
	);
}
