import type { NextApiRequest, NextApiResponse } from "next";
import { getCollectionRegistryContractInstance } from "@/lib/contracts";
import COLLECTION_ABI from "../../../../artifacts/contracts/collections/Collection.sol/Collection.json";
import { Network, Alchemy } from "alchemy-sdk";
import { MODERATOR_HASH } from "@/constants";
import { ethers } from "ethers";

import {
	InfuraProvider,
	NULL_ADDRESS,
	COLLECTION_REGISTRY_ADDRESS__GOERLI,
} from "@/constants";

type Data = {
	error: boolean;
	message: string;
	address: string;
	tokens: any;
	metadata: any;
	moderators: any;
};

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	// Initiate params
	let id;
	let address;
	let collection = req.query.addressOrId as string;
	let registry = getCollectionRegistryContractInstance(InfuraProvider);

	// Set collection address and registry ID.
	if (ethers.utils.isAddress(collection)) {
		// If collection param is address
		// Set address and get ID.
		address = collection;
		id = await registry.addressToTokenID(collection);
	} else {
		// Else, if is ID,
		// Get address and set ID.
		id = collection;
		address = await registry.collectionAddresses(id);
	}

	// If address is not null, proceed.
	if (address !== NULL_ADDRESS) {
		// Instantiate Alchemy
		const settings = {
			apiKey: process.env.ALCHEMY_PRIVATE_KEY,
			network:
				process.env.NEXT_PUBLIC_DEV == "true"
					? Network.OPT_GOERLI
					: Network.OPT_MAINNET,
		};
		const alchemy = new Alchemy(settings);
		// Get collection tokens
		const tokens = await alchemy.nft.getNftsForContract(address);
		// Get collection metadata
		const metadata = await alchemy.nft.getNftMetadata(
			COLLECTION_REGISTRY_ADDRESS__GOERLI,
			id
		);
		// Get collection moderators
		const moderators = await getCollectionModerators(address);

		// Send results
		res.status(200).json({
			error: false,
			message: "success",
			address,
			tokens,
			metadata,
			moderators,
		});
	} else {
		res.status(404).json({
			error: true,
			message: "collection not found",
			address,
			tokens: [],
			metadata: [],
			moderators: [],
		});
	}
}

const getCollectionModerators = async (collection: string) => {
	const CollectionContract = new ethers.Contract(
		collection,
		COLLECTION_ABI.abi,
		InfuraProvider
	);

	let moderatorsArray = [];
	let modCount = await CollectionContract.getRoleMemberCount(MODERATOR_HASH);

	for (let i = 0; i < modCount; i++) {
		let address = await CollectionContract.getRoleMember(MODERATOR_HASH, i);
		let url = process.env.NEXT_PUBLIC_BASE_URL + `/${address}`;
		let res = await fetch(url, {
			method: "POST",
			body: JSON.stringify({ address }),
		});
		let data = await res.json();
		let moderator = { ...data.user, address };
		moderatorsArray.push(moderator);
	}

	return moderatorsArray;
};
