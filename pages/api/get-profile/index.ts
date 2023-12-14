import type { NextApiRequest, NextApiResponse } from "next";
import PROFILE_REGISTRY_ABI from "../../../artifacts/contracts/NewProfileRegistry.sol/ProfileRegistry.json";
import { getProfileContractInstance } from "@/lib/contracts";
import { InfuraProvider } from "../../../constants";
import { ethers } from "ethers";

type User = {
	handle: string | null;
	name: string | null;
	description: string | null;
	image: string | null;
	metadataURI: string | null;
	// collections: Collection[] | any;
};

type Collection = {
	title: string | null;
	description: string | null;
	image: string | null;
	address: string | null;
};

type Data = {
	error: boolean;
	message: string;
	user: User;
};

let emptyUser = {
	handle: null,
	name: null,
	description: null,
	image: null,
	metadataURI: null,
	collections: null,
};

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	let PROFILE_REGISTRY_ADDRESS__GOERLI =
		process.env.NEXT_PUBLIC_PROFILE_REGISTRY_ADDRESSS__GOERLI;

	let ProfileRegistryContract = new ethers.Contract(
		PROFILE_REGISTRY_ADDRESS__GOERLI as string,
		PROFILE_REGISTRY_ABI.abi,
		InfuraProvider
	);

	let { handle, address } = JSON.parse(req.body);

	if (!address && !handle)
		res.status(200).json({
			error: true,
			message: "invalid request",
			user: emptyUser,
		});

	let id;

	if (!!address) {
		let hexID = await ProfileRegistryContract.addressToProfileID(address);
		id = parseInt(hexID._hex);
	} else {
		let hexID = await ProfileRegistryContract.getIdFromHandle(handle);
		id = parseInt(hexID._hex);
	}
	if (id == 0 || !id)
		res.status(200).json({
			error: true,
			message: "user not found",
			user: emptyUser,
		});
	else {
		let profile = await ProfileRegistryContract.getProfileByID(id);
		let handle = profile.handle;
		let metadataURI = profile.metadataURI; // "https://arweave.net/onaWXNLR8_fZ_f1WqH1PBVGDq0KSXH1dMuX-rwQtxQk"
		if (metadataURI.length > 10) {
			let profileData = await fetch(metadataURI);
			let { name, description, image } = await profileData.json();
			// let { collections } = await fetchCollections(profile.collections);
			res.status(200).json({
				error: false,
				message: "success",
				user: {
					handle,
					name,
					description,
					image,
					// collections,
					metadataURI,
				},
			});
		} else {
			res.status(200).json({
				error: true,
				message: "incorrect metadata",
				user: { ...emptyUser, handle: handle },
			});
		}
	}
}

async function fetchCollections(collections: string[]) {
	let base = process.env.NEXT_PUBLIC_BASE_URL;
	let array = await fetch(base + "/get-collection-data", {
		method: "POST",
		body: JSON.stringify(collections),
	});
	return await array.json();
}
