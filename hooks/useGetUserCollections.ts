import { Collection } from "@/resources/collections/types";
import useSWR from "swr";

const useGetUserCollections = (userWalletAddress: string) => {
  // Super simple user collections fetching with SWR.
  const route = `${process.env.NEXT_PUBLIC_BASE_URL}/profiles/${userWalletAddress}/collections`;

  const fetcher = (url: any) => fetch(url).then((res) => res.json());
  const { data, error, isLoading, mutate } = useSWR<{
    data: Collection[];
  }>(route, fetcher);
  return { data, error, isLoading, mutate };
};

export default useGetUserCollections;
