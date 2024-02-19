import React from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useCallback, useState, useEffect } from "react";
import Head from "next/head";
import { usePrivy } from "@privy-io/react-auth";
import { Spinner } from "@/components/common/Spinner";
import { useCreateProfile } from "@/hooks/profile/useCreateProfile";
import { useUser } from "@/context/user-context";

const CreateProfile: NextPage = () => {
	// Global state hooks
	const router = useRouter();
	const { login } = usePrivy();
	const user = useUser();
	const {
		createProfile,
		error: profileError,
		loading: loadingCreateProfile,
	} = useCreateProfile();

	// Form state variables
	const [name, setName] = useState<string>("");
	const [handle, setHandle] = useState<string>("");
	const [error, setError] = useState<string | null>(null);
	const [nameError, setNameError] = useState<string | null>(null);
	const [handleError, setHandleError] = useState<string | null>(null);

	useEffect(() => {
		if (user?.profile?.metadata?.handle) {
			router.push(`/${user?.profile?.metadata?.handle}`);
		}
	}, [user]);

	const handleCreateProfile = async () => {
		if (!user?.wallet) {
			setError("Please connect your wallet");
			return;
		}

		if (!handle.length) {
			setHandleError("Handle cannot be empty");
			return;
		}

		await createProfile(user.wallet, name, handle);
	};

	// HANDLE input
	const handleHandleInput = useCallback((e: any) => {
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
	}, []);

	// NAME input
	const handleNameInput = useCallback((e: any) => {
		e.preventDefault();
		setNameError(null);
		setName(e.target.value);
	}, []);

	const errorMessage = error || handleError || nameError || profileError;
	const canCreateProfile = !errorMessage && handle.length > 0;

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

						{errorMessage ? (
							<div className="w-full flex flex-row">
								<div className="flex items-center">
									<h6 className="text-rose-700 text-sm font-normal">
										{errorMessage}
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
									user?.wallet?.address ? (
										<button
											onClick={handleCreateProfile}
											disabled={!canCreateProfile}
											className={`h-14 w-full rounded-sm flex flex-col items-center justify-center
												${
													canCreateProfile
														? "cursor-pointer hover:opacity-90 bg-teal-400"
														: "bg-teal-400 opacity-70"
												} `}
										>
											{loadingCreateProfile ? (
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

const withProfile = (WrappedComponent: NextPage) => {
	return function WithProfile() {
		const router = useRouter();
		const user = useUser();
		const { ready } = usePrivy();

		useEffect(() => {
			if (user?.profile?.metadata?.handle) {
				router.push(`/${user?.profile?.metadata?.handle}`);
			}
		}, [user]);

		if (!ready || user?.loading) {
			return null;
		}

		return <WrappedComponent />;
	};
};

export default withProfile(CreateProfile);
