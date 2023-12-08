import { ethers } from "ethers";
import PROFILE_REGISTRY_ABI from "../../artifacts/contracts/NewProfileRegistry.sol/ProfileRegistry.json";
import { PROFILE_REGISTRY_ADDRESS__GOERLI } from "../../constants";

export const getProfileContractInstance = (signer: any) => {
	return new ethers.Contract(
		PROFILE_REGISTRY_ADDRESS__GOERLI as string,
		PROFILE_REGISTRY_ABI.abi,
		signer
	);
};
