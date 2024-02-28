import { Post } from "../posts/types";
import { Profile } from "../users/types";

export interface CollectionMetadata {
  title: string;
  description: string;
  image: string;
}

export interface Collection {
  address: string;
  metadataURI: string;
  metadata?: CollectionMetadata;
  posts: Post[];
  moderators: Profile[];
}
