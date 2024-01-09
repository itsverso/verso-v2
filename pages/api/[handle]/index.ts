// "https://arweave.net/onaWXNLR8_fZ_f1WqH1PBVGDq0KSXH1dMuX-rwQtxQk";
import type { NextApiRequest, NextApiResponse } from "next";
import { getProfileContractInstance } from "@/lib/contracts";
import { InfuraProvider } from "@/constants";
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
	let id;
	let handle = req.query.handle as string;
	let isAddress = ethers.utils.isAddress(handle);
	let Registry = getProfileContractInstance(InfuraProvider);

	console.log("HERE");
	// First we marke sure handle is not undefined
	if (handle !== undefined || handle !== "undefined") {
		// Either get ID from address
		if (isAddress) {
			let hexID = await Registry.addressToProfileID(handle);
			id = parseInt(hexID._hex);
		}
		// OR get ID from handle
		if (!isAddress) {
			console.log("WE ARE HERE!");
			let hexID = await Registry.getIdFromHandle(handle);
			id = parseInt(hexID._hex);
		}

		// Then, get profile based on ID.
		if (id == 0 || !id) {
			if (isAddress) {
				// If ID is 0 && is address, user doesen't exist.
				// We will handle fetching collections in the futrue
				res.status(200).json({
					error: false,
					message: "user not found",
					user: emptyUser,
				});
			} else {
				// Else, its a wrong handle
				// and we should prompt user not found
				res.status(404).json({
					error: true,
					message: "user not found",
					user: emptyUser,
				});
			}
		} else {
			// Else, profile exists
			// so we fecth data for that profile
			let profile = await Registry.getProfileByID(id);
			let handle = profile.handle;
			let metadataURI = profile.metadataURI;
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
				// This is just in case we get an error
				// from the metadata (might not be parsed correctly)
				res.status(200).json({
					error: true,
					message: "incorrect metadata",
					user: { ...emptyUser, handle: handle },
				});
			}
		}
	} else {
		// If handle is undefined
		res.status(404).json({
			error: true,
			message: "wrong handle: undefined",
			user: { ...emptyUser, handle: handle },
		});
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
