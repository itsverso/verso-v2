import React from "react";
import { useRouter } from "next/router";
import { Collection } from "@/resources/collections/types";

type Props = {
  title: string;
  address: string;
  handle: string;
  item: Collection;
};

export function CollectionCard(props: Props) {
  const router = useRouter();
  const { title, item } = props;

  const handleCollectionRedirect = () => {
    router.push(`/${props.handle}/${item.address}`);
  };

  return (
    <div
      onClick={handleCollectionRedirect}
      className={`relative w-full aspect-square cursor-pointer hover:opacity-90`}
    >
      <div className="w-full h-full flex flex-row">
        <div className="h-full w-1/2 bg-zinc-100 border-r-4 border-white">
          {item?.posts[0] ? (
            <img
              src={item?.posts[0]?.metadata.image}
              className="w-full h-full object-cover"
            />
          ) : null}
        </div>
        <div className="flex flex-col w-1/2 h-full">
          <div className="w-full h-1/2 bg-zinc-100 border-b-4 border-white">
            {item?.posts[1] ? (
              <img
                src={item?.posts[1]?.metadata.image}
                className="w-full h-full object-cover"
              />
            ) : null}
          </div>
          <div className="w-full h-1/2 bg-zinc-100">
            {item?.posts[2] ? (
              <img
                src={item?.posts[2]?.metadata.image}
                className="w-full h-full object-cover"
              />
            ) : null}
          </div>
        </div>
      </div>

      <div className="py-2">
        <p className="font-light text-gray-600">
          @{item.moderators[0]?.metadata.handle} - {title}
        </p>
      </div>
    </div>
  );
}
