import { getProfileContractInstance } from "@/lib/contracts";
import { uploadMetadata } from "@/resources";
import { ConnectedWallet } from "@privy-io/react-auth";
import { Profile } from "./types";

const URL = process.env.NEXT_PUBLIC_BASE_URL + `/profiles`;
const IMAGE_ENCODING = "base64";

export const updateProfile = async (
  wallet: ConnectedWallet,
  profile: Profile,
  metadata: {
    name: string;
    handle: string;
    description?: string;
    image?: string;
    imageUrl?: string;
    mimeType?: string;
    website?: string;
    foundation?: string;
    superRare?: string;
  }
): Promise<Profile> => {
  const { mimeType, image, ...restMetadata } = metadata;

  let imageUrl = metadata.imageUrl;

  if (image && mimeType) {
    const uploadImage = image.split(`${IMAGE_ENCODING},`)[1];
    const newImageUpload = await uploadMetadata(uploadImage, {
      tags: [{ name: "Content-Type", value: mimeType }],
      encoding: IMAGE_ENCODING,
    });

    if (!newImageUpload.url.length) {
      throw new Error("Error uploading image to Arweave");
    }

    imageUrl = newImageUpload.url;
  }

  const newMetadata = {
    ...restMetadata,
    image: imageUrl,
  };

  const newMetadataUrl = await uploadMetadata(JSON.stringify(newMetadata));

  if (!newMetadataUrl.url.length) {
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
      metadataUrl: newMetadataUrl.url,
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
      newMetadataUrl.url
    );
    await tx.wait();

    return {
      walletAddress: wallet.address,
      metadataURI: newMetadataUrl.url,
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
