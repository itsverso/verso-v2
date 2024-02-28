export interface PostMetadata {
  image: string;
  creator: string;
  description: string;
  isPrivate: boolean;
  mimeType: string;
  timestamp: number;
  title: string;
}

export interface Post {
  tokenId: string;
  metadataURI: string;
  metadata?: PostMetadata;
}

export interface PostDetails extends Post {
  supply: string;
  market: string;
}
