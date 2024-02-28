import { PostDetails } from "@/resources/posts/types";
import useSWR from "swr";

const useGetTokenDetails = (collection: string, id: string) => {
  // Super simple token details fetching with SWR.
  const route =
    process.env.NEXT_PUBLIC_BASE_URL +
    `/collections/${collection}/tokens/${id}`;
  const fetcher = (url: any) => fetch(url).then((res) => res.json());
  const { data, error, isLoading, mutate } = useSWR<{
    data: PostDetails;
  }>(route, fetcher);
  return { data: data?.data, error, isLoading, mutate };
};

export default useGetTokenDetails;
