import { getFactoryContractInstance } from "../contracts";

export const createCollection = async (params: any, signer: any) => {
	let factory = getFactoryContractInstance(signer);
	let tx = await factory.createCollection(params);
	let receipt = await tx.wait();
	return receipt.logs[0].address;
};
