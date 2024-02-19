import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { users } from "@prisma/client";
import { APIResponse } from "../types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<APIResponse<users>>
) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ message: "Method not allowed, please use POST" });
  }

  const { walletAddress } = req.body;

  if (!walletAddress) {
    res.status(404).json({
      message: "user wallet address not provided",
    });

    return;
  }

  const user = await prisma.users.findUnique({
    where: {
      id: walletAddress,
    },
  });

  if (user) {
    res.status(200).json({
      message: "user already exists",
      data: user,
    });

    return;
  }

  const newUser = await prisma.users.create({
    data: {
      id: walletAddress,
    },
  });

  res.status(200).json({
    message: "user created",
    data: newUser,
  });
}
