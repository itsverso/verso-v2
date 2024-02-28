import type { NextApiRequest, NextApiResponse } from "next";
import { getCollectionInstance } from "@/lib/contracts";
import { InfuraProvider } from "@/constants";
import { APIResponse } from "@/pages/api/types";
import { PostDetails, PostMetadata } from "@/resources/posts/types";
import { getMetadata } from "@/pages/api/collections/[collectionAddress]/helpers";

interface APIRequest extends NextApiRequest {
  query: {
    collectionAddress?: string;
    tokenId?: string;
  };
}

export default async function handler(
  req: APIRequest,
  res: NextApiResponse<APIResponse<PostDetails>>
) {
  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ message: "Method not allowed, please use GET" });
  }

  const { collectionAddress, tokenId } = req.query;

  if (!collectionAddress || !tokenId) {
    res.status(404).json({
      message: "collectionAddress and tokenId must be provided",
    });

    return;
  }

  const collectionContract = getCollectionInstance(
    collectionAddress,
    InfuraProvider
  );
  const bigInt = await collectionContract.tokenSupply(tokenId);
  const supply = parseInt(bigInt._hex).toString();
  const tokenMetadataURI = await collectionContract.uri(tokenId);
  const market = await collectionContract.marketAddresses(tokenId);

  const tokenMetadata = await getMetadata<PostMetadata>(tokenMetadataURI);

  res.status(200).json({
    message: "success",
    data: {
      tokenId,
      metadataURI: tokenMetadataURI,
      metadata: tokenMetadata,
      supply,
      market,
    },
  });
}
