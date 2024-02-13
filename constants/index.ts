import { ethers } from "ethers";

export const FILE_SIZE = 3100000;
export const NULL_ADDRESS = "0x0000000000000000000000000000000000000000";
export const MAX_INT =
	"115792089237316195423570985008687907853269984665640564039457584007913129639935";
export const MODERATOR_HASH =
	"0x44a854cabd360644e908fcd642b33fedfb60c399d7b1e7e2051275f0b09b0be5";
export const MEMBERS_HASH =
	"0x3238a3641700084b9e028fe65d2b3bf551f4498c926ce0b8e97aa2eaec0e4bf9";

// Contract adddresses: GOERLI
export const SIMPLE_MARKET_ADDRESS__GOERLI =
	"0x7616F0BC60240B5D88839b868485b47d8f32824C";
// MARKET
export const MARKET_MASTER_ADDRESS__GOERLI =
	"0x6b7625Bc2A4BE1C4A28a6e1cfA73026F226DbFE9";
export const MARKET_MASTER_IMPLEMENTATION_ADDRESS__GOERLI =
	"0xB5A6234E7b3B1D5361B9299644a3C6609AF0e185"; // Do not use this one, it's just the implementation.
// COLLECTION
export const COLLECTION_IMPLEMENTATION_ADDRESS__GOERLI =
	"0xfb944cf529e7448d6B11941d90E12368Dd028f8a";
// FACTORY
export const COLLECTION_FACTORY_ADDRESS__GOERLI =
	"0x7f11b50F5864f8B83F3Ae15b3aA4d3473A723624";
// COLLECTION REGISTRY
export const COLLECTION_REGISTRY_IMPLEMENTATION_ADDRESS__GOERLI =
	"0xCF07f7BA3861192c145c53EA979E04FA9fAb8A24"; // Do not use this one, it's just the implementation.
export const COLLECTION_REGISTRY_ADDRESS__GOERLI =
	"0x1FC1bAFEF0A2D8C1203d0D11aBA4FDFC5Ffd5081";
// PROFILE REGISTRY
export const PROFILE_REGISTRY_ADDRESS__GOERLI =
	process.env.NEXT_PUBLIC_PROFILE_REGISTRY_ADDRESSS__GOERLI;

// Contract Addresses: MAINNET
export const PROFILE_REGISTRY_ADDRESS__MAINNET = "";

export const InfuraProvider = new ethers.providers.InfuraProvider(
	"optimism-goerli",
	process.env.INFURA_PRIVATE_KEY
);

export const AlchemyProvider = new ethers.providers.AlchemyProvider(
	"optimism-goerli",
	process.env.ALCHEMY_PRIVATE_KEY
);
