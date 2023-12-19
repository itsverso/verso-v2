import type { NextApiRequest, NextApiResponse } from "next";
import { getCollectionRegistryContractInstance } from "@/lib/contracts";
import { InfuraProvider, NULL_ADDRESS } from "@/constants";
import { alchemyClient } from "@/resources";

type Data = {
	error: boolean;
	message: string;
	feed: any;
};

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	// First, get collection address from registry
	let id = req.query.collectionId;
	let registry = getCollectionRegistryContractInstance(InfuraProvider);
	let collectionAddress = await registry.collectionAddresses(id);

	if (collectionAddress !== NULL_ADDRESS) {
		// Instantiate Alchemy
		const alchemy = alchemyClient();
		const nfts = await alchemy.nft.getNftsForContract(collectionAddress);

		// Send results
		res.status(200).json({
			error: false,
			message: "success",
			feed: nfts,
		});
	} else {
		res.status(404).json({
			error: true,
			message: "collection not found",
			feed: [],
		});
	}
}
