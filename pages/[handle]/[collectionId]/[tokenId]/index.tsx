import { useCallback, useEffect } from "react";
import { NextPage } from "next";
import { GetStaticPaths } from "next";
import useGetTokenDetails from "@/hooks/useGetTokenDetails";
import useGetUserProfile from "@/hooks/useGetUserProfile";
import { Info } from "@/resources/icons";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/router";

export const getStaticPaths: GetStaticPaths<{ handle: string }> = async () => {
	return {
		paths: [],
		fallback: "blocking",
	};
};

export async function getStaticProps({ params }: any) {
	let id = params.tokenId;
	let collection = params.collectionId;
	return { props: { id, collection } };
}

const CreatorCard = (props: any) => {
	const router = useRouter();
	const { data, error, isLoading, mutate } = useGetUserProfile(props.handle);

	const handleUserRedirect = () => {
		router.push(`/${props.handle}`);
	};

	if (error) {
		return null;
	}

	return (
		<button
			onClick={handleUserRedirect}
			className="flex flex-row items-center mb-4"
		>
			{!data?.user?.image ? (
				<div className="h-6 w-6 rounded-full bg-zinc-200"></div>
			) : (
				<img
					src={data?.user?.image}
					className="h-6 w-6 rounded-full bg-zinc-200"
				/>
			)}
			<p className="ml-2 text-xl text-gray-500 font-hedvig">
				@{data?.user?.handle}
			</p>
		</button>
	);
};

const TokenId: NextPage = (props: any) => {
	const { collection, id } = props;
	const router = useRouter();
	const { data, error, isLoading, mutate } = useGetTokenDetails(
		collection,
		id
	);

	useEffect(() => {
		console.log(data);
	}, [data]);

	const handleRedirectBack = useCallback(() => {
		router.back();
	}, []);

	return (
		<main className="flex flex-row min-w-screen min-h-screen">
			<div className="w-2/3 p-10 h-screen flex items-center justify-center bg-zinc-100">
				<img
					className="h-full object-contain shadow-md"
					src={data?.token?.media[0]?.gateway}
				/>
			</div>
			<div className="relative flex flex-col justify-between w-1/3 h-screen px-10 pt-28 pb-10">
				<div>
					<div className="">
						{data ? (
							<CreatorCard
								handle={data?.token?.rawMetadata.creator}
							/>
						) : null}
					</div>
					<button
						onClick={handleRedirectBack}
						className="absolute top-10 right-12 h-10 w-10"
					>
						<XMarkIcon color="#646464" />
					</button>
					<p className="text-4xl font-hedvig">
						{data?.token?.rawMetadata?.title || "Untitled "}
					</p>
					<p className="mt-4 text-zinc-600 font-sans">
						{data?.token?.rawMetadata?.description}
					</p>
				</div>
				<div className="">
					<div className="h-32 w-full flex relative p-4">
						<p className="text-base italic text-left">
							<span className="font-bold">
								NFTs on Verso are open-edition liquid NFTs.
							</span>{" "}
							This means you can buy or sell anytime you want. The
							more people buy, the higher the price and viceversa.
							This makes ART are more accessible and fun.
						</p>
					</div>
					<div className="w-full h-14 bg-zinc-100 my-4 flex items-center justify-center">
						<p className="">COLLECTED 127 TIMES</p>
					</div>
					<div className="w-full h-14 bg-black flex items-center justify-center">
						<p className="text-white">COLLECT FOR 1.23ETH</p>
					</div>
				</div>
			</div>
		</main>
	);
};

export default TokenId;
