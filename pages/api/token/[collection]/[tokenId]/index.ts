import type { NextApiRequest, NextApiResponse } from "next";
import { Network, Alchemy } from "alchemy-sdk";
import { getCollectionInstance } from "@/lib/contracts";
import { InfuraProvider } from "@/constants";

type Data = {
	error: boolean;
	message: string;
	token: any;
	supply: any;
	market: string;
};

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	let tokenId = req.query.tokenId as string;
	let collection = req.query.collection as string;

	const settings = {
		apiKey: process.env.ALCHEMY_PRIVATE_KEY,
		network:
			process.env.NEXT_PUBLIC_DEV == "true"
				? Network.OPT_GOERLI
				: Network.OPT_MAINNET,
	};

	const alchemy = new Alchemy(settings);

	const token = await alchemy.nft.getNftMetadata(collection, tokenId);

	let collectionContract = getCollectionInstance(collection, InfuraProvider);
	let bigInt = await collectionContract.tokenSupply(tokenId);
	let supply = parseInt(bigInt._hex).toString();
	let market = await collectionContract.marketAddresses(tokenId);

	res.status(200).json({
		error: false,
		message: "success",
		token: token,
		supply,
		market,
	});
}
