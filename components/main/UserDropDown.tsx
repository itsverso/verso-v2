"use client";
import React, { useState, useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";
import * as Icons from "../../resources/icons";
import { ethers } from "ethers";
import Link from "next/link";

export function UserDropDown(props: any) {
	const { logout } = usePrivy();
	const [address, setAddress] = useState<string>("");
	const [balance, setBalance] = useState<string>("");
	const [visible, setIsVisible] = useState<boolean>(false);
	const [hasCopied, setHasCopied] = useState<boolean>(false);

	// Set user address
	// and fetch balance
	useEffect(() => {
		setWalletAndNetwork();
	}, [props.wallet]);

	// Get wallet instance and set state
	const setWalletAndNetwork = async () => {
		if (props.wallet?.address) {
			setAddress(props.wallet.address);
			getWalletBalance(props.wallet);
		}
	};

	// Get wallet balance, only triggered on mount.
	const getWalletBalance = async (wallet: any) => {
		if (props?.wallet?.address) {
			let provider = await wallet.getEthersProvider();
			let bigNumber = await provider.getBalance(props?.wallet?.address);
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
				className="relative h-10 w-10 rounded-full flex items-center justify-center hover:opacity-80"
				onClick={() => setIsVisible(true)}
			>
				<div className="h-10 w-10 rounded-full">
					{props.user?.image ? (
						<img
							className="h-10 w-10 rounded-full object-cover"
							src={props.user?.image}
						/>
					) : (
						<div className="h-10 w-10 rounded-full bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500" />
					)}
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
				<Link href={`/${props.user?.handle}`}>
					<div className="px-4 py-8 flex flex-col items-left hover:bg-neutral-100 cursor-pointer">
						<div className="flex flex-row items-center ">
							<div className="w-1/4 flex items-center justify-center">
								<div className="h-10 w-10 rounded-full bg-white">
									{props.user?.image ? (
										<img
											className="h-10 w-10 rounded-md object-cover"
											src={props.user?.image}
										/>
									) : (
										<div className="h-10 w-10 rounded-md bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500" />
									)}
								</div>
							</div>
							<div className="px-4">
								<p className="text-xl font-bold leading-0">
									{props?.user?.name}
								</p>
								<p className="text-sm italic font-light text-gray-700">
									{props?.user?.handle}.verso
								</p>
							</div>
						</div>
					</div>
				</Link>
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

				<button
					onClick={logout}
					className="h-14 text-left hover:opacity-90 bg-zinc-200 px-4"
				>
					<p className="text-sm">Log out</p>
				</button>
			</div>
		</div>
	);
}
