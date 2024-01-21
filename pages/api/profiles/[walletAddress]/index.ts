import type { NextApiRequest, NextApiResponse } from "next";
import { APIResponse } from "../../types";
import { profiles } from "@prisma/client";
import { getProfile } from "./getProfile";
import { updateProfile } from "./updateProfile";

interface APIRequest extends NextApiRequest {
  query: {
    walletAddress?: string;
  };
  body: {
    walletAddress?: string;
    metadata?: {
      name: string;
      handle: string;
      image: string;
    };
    metadataUrl?: string;
  };
}

export default async function handler(
  req: APIRequest,
  res: NextApiResponse<APIResponse<profiles>>
) {
  const walletAddress = req.query.walletAddress;

  if (!walletAddress) {
    res.status(404).json({
      message: "user wallet address not provided",
    });

    return;
  }

  if (req.method === "GET") {
    return getProfile(walletAddress, res);
  } else if (req.method === "PATCH") {
    return updateProfile(walletAddress, req.body, res);
  }
}
