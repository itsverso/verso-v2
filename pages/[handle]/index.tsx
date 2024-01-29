import { useCallback, useContext, useEffect, useState } from "react";
import { NextPage } from "next";
import { GetStaticPaths } from "next";
import { ethers } from "ethers";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";

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
	let router = useRouter();
	let params = useSearchParams();
	let { state, dispatch } = useContext(AppContext);
	let [fireFetch, setFireFetch] = useState<boolean>(false);
	let [collectionsView, setCollectionsView] = useState<boolean | undefined>(
		undefined
	);
	let [openUpdateDrawer, setOpenUpdateDrawer] = useState<boolean>(false);
	let [openCreateDrawer, setOpenCreateDrawer] = useState<boolean>(false);
	let { data, error, isLoading, mutate } = useGetUserProfile(props.handle);

	// Set right view based on param.
	// If not set, collection view is default.
	useEffect(() => {
		let hasParam = params.has("collections");
		if (hasParam) {
			let param = params.get("collections");
			if (param == "true") setCollectionsView(true);
			else setCollectionsView(false);
		} else setCollectionsView(true);
	}, [params]);

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

	// Open edit profile drawer
	const handleOpenUpdateDrawer = useCallback(() => {
		// Check if user exists
		if (data?.user && data?.user?.handle == props.handle) {
			// Only open drawer if users owns the profile
			if (state.user.handle == data?.user?.handle) {
				setOpenUpdateDrawer(true);
			}
		}
	}, [data, state.user]);

	// Close edit profile drawer
	const handleCloseUpdateDrawer = useCallback(() => {
		setFireFetch(true);
		setOpenUpdateDrawer(false);
	}, []);

	const handleSwitchView = () => {
		router.push(`/${props.handle}?collections=${!collectionsView}`);
	};

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
			<div className="w-full flex flex-col">
				<div className="w-1/2 h-full flex flex-col justify-center md:pr-4 ">
					{data.user.image ? (
						<img
							onClick={handleOpenUpdateDrawer}
							className="h-20 w-20 rounded-full object-cover"
							src={data.user?.image}
						/>
					) : (
						<div onClick={handleOpenUpdateDrawer} className="" />
					)}
					<div className="w-full md:mt-8">
						<div className="flex flex-row items-center">
							<p className="text-xl font-hedvig text-gray-600">
								{data.user.name}
							</p>
							<div className="w-1 h-1 rounded-full bg-gray-800 mx-2" />
							<p className="text-xl font-hedvig text-gray-600">
								@{data.user.handle}.verso
							</p>
						</div>

						<p className="text-2xl text-black font-hedvig mt-1">
							{data.user.description}
						</p>
					</div>
				</div>
				<div className="w-full h-16 my-6 flex items-center justify-between">
					<div className="flex flex-row items-center">
						<button
							onClick={handleSwitchView}
							disabled={collectionsView}
							className={`h-10 px-3 flex items-center justify-center ${
								collectionsView
									? "bg-gray-200 rounded-md"
									: "hover:bg-gray-50 rounded-md"
							} `}
						>
							<p
								className={
									collectionsView
										? "text-black"
										: "text-gray-500"
								}
							>
								Collections
							</p>
						</button>
						<button
							onClick={handleSwitchView}
							disabled={!collectionsView}
							className={`h-10 px-3 ml-4 flex items-center justify-center ${
								!collectionsView
									? "bg-gray-200 rounded-md "
									: "hover:bg-gray-50 rounded-md"
							} `}
						>
							<p
								className={
									!collectionsView
										? "text-black"
										: "text-gray-500"
								}
							>
								Latest items
							</p>
						</button>
					</div>
					<div className=" h-full flex flex-row items-center justify-end">
						{data.user.superRare ? (
							<a
								target="_blank"
								href={data.user.superRare}
								className="w-10 h-10 rounded-md m-1 border border-gray-400 hover:opacity-70 flex items-center justify-center"
							>
								<img
									src={"./SR_logo.png"}
									className="w-8 h-8 object-contain"
								/>
							</a>
						) : null}
						{data.user.foundation ? (
							<a
								target="_blank"
								href={data.user.foundation}
								className="w-10 h-10 rounded-md m-1 border border-gray-400 hover:opacity-70 flex items-center justify-center"
							>
								<img
									src={"./foundation-logo.jpeg"}
									className="rounded-md object-contain"
								/>
							</a>
						) : null}
						{data.user.website ? (
							<a
								target="_blank"
								href={data.user.website}
								className="w-10 h-10 rounded-md m-1 border border-gray-400 hover:opacity-70 flex items-center justify-center"
							>
								<World size="6" />
							</a>
						) : null}

						{state.user.handle == props.handle ? (
							<div>
								<button
									onClick={() => handleOpenUpdateDrawer()}
									className="h-10 w-32 rounded-md border border-gray-400 m-1"
								>
									<p>Edit Profile</p>
								</button>
							</div>
						) : null}
					</div>
				</div>
				<div className="border-b border-gray-200"></div>
			</div>
			<div className="w-full mt-5 pb-24">
				{
					<CollectionsCarousel
						openDrawer={() => setOpenCreateDrawer(true)}
						isOwner={state.user.handle == props.handle}
						handle={props.handle}
					/>
				}
			</div>
		</main>
	);
};

export default Profile;
