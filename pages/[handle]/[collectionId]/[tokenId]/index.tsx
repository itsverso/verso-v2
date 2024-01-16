import { useCallback, useEffect, useState } from "react";
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
				@{data?.user?.handle} / Mexapixels
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

	// Bonding curve stuff
	const protocolFeePercent = 0.04;
	const creatorFeePercent = 0.06;

	const [tokenSupply, setTokenSupply] = useState<number>(1);
	const [priceArray, setPriceArray] = useState<number[]>([0]);

	const [poolAmount, setPoolAmount] = useState<number>(0);
	const [creatorEarningsArray, setCreatorEarningsArray] = useState<number[]>([
		0,
	]);
	const [protocolEarningsArray, setProtocolEarningsArray] = useState<
		number[]
	>([0]);

	useEffect(() => {
		console.log(100 * creatorFeePercent);
	}, [data]);

	const handleRedirectBack = useCallback(() => {
		router.back();
	}, []);

	const executeBuy = () => {
		// Basics
		let newPriceArray = priceArray;
		let newCreatorArray = creatorEarningsArray;
		let newProtocolArray = protocolEarningsArray;
		let newPrice = getBuyPriceAfterFee(1);
		let newTokenSupply = tokenSupply + 1;
		// Calculations
		let creatorFee = newPrice * creatorFeePercent;
		let protocolFee = newPrice * protocolFeePercent;
		let newPoolAmount = poolAmount + (newPrice - creatorFee - protocolFee);
		let creatorEarning =
			creatorEarningsArray[creatorEarningsArray.length - 1] + creatorFee;
		let protocolEarning =
			protocolEarningsArray[protocolEarningsArray.length - 1] +
			protocolFee;

		// Set state.
		newPriceArray.push(newPrice);
		newCreatorArray.push(creatorEarning);
		newProtocolArray.push(protocolEarning);
		setPriceArray(newPriceArray);
		setTokenSupply(newTokenSupply);
		setPoolAmount(newPoolAmount);
		setCreatorEarningsArray(newCreatorArray);
		setProtocolEarningsArray(newProtocolArray);
	};

	const executeSell = () => {
		if (tokenSupply < 2) return;
		// Basics
		let newPriceArray = priceArray;
		let newCreatorArray = creatorEarningsArray;
		let newProtocolArray = protocolEarningsArray;
		let newPrice = getSellPriceAfterFee(1);
		let newTokenSupply = tokenSupply - 1;
		// Calculations
		let creatorFee = newPrice * creatorFeePercent;
		let protocolFee = newPrice * protocolFeePercent;
		let newPoolAmount = poolAmount - (newPrice + creatorFee + protocolFee);
		let creatorEarning =
			creatorEarningsArray[creatorEarningsArray.length - 1] + creatorFee;
		let protocolEarning =
			protocolEarningsArray[protocolEarningsArray.length - 1] +
			protocolFee;

		// Set state.
		newPriceArray.push(newPrice);
		newCreatorArray.push(creatorEarning);
		newProtocolArray.push(protocolEarning);
		setPriceArray(newPriceArray);
		setTokenSupply(newTokenSupply);
		setPoolAmount(newPoolAmount);
		setCreatorEarningsArray(newCreatorArray);
		setProtocolEarningsArray(newProtocolArray);
	};

	const parseEthOutput = (output: number) => {
		return (output / 1000000000000000000).toFixed(4);
	};

	const parseEthOutputInUSD = (output: number) => {
		return ((output / 1000000000000000000) * 2300).toLocaleString("en-US", {
			style: "currency",
			currency: "USD",
		});
	};

	const getBuyPriceAfterFee = useCallback(
		(amount: number) => {
			let price = getPrice(tokenSupply, amount);
			let protocolFee = price * protocolFeePercent;
			let creatorFee = price * creatorFeePercent;
			return price + protocolFee + creatorFee;
		},
		[tokenSupply]
	);

	const getSellPriceAfterFee = useCallback(
		(amount: number) => {
			let price = getPrice(tokenSupply - amount, amount);
			let protocolFee = price * protocolFeePercent;
			let creatorFee = price * creatorFeePercent;
			return price + protocolFee + creatorFee;
		},
		[tokenSupply]
	);

	const getPrice = (supply: number, amount: number) => {
		let sum1 =
			supply == 0
				? 0
				: ((supply - 1) * supply * (2 * (supply - 1) + 1)) / 6;
		let sum2 =
			supply == 0 && amount == 1
				? 0
				: ((supply - 1 + amount) *
						(supply + amount) *
						(2 * (supply - 1 + amount) + 1)) /
				  6;
		let summation = sum2 - sum1;
		return (summation * 1000000000000000000) / 240000;
	};

	// 2777777777777778;
	// 2777777777777778

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
						<span className="font-bold">{tokenSupply}</span> times
					</p>
					<div className="w-full h-16 bg-zinc-100 my-4 p-4 flex flex-col center justify-center">
						<p className="text-sm">Current Price</p>
						<p className="text-base font-bold">
							{parseEthOutput(getBuyPriceAfterFee(1)) + " "}
							ETH -{" "}
							{parseEthOutputInUSD(getBuyPriceAfterFee(1)) + " "}
							USD
						</p>
					</div>
					<div className="w-full h-16 bg-zinc-100 mt-4 p-4 flex flex-col center justify-center">
						<p className="text-sm">Creator Earnings (6%)</p>

						<p className="text-base font-bold">
							{parseEthOutput(
								creatorEarningsArray[
									creatorEarningsArray.length - 1
								]
							)}{" "}
							ETH -{" "}
							{parseEthOutputInUSD(
								creatorEarningsArray[
									creatorEarningsArray.length - 1
								]
							)}{" "}
							USD
						</p>
					</div>

					<div className=" w-full flex relative py-8 ">
						<p className="text-base italic text-left">
							<span className="font-bold">
								NFTs on Verso are open-edition liquid NFTs.
							</span>{" "}
							This means you can buy or sell anytime you want. The
							more people buy, the higher the price and viceversa.
							This makes ART more accessible and fun.
						</p>
					</div>
					<div className="w-full flex flex-row">
						<button
							onClick={() => executeBuy()}
							className="w-1/2 h-16 bg-black border border-black flex flex-col items-center justify-center"
						>
							<p className="text-white">
								<span className="font-semibold">BUY</span>
							</p>
							<p className="text-sm text-zinc-400">
								{parseEthOutput(getBuyPriceAfterFee(1)) + " "}
								ETH -
								{parseEthOutputInUSD(getBuyPriceAfterFee(1)) +
									" "}
								USD
							</p>
						</button>
						<button
							onClick={() => executeSell()}
							className="w-1/2 h-16 bg-white border-2 border-black flex flex-col items-center justify-center"
						>
							<p className="">
								<span className="font-semibold">SELL</span>
							</p>
							<p className="text-sm text-zinc-500">
								{parseEthOutput(getBuyPriceAfterFee(1)) + " "}
								ETH -
								{parseEthOutputInUSD(getBuyPriceAfterFee(1)) +
									" "}
								USD
							</p>
						</button>
					</div>
				</div>
			</div>
		</main>
	);
};

export default TokenId;

/**
 * 
 * <div className="w-full h-16 bg-zinc-100 my-4 p-4 flex flex-col center justify-center">
						<p className="text-sm">Protocol Earnings</p>
						<p className="text-base font-bold">
							{parseEthOutput(
								protocolEarningsArray[
									protocolEarningsArray.length - 1
								]
							)}{" "}
							ETH -{" "}
							{parseEthOutputInUSD(
								protocolEarningsArray[
									protocolEarningsArray.length - 1
								]
							)}{" "}
							USD
						</p>
					</div>
					<div className="w-full h-16 bg-zinc-100 mt-4 p-4 flex flex-col center justify-center">
						<p className="text-sm">Liquidity Pool</p>
						<p className="text-base font-bold">
							{parseEthOutput(poolAmount) + " "}ETH -
							{parseEthOutputInUSD(poolAmount) + " "}USD
						</p>
					</div>
 */
