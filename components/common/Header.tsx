"use client";
import React, { useState, useEffect, useContext } from "react";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { UserDropDown } from "../main/UserDropDown";
import { AppContext } from "@/context/context";
import { UserActionTypes } from "@/reducers/userReducer";
import useGetUserProfile from "@/hooks/useGetUserProfile";
import { useRouter } from "next/router";
import * as Icons from "@/resources/icons";
import Link from "next/link";

export function Header() {
	const router = useRouter();
	const { wallets } = useWallets();
	const { state, dispatch } = useContext(AppContext);
	const [top, setTop] = useState(true);
	const [wallet, setWallet] = useState<any>();
	const { ready, authenticated, user, login } = usePrivy();
	const { data, error, mutate } = useGetUserProfile(wallet?.address);

	// Simple use effect to get wallet
	useEffect(() => {
		// If user and wallets exists
		if (ready && authenticated && wallets) {
			// we set the user wallet
			setWallet(wallets[0]);
		}
	}, [ready, authenticated, wallets]);

	// Simple use effect to set user in global state
	useEffect(() => {
		handleSetUserInGlobalState();
	}, [data, wallet]);

	// Simple use effect to refetch profile
	useEffect(() => {
		if (state.user.fetch) {
			mutate();
			dispatch({
				type: UserActionTypes.FETCH,
				payload: { fetch: false },
			});
		}
	}, [state.user.fetch]);

	// Simple use effect to handle scroll behavior
	useEffect(() => {
		const scrollHandler = () => {
			window.pageYOffset > 10 ? setTop(false) : setTop(true);
		};
		window.addEventListener("scroll", scrollHandler);
		return () => window.removeEventListener("scroll", scrollHandler);
	}, [top]);

	// Set user in global state.
	const handleSetUserInGlobalState = async () => {
		if (!data || !wallet) return;
		// if user is logged in and authenticated
		else if (!data?.error && !error) {
			// fecth provider, signer and set user in state.
			let provider = await wallet.getEthersProvider();
			let signer = provider.getSigner();
			let user = { ...data.user, address: wallet.address, signer };
			dispatch({
				type: UserActionTypes.SET_USER,
				payload: { user },
			});
		}
	};

	function LoginButton() {
		return (
			<div className="h-10 w-20 rounded-sm bg-zinc-800 flex items-center justify-center hover:opacity-90">
				<button
					className="h-full w-full text-sm font-light"
					onClick={login}
				>
					<p className="text-white font-light text-sm">Connect</p>
				</button>
			</div>
		);
	}

	if (router?.pathname === "/[handle]/[collectionId]/[tokenId]") {
		return null;
	}

	return (
		<div
			className={`z-10 w-full h-20 lg:h-16 fixed top-0 flex flex-row bg-white ${
				!top && "shadow-md"
			}`}
		>
			<div className="w-1/3 md:w-1/5 flex flex-col justify-end lg:justify-center pl-5 lg:pl-6">
				<div className="py-4 lg:p-4 z-50 overflow-visible cursor-pointer">
					<h4 className="text-xl lg:text-xl font-lora tracking-wide leading-none text-zinc-800 ">
						verso
						<span className="text-teal-400 lg:text-2xl">.</span>
					</h4>
				</div>
			</div>
			<div className="w-1/3 md:w-3/5"></div>
			<div className="w-1/3 md:w-1/5 pr-5 lg:pr-10 flex flex-col items-end justify-center">
				{ready ? (
					<div>
						{authenticated ? (
							<div className="flex flex-row justify-center">
								{state.user.handle ? (
									<div className="flex items-center justify-center h-10 w-32 bg-black rounded-md hover:opacity-80 mr-6">
										<Link href={`/create`}>
											<p className="cursor-pointer text-sm text-white tracking-wide ">
												New Collection
											</p>
										</Link>
									</div>
								) : null}
								<UserDropDown
									user={data?.user}
									wallet={wallet}
								/>
							</div>
						) : (
							<LoginButton />
						)}
					</div>
				) : null}
			</div>
		</div>
	);
}
