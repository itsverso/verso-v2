import type { NextApiRequest, NextApiResponse } from "next";
import { Network, Alchemy } from "alchemy-sdk";

type Data = {
	error: boolean;
	message: string;
	token: any;
};

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	let tokenId = req.query.tokenId as string;
	let collection = req.query.collection as string;

	const settings = {
		apiKey: process.env.NEXT_PUBLIC_ALCHEMY_KEY,
		network:
			process.env.NEXT_PUBLIC_DEV == "true"
				? Network.OPT_GOERLI
				: Network.OPT_MAINNET,
	};

	const alchemy = new Alchemy(settings);

	const token = await alchemy.nft.getNftMetadata(collection, tokenId);

	res.status(200).json({
		error: false,
		message: "success",
		token: token,
	});
}
