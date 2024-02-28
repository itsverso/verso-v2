export interface Profile {
	walletAddress: string;
	metadataURI: string;
	metadata: {
		name: string;
		handle: string;
		description?: string;
		image?: string;
		mimeType?: string;
		website?: string;
		foundation?: string;
		superRare?: string;
		warpcast?: string;
	};
}
