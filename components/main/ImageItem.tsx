import React from "react";
import Link from "next/link";
import { Post } from "@/resources/posts/types";

type Props = {
  index: number;
  route: string;
  item: Post;
};

export const ImageItem = (props: Props) => {
  const { index, route, item } = props;

  return (
    <div className="flex flex-col mb-6 md:mb-10">
      <Link
        key={index}
        href={route}
        className="w-full md:h-96 md:p-4 flex md:flex-col md:items-center md:justify-center"
      >
        <img
          src={item.metadata?.image}
          className={`w-full md:h-full cursor-pointer object-contain`}
        />
      </Link>
    </div>
  );
};
