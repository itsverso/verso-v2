import { useCallback, useContext, useEffect, useState } from "react";
import { NextPage } from "next";
import { GetStaticPaths } from "next";
import { ethers } from "ethers";

import { UserActionTypes } from "@/reducers/userReducer";
import { AppContext } from "@/context/context";
import { Spinner } from "@/components/common/Spinner";
import { Drawer } from "@/components/common/Drawer";
import * as Icons from "@/resources/icons";
import { UpdateProfileDetailsForm } from "@/components/forms/UpdateProfileDetails";
import useGetUserProfile from "@/hooks/getUserProfile";

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
		<main className="flex flex-row min-h-screen min-w-screen py-20 px-32">
			<Drawer isOpen={openUpdateDrawer} setIsOpen={setOpenUpdateDrawer}>
				<UpdateProfileDetailsForm
					side={true}
					signer={state.user.signer}
					user={data?.user}
					onUpdateComplete={handleCloseUpdateDrawer}
				/>
			</Drawer>
			<div className="w-full p-4 flex flex-col items-start">
				{data.user.image ? (
					<img
						onClick={handleOpenUpdateDrawer}
						className="h-20 w-20 rounded-md object-cover"
						src={data.user?.image}
					/>
				) : (
					<div
						onClick={handleOpenUpdateDrawer}
						className="h-20 w-20 rounded-md object-cover bg-zinc-200"
					/>
				)}
				<p className="mt-6 text-3xl font-bold">{data.user.name}</p>
				<p className="italic text-lg font-light">
					{data.user.handle}.verso
				</p>
				<div className="h-14 w-full my-10 border-y border-zinc-400 ">
					<div className="flex flex-row h-full items-center">
						<p className="mr-10 text-zinc-600">Created</p>
						<p className="text-zinc-600">Collected</p>
					</div>
				</div>
				<div
					key={"#e4e4e7"}
					onClick={props.onClick}
					className={`md:mb-20 w-full h-40 lg:h-72 lg:w-72 flex flex-col items-center justify-center cursor-pointer hover:opacity-90 bg-zinc-100`}
				>
					<Icons.Plus color={"#e4e4e7"} size={"20"} />
				</div>
			</div>
		</main>
	);
};

export default Profile;
