import { useCallback, useContext, useState } from "react";
import { NextPage } from "next";
import { GetStaticPaths } from "next";
import useGetTokenDetails from "@/hooks/useGetTokenDetails";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import { useUser } from "@/context/user-context";
import {
	getCollectionInstance,
	getMarketContractInstance,
} from "@/lib/contracts";
import { AppActionTypes } from "@/reducers/appReducer";
import { InfuraProvider } from "@/constants";
import { UserContext } from "@/context/user-context";
import { Spinner } from "@/components/common/Spinner";
import { AppContext } from "@/context/context";

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
	const user = useUser();

	const handleUserRedirect = () => {
		router.push(`/${props.handle}`);
	};

	return (
		<button
			onClick={handleUserRedirect}
			className="flex flex-row items-center mb-4"
		>
			{!user?.profile?.metadata.image ? (
				<div className="h-6 w-6 rounded-full bg-zinc-200"></div>
			) : (
				<img
					src={user?.profile?.metadata.image}
					className="h-6 w-6 rounded-full bg-zinc-200"
				/>
			)}
			<p className="ml-2 text-xl text-gray-500 font-hedvig">
				@{user?.profile?.metadata.handle}
			</p>
		</button>
	);
};

const TokenId: NextPage = (props: any) => {
	const { collection, id } = props;
	const router = useRouter();
	const user = useContext(UserContext);
	const { dispatch } = useContext(AppContext);
	const [loading, setLoading] = useState<boolean>(false);
	const { data, error, isLoading, mutate } = useGetTokenDetails(
		collection,
		id
	);

	const handleRedirectBack = useCallback(() => {
		router.back();
	}, []);

	const executeBuy = async () => {
		if (data && !isLoading) {
			setLoading(true);
			try {
				let market = getMarketContractInstance(
					data.market,
					InfuraProvider
				);
				let price = await market.getBuyPrice(collection, id, 1);
				let provider = await user?.wallet?.getEthersProvider();
				let signer = provider?.getSigner();
				let collectionContract = getCollectionInstance(
					collection,
					signer
				);
				let buy = await collectionContract.collect(
					id,
					user?.profile?.walletAddress,
					1,
					user?.profile?.walletAddress,
					{
						value: parseInt(price._hex) + 2000000000,
					}
				);
				await buy.wait();
				dispatch({
					type: AppActionTypes.Set_Toaster,
					payload: {
						toaster: {
							render: true,
							success: true,
							message: "New verso minted!",
						},
					},
				});
				setLoading(false);
				mutate();
			} catch (e) {
				dispatch({
					type: AppActionTypes.Set_Toaster,
					payload: {
						toaster: {
							render: true,
							success: false,
							message: undefined,
						},
					},
				});
				console.log(e);
				setLoading(false);
			}
		}
	};

	return (
		<main className="flex flex-col md:flex-row min-w-screen min-h-screen pt-10 md:pt-0 px-6 md:px-0">
			<div className="md:p-14 md:w-2/3 md:h-screen flex items-center justify-center bg-zinc-100">
				<img
					className="h-full shadow-md"
					src={data?.token?.media[0]?.gateway}
				/>
			</div>
			<div className="relative flex flex-col justify-between md:w-1/3 md:h-screen md:px-10 pt-6 md:pt-12 pb-10">
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
						className="absolute top-5 md:top-10 right-5 md:right-12 h-8 w-8 md:h-10 md:w-10"
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
						{loading ? (
							<div className="w-full h-16 bg-zinc-600 flex flex-col items-center justify-center">
								<Spinner color={"zinc-800"} />
							</div>
						) : (
							<button
								onClick={() => executeBuy()}
								className="w-full h-16 bg-black flex flex-col items-center justify-center"
							>
								<p className="text-white">COLLECT</p>
							</button>
						)}
					</div>
				</div>
			</div>
		</main>
	);
};

export default TokenId;
