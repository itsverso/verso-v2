// "https://arweave.net/onaWXNLR8_fZ_f1WqH1PBVGDq0KSXH1dMuX-rwQtxQk";
import type { NextApiRequest, NextApiResponse } from "next";
import { Network, Alchemy } from "alchemy-sdk";
import { COLLECTION_REGISTRY_ADDRESS__GOERLI } from "@/constants";
import { ethers } from "ethers";
import { getProfileContractInstance } from "@/lib/contracts";
import { InfuraProvider } from "@/constants";

type Data = {
	error: boolean;
	message: string;
	collections: any;
};

/**
 * @notice
 * In this case, since collections are NFT in the
 * CollectionRegistry smart contract, what we do is
 * fetch all NFTs that belong to user (address) from
 * that specific contract.
 */

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	// Initiate
	let id;
	let owner;
	// Parse param and check.
	let handle = req.query.handle as string;
	let isAddress = ethers.utils.isAddress(handle);
	// Get address
	if (!isAddress) {
		let Registry = getProfileContractInstance(InfuraProvider);
		let hexID = await Registry.getIdFromHandle(handle);
		owner = await Registry.ownerOf(parseInt(hexID._hex));
		id = parseInt(hexID._hex);
	} else owner = handle;

	// Instantiate alchemy client
	const settings = {
		apiKey: process.env.ALCHEMY_PRIVATE_KEY,
		network:
			process.env.NEXT_PUBLIC_DEV == "true"
				? Network.OPT_GOERLI
				: Network.OPT_MAINNET,
	};
	const alchemy = new Alchemy(settings);
	// Get address param and fetch collection
	const nftsForOwner = await alchemy.nft.getNftsForOwner(owner, {
		contractAddresses: [COLLECTION_REGISTRY_ADDRESS__GOERLI],
	});
	// Send collections back
	res.status(200).json({
		error: false,
		message: "success",
		collections: nftsForOwner,
	});
}
