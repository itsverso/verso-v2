import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { profiles } from "@prisma/client";
import { APIResponse } from "../types";

interface APIRequest extends NextApiRequest {
  body: {
    walletAddress?: string;
    metadata?: {
      name: string;
      handle: string;
    };
    metadataUrl?: string;
  };
}

export default async function handler(
  req: APIRequest,
  res: NextApiResponse<APIResponse<profiles>>
) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ message: "Method not allowed, please use POST" });
  }

  const { walletAddress, metadata, metadataUrl } = req.body;

  if (!walletAddress) {
    res.status(404).json({
      message: "user wallet address not provided",
    });

    return;
  }

  if (!metadata?.handle || !metadata?.name) {
    res.status(404).json({
      message: "handle and name are mandatory",
    });

    return;
  }

  if (!metadataUrl?.length) {
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

  if (profile) {
    res.status(200).json({
      message: "profile already exists",
      data: profile,
    });

    return;
  }

  const newProfile = await prisma.profiles.create({
    data: {
      user_id: walletAddress,
      metadataURI: metadataUrl,
      metadata,
    },
  });

  res.status(200).json({
    message: "profile created",
    data: newProfile,
  });
}
