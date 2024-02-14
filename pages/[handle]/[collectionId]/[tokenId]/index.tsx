import { useCallback, useEffect, useContext } from "react";
import { NextPage } from "next";
import { GetStaticPaths } from "next";
import useGetTokenDetails from "@/hooks/useGetTokenDetails";
import useGetUserProfile from "@/hooks/useGetUserProfile";
import { Info } from "@/resources/icons";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import { AppContext } from "@/context/context";
import {
	getCollectionInstance,
	getMarketContractInstance,
} from "@/lib/contracts";
import { InfuraProvider } from "@/constants";

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

	console.log("User: ", data);

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
	const { state } = useContext(AppContext);
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

	const executeBuy = async () => {
		if (data && !isLoading) {
			let { signer, address } = state.user;
			let market = getMarketContractInstance(data.market, InfuraProvider);
			let price = await market.getBuyPrice(collection, id, 1);
			let collectionContract = getCollectionInstance(collection, signer);
			let buy = await collectionContract.collect(
				id,
				address,
				1,
				address,
				{
					value: price,
				}
			);

			let receipt = await buy.wait();
		}
		console.log("buy");
	};

	return (
		<main className="flex flex-row min-w-screen min-h-screen">
			<div className="w-2/3 p-10 h-screen flex items-center justify-center bg-zinc-100">
				<img
					className="h-full object-contain shadow-md"
					src={data?.token?.media[0]?.gateway}
				/>
			</div>
			<div className="relative flex flex-col justify-between w-1/3 h-screen px-10 pt-12 pb-10">
				<div className="">
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
					<p className="mt-8 text-4xl font-hedvig">
						{data?.token?.rawMetadata?.title}
					</p>
					<p className="mt-4 text-zinc-600 font-sans">
						{data?.token?.rawMetadata?.description}
					</p>
				</div>
				<div className="">
					<p className="mt-4">
						Collected{" "}
						<span className="font-bold">{data?.supply}</span> times
					</p>

					<div className="w-full h-16 bg-zinc-100 my-4 p-4 flex flex-col center justify-center">
						<p className="text-sm font-bold">Collection Address</p>

						<p className="text-sm">{props.collection}</p>
					</div>
					<div className="w-full h-16 bg-zinc-100 my-4 p-4 flex flex-col center justify-center">
						<p className="text-sm font-bold">Arweave ID</p>
						<p className="text-sm">
							onaWXNLR8_fZ_f1WqH1PBVGDq0KSXH1dMuX-rwQtxQk
						</p>
					</div>
					<div className="w-full flex flex-row">
						<button
							onClick={() => executeBuy()}
							className="w-full h-16 bg-black border border-black flex flex-col items-center justify-center"
						>
							<p className="text-white">COLLECT</p>
						</button>
					</div>
				</div>
			</div>
		</main>
	);
};

export default TokenId;
