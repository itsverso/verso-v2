import { Alchemy, Network } from "alchemy-sdk";

export const uploadDataToArweave = async (data: any) => {
	let route = process.env.NEXT_PUBLIC_BASE_URL + "/upload-media";
	let response = await fetch(route, {
		method: "POST",
		body: JSON.stringify(data),
	});
	return await response.json();
};

export const alchemyClient = () => {
	const settings = {
		apiKey: process.env.NEXT_PUBLIC_ALCHEMY_KEY,
		network:
			process.env.NEXT_PUBLIC_DEV == "true"
				? Network.OPT_GOERLI
				: Network.OPT_MAINNET,
	};

	return new Alchemy(settings);
};
