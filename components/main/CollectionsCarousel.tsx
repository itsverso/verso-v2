import React from "react";
import { CollectionCard } from "./CollectionCard";
import useGetUserCollections from "@/hooks/useGetUserCollections";
import { EmptyUserGrid } from "./EmptyUserGrid";

type CarouselProps = {
  userWalletAddress: string;
  isOwner: boolean;
  userHandle: string;
  openDrawer: () => void;
};

export function CollectionsCarousel(props: CarouselProps) {
  const { userWalletAddress } = props;
  const {
    data: collections,
    error,
    isLoading,
  } = useGetUserCollections(userWalletAddress);

  if (isLoading || !collections?.data || error) {
    return <div></div>;
  }

  return (
    <div className="w-full flex flex-col lg:flex-row items-center">
      {collections?.data.length > 0 ? (
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 lg:gap-12 mt-6">
          {collections.data.map((collection, index) => (
            <CollectionCard
              key={index}
              item={collection}
              title={collection.metadata?.title ?? ""}
              address={collection.address}
              handle={props.userHandle}
            />
          ))}
        </div>
      ) : (
        <div>
          <EmptyUserGrid isOwner={props.isOwner} />
        </div>
      )}
    </div>
  );
}
