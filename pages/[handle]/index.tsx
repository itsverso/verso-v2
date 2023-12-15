import { useEffect, useState } from "react";
import { NextPage } from "next";
import { GetStaticPaths } from "next";
import { fetchUserProfileFromHandle } from "@/lib/user";
import { ethers } from "ethers";
import { Spinner } from "@/components/common/Spinner";
import { Drawer } from "@/components/common/Drawer";
import { UpdateProfileDetailsForm } from "@/components/forms/UpdateProfileDetails";

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
	// State
	let [user, setUser] = useState<any>(null);
	let [loading, setLoading] = useState<boolean>(true);
	let [fireFetch, setFireFetch] = useState<boolean>(false);
	let [openUpdateDrawer, setOpenUpdateDrawer] = useState<boolean>(false);

	// Use effects
	useEffect(() => {
		fetchUserData();
	}, []);

	// Get user
	const fetchUserData = async () => {
		let profile = await fetchUserProfileFromHandle(props.handle);
		setLoading(false);
		setUser(profile.user);
		console.log(profile);
	};

	if (loading) {
		return (
			<main className="flex flex-row items-center justify-center min-h-screen min-w-screen">
				<Spinner />
			</main>
		);
	}

	return (
		<main className="flex flex-row min-h-screen min-w-screen py-20 px-32">
			<Drawer isOpen={openUpdateDrawer} setIsOpen={setOpenUpdateDrawer}>
				<UpdateProfileDetailsForm
					side={true}
					fireFetch={() => {
						setFireFetch(true);
					}}
				/>
			</Drawer>
			<div className="w-full p-4 flex flex-col items-center">
				{user.image ? (
					<img
						onClick={() => setOpenUpdateDrawer(true)}
						className="h-20 w-20 rounded-md object-cover"
						src={user?.image}
					/>
				) : (
					<div
						onClick={() => setOpenUpdateDrawer(true)}
						className="h-20 w-20 rounded-md object-cover bg-zinc-200"
					/>
				)}
				<p className="mt-6 text-3xl font-bold">{user.name}</p>
				<p className="italic text-lg font-light">{user.handle}.verso</p>
				<div className="h-14 w-full mt-10 border-y border-black ">
					<div className="flex flex-row h-full items-center">
						<p className="mr-10">Created</p>
						<p>Collected</p>
					</div>
				</div>
			</div>
		</main>
	);
};

export default Profile;
