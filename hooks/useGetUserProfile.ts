import { getUserProfileByhandle } from "@/resources/users/getProfile";
import useSWR from "swr";

const useGetUserProfile = (handle: string) => {
  const fetcher = async (handle: string) => getUserProfileByhandle(handle);

  const { data, error, isLoading } = useSWR(handle, fetcher);
  return { data, error, isLoading };
};

export default useGetUserProfile;
