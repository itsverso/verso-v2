import React, { useEffect, useState } from "react";
import Link from "next/link";
import { NeynarAPIClient } from "@neynar/nodejs-sdk";
import useSWR from "swr";

type Props = {
	walletAddress: string | undefined;
};

export const WarpcastBox = (props: Props) => {
	const route =
		process.env.NEXT_PUBLIC_BASE_URL +
		`/farcaster-profile?walletAddress=${props.walletAddress}`;
	const fetcher = (url: any) => fetch(url).then((res) => res.json());
	const { data, error, isLoading, mutate } = useSWR(route, fetcher);

	return (
		<div>
			{data?.data?.result?.user?.activeStatus == "active" ? (
				<a
					target="_blank"
					href={`https://warpcast.com/${data?.data?.result?.user?.username}`}
					className="w-10 h-10 rounded-md m-1 border border-gray-400 hover:opacity-70 flex items-center justify-center"
				>
					<p className="font-sans font-black">W</p>
				</a>
			) : null}
		</div>
	);
};
