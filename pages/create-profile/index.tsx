import React, { useContext } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useCallback, useState, useEffect } from "react";
import { getProfileContractInstance } from "@/lib/contracts";
import Head from "next/head";
import { useWallets, usePrivy } from "@privy-io/react-auth";
import { Spinner } from "@/components/common/Spinner";
import { ethers } from "ethers";

const CreateProfile: NextPage = () => {
	// Global state hooks
	const router = useRouter();
	const { authenticated, user, login } = usePrivy();
	const { wallets } = useWallets();

	// Global page state
	const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
	const [loading, setIsLoading] = useState<boolean>(false);
	const [wallet, setWallet] = useState<any>(null);
	const [signer, setSigner] = useState<any>(null);
	const [metadataURL, setMetadataURL] = useState<string>("");

	// Form state variables
	const [name, setName] = useState<string>("");
	const [handle, setHandle] = useState<string>("");
	const [error, setError] = useState<string | null>(null);
	const [nameError, setNameError] = useState<string | null>(null);
	const [handleError, setHandleError] = useState<string | null>(null);

	// Checks if users is logged in and sets state.
	useEffect(() => {
		if (authenticated) {
			setIsLoggedIn(true);
		} else setIsLoggedIn(false);
	}, [authenticated]);

	// If wallets exists, sets wallet and signer
	useEffect(() => {
		if (wallets[0]) {
			let wallet = wallets[0];
			setWallet(wallet);
			getProviderAndSetSigner(wallet);
		} else setIsLoggedIn(false);
	}, [wallets]);

	// If signer, checks if address has profile
	useEffect(() => {
		if (signer && isLoggedIn) checkIfAddressHasProfile();
		else setError(null);
	}, [signer, isLoggedIn]);

	// Get provider and set signer
	const getProviderAndSetSigner = async (wallet: any) => {
		let provider = await wallet.getEthersProvider();
		setSigner(provider.getSigner());
	};

	// Check if address already has profile
	const checkIfAddressHasProfile = async () => {
		let address = wallet.address;
		let contractInstance = getProfileContractInstance(signer);
		let response = await contractInstance.addressToProfileID(address);
		let id = parseInt(response._hex);
		if (id == 0) setError(null);
		else setError("This address already has a profile.");
	};

	// Check that handle is not empty nor taken
	const runHandleValidation = async () => {
		let length = handle.length;
		if (length == 0) setHandleError("Handle cannot be empty");
		let contractInstance = getProfileContractInstance(signer);
		let response = await contractInstance.getIdFromHandle(handle);
		let id = parseInt(response._hex);
		if (id !== 0) setHandleError("This handle already taken");
		if (length == 0 || id !== 0) return false;
		else return true;
	};

	// Initiate & execute minting
	const runChecksAndMintProfile = async (e: any) => {
		e.preventDefault();
		setIsLoading(true);
		let isCorrect = await runHandleValidation();
		if (ready && isCorrect) mintProfile();
	};

	// Execute minting
	const mintProfile = async () => {
		try {
			let address = wallet.address;
			let contractInstance = getProfileContractInstance(signer);
			let register = await contractInstance.registerProfile(
				"0xA6922859cfd81e9dDB9B7504558ff2B1acB7240b",
				handle,
				"www.url.com"
			);
			await register.wait();
			console.log("minted?");
		} catch (e) {
			setIsLoading(false);
			console.log(e);
		}
	};

	// HANDLE input
	const handleHandleInput = useCallback(
		(e: any) => {
			e.preventDefault();
			setHandleError(null);
			setHandle(
				e.target.value
					.toLocaleLowerCase()
					.split(" ")
					.join("")
					.normalize("NFD")
					.replace(/[\u0300-\u036f]/g, "")
					.replace("/", "")
					.replace(/[@#¢∞¬÷“”≠´∫!"·$%&/()=?¿{}]/g, "")
			);
		},
		[error]
	);

	// NAME input
	const handleNameInput = useCallback(
		(e: any) => {
			e.preventDefault();
			setNameError(null);
			setName(e.target.value);
		},
		[error]
	);

	const ready = !loading && !error && !nameError && handle.length > 0;

	return (
		<div>
			<Head>
				<title>Verso App - Create Profile</title>
				<meta
					name="description"
					content="Create, Store, Share, on your terms."
				/>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<main className="pl-0">
				<div className="overflow-hidden h-screen pt-32 lg:pt-0 flex flex-col lg:items-center lg:justify-center">
					<div className="flex flex-col px-6 lg:w-1/3">
						<h1 className="font-light text-zinc400 text-2xl">
							Welcome to verso.
						</h1>
						<h1 className="font-light text-black text-2xl mb-4">
							Start by creating your profile
							<span className="text-versoMint">.</span>
						</h1>

						{error || handleError ? (
							<div className="w-full flex flex-row">
								<div className="flex items-center">
									<h6 className="text-rose-700 text-sm font-normal">
										{error || handleError}
									</h6>
								</div>
							</div>
						) : null}
					</div>

					<div className="flex flex-col mt-4 px-6 lg:w-1/3">
						<div className="w-full my-4 lg:my-4">
							{
								// Name
							}
							<label className="h-full w-full flex flex-col">
								<p className="text-sm text-neutral-600 font-medium py-2">
									Name
								</p>
								<input
									type="text"
									name="username"
									value={name || ""}
									placeholder="Choose display name"
									className="h-12 px-2 font-light text-neutral-800 text-sm bg-neutral-200 focus:outline-none"
									onChange={handleNameInput}
								></input>
								{nameError ? (
									<div className="w-full mt-1">
										<p className="text-rose-700 text-xs font-normal">
											{nameError}
										</p>
									</div>
								) : null}
							</label>
						</div>

						<div className="w-full mb-6 lg:mb-4">
							{
								// Handle
							}
							<label className="h-full w-full flex flex-col">
								<p className="text-sm  text-neutral-600 font-medium  py-2">
									Handle
								</p>
								<input
									type="text"
									name="handle"
									value={handle || ""}
									placeholder="Choose your handle name"
									className="h-12 px-2 font-light text-neutral-800 text-sm bg-neutral-200 focus:outline-none"
									onChange={handleHandleInput}
								></input>
								<p className="text-sm  text-neutral-500 py-2">
									itsverso.com/{handle}.verso
								</p>
							</label>
						</div>

						<div className="w-full mt-2 lg:mt-0">
							<div>
								{
									// Buttons
									isLoggedIn ? (
										<button
											onClick={runChecksAndMintProfile}
											disabled={ready ? false : true}
											className={`h-14 w-full rounded-sm flex flex-col items-center justify-center
												${
													ready
														? "cursor-pointer hover:opacity-90 bg-teal-400"
														: "bg-teal-400 opacity-70"
												} `}
										>
											{loading ? (
												<Spinner
													color="zinc-800"
													size="8"
												/>
											) : (
												<p className="">
													Create Profile
												</p>
											)}
										</button>
									) : (
										<div
											onClick={login}
											className={`h-14 rounded-sm flex flex-col items-center justify-center bg-zinc-600 shadow-md cursor-pointer hover:opacity-90
											}`}
										>
											<p className="text-white ">
												Connect
											</p>
										</div>
									)
								}
							</div>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
};

export default CreateProfile;
