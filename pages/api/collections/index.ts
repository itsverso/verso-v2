import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { collections } from "@prisma/client";
import { APIResponse } from "../types";

interface APIRequest extends NextApiRequest {
  body: {
    ownerWalletAddress: string;
    collectionAddress: string;
  };
}

export default async function handler(
  req: APIRequest,
  res: NextApiResponse<APIResponse<collections>>
) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ message: "Method not allowed, please use POST" });
  }

  const { collectionAddress, ownerWalletAddress } = req.body;

  if (!ownerWalletAddress) {
    res.status(404).json({
      message: "collection must have an owner",
    });

    return;
  }

  if (!collectionAddress) {
    res.status(404).json({
      message: "collection must have an address",
    });

    return;
  }

  const collection = await prisma.collections.create({
    data: {
      id: collectionAddress,
      users: {
        connect: {
          id: ownerWalletAddress,
        },
      },
    },
  });

  res.status(200).json({
    message: "collection created",
    data: collection,
  });
}
