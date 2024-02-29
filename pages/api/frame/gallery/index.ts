import type { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";
import { APIResponse } from "../../types";

interface APIRequest extends NextApiRequest {
	query: {
		collectionAddress?: string | undefined;
		tokenId?: string | undefined;
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

	if (tokenId == 0) {
		let htmlResponse = `<!DOCTYPE html><html><head>
				<title>Verso Collection Gallery</title>
				<meta property="fc:frame" content="vNext" />
				<meta property="fc:frame:image" content="${
					data.tokens.nfts[tokenId - 1].rawMetadata.image
				}" />
				<meta property="fc:frame:button:1" content="Get started" />
				<meta property="fc:frame:post_url" content="${
					process.env.NEXT_PUBLIC_BASE_URL
				}/api/frame/gallery?collectionAddress=${address}&tokenId=${1}" />
			</head></html>`;
		res.setHeader("Content-Type", "text/html");
		res.status(200).send(htmlResponse);
	} else if (tokenId <= maxLength) {
		if (body.untrustedData.buttonIndex == 1) {
			let nextToken = tokenId - 1;
			let htmlResponse = `<!DOCTYPE html><html><head>
				<title>This is frame 7</title>
				<meta property="fc:frame" content="vNext" />
				<meta property="fc:frame:image" content="${data.tokens.nfts[nextToken].rawMetadata.image}" />
				<meta property="fc:frame:button:1" content="Pervious" />
				<meta property="fc:frame:button:2" content="Next" />
				<meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_BASE_URL}/api/frame/gallery?collectionAddress=${address}&tokenId=${nextToken}" />
			</head></html>`;
			res.setHeader("Content-Type", "text/html");
			res.status(200).send(htmlResponse);
		} else {
			let nextToken = tokenId + 1;
			let htmlResponse = `<!DOCTYPE html><html><head>
				<title>This is frame 7</title>
				<meta property="fc:frame" content="vNext" />
				<meta property="fc:frame:image" content="${data.tokens.nfts[nextToken].rawMetadata.image}" />
				<meta property="fc:frame:button:1" content="Pervious" />
				<meta property="fc:frame:button:2" content="Next" />
				<meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_BASE_URL}/api/frame/gallery?collectionAddress=${address}&tokenId=${nextToken}" />
			</head></html>`;
			res.setHeader("Content-Type", "text/html");
			res.status(200).send(htmlResponse);
		}
	}
}
