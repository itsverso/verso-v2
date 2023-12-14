import { ethers } from "ethers";

export const PROFILE_REGISTRY_ADDRESS__GOERLI =
	process.env.NEXT_PUBLIC_PROFILE_REGISTRY_ADDRESSS__GOERLI;

export const InfuraProvider = new ethers.providers.InfuraProvider(
	"optimism-goerli",
	process.env.INFURA_PRIVATE_KEY
);
