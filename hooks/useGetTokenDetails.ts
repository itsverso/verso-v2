import useSWR from "swr";

const useGetTokenDetails = (collection: string, id: string) => {
	// Super simple token details fetching with SWR.
	const route =
		process.env.NEXT_PUBLIC_BASE_URL + `/token/${collection}/${id}`;
	const fetcher = (url: any) => fetch(url).then((res) => res.json());
	const { data, error, isLoading, mutate } = useSWR(route, fetcher);
	return { data, error, isLoading, mutate };
};

export default useGetTokenDetails;
