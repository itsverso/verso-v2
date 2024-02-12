import { UserActionTypes, UserDispatchContext } from "@/context/user-context";
import { createProfile } from "@/resources/users/createProfile";
import { Profile } from "@/resources/users/types";
import { ConnectedWallet } from "@privy-io/react-auth";
import { useContext } from "react";
import { useCallback } from "react";
import { useState } from "react";

const useCreateProfile = () => {
	const userDispatch = useContext(UserDispatchContext);
	const [data, setData] = useState<Profile | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const handleCreateProfile = useCallback(
		async (
			wallet: ConnectedWallet,
			name: string,
			handle: string
		): Promise<Profile | null> => {
			setLoading(true);
			let profile: Profile | null = null;

			try {
				profile = await createProfile(wallet, name, handle);
				setData(profile);
			} catch (error: any) {
				profile = null;
				setError(error.message);
			} finally {
				setLoading(false);
			}

			userDispatch?.({
				type: UserActionTypes.SET_PROFILE,
				payload: {
					profile,
				},
			});

			return profile;
		},
		[setData, setLoading, setError]
	);

	return { data, loading, error, createProfile: handleCreateProfile };
};

export { useCreateProfile };
