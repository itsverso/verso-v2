import { getProfileContractInstance } from "@/lib/contracts";
import { uploadMetadata } from "@/resources";
import { ConnectedWallet } from "@privy-io/react-auth";
import { Profile } from "./types";

const URL = process.env.NEXT_PUBLIC_BASE_URL + `/profiles`;

export const createProfile = async (
  wallet: ConnectedWallet,
  name: string,
  handle: string
): Promise<Profile> => {
  const metadata = {
    name,
    handle,
  };

  const provider = await wallet.getEthersProvider();
  const signer = provider.getSigner();
  const contractInstance = getProfileContractInstance(signer);
  const profileId = await contractInstance.addressToProfileID(wallet.address);
  const profileIdHex = parseInt(profileId._hex);

  if (profileIdHex > 0) {
    throw new Error("Profile already exists");
  }

  const profileMetadata = await uploadMetadata(JSON.stringify(metadata));

  const url = profileMetadata.url;

  if (!url?.length) {
    throw new Error("Error uploading metadata to Arweave");
  }

  const register = await contractInstance.registerProfile(
    wallet.address,
    handle,
    url
  );

  await register.wait();

  // Save profile to our database
  fetch(URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      walletAddress: wallet.address,
      metadata,
      metadataUrl: url,
    }),
  });

  return {
    walletAddress: wallet.address,
    metadataURI: url,
    metadata,
  };
};
