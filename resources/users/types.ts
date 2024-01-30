export interface Profile {
  walletAddress: string;
  metadataURI: string;
  metadata: {
    name: string;
    handle: string;
    description?: string;
    image?: string;
    website?: string;
    foundation?: string;
    superRare?: string;
  };
}
