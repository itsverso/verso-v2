import type { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

interface APIRequest extends NextApiRequest {
	query: {
		collectionAddress?: string | undefined;
		tokenId?: string | undefined;
		handle?: string | undefined;
	};
}

// Simple route to fecth a user's FARCASTER profile
// based on his wallet address.
export default async function handler(
	req: APIRequest,
	res: NextApiResponse<any>
) {
	const address = req.query.collectionAddress;
	const handle = req.query.handle as string;
	const route = `https://www.itsverso.com/${handle}/${address}`;
	// Redirect the request
	res.redirect(302, route);
}

// https://www.itsverso.com/api/frame/gallery?collectionAddress=0x0C85CB358E7805A4B9B5725890B8Ba3C5b71c028&tokenId=1
