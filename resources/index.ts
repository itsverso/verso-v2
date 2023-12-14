export const uploadDataToArweave = async (data: any) => {
	let route = process.env.NEXT_PUBLIC_BASE_URL + "/upload-media";
	let response = await fetch(route, {
		method: "POST",
		body: JSON.stringify(data),
	});
	return await response.json();
};
