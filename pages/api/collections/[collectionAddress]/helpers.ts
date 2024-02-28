import { ethers } from "ethers";
import COLLECTION_ABI from "@/artifacts/contracts/collections/Collection.sol/Collection.json";
import { InfuraProvider, MODERATOR_HASH } from "@/constants";

export const getCollectionModerators = async (collection: string) => {
  const CollectionContract = new ethers.Contract(
    collection,
    COLLECTION_ABI.abi,
    InfuraProvider
  );

  const moderatorsArray = [];
  const modCount = await CollectionContract.getRoleMemberCount(MODERATOR_HASH);

  for (let i = 0; i < modCount; i++) {
    const address = await CollectionContract.getRoleMember(MODERATOR_HASH, i);
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/profiles?walletAddress=${address}`,
      {
        method: "GET",
      }
    );

    const resJSON = await res.json();

    moderatorsArray.push(resJSON.data);
  }

  return moderatorsArray;
};

export async function getMetadata<T>(url: string): Promise<T | undefined> {
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const responseJSON = await response.json();

    return responseJSON as T;
  } catch (err) {
    return undefined;
  }
}
