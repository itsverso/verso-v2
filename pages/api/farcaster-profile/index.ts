import type { NextApiRequest, NextApiResponse } from "next";
import { APIResponse } from "../types";
import { NeynarAPIClient } from "@neynar/nodejs-sdk";

let neynarClient = new NeynarAPIClient("50004971-4042-461E-B925-DC4083C0512E");

interface APIRequest extends NextApiRequest {
	query: {
		walletAddress?: string | undefined;
	};
}

// Simple route to fecth a user's FARCASTER profile
// based on his wallet address.
export default async function handler(
	req: APIRequest,
	res: NextApiResponse<APIResponse<any>>
) {
	const walletAddress = req.query.walletAddress;

	if (!walletAddress) {
		res.status(404).json({
			message: "user wallet address not provided",
		});
		return;
	} else {
		try {
			const user = await neynarClient.lookupUserByVerification(
				walletAddress
			);
			if (user.result.user) {
				res.status(200).json({
					message: "success",
					data: user,
				});
			} else {
				res.status(404).json({
					message: "farcaster profile not found",
				});
			}
		} catch (e) {
			res.status(404).json({
				message: "farcaster profile not found",
			});
		}
	}
}
