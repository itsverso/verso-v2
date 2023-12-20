import { ethers } from "ethers";
import COLLECTION_ABI from "../../artifacts/contracts/collections/Collection.sol/Collection.json";
import PROFILE_REGISTRY_ABI from "../../artifacts/contracts/NewProfileRegistry.sol/ProfileRegistry.json";
import COLLECTION_FACTORY_ABI from "../../artifacts/contracts/collections/factory/CollectionFactory.sol/CollectionFactory.json";
import COLLECTION_REGISTRY_ABI from "../../artifacts/contracts/collections/CollectionRegistry.sol/CollectionRegistry.json";

import {
	PROFILE_REGISTRY_ADDRESS__GOERLI,
	COLLECTION_FACTORY_ADDRESS__GOERLI,
	COLLECTION_REGISTRY_ADDRESS__GOERLI,
} from "../../constants";

export const getProfileContractInstance = (signer: any) => {
	return new ethers.Contract(
		PROFILE_REGISTRY_ADDRESS__GOERLI as string,
		PROFILE_REGISTRY_ABI.abi,
		signer
	);
};

export const getFactoryContractInstance = (signer: any) => {
	return new ethers.Contract(
		COLLECTION_FACTORY_ADDRESS__GOERLI as string,
		COLLECTION_FACTORY_ABI.abi,
		signer
	);
};

export const getCollectionRegistryContractInstance = (signer: any) => {
	return new ethers.Contract(
		COLLECTION_REGISTRY_ADDRESS__GOERLI as string,
		COLLECTION_REGISTRY_ABI.abi,
		signer
	);
};

export const getCollectionInstance = (address: string, signer: any) => {
	return new ethers.Contract(address, COLLECTION_ABI.abi, signer);
};
