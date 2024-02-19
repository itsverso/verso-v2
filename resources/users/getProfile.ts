import { profiles } from "@prisma/client";
import { Profile } from "./types";

const URL = process.env.NEXT_PUBLIC_BASE_URL + `/profiles`;

export const getUserProfileByWalletAddress = async (
  wallet: string
): Promise<Profile> => {
  return getUserProfile(`${URL}?walletAddress=${wallet}`);
};

export const getUserProfileByhandle = async (
  handle: string
): Promise<Profile> => {
  return getUserProfile(`${URL}?handle=${handle}`);
};

const getUserProfile = async (url: string): Promise<Profile> => {
  try {
    const response = await fetch(`${url}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const jsonResponse = await response.json();

    if (!response.ok || !jsonResponse.data) {
      const message = jsonResponse.message;
      throw new Error(`Error: ${message ?? response.status}`);
    }

    const data: profiles = jsonResponse.data;

    return {
      walletAddress: data.user_id,
      metadataURI: data.metadataURI,
      metadata: {
        name: (data.metadata as any).name ?? "",
        handle: (data.metadata as any).handle ?? "",
        description: (data.metadata as any).description,
        image: (data.metadata as any).image,
        website: (data.metadata as any).website,
        foundation: (data.metadata as any).foundation,
        superRare: (data.metadata as any).superRare,
      },
    };
  } catch (error: any) {
    throw new Error(error.message);
  }
};
