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

	let body = JSON.parse(req.body);
	console.log(body);

	if (true) {
		let htmlResponse = `<!DOCTYPE html><html><head>
			<title>This is frame 7</title>
			<meta property="fc:frame" content="vNext" />
			<meta property="fc:frame:image" content="https://arweave.net/kA7Qry-8yP24ANW9aKGHhNS_tja_41eiQiar67cMLCI" />
			<meta property="fc:frame:button:1" content="Visit CosmicCowboys.cloud" />
			<meta property="fc:frame:button:1:action" content="post_redirect" />
			<meta property="fc:frame:button:2" content="Learn How this was made" />
			<meta property="fc:frame:button:2:action" content="post_redirect" />
			<meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_BASE_URL}/api/end" />
		</head></html>`;
		res.setHeader("Content-Type", "text/html");
		res.status(200).send(htmlResponse);
	} else {
		if (tokenId === 7) {
			return new NextResponse(`<!DOCTYPE html><html><head>
		  <title>This is frame 7</title>
		  <meta property="fc:frame" content="vNext" />
		  <meta property="fc:frame:image" content="https://arweave.net/kA7Qry-8yP24ANW9aKGHhNS_tja_41eiQiar67cMLCI" />
		  <meta property="fc:frame:button:1" content="Visit CosmicCowboys.cloud" />
		  <meta property="fc:frame:button:1:action" content="post_redirect" />
		  <meta property="fc:frame:button:2" content="Learn How this was made" />
		  <meta property="fc:frame:button:2:action" content="post_redirect" />
		  <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_BASE_URL}/api/end" />
		</head></html>`);
		} else {
			return new NextResponse(`<!DOCTYPE html><html><head>
		  <title>This is frame ${nextId}</title>
		  <meta property="fc:frame" content="vNext" />
		  <meta property="fc:frame:image" content="${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/Qme4FXhoxHHfyzTfRxSpASbMF8kajLEPkRQWhwWu9pkUjm/${nextId}.png" />
		  <meta property="fc:frame:button:1" content="Next Page" />
		  <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_BASE_URL}/api/frame?id=${nextId}" />
		</head></html>`);
		}
	}
}
