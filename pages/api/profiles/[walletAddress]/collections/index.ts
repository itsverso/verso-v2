import type { NextApiRequest, NextApiResponse } from "next";
import {
  getCollectionInstance,
  getCollectionRegistryContractInstance,
} from "@/lib/contracts";
import { InfuraProvider } from "@/constants";
import { APIResponse } from "@/pages/api/types";
import { prisma } from "@/lib/prisma";
import { Post, PostMetadata } from "@/resources/posts/types";
import { Collection, CollectionMetadata } from "@/resources/collections/types";
import {
  getMetadata,
  getCollectionModerators,
} from "@/pages/api/collections/[collectionAddress]/helpers";

interface APIRequest extends NextApiRequest {
  query: {
    walletAddress?: string;
  };
}

export default async function handler(
  req: APIRequest,
  res: NextApiResponse<APIResponse<Collection[]>>
) {
  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ message: "Method not allowed, please use GET" });
  }

  const { walletAddress } = req.query;

  if (!walletAddress) {
    res.status(404).json({
      message: "user wallet address must be provided",
    });

    return;
  }

  const collections = await prisma.collections.findMany({
    where: {
      users: {
        some: {
          id: walletAddress,
        },
      },
      posts: {
        every: {
          user_id: walletAddress,
        },
      },
    },
    include: {
      users: true,
      posts: true,
    },
  });

  const collectionsResponse: Collection[] = await Promise.all(
    collections.map(async (collection) => {
      const collectionRegistry =
        getCollectionRegistryContractInstance(InfuraProvider);
      const collectionTokenId = await collectionRegistry.addressToTokenID(
        collection.id
      );
      const collectionMetadataURI = await collectionRegistry.uri(
        collectionTokenId
      );

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

          const tokenMetadata = await getMetadata<PostMetadata>(
            tokenMetadataURI
          );

          return {
            tokenId: post.token_id.toString(),
            metadataURI: tokenMetadataURI,
            metadata: tokenMetadata,
          };
        })
      );

      return {
        address: collection.id,
        moderators,
        metadataURI: collectionMetadataURI,
        metadata: collectionMetadata,
        posts,
      };
    })
  );

  res.status(200).json({
    message: "success",
    data: collectionsResponse,
  });
}
