export type SimpleUserType = {
	name: string | undefined;
	handle: string | undefined;
	description: string | undefined;
	image: string | undefined;
	metadataURI: string | undefined;
	collections: Collection[];
};

export type GetUserResponse = {
	data: {
		error: boolean;
		message: string;
		user: SimpleUserType;
	};
};

export type Collection = {
	address: string;
	title: string;
	description: string;
	image: string;
};

export type ProfileType = {
	name: string | undefined;
	handle: string | undefined;
	description: string | undefined;
	image: string | undefined;
	metadataURI: string | undefined;
	collections: Collection[];
	userNotFound: boolean;
};

export type AppType = {
	loading: boolean;
	featuredItem: any | undefined;
	renderToaster: boolean;
	toasterSuccess: boolean;
	toasterMessage: string | undefined;
};

export type InitialStateType = {
	app: AppType;
};

export type AppProps = {
	children: React.ReactNode;
};
