export const fetchUserProfileFromHandle = async (handle: string) => {
	let url = process.env.NEXT_PUBLIC_BASE_URL + "/get-profile";
	let res = await fetch(url, {
		method: "POST",
		body: JSON.stringify({ handle }),
	});
	return await res.json();
};
