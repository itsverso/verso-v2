import type { NextApiRequest, NextApiResponse } from "next";
import { APIResponse } from "../../types";
import { Collection, CollectionMetadata } from "@/resources/collections/types";
import { prisma } from "@/lib/prisma";
import {
  getCollectionInstance,
  getCollectionRegistryContractInstance,
} from "@/lib/contracts";
import { InfuraProvider } from "@/constants";
import { Post, PostMetadata } from "@/resources/posts/types";
import { getMetadata, getCollectionModerators } from "./helpers";

interface APIRequest extends NextApiRequest {
  query: {
    collectionAddress?: string;
  };
}

export default async function handler(
  req: APIRequest,
  res: NextApiResponse<APIResponse<Collection>>
) {
  const collectionAddress = req.query.collectionAddress;

  if (!collectionAddress) {
    res.status(404).json({
      message: "collection address not provided",
    });

    return;
  }

  if (req.method !== "GET") {
    return res.status(405).json({
      message: "Method not allowed",
    });
  }

  const collection = await prisma.collections.findFirst({
    where: {
      id: collectionAddress,
      posts: {
        every: {
          collection_id: collectionAddress,
        },
      },
    },
    include: {
      posts: true,
    },
  });

  if (!collection) {
    return res.status(404).json({
      message: "Collection not found",
    });
  }

  const collectionRegistry =
    getCollectionRegistryContractInstance(InfuraProvider);
  const collectionTokenId = await collectionRegistry.addressToTokenID(
    collection.id
  );
  const collectionMetadataURI = await collectionRegistry.uri(collectionTokenId);

  const collectionMetadata = await getMetadata<CollectionMetadata>(
    collectionMetadataURI
  );
  const moderators = await getCollectionModerators(collection.id);

  const posts: Post[] = await Promise.all(
    collection.posts.map(async (post) => {
      const collectionContract = getCollectionInstance(
        collection.id,
        InfuraProvider
      );
      const tokenMetadataURI = await collectionContract.uri(post.token_id);
      const tokenMetadata = await getMetadata<PostMetadata>(tokenMetadataURI);

      return {
        tokenId: post.token_id.toString(),
        metadataURI: tokenMetadataURI,
        metadata: tokenMetadata,
      };
    })
  );

  res.status(200).json({
    data: {
      address: collection.id,
      moderators,
      metadataURI: collectionMetadataURI,
      metadata: collectionMetadata,
      posts,
    },
  });
}
