import React, { useState, useCallback, useEffect, useContext } from "react";
import { AppContext } from "@/context/context";
import { Spinner } from "../common/Spinner";
import { useWallets } from "@privy-io/react-auth";
import { getFactoryContractInstance } from "@/lib/contracts";
import { uploadDataToArweave } from "@/resources";
import { NULL_ADDRESS } from "@/constants";
import { UserActionTypes } from "@/reducers/userReducer";

export function CreateCollectionForm(props: any) {
	// General state
	const { state, dispatch } = useContext(AppContext);
	const { wallets } = useWallets();
	const [signer, setSigner] = useState<any>();
	const [loading, setLoading] = useState<boolean>(false);

	// Form state
	const [title, setTitle] = useState<string>("");
	const [fileName, setFileName] = useState<string | undefined>();
	const [image, setImage] = useState<any>("");
	const [mimeType, setMimeType] = useState<string>("");
	const [description, setDescription] = useState<string>("");
	const [tokenAddress, setTokenAddress] = useState<string>("");
	const [readType, setReadType] = useState<number>(0);
	const [writeType, setWriteType] = useState<number>(1);
	const [minimumBalance, setMinimumBalance] = useState<number>(0);

	// Form errors
	const [titleError, setTitleError] = useState<string>("");
	const [imageError, setImageError] = useState<string>("");
	const [addressError, setAddressError] = useState<string>("");
	const [error, setError] = useState<string | null>(null);

	// If wallets exists, sets wallet and signer
	useEffect(() => {
		if (wallets[0]) {
			let wallet = wallets[0];
			getProviderAndSetSigner(wallet);
		}
	}, [wallets]);

	// Get provider and set signer
	const getProviderAndSetSigner = async (wallet: any) => {
		let provider = await wallet.getEthersProvider();
		setSigner(provider.getSigner());
	};

	// Run checks, upload media and create collection.
	const handleCreateCollection = async () => {
		// Set loading
		setLoading(true);
		// Run checks
		let error = handleErrors(title);
		// If correct,
		if (!error && !!signer) {
			try {
				// Upload media
				let metadata = await uploadDataToArweave({
					title,
					description,
					image,
					mimeType,
					creator: state.user.handle,
					date: Date.now(),
				});
				// Execute TX.
				let factory = getFactoryContractInstance(signer);
				let tx = await factory.createCollection(
					title,
					readType,
					writeType,
					NULL_ADDRESS,
					minimumBalance,
					metadata.url
				);
				let receipt = await tx.wait();
				console.log(receipt);
				console.log(receipt.logs);
				console.log(receipt.logs[0].address);
				resetInitialState();
				props.handleClose();
				handleRefetch();
			} catch (e) {}
		} else {
			setLoading(false);
		}
	};

	const handleRefetch = () => {
		dispatch({
			type: UserActionTypes.FETCH,
			payload: { fetch: true },
		});
	};

	// Check errors before minting new colection
	const handleErrors = (title: string) => {
		let titleError;
		let imageError;
		if (title?.length == 0) {
			setTitleError("Title can't be empty");
			titleError = true;
		}
		if (titleError || imageError || error) {
			return true;
		} else return false;
	};

	const resetInitialState = () => {
		setTitle("");
		setDescription("");
		setFileName(undefined);
		setImage("");
		setLoading(false);
		setTitleError("");
		setMinimumBalance(0);
		setTokenAddress("");
		setAddressError("");
		setTitleError("");
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
			<div className="w-full h-full flex flex-col justify-center bg-white px-8">
				<h1 className="text-4xl mb-10 font-light">Create Collection</h1>
				<div className="w-full">
					<label className="w-full flex flex-col">
						<p className="text-base font-hedvig text-zinc-600 py-2">
							Title
						</p>
						<input
							type="text"
							name="title"
							value={title || ""}
							placeholder="Rebirth of Detroit"
							className="h-14 pl-2 text-base bg-zinc-100 font-sans rounded-sm font-light focus:outline-none"
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
						<p className="text-base font-hedvig text-zinc-600 py-2">
							Description
						</p>
						<textarea
							name="description"
							value={description || ""}
							placeholder="What will be your verse?"
							className="h-32 p-2 bg-zinc-100 rounded-sm text-base font-sans font-light focus:outline-none"
							onChange={(e) => setDescription(e.target.value)}
						></textarea>
					</label>
				</div>

				<div className="mt-6">
					<button
						onClick={handleCreateCollection}
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
							<p className="font-hedvig text-xl">Create</p>
						)}
					</button>
				</div>
			</div>
		);
	}
}

/**
 *
 *<div className="w-full mt-2">
					<div
						className={`flex items-center justify-center w-full relative ${
							imageError ? "mb-20" : "mb-24"
						}`}
					>
						<label className="h-full w-full flex flex-col absolute">
							<p className="text-sm font-semibold text-zinc-600 py-2">
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
 */
