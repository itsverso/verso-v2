import type { NextApiRequest, NextApiResponse } from "next";
import { APIResponse } from "../../types";
import { profiles } from "@prisma/client";
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

export const config = {
  api: {
    responseLimit: false,
    bodyParser: {
      sizeLimit: "4mb",
    },
  },
};

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

  if (req.method === "PATCH") {
    return updateProfile(walletAddress, req.body, res);
  } else {
    return res
      .status(405)
      .json({ message: "Method not allowed, please use PATCH" });
  }
}
