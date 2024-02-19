import { UserActionTypes, useUserDispatch } from "@/context/user-context";
import { Profile } from "@/resources/users/types";
import { updateProfile } from "@/resources/users/updateProfile";
import { ConnectedWallet } from "@privy-io/react-auth";
import { useCallback } from "react";
import { useState } from "react";

const useUpdateProfile = () => {
	const userDispatch = useUserDispatch();
	const [data, setData] = useState<Profile | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const handleUpdateProfile = useCallback(
		async (
			wallet: ConnectedWallet,
			profile: Profile,
			metadata: {
				name: string;
				description: string;
				image?: string;
				mimeType?: string;
				website?: string;
				foundation?: string;
				superRare?: string;
			}
		): Promise<Profile> => {
			const {
				name,
				description,
				image,
				mimeType,
				foundation,
				superRare,
				website,
			} = metadata;

			if (!name && !description && !image) {
				return profile;
			}

			if (
				name === profile.metadata.name &&
				description === profile.metadata.description &&
				image === profile.metadata.image &&
				foundation === profile.metadata.foundation &&
				superRare === profile.metadata.superRare &&
				website === profile.metadata.website
			) {
				return profile;
			}

			setLoading(true);

			try {
				profile = await updateProfile(wallet, profile, metadata);

				setData(profile);
			} catch (error: any) {
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

	return { data, loading, error, updateProfile: handleUpdateProfile };
};

export { useUpdateProfile };
