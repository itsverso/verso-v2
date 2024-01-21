import type { NextApiResponse } from "next";
import { getProfileContractInstance } from "@/lib/contracts";
import { InfuraProvider } from "@/constants";
import { APIResponse } from "../../types";
import { profiles } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { Profile } from "@/resources/users/types";

export async function getProfile(
  walletAddress: string,
  res: NextApiResponse<APIResponse<profiles>>
) {
  const profile = await prisma.profiles.findFirst({
    where: {
      user_id: walletAddress,
    },
  });

  if (profile) {
    res.status(200).json({
      message: "success",
      data: profile,
    });

    return;
  }

  const profilesContract = getProfileContractInstance(InfuraProvider);
  const profileId = await profilesContract.addressToProfileID(walletAddress);
  const profileInChain = await profilesContract.getProfileByID(profileId);

  if (!profileInChain) {
    res.status(404).json({
      message: "profile not found",
    });
  }

  let metadata: Profile["metadata"];
  let metadataURI: string;

  try {
    metadataURI = profileInChain[1];
    const metadataResponse = await fetch(metadataURI, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    metadata = await metadataResponse.json();
  } catch (error: any) {
    res.status(404).json({
      message: "profile not found",
    });

    return;
  }

  // Store profile in database when it doesn't exist
  const newProfile = await prisma.profiles.create({
    data: {
      user_id: walletAddress,
      metadataURI: metadataURI,
      metadata,
    },
  });

  res.status(200).json({
    message: "profile created",
    data: newProfile,
  });
}
