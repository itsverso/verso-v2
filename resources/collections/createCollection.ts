const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL + `/collections`;

export const createCollection = async (
  collectionAddress: string,
  walletAddress: string
) => {
  // Save collection to our database
  await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ownerWalletAddress: walletAddress,
      collectionAddress,
    }),
  });
};
