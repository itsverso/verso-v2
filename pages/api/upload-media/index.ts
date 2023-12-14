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
		let imageUrl;
		let body = JSON.parse(req.body);
		let haschanged = true;
		if (body.hasChanged == false) {
			haschanged = body.hasChanged;
		}
		if (body.image && haschanged) {
			let image = body.image;
			const buffer = Buffer.from(image, "base64");
			let tags = {
				tags: [{ name: "Content-Type", value: body.mimeType }],
			};
			let id = await uploadToArweave(buffer, tags);
			imageUrl = `https://arweave.net/${id}`;
		}

		let dataToUpload = haschanged
			? { ...body, image: imageUrl }
			: { ...body };
		let id = await uploadToArweave(JSON.stringify(dataToUpload), false);
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
