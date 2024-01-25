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
import { World } from "../../resources/icons";

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
		console.log("DATA: ", data);
		console.log("ERROR: ", error);
	}, [fireFetch, data, error]);

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
		console.log(error);
		return (
			<main className="flex flex-row items-center justify-center min-h-screen min-w-screen">
				<p>Something went wrong: {data?.message}</p>
			</main>
		);
	}

	return (
		<main className="h-screen w-screen flex flex-col px-32 pt-20">
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
			<div className="w-full h-full flex flex-col">
				<div className="w-1/2 h-full flex flex-col justify-center md:pr-4 ">
					{data.user.image ? (
						<img
							onClick={handleOpenUpdateDrawer}
							className="h-20 w-20 rounded-full object-cover cursor-pointer"
							src={data.user?.image}
						/>
					) : (
						<div
							onClick={handleOpenUpdateDrawer}
							className="h-20 w-20 rounded-full cursor-pointer bg-zinc-200"
						/>
					)}
					<div className="w-full md:mt-8">
						<p className="text-2xl font-hedvig text-gray-500">
							{data.user.name}
						</p>
						<p className="font-hedvig text-xl font-light text-black opacity-60">
							{data.user.handle}.verso
						</p>
						<p className="md:mt-4 text-3xl text-black font-hedvig">
							{data.user.description}
						</p>
					</div>
				</div>
				<div className="w-full h-16 my-6 flex items-center justify-between ">
					<div className="flex flex-row items-center">
						<button className="h-10 px-2 flex items-center justify-center hover:opacity-80 bg-gray-200 rounded-md">
							<p className="text-black">Collections</p>
						</button>
						<button className="h-10 px-2 ml-2 flex items-center justify-center hover:opacity-80 rounded-md">
							<p className="text-gray-600">Latest items</p>
						</button>
					</div>
					<div className=" h-full flex flex-row items-center justify-end">
						<button className="w-10 h-10 rounded-md m-1 border border-gray-400 flex items-center justify-center">
							<img
								src={"./SR_logo.png"}
								className="w-8 h-8 object-contain"
							/>
						</button>
						<button className="w-10 h-10 rounded-md m-1 border border-gray-400 flex items-center justify-center">
							<img
								src={"./foundation-logo.jpeg"}
								className="rounded-md object-contain"
							/>
						</button>
						<button className="w-10 h-10 rounded-md m-1 mr-0 border border-gray-400 flex items-center justify-center">
							<World size="6" />
						</button>
					</div>
				</div>
			</div>
			<div className="w-full h-full mt-5">
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
