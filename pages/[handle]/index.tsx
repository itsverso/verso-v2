import { useCallback, useState } from "react";
import { NextPage } from "next";

import { Drawer } from "@/components/common/Drawer";
import { UpdateProfileDetailsForm } from "@/components/forms/UpdateProfileDetails";
import { CreateCollectionForm } from "@/components/forms/CreateCollectionForm";
import { CollectionsCarousel } from "@/components/main/CollectionsCarousel";
import { useUser } from "@/context/user-context";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { World } from "../../resources/icons";
import { Spinner } from "@/components/common/Spinner";
import useGetUserProfile from "@/hooks/useGetUserProfile";

const Profile: NextPage = () => {
	let [openUpdateDrawer, setOpenUpdateDrawer] = useState<boolean>(false);
	let [openCreateDrawer, setOpenCreateDrawer] = useState<boolean>(false);
	const user = useUser();
	const router = useRouter();
	let params = useSearchParams();
	let [collectionsView, setCollectionsView] = useState<boolean | undefined>(
		undefined
	);
	const handle = router.query.handle as string;
	let { data, error, isLoading } = useGetUserProfile(handle);

	const isUserOwnProfile = user?.profile?.metadata.handle == handle;

	const handleOpenUpdateDrawer = useCallback(() => {
		// Check if user exists
		if (isUserOwnProfile) {
			setOpenUpdateDrawer(true);
		}
	}, [user, handle, isUserOwnProfile]);

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

	const handleSwitchView = () => {
		router.push(`/${handle}?collections=${!collectionsView}`);
	};

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
				<p>Something went wrong: {data?.message}</p>
			</main>
		);
	}

	return (
		<main className="h-screen w-screen flex flex-col px-6 md:px-16 lg:px-20 xl:px-32 pt-20">
			{user?.wallet && user?.profile ? (
				<Drawer
					isOpen={openUpdateDrawer}
					setIsOpen={setOpenUpdateDrawer}
				>
					<UpdateProfileDetailsForm
						side
						wallet={user.wallet}
						profile={user.profile}
						onUpdateComplete={() => setOpenUpdateDrawer(false)}
					/>
				</Drawer>
			) : null}

			<Drawer isOpen={openCreateDrawer} setIsOpen={setOpenCreateDrawer}>
				<CreateCollectionForm
					handleClose={() => setOpenCreateDrawer(false)}
				/>
			</Drawer>

			<div className="w-full flex flex-col">
				<div className="w-full md:w-1/2 h-full flex flex-col justify-center md:pr-4">
					{data.user.image ? (
						<img
							onClick={handleOpenUpdateDrawer}
							className="h-16 w-16 md:h-20 md:w-20 rounded-full object-cover"
							src={data.user?.image}
						/>
					) : (
						<div onClick={handleOpenUpdateDrawer} className="" />
					)}
					<div className="w-full mt-4 md:mt-8">
						<div className="flex flex-col md:flex-row md:items-center">
							<p className="text-xl font-hedvig text-gray-600">
								{data.user.name}
							</p>
							<div className="w-1 h-1 rounded-full md:bg-gray-800 mx-2" />
							<p className="text-lg md:text-xl font-hedvig text-gray-600">
								@{data.user.handle}.verso
							</p>
						</div>

						<p className="text-2xl text-black font-hedvig mt-1">
							{data.user.description}
						</p>
					</div>
				</div>
				<div className="w-full my-4 flex items-center justify-between">
					{data.user.superRare ||
					data.user.foundation ||
					data.user.website ? (
						<div className="h-16 my-2 flex flex-row items-center justify-end">
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

							{isUserOwnProfile ? (
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
					) : null}
				</div>
				<div className="border-b border-gray-200"></div>
			</div>
			<div className="w-full mt-5 pb-24">
				{
					<CollectionsCarousel
						openDrawer={() => setOpenCreateDrawer(true)}
						isOwner={isUserOwnProfile}
						handle={handle}
					/>
				}
			</div>
		</main>
	);
};

export default Profile;

/***
 * 
 * <div className="flex flex-row items-center">
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
								Minted
							</p>
						</button>
					</div>
 */
