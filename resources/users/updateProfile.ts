import { getProfileContractInstance } from "@/lib/contracts";
import { uploadDataToArweave } from "@/resources";
import { ConnectedWallet } from "@privy-io/react-auth";
import { Profile } from "./types";

const URL = process.env.NEXT_PUBLIC_BASE_URL + `/profiles`;

export const updateProfile = async (
  wallet: ConnectedWallet,
  profile: Profile,
  metadata: {
    name: string;
    description?: string;
    image?: string;
  }
): Promise<Profile> => {
  const newMetadata: Profile["metadata"] = {
    handle: profile.metadata.handle,
    ...metadata,
  };

  const profileMetadataUrl = await uploadDataToArweave(newMetadata);

  if (!profileMetadataUrl?.url.length) {
    throw new Error("Error uploading metadata to Arweave");
  }

  // Save profile to our database
  const response = await fetch(`${URL}/${wallet.address}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      metadata: newMetadata,
      metadataUrl: profileMetadataUrl.url,
    }),
  });

  const jsonResponse = await response.json();

  if (!response.ok || !jsonResponse.data) {
    const message = jsonResponse.message;
    throw new Error(`Error: ${message ?? response.status}`);
  }

  try {
    const provider = await wallet.getEthersProvider();
    const signer = provider.getSigner();
    const contractInstance = getProfileContractInstance(signer);
    const id = await contractInstance.getIdFromHandle(profile.metadata.handle);
    const hexId = parseInt(id._hex);
    const tx = await contractInstance.updateProfileMetadata(
      hexId,
      profileMetadataUrl.url
    );
    await tx.wait();

    return {
      walletAddress: wallet.address,
      metadataURI: profileMetadataUrl.url,
      metadata: newMetadata,
    };
  } catch (error: any) {
    // Rollback db changes
    const response = await fetch(`${URL}/${wallet.address}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        metadata: profile.metadata,
        metadataUrl: profile.metadataURI,
      }),
    });

    const jsonResponse = await response.json();

    if (!response.ok || !jsonResponse.data) {
      const message = jsonResponse.message;
      throw new Error(`Error: ${message ?? response.status}`);
    }

    return profile;
  }
};
