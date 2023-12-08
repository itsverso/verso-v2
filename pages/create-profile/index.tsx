import React, { useContext } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useCallback, useState, useEffect } from "react";
import Head from "next/head";
import { ethers } from "ethers";

const CreateProfile: NextPage = () => {
	// Global state hooks
	const router = useRouter();

	// Form state variables
	const [image, setImage] = useState<string | any>();
	const [name, setName] = useState<string>("");
	const [preview, setPreview] = useState<string>();
	const [mimeType, setMimeType] = useState<string>("");
	const [handle, setHandle] = useState<string>("");
	const [metadataURL, setMetadataURL] = useState<string>("");
	const [redirect, setRedirect] = useState<boolean>(false);
	const [isConnected, setIsConnected] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [nameError, setNameError] = useState<string | null>(null);
	const [handleError, setHandleError] = useState<string | null>(null);

	const PROFILE_REGISTRY_ADDRESS: any =
		process.env.NEXT_PUBLIC_PROFILE_REGISTRY_ADDRESS || ""; // OP gorli

	const checkIfAddressHasProfile = async () => {};

	const mintProfile = async () => {
		console.log("here");
		let error = await handleErrors(name, handle);
	};

	const handleErrors = async (name: string | undefined, handle: string) => {
		let nameError;
		// let handleIsCorrect = await checkHandle();
		if (name?.length == 0) {
			console.log("here");
			setNameError("Name can't be empty");
			nameError = true;
		}
		if (nameError || error) {
			return true;
		} else return false;
	};

	const checkHandle = async () => {
		return true;
	};

	const handleHandleInput = useCallback(
		(e: any) => {
			e.preventDefault();
			if (error) {
				setHandleError(null);
			}
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

	const handleNameInput = useCallback(
		(e: any) => {
			e.preventDefault();
			setNameError(null);
			setName(e.target.value);
		},
		[error]
	);

	const ready = !error && handle.length > 0;

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
						<h1 className="font-lora font-light text-zinc400 text-2xl">
							Welcome to verso.
						</h1>
						<h1 className="font-lora font-light text-black text-2xl mb-4">
							Start by creating your profile
							<span className="text-versoMint">.</span>
						</h1>

						{error ? (
							<div className="w-full flex flex-row">
								<div className="flex items-center">
									<h6 className="font-lora text-rose700 text-sm font-normal">
										{error}
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
								<p className="text-sm font-mono text-neutral-600 font-medium py-2">
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
								<p className="text-sm font-mono text-neutral-600 font-medium  py-2">
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
								<p className="text-sm font-lora text-neutral-500 py-2">
									itsverso.com/{handle}.verso
								</p>
							</label>
						</div>

						<div className="w-full mt-2 lg:mt-0">
							<div>
								{
									// Buttons
									!isConnected ? (
										<div
											onClick={mintProfile}
											className={`h-16 flex flex-col items-center justify-center bg-teal-400 cursor-pointer hover:opacity-90`}
										></div>
									) : (
										<div
											onClick={mintProfile}
											className={`h-16 flex flex-col items-center justify-center bg-teal-400 ${
												!!true
													? "opacity-70"
													: " shadow-md cursor-pointer hover:opacity-90"
											}`}
										></div>
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

/**
 * 
 
 <div className="relative w-16 lg:w-20 h-16 lg:h-20 rounded-full cursor-pointer flex flex-row items-center justify-center bg-gradient-to-tr from-gradientLight to-zinc300">
                            <label className={`h-full w-full ${image ? null : 'pt-4 lg:pt-6 px-2 lg:px-4'}`}>
                                {
                                    !!image ? 
                                    <div> 
                                        <img
                                            src={preview}
                                            className="z-10 w-16 lg:w-20 h-16 lg:h-20 rounded-full object-cover object-center"
                                        />
                                    </div>
                                    :
                                    <div>
                                        <p className="text-xs font-extralight lg:font-normal text-center">Add Image</p>
                                    </div>
                                }
    
                                    <input 
                                        type="file" 
                                        accept=".jpg, .jpge, .png"
                                        name="add image"
                                        className="opacity-0" 
                                        onChange={handleImageUpload}>
                                    </input>
                            </label>
                            {
                                !!image ?
                                <div
                                    onClick={handleRemovePic} 
                                    className="absolute left-16 lg:left-20 w-10 flex flex-row items-center justify-center cursor-pointer">
                                    <Icons.circledX color="gray"/>
                                </div>
                                :
                                null
                            }
                        </div>



                        <div className="w-full mb-6 lg:mb-4">
                            {
                                // Description
                            }
                            <label className="h-full w-full flex flex-col">
                                <p className="text-sm font-bold">Description</p>
                                    <textarea 
                                        name="name"
                                        value={description || ""}
                                        placeholder='Tell people about yourself'
                                        className="font-light text-zinc700 text-sm focus:outline-none" 
                                        onChange={handleDescriptionInput}>
                                    </textarea>
                            </label>
                        </div>

 * 
 * Currently building https://www.itsverso.xyz for fun. Previously growth at Dune Analytics. I like the ocean and summer mornings.
 */
