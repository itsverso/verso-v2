import useSWR from "swr";

const useGetUserProfile = (handle: string) => {
  // Super simple user profile fetching with SWR.
  const route = process.env.NEXT_PUBLIC_BASE_URL + `/${handle}`;
  const fetcher = (url: any) => fetch(url).then((res) => res.json());
  const { data, error, isLoading, mutate } = useSWR(route, fetcher);
  return { data, error, isLoading, mutate };
};

export default useGetUserProfile;
