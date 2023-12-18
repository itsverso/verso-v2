import type { NextApiRequest, NextApiResponse } from "next";
import { COLLECTION_FACTORY_ADDRESS__GOERLI } from "@/constants";
import COLLECTION_FACTORY_ABI from "../../../artifacts/contracts/collections/factory/CollectionFactory.sol/CollectionFactory.json";
import { ethers } from "ethers";

type Data = {
	url: string | any;
};

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	// Get params
	let params = JSON.parse(req.body);
	// Private key
	const privateKey = process.env.ETHEREUM_PRIVATE_KEY as string;
	// Alchemy API key
	const alchemyKey = process.env.ALCHEMY_PRIVATE_KEY;
	// Instantiate provider
	const Provider = new ethers.providers.AlchemyProvider(
		"optimism-goerli",
		alchemyKey
	);
	// Create a signer with the specified private key
	const signer = new ethers.Wallet(privateKey, Provider);
	// Instantiate contract with signer
	const factory = new ethers.Contract(
		COLLECTION_FACTORY_ADDRESS__GOERLI as string,
		COLLECTION_FACTORY_ABI.abi,
		signer
	);

	let tx = await factory.createCollection(params, { gasLimit: 300000 });
	console.log("hereee");
	let receipt = await tx.wait();
	console.log("thereee");
	res.status(200).send({ url: receipt.logs[0].address });
	return;
	/** 
		let tx = await factory.createCollection(params);
		console.log("hereee");
		let receipt = await tx.wait();
		return receipt.logs[0].address;
        */
}
