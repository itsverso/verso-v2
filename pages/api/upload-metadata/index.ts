import type { NextApiRequest, NextApiResponse } from "next";
import Bundlr from "@bundlr-network/client";
import { APIResponse } from "../types";

interface APIRequest extends NextApiRequest {
  body: {
    metadata: string | Buffer;
    encoding?: BufferEncoding;
    tags?: {
      name: string;
      value: string;
    }[];
  };
}

type Data = {
  url: string;
};

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
  res: NextApiResponse<APIResponse<Data>>
) {
  if (!req.body.metadata) {
    res.status(404).json({
      message: "Metadata is missing",
    });
  }

  const metadata = req.body.encoding
    ? Buffer.from(req.body.metadata as string, req.body.encoding)
    : req.body.metadata;

  try {
    const id = await uploadToArweave(metadata, req.body.tags);
    res.status(200).json({
      data: {
        url: `https://arweave.net/${id}`,
      },
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Error uploading information to chain",
    });
  }
}

async function uploadToArweave(
  data: string | Buffer,
  tags?: {
    name: string;
    value: string;
  }[]
) {
  const bundlr = new Bundlr(
    "http://node1.bundlr.network",
    "matic",
    process.env.BUNDLR_PRIVATE_KEY as string
  );

  const response = await bundlr.upload(data, { tags });

  return response.id;
}
