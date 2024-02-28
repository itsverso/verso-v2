import { useEffect, useState } from "react";
import useGetCollectionTokens from "@/hooks/useGetCollectionTokens";
import { Drawer } from "@/components/common/Drawer";
import { MintPictureForm } from "@/components/forms/MintPictureForm";
import { NextPage } from "next";
import { GetStaticPaths } from "next";
import { Spinner } from "@/components/common/Spinner";
import { useRouter } from "next/router";
import { ImageItem } from "@/components/main/ImageItem";
import { useUser } from "@/context/user-context";
import { PlusIcon } from "@heroicons/react/24/solid";
import Head from "next/head";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Collection Name Test",
  description: "collection description",
  openGraph: {
    title: "Collection Name",
    description: "collection description",
    images: [`https://arweave.net/kA7Qry-8yP24ANW9aKGHhNS_tja_41eiQiar67cMLCI`],
  },
  other: {},
};

export const getStaticPaths: GetStaticPaths<{ handle: string }> = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export async function getStaticProps({ params }: any) {
  let id = params.collectionId;
  let handle = params.handle;
  return { props: { id, handle } };
}

const Collection: NextPage = (props: any) => {
  const router = useRouter();
  const user = useUser();
  const [fireFetch, setFireFetch] = useState<boolean>(false);
  const [openCreateDrawer, setOpenCreateDrawer] = useState<boolean>(false);
  const {
    data: collectionData,
    isLoading,
    mutate,
  } = useGetCollectionTokens(props.id);
  const collection = collectionData?.data;

  useEffect(() => {
    if (fireFetch) {
      mutate();
      setFireFetch(false);
    }
  }, [fireFetch]);

  const handleUserRedirect = () => {
    router.push(`/${collection?.moderators[0]?.metadata.handle}`);
  };

  if (isLoading || !collection) {
    return (
      <main className="flex items-center justify-center min-w-screen min-h-screen">
        <Spinner />
      </main>
    );
  }

  return (
    <>
      <Head>
        <meta property="og:title" content={`Try`} />
        <meta
          property="og:image"
          content={`https://arweave.net/kA7Qry-8yP24ANW9aKGHhNS_tja_41eiQiar67cMLCI`}
        />
        <meta property="fc:frame" content="vNext" />
        <meta
          property="fc:frame:image"
          content={`https://arweave.net/kA7Qry-8yP24ANW9aKGHhNS_tja_41eiQiar67cMLCI`}
        />
        <meta
          property="fc:frame:post_url"
          content={`https://www.itsverso.com/guille/0x0C85CB358E7805A4B9B5725890B8Ba3C5b71c028`}
        />
        <meta property="fc:frame:button:1" content="Get started" />
      </Head>
      <main className="flex flex-col px-6 md:px-16 lg:px-20 xl:px-32 py-20 min-w-screen min-h-screen">
        <Drawer isOpen={openCreateDrawer} setIsOpen={setOpenCreateDrawer}>
          <MintPictureForm
            address={collection?.address}
            fireFetch={() => setFireFetch(true)}
            onClickBack={() => setOpenCreateDrawer(false)}
          />
        </Drawer>
        <div className="w-full mt-4 md:mt-10 lg:px-4 flex flex-col">
          <div className="flex flex-row items-center mb-2">
            <div className="h-6 w-6 rounded-full bg-zinc-200">
              {collection.moderators[0]?.metadata.image ? (
                <img
                  className="w-full h-full rounded-full object-cover"
                  src={collection.moderators[0].metadata.image}
                />
              ) : null}
            </div>
            <div
              className="cursor-pointer"
              onClick={() => handleUserRedirect()}
            >
              <p className="ml-2 mt-1 text-xl text-gray-600 hover:opacity-80 font-hedvig">
                @{collection.moderators[0]?.metadata.handle}
              </p>
            </div>
          </div>
          <p className="font-hedvig font-light text-4xl ">
            {collection.metadata?.title}
          </p>
          <p className="font-sans text-lg text-zinc-600 font-light max-w-3xl mt-2">
            {collection.metadata?.description}
          </p>
        </div>
        <div className="h-full w-full mt-10">
          <div className="w-full h-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            {collection.posts.map((item, index) => {
              return (
                <ImageItem
                  item={item}
                  index={index}
                  route={`${router.asPath}/${item.tokenId}`}
                />
              );
            })}
          </div>
        </div>
        {
          // Only display button if user is owner.
          user?.profile?.metadata.handle == props.handle ? (
            <div className="fixed bottom-10 right-12 flex flex-col items-center">
              <button
                onClick={() => setOpenCreateDrawer(true)}
                className="my-1 flex items-center justify-center  h-14 w-14 rounded-full bg-black hover:opacity-90 cursor-pointer shadow-2xl"
              >
                <PlusIcon className="w-6 h-6 text-white" />
              </button>
            </div>
          ) : null
        }
      </main>
    </>
  );
};

export default Collection;
