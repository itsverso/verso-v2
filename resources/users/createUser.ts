import { User } from "@privy-io/react-auth";

const URL = process.env.NEXT_PUBLIC_BASE_URL + `/users`;

const createUser = async (privyUser: User) => {
  try {
    const response = await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ walletAddress: privyUser.wallet?.address }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return response.json();
  } catch (error: any) {
    return null;
  }
};

export { createUser };
