import type { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";
import { APIResponse } from "../../types";

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
	const tokenId = parseInt(req.query.tokenId as string);
	const address = req.query.collectionAddress;
	const handle = req.query.handle as string;
	const nextId = tokenId + 1;

	let route = process.env.NEXT_PUBLIC_BASE_URL + `/collection/${address}`;
	let requestCollectionData = await fetch(route, {
		method: "POST",
		body: JSON.stringify({ address }),
	});
	let data = await requestCollectionData.json();
	let maxLength = data.tokens.nfts.length;

	let body = req.body;
	console.log(body);

	let nextToken = tokenId + 1;

	if (nextToken < maxLength - 1) {
		// If token id is 0 and user has clicked on "Get started"
		// We return second image and button options
		let htmlResponse = `<!DOCTYPE html><html><head>
				<title>This is frame 7</title>
				<meta property="fc:frame" content="vNext" />
				<meta property="fc:frame:image" content="${data.tokens.nfts[nextToken].rawMetadata.image}" />
				<meta property="fc:frame:button:1" content="Next" />
				<meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_BASE_URL}/frame/gallery?handle=${handle}&collectionAddress=${address}&tokenId=${nextToken}" />
			</head></html>`;
		res.setHeader("Content-Type", "text/html");
		res.status(200).send(htmlResponse);
	} else if (nextToken == maxLength - 1) {
		let htmlResponse = `<!DOCTYPE html><html><head>
				<title>This is frame 7</title>
				<meta property="fc:frame" content="vNext" />
				<meta property="fc:frame:image" content="${data.tokens.nfts[nextToken].rawMetadata.image}" />
				<meta property="fc:frame:button:1" content="Visit on Verso" />
				<meta property="fc:frame:button:2:action" content="post_redirect" />
				<meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_BASE_URL}/${handle}/${address}" />
			</head></html>`;
		res.setHeader("Content-Type", "text/html");
		res.status(200).send(htmlResponse);
	}
}

// https://www.itsverso.com/api/frame/gallery?collectionAddress=0x0C85CB358E7805A4B9B5725890B8Ba3C5b71c028&tokenId=1
