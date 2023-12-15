import React, { useState, useCallback } from "react";
import { useRouter } from "next/router";
import useWindowDimensions from "../../hooks/useWindowDimensions";
import { uploadDataToArweave } from "../../resources";
import * as Icons from "../../resources/icons";
import { FILE_SIZE } from "../../constants";
import { getProfileContractInstance } from "@/lib/contracts";
import { FormButton } from "../common/FormButton";

type Props = {
	fireFetch: any;
	side?: boolean;
	signer?: any;
	handle?: string;
	user?: any;
};

export function UpdateProfileDetailsForm(props: Props) {
	// Global state hooks
	const router = useRouter();
	const { width, height } = useWindowDimensions();

	// Form state variables
	const [image, setImage] = useState<string | undefined>();
	const [preview, setPreview] = useState<string>();
	const [imageHasChanged, setImageHasChanged] = useState<boolean>(false);
	const [name, setName] = useState<string>();
	const [handle, setHandle] = useState<string>("");
	const [mimeType, setMimeType] = useState<string>("");
	const [description, setDescription] = useState<string>();
	const [metadataURL, setMetadataURL] = useState<string>("");
	const [redirect, setRedirect] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState<boolean>(false);

	// Update profile metadata URL on registry.
	const updateProfile = async () => {
		setLoading(true);
		// Upload data to Areweave
		let metadata = await uploadProfileMetadata();
		// Send TX
		try {
			const RegistryContract = getProfileContractInstance(props.signer);
			let id = await RegistryContract.getIdFromHandle(props.handle);
			let hexId = parseInt(id._hex);
			let tx = await RegistryContract.updateProfileMetadata(
				hexId,
				metadata
			);
			await tx.wait();
		} catch (e) {
			console.log("E: ", e);
		}
	};

	// Upload to Arweave
	const uploadProfileMetadata = async () => {
		let res = await uploadDataToArweave({
			name,
			description,
			image,
			mimeType: mimeType,
			hasChanged: imageHasChanged,
		});
		return res.url;
	};

	// Handle name input
	const handleNameInput = useCallback(
		(e: any) => {
			e.preventDefault();
			if (error) {
				setError(null);
			}
			setName(e.target.value);
		},
		[error]
	);

	// Handle description
	const handleDescriptionInput = useCallback(
		(e: any) => {
			e.preventDefault();
			if (error) {
				setError(null);
			}
			setDescription(e.target.value);
		},
		[error]
	);

	// Convert file to base64 and set in state
	const handleImageUpload = useCallback((e: any) => {
		e.preventDefault();
		let file = e.target.files[0];
		const objectUrl = URL.createObjectURL(file);
		setPreview(objectUrl);
		if (file.size > FILE_SIZE) {
			setError("File too big. 3mb maximum.");
		}
		if (!!file) {
			let reader = new FileReader();
			reader.onload = () => {
				let imageBase64 = reader.result as string;
				let trimed64 = imageBase64.split(",")[1];
				setImage(trimed64);
				setMimeType(file.type);
				setImageHasChanged(true);
			};
			reader.readAsDataURL(file);
		}
	}, []);

	// Delete file if user doesn't like it
	const handleRemovePic = useCallback(() => {
		setImage(undefined);
	}, []);

	const ready = !error;

	return (
		<div>
			<main>
				<div
					className={`overflow-hidden h-screen w-full flex flex-col pt-24 lg:pt-30 bg-white ${
						props.side ? "" : "md:px-64"
					}`}
				>
					<div className="flex flex-col px-6">
						<h1 className="font-lora font-light text-zinc-800 text-2xl md:text-3xl mb-4 sm:mb-8">
							Update Profile
						</h1>

						{error ? (
							<div className="w-full h-10 mb-4 flex flex-row">
								<div className="w-1/12 flex items-center justify-center">
									<Icons.Warning color="#be123c" />
								</div>
								<div className="flex items-center">
									<p className="text-rose700 text-sm font-normal">
										{error}
									</p>
								</div>
							</div>
						) : null}

						<div className="w-full mt-4 mb-5 flex flex-row">
							<div className="w-16 lg:w-20 h-16 lg:h-20 rounded-full flex flex-row bg-zinc-100">
								<label
									className={`h-full w-full ${
										image
											? null
											: "pl-5 lg:pl-7 pt-5 lg:pt-7"
									}`}
								>
									{!!image ? (
										<div>
											<img
												src={preview}
												className="z-50 w-16 lg:w-20 h-16 lg:h-20 rounded-full object-cover object-center"
											/>
										</div>
									) : (
										<Icons.Image color="black" />
									)}

									<input
										type="file"
										accept=".jpg, .jpge, .png"
										name="add image"
										className="opacity-0"
										onChange={handleImageUpload}
									></input>
								</label>
							</div>
							{!!image ? (
								<div
									onClick={handleRemovePic}
									className="w-10 flex flex-row items-center justify-center cursor-pointer"
								>
									<Icons.circledX color="gray" />
								</div>
							) : null}
						</div>
						<div className="w-full mb-4">
							{
								// Name
							}
							<label className="h-full w-full flex flex-col">
								<p className="text-sm font-lora text-accent6 py-2">
									Name
								</p>
								<input
									type="text"
									name="name"
									value={name || ""}
									className="h-12 px-4 font-light font-lora text-zinc-500 bg-zinc-100 text-sm focus:outline-none"
									onChange={handleNameInput}
								></input>
							</label>
						</div>

						<div className="w-full mb-4">
							{
								// Description
							}
							<label className="h-full w-full flex flex-col">
								<p className="text-sm font-lora text-accent6 py-2">
									Description
								</p>
								<textarea
									name="description"
									value={description}
									placeholder={props.user?.description || ""}
									className="h-24 p-4 font-light font-lora text-zinc-500 bg-zinc-100 text-sm focus:outline-none"
									onChange={handleDescriptionInput}
								></textarea>
							</label>
						</div>
						<div className="w-full mt-6">
							<FormButton
								text={"Update Profile"}
								loading={loading}
								onClick={() => updateProfile()}
							/>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}
