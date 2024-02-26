import { Alchemy, Network } from "alchemy-sdk";

export const uploadDataToArweave = async (data: any) => {
  const route = process.env.NEXT_PUBLIC_BASE_URL + "/upload-media";
  const response = await fetch(route, {
    method: "POST",
    body: JSON.stringify(data),
  });

  return response.json();
};

export const uploadMetadata = async (
  metadata: string | Buffer,
  options?: {
    tags?: {
      name: string;
      value: string;
    }[];
    encoding?: BufferEncoding;
  }
): Promise<{
  url: string;
}> => {
  const route = process.env.NEXT_PUBLIC_BASE_URL + "/upload-metadata";
  const response = await fetch(route, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      metadata,
      tags: options?.tags,
      encoding: options?.encoding,
    }),
  });

  const jsonResponse = await response.json();

  if (!response.ok || !jsonResponse.data) {
    const message = jsonResponse.message;
    throw new Error(`Error: ${message ?? response.status}`);
  }

  return jsonResponse.data;
};

export const alchemyClient = () => {
  const settings = {
    apiKey: process.env.ALCHEMY_PRIVATE_KEY,
    network:
      process.env.NEXT_PUBLIC_DEV == "true"
        ? Network.OPT_GOERLI
        : Network.OPT_MAINNET,
  };

  return new Alchemy(settings);
};
