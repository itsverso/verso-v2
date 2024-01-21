import { profiles } from "@prisma/client";
import { Profile } from "./types";

const URL = process.env.NEXT_PUBLIC_BASE_URL + `/profiles`;

export const getUserProfile = async (wallet: string): Promise<Profile> => {
  try {
    const response = await fetch(`${URL}/${wallet}`, {
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
      walletAddress: wallet,
      metadataURI: data.metadataURI,
      metadata: {
        name: (data.metadata as any).name ?? "",
        handle: (data.metadata as any).handle ?? "",
        description: (data.metadata as any).description,
        image: (data.metadata as any).image,
      },
    };
  } catch (error: any) {
    throw new Error(error.message);
  }
};
