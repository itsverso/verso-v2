import useSWR from "swr";

const useGetUserCollections = (handle: string) => {
	// Super simple user collections fetching with SWR.
	const route = process.env.NEXT_PUBLIC_BASE_URL + `/collections/${handle}`;
	const fetcher = (url: any) => fetch(url).then((res) => res.json());
	const { data, error, isLoading, mutate } = useSWR(route, fetcher);
	return { data, error, isLoading, mutate };
};

export default useGetUserCollections;
