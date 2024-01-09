import { useCallback, useContext, useEffect, useState } from "react";
import { NextPage } from "next";
import { GetStaticPaths } from "next";
import { ethers } from "ethers";

import { UserActionTypes } from "@/reducers/userReducer";
import { AppContext } from "@/context/context";
import { Spinner } from "@/components/common/Spinner";
import { Drawer } from "@/components/common/Drawer";
import { UpdateProfileDetailsForm } from "@/components/forms/UpdateProfileDetails";
import { CreateCollectionForm } from "@/components/forms/CreateCollectionForm";
import { CollectionsCarousel } from "@/components/main/CollectionsCarousel";
import useGetUserProfile from "@/hooks/useGetUserProfile";

export const getStaticPaths: GetStaticPaths<{ handle: string }> = async () => {
	return {
		paths: [],
		fallback: "blocking",
	};
};

export async function getStaticProps({ params }: any) {
	let handle = params.handle;
	let isAddress = ethers.utils.isAddress(handle);
	return { props: { handle, isAddress } };
}

const Profile: NextPage = (props: any) => {
	// Component state
	let [fireFetch, setFireFetch] = useState<boolean>(false);
	let { state, dispatch } = useContext(AppContext);
	let [openUpdateDrawer, setOpenUpdateDrawer] = useState<boolean>(false);
	let [openCreateDrawer, setOpenCreateDrawer] = useState<boolean>(false);
	let { data, error, isLoading, mutate } = useGetUserProfile(props.handle);

	// If profile is updated
	// refetch both locally and globally
	useEffect(() => {
		if (fireFetch) {
			mutate();
			setFireFetch(false);
			dispatch({
				type: UserActionTypes.FETCH,
				payload: { fetch: true },
			});
		}
	}, [fireFetch]);

	const handleOpenUpdateDrawer = useCallback(() => {
		// Check if user exists
		if (data?.user && data?.user?.handle == props.handle) {
			// Only open drawer if users owns the profile
			if (state.user.handle == data?.user?.handle) {
				setOpenUpdateDrawer(true);
			}
		}
	}, [data, state.user]);

	const handleCloseUpdateDrawer = useCallback(() => {
		setFireFetch(true);
		setOpenUpdateDrawer(false);
	}, []);

	if (isLoading) {
		return (
			<main className="flex flex-row items-center justify-center min-h-screen min-w-screen">
				<Spinner />
			</main>
		);
	}

	if (error || data.error) {
		return (
			<main className="flex flex-row items-center justify-center min-h-screen min-w-screen">
				<p>Something went wrong: {data.message}</p>
			</main>
		);
	}

	return (
		<main className="h-screen w-screen flex flex-row px-24">
			<Drawer isOpen={openUpdateDrawer} setIsOpen={setOpenUpdateDrawer}>
				<UpdateProfileDetailsForm
					side={true}
					signer={state.user.signer}
					user={data?.user}
					onUpdateComplete={handleCloseUpdateDrawer}
				/>
			</Drawer>
			<Drawer isOpen={openCreateDrawer} setIsOpen={setOpenCreateDrawer}>
				<CreateCollectionForm
					handleClose={() => setOpenCreateDrawer(false)}
				/>
			</Drawer>
			<div className="w-1/4 h-full flex flex-col justify-center md:pr-4">
				{data.user.image ? (
					<img
						onClick={handleOpenUpdateDrawer}
						className="h-28 w-28 rounded-full object-cover cursor-pointer"
						src={data.user?.image}
					/>
				) : (
					<div
						onClick={handleOpenUpdateDrawer}
						className="h-28 w-28 rounded-full cursor-pointer bg-zinc-200"
					/>
				)}
				<div className="w-full md:mt-8">
					<p className="text-2xl font-hedvig text-black">
						{data.user.name}
					</p>
					<p className="font-hedvig text-xl font-light text-black opacity-60">
						@{data.user.handle}.verso
					</p>

					<p className="md:mt-4 text-3xl text-black font-hedvig">
						{data.user.description}
					</p>
				</div>
			</div>
			<div className="w-3/4 h-full md:py-44 md:pl-24 overflow-y-scroll no-scrollbar">
				<CollectionsCarousel
					openDrawer={() => setOpenCreateDrawer(true)}
					handle={props.handle}
					collections={[]}
					onClick={() => null}
				/>
			</div>
		</main>
	);
};

export default Profile;

/**
 * 
				<div className="h-14 w-full my-10 border-y border-zinc-300 ">
					<div className="flex flex-row h-full items-center">
						<p className="mr-10 font-light text-zinc-600">
							Collections
						</p>
						<p className="font-light text-zinc-600">About me</p>
					</div>
				</div>

				
 */
