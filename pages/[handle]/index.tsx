import { useEffect } from "react";
import { NextPage } from "next";
import { GetStaticPaths } from "next";
import { ethers } from "ethers";

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
	useEffect(() => {
		console.log("HAND: ", props.handle);
	}, []);

	const fetchUserData = async () => {};

	return (
		<main className="flex flex-row min-h-screen min-w-screen py-20 px-32">
			<div className="w-full p-4 flex flex-col items-center">
				<img
					className="h-20 w-20 rounded-md object-cover"
					src={
						"https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?q=80&w=2776&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
					}
				/>
				<p className="mt-6 text-3xl font-bold">Louisa Rodrigues</p>
				<p className="italic text-lg font-light">bighugs.verso</p>
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
