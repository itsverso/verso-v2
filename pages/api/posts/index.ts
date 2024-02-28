import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { posts } from "@prisma/client";
import { APIResponse } from "../types";

interface APIRequest extends NextApiRequest {
  body: {
    ownerWalletAddress: string;
    collectionAddress: string;
    tokenId: number;
  };
}

export default async function handler(
  req: APIRequest,
  res: NextApiResponse<APIResponse<posts>>
) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ message: "Method not allowed, please use POST" });
  }

  const { collectionAddress, ownerWalletAddress, tokenId } = req.body;

  if (!ownerWalletAddress) {
    res.status(404).json({
      message: "post must have an owner",
    });

    return;
  }

  if (!collectionAddress) {
    res.status(404).json({
      message: "post must have an address",
    });

    return;
  }

  if (!tokenId) {
    res.status(404).json({
      message: "post must have an tokenId",
    });

    return;
  }

  const post = await prisma.posts.create({
    data: {
      token_id: tokenId,
      user_id: ownerWalletAddress,
      collection_id: collectionAddress,
    },
  });

  res.status(200).json({
    message: "post created",
    data: post,
  });
}
