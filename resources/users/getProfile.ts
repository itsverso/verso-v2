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

    const data: Profile = jsonResponse.data;

    return data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
