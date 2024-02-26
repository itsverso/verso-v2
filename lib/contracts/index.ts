import { ethers } from "ethers";
import COLLECTION_ABI from "../../artifacts/contracts/collections/Collection.sol/Collection.json";
import PROFILE_REGISTRY_ABI from "../../artifacts/contracts/NewProfileRegistry.sol/ProfileRegistry.json";
import COLLECTION_FACTORY_ABI from "../../artifacts/contracts/collections/factory/CollectionFactory.sol/CollectionFactory.json";
import COLLECTION_REGISTRY_ABI from "../../artifacts/contracts/collections/CollectionRegistry.sol/CollectionRegistry.json";
import MARKET_ABI from "../../artifacts/contracts/SimpleMarketMaster.sol/SimpleMarketMaster.json";

import {
  PROFILE_REGISTRY_ADDRESS__GOERLI,
  COLLECTION_FACTORY_ADDRESS__GOERLI,
  COLLECTION_REGISTRY_ADDRESS__GOERLI,
  PROFILE_REGISTRY_ADDRESS__MAINNNET,
  COLLECTION_FACTORY_ADDRESS__MAINNET,
  COLLECTION_REGITSRY_ADDRESS__MAINNET,
} from "../../constants";

export const getProfileContractInstance = (signer: any) => {
  let address =
    process.env.NEXT_PUBLIC_DEV == "true"
      ? PROFILE_REGISTRY_ADDRESS__GOERLI
      : PROFILE_REGISTRY_ADDRESS__MAINNNET;

  return new ethers.Contract(
    address as string,
    PROFILE_REGISTRY_ABI.abi,
    signer
  );
};

export const getFactoryContractInstance = (signer: any) => {
  let address =
    process.env.NEXT_PUBLIC_DEV == "true"
      ? COLLECTION_FACTORY_ADDRESS__GOERLI
      : COLLECTION_FACTORY_ADDRESS__MAINNET;
  return new ethers.Contract(
    address as string,
    COLLECTION_FACTORY_ABI.abi,
    signer
  );
};

export const getCollectionRegistryContractInstance = (signer: any) => {
  let address =
    process.env.NEXT_PUBLIC_DEV == "true"
      ? COLLECTION_REGISTRY_ADDRESS__GOERLI
      : COLLECTION_REGITSRY_ADDRESS__MAINNET;
  return new ethers.Contract(
    address as string,
    COLLECTION_REGISTRY_ABI.abi,
    signer
  );
};

export const getMarketContractInstance = (address: string, signer: any) => {
  return new ethers.Contract(address, MARKET_ABI.abi, signer);
};

export const getCollectionInstance = (address: string, signer: any) => {
  return new ethers.Contract(address, COLLECTION_ABI.abi, signer);
};
