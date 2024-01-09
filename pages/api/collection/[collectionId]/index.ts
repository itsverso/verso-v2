import type { NextApiRequest, NextApiResponse } from "next";
import { getCollectionRegistryContractInstance } from "@/lib/contracts";
import COLLECTION_ABI from "../../../../artifacts/contracts/collections/Collection.sol/Collection.json";
import { alchemyClient } from "@/resources";
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
	// First, get collection address from registry
	let id = req.query.collectionId as string;
	let registry = getCollectionRegistryContractInstance(InfuraProvider);
	let address = await registry.collectionAddresses(id);

	if (address !== NULL_ADDRESS) {
		// Instantiate Alchemy
		const alchemy = alchemyClient();

		const tokens = await alchemy.nft.getNftsForContract(address);

		const metadata = await alchemy.nft.getNftMetadata(
			COLLECTION_REGISTRY_ADDRESS__GOERLI,
			id
		);

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
