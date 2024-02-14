import type { NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { profiles } from "@prisma/client";
import { APIResponse } from "../../types";

export async function updateProfile(
  walletAddress: string,
  body: {
    metadata?: {
      name: string;
      handle: string;
      image: string;
    };
    metadataUrl?: string;
  },
  res: NextApiResponse<APIResponse<profiles>>
) {
  if (!body?.metadata || !body?.metadataUrl) {
    res.status(404).json({
      message: "metadata is mandatory",
    });

    return;
  }

  if (!body.metadataUrl?.length) {
    res.status(404).json({
      message: "metadataUrl is mandatory",
    });

    return;
  }

  const profile = await prisma.profiles.findFirst({
    where: {
      user_id: walletAddress,
    },
  });

  if (!profile) {
    res.status(400).json({
      message: "profile does not exist",
    });

    return;
  }

  const updatedProfile = await prisma.profiles.update({
    where: {
      id: profile.id,
    },
    data: {
      user_id: walletAddress,
      metadataURI: body.metadataUrl,
      metadata: body.metadata,
      handle: body.metadata.handle,
    },
  });

  res.status(200).json({
    message: "profile updated successfully",
    data: updatedProfile,
  });
}
