import React, { useState, useCallback, useEffect, useContext } from "react";
import { Spinner } from "../common/Spinner";
import { ethers } from "ethers";
import * as Icons from "../../resources/icons";

const ETHEREUM_NULL_ADDRESS = "0x0000000000000000000000000000000000000000";

type Props = {};

export function CreateCollectionForm(props: Props) {
	// General state.

	// Form state
	const [title, setTitle] = useState<string>("");
	const [fileName, setFileName] = useState<string | undefined>();
	const [image, setImage] = useState<any>("");
	const [mimeType, setMimeType] = useState<string>("");
	const [description, setDescription] = useState<string>("");
	let [tokenAddress, setTokenAddress] = useState<string>("");
	const [minimumBalance, setMinimumBalance] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(false);
	const [fireCreateCollection, setFireCreateCollection] =
		useState<boolean>(false);
	const [renderCommunitySettings, setRenderCommunitySettings] =
		useState<boolean>(false);
	const [isERC20, setisERC20] = useState<boolean>(true);
	// Component/Form errors
	const [titleError, setTitleError] = useState<string>("");
	const [descriptionError, setDescriptionError] = useState<string>("");
	const [imageError, setImageError] = useState<string>("");
	const [addressError, setAddressError] = useState<string>("");
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (fireCreateCollection) {
			try {
				handleCreateCollection(title, description, image);
			} catch (error) {
				setLoading(false);
				setError(error as any);
				setFireCreateCollection(false);
			}
		}
	}, [title, description, image, fireCreateCollection]);

	const handleErrors = (title: string, description: string) => {
		let titleError;
		let descriptionError;
		let imageError;
		if (title?.length == 0) {
			setTitleError("Title can't be empty");
			titleError = true;
		}
		if (description?.length == 0 || !description) {
			// setDescriptionError("Description can't be empty")
			// descriptionError = true
		}
		if (fileName?.length == 0 || !fileName) {
			setImageError("Image can't be empty");
			imageError = true;
		}
		if (tokenAddress.length > 0 && !ethers.utils.isAddress(tokenAddress)) {
			setAddressError("Invalid address format. Please double check.");
		}
		if (titleError || descriptionError || imageError || error) {
			return true;
		} else return false;
	};

	const handleCreateCollection = async (
		title: string,
		description: string,
		image: string
	) => {
		setLoading(true);
		setFireCreateCollection(false);
		let error = handleErrors(title, description);

		if (error) {
			setLoading(false);
		} else {
			try {
				resetInitialState();
			} catch (e) {}
		}
	};

	const createCollection = async (res: any) => {};

	const resetInitialState = () => {
		setTitle("");
		setDescription("");
		setFileName(undefined);
		setImage("");
		setLoading(false);
		setTitleError("");
		setMinimumBalance("");
		setTokenAddress("");
		setAddressError("");
		setTitleError("");
		setDescriptionError("");
		setImageError("");
		setError("");
	};

	const handleImageUpload = useCallback((e: any) => {
		e.preventDefault();
		let file = e.target.files[0];
		if (file.name) {
			setMimeType(file.type);
			setFileName(file.name);
		} else {
			setFileName("unknown");
		}

		if (file.size > 3300000) {
			setError("File too big. 2mb maximum.");
		} else if (file.size < 3300000) {
			setError(null);
		}

		if (!!file) {
			setImageError("");
			let reader = new FileReader();
			reader.onload = () => {
				const srcData = reader.result as string;
				var data = srcData?.split(",")[1];
				setImage(data);
			};
			reader.readAsDataURL(file);
		}
	}, []);

	const ready = true;

	if (true) {
		return (
			<div className="w-full h-full flex flex-col justify-center bg-white lg:py-20 px-8">
				<h1 className="text-5xl mb-10">Create Collection</h1>
				<div className="w-full">
					<label className="w-full flex flex-col">
						<p className="text-sm font-extrabold text-zinc-600 py-2">
							Title
						</p>
						<input
							type="text"
							name="title"
							value={title || ""}
							placeholder="Rebirth of Detroit"
							className="h-14 pl-2 text-base bg-zinc-100 font-lora rounded-sm font-light focus:outline-none"
							onChange={(e) => setTitle(e.target.value)}
							onFocus={() => setTitleError("")}
						></input>
						<div className="flex flex-row items-center mt-1">
							<p className="text-rose-700 text-xs font-semibold">
								{titleError}
							</p>
						</div>
					</label>
				</div>
				<div className="w-full mt-2">
					<label className="w-full flex flex-col">
						<p className="text-sm font-extrabold text-zinc-600 py-2">
							Description
						</p>
						<textarea
							name="description"
							value={description || ""}
							placeholder="What will be your verse?"
							className="h-32 p-2 bg-zinc-100 rounded-sm text-base font-lora font-light focus:outline-none"
							onChange={(e) => setDescription(e.target.value)}
							onFocus={() => setDescriptionError("")}
						></textarea>
						<div className="flex flex-row items-center mt-1">
							<p className="text-rose700 text-xs font-semibold">
								{descriptionError}
							</p>
						</div>
					</label>
				</div>
				<div className="w-full mt-2">
					<label className="w-full flex flex-col">
						<p className="text-sm font-extrabold text-zinc-600 py-2">
							Access Price
						</p>
						<input
							type="text"
							name="title"
							value={title || ""}
							placeholder="0.008"
							className="h-14 pl-2 text-base bg-zinc-100 rounded-sm font-lora font-light focus:outline-none"
							onChange={(e) => setTitle(e.target.value)}
							onFocus={() => setTitleError("")}
						></input>
						<div className="flex flex-row items-center mt-1">
							<p className="text-rose700 text-xs font-semibold">
								{titleError}
							</p>
						</div>
					</label>
				</div>
				<div className="w-full mt-2">
					<div
						className={`flex items-center justify-center w-full relative ${
							imageError ? "mb-20" : "mb-24"
						}`}
					>
						<label className="h-full w-full flex flex-col absolute">
							<p className="text-sm font-extrabold text-zinc-600 py-2">
								Cover Picture
							</p>
							<div className="flex flex-col items-center bg-zinc-100 rounded-sm justify-center h-20 cursor-pointer bg-zinc100 overflow-hidden pt-8 pb-8">
								{!fileName ? (
									<div>
										<p className="text-xs text-zinc800">
											<span className="font-semibold">
												Click to upload
											</span>
										</p>
										<p className="text-xs text-zinc600">
											PNG, JPG or JPGE
										</p>
									</div>
								) : (
									<p className="text-zinc800 text-xs font-semibold">
										{fileName}
									</p>
								)}
							</div>
							<input
								id="dropzone-file"
								type="file"
								accept=".jpg, .jpge, .png"
								className="opacity-0 z-40"
								onChange={handleImageUpload}
							/>
						</label>
					</div>
					{imageError ? (
						<div className="flex flex-row items-center mt-1">
							<p className="text-rose700 text-xs font-semibold">
								{imageError}
							</p>
						</div>
					) : null}
				</div>
				<div className="mt-6">
					<button
						onClick={() => {}}
						disabled={ready ? false : true}
						className={`h-14 w-full rounded-sm flex flex-col items-center justify-center
												${
													ready
														? "cursor-pointer hover:opacity-90 bg-teal-400"
														: "bg-teal-400 opacity-70"
												} `}
					>
						{loading ? (
							<Spinner color="zinc-800" size="8" />
						) : (
							<p className="">Create Collection</p>
						)}
					</button>
				</div>
			</div>
		);
	}
}
