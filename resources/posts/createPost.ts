const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL + `/posts`;

export const createPost = async (
  collectionAddress: string,
  ownerWalletAddress: string,
  tokenId: string
) => {
  // Save post to our database
  await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ownerWalletAddress,
      collectionAddress,
      tokenId,
    }),
  });
};
