import type { NextApiRequest, NextApiResponse } from "next";
import Bundlr from "@bundlr-network/client";

type Data = {
	url: string | any;
};

export const config = {
	api: {
		responseLimit: false,
		bodyParser: {
			sizeLimit: "4mb",
		},
	},
};

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	try {
		// We may need to change this to be more abstract and not image specific
		let imageUrl;
		const body = JSON.parse(req.body);
		const haschanged = body.hasChanged || true;

		if (body.image && haschanged) {
			const image = body.image;
			const buffer = Buffer.from(image, "base64");
			const tags = {
				tags: [{ name: "Content-Type", value: body.mimeType }],
			};
			const id = await uploadToArweave(buffer, tags);
			imageUrl = `https://arweave.net/${id}`;
		}

		const dataToUpload = haschanged
			? { ...body, image: imageUrl }
			: { ...body };
		const id = await uploadToArweave(JSON.stringify(dataToUpload), false);
		res.status(200).json({
			url: `https://arweave.net/${id}`,
		});
	} catch (e) {
		console.log(e);
		res.status(500).json({
			url: e,
		});
	}
}

async function uploadToArweave(data: any, tags: any) {
	let response;
	const bundlr = new Bundlr(
		"http://node1.bundlr.network",
		"matic",
		process.env.BUNDLR_PRIVATE_KEY as string
	);
	if (!!tags) {
		response = await bundlr.upload(data, tags);
	} else {
		response = await bundlr.upload(data);
	}
	return response.id;
}
