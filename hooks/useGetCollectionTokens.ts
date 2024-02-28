import { Collection } from "@/resources/collections/types";
import useSWR from "swr";

const useGetCollectionTokens = (id: string) => {
  // Super simple tokens fetching with SWR.
  const route = process.env.NEXT_PUBLIC_BASE_URL + `/collections/${id}`;
  const fetcher = (url: any) => fetch(url).then((res) => res.json());
  const { data, error, isLoading, mutate } = useSWR<{
    data: Collection;
  }>(route, fetcher);
  return { data, error, isLoading, mutate };
};

export default useGetCollectionTokens;
