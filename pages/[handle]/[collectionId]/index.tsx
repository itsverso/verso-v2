import { useEffect, useState, useContext } from "react";
import { AppContext } from "@/context/context";
import { AddMediaButton } from "@/components/main/AddMediaButton";
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
import { getFrameMetadata } from "@coinbase/onchainkit";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Collection Name Test",
	description: "collection description",
	openGraph: {
		title: "Collection Name",
		description: "collection description",
		images: [
			`https://arweave.net/kA7Qry-8yP24ANW9aKGHhNS_tja_41eiQiar67cMLCI`,
		],
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
	const route = process.env.NEXT_PUBLIC_BASE_URL + `/collection/${id}`;
	let res = await fetch(route);
	let collection = await res.json();
	return { props: { id, handle, collection } };
}

const Collection: NextPage = (props: any) => {
	const router = useRouter();
	const { state } = useContext(AppContext);
	const user = useUser();
	const [fireFetch, setFireFetch] = useState<boolean>(false);
	const [openCreateDrawer, setOpenCreateDrawer] = useState<boolean>(false);
	const { data, isLoading, mutate } = useGetCollectionTokens(props.id);

	useEffect(() => {
		if (fireFetch) {
			mutate();
			setFireFetch(false);
		}
	}, [data, fireFetch]);

	const handleUserRedirect = () => {
		router.push(`/${data?.moderators[0]?.handle}`);
		console.log("hello");
	};

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
					content={`${props.collection?.tokens?.nfts[0]?.rawMetadata?.image}`}
				/>
				<meta
					property="fc:frame:post_url"
					content={`https://www.itsverso.com/api/frame/gallery?handle=${props.handle}&collectionAddress=0x0C85CB358E7805A4B9B5725890B8Ba3C5b71c028&tokenId=0`}
				/>
				<meta property="fc:frame:button:1" content="Get started" />
			</Head>
			<main className="flex flex-col px-6 md:px-16 lg:px-20 xl:px-32 py-20 min-w-screen min-h-screen">
				<Drawer
					isOpen={openCreateDrawer}
					setIsOpen={setOpenCreateDrawer}
				>
					<MintPictureForm
						address={data?.address}
						fireFetch={() => setFireFetch(true)}
						onClickBack={() => setOpenCreateDrawer(false)}
					/>
				</Drawer>
				<div className="w-full mt-4 md:mt-10 lg:px-4 flex flex-col">
					<div className="flex flex-row items-center mb-2">
						<div className="h-6 w-6 rounded-full bg-zinc-200">
							{data?.moderators[0]?.image ? (
								<img
									className="w-full h-full rounded-full object-cover"
									src={data?.moderators[0]?.image}
								/>
							) : null}
						</div>
						<div
							className="cursor-pointer"
							onClick={() => handleUserRedirect()}
						>
							<p className="ml-2 mt-1 text-xl text-gray-600 hover:opacity-80 font-hedvig">
								@{data?.moderators[0]?.handle}
							</p>
						</div>
					</div>
					<p className="font-hedvig font-light text-4xl ">
						{data?.metadata?.title}
					</p>
					<p className="font-sans text-lg text-zinc-600 font-light max-w-3xl mt-2">
						{data?.metadata?.description}
					</p>
				</div>
				<div className="h-full w-full mt-10">
					<div className="w-full h-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
						{data?.tokens?.nfts.map((item: any, index: number) => {
							if (!item.metadataError) {
								return (
									<ImageItem
										item={item}
										index={index}
										src={item?.media[0]?.gateway}
										route={`${router.asPath}/${item.tokenId}`}
									/>
								);
							}
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

/***
 * 
 * 	const handleDragEnter = (e: any) => {
		e.preventDefault();
		e.stopPropagation();
		setDragActive(true);
		console.log("Entered");
	};

	const handleDragLeave = (e: any) => {
		e.preventDefault();
		e.stopPropagation();
		setDragActive(false);
		console.log("Leaved");
	};

	const handleDragOver = (e: any) => {
		e.preventDefault();
		e.stopPropagation();
		setDragActive(true);
		console.log("Over");
	};

	const handleDrop = (e: any) => {
		e.preventDefault();
		e.stopPropagation();
		if (e.dataTransfer.files && e.dataTransfer.files[0]) {
			console.log(e.dataTransfer.files);
			for (let i = 0; i < e.dataTransfer.files["length"]; i++) {
				setFiles((prevState: any) => [
					...prevState,
					window.URL.createObjectURL(e.dataTransfer.files[i]),
				]);
			}
		}
		console.log("Dropped");
	};

	function handleChange(e: any) {
		e.preventDefault();
		console.log("File has been added");
		if (e.target.files && e.target.files[0]) {
			console.log(e.target.files);
			for (let i = 0; i < e.target.files["length"]; i++) {
				if (e.target.files[i].type.includes("image")) {
					setFiles((prevState: any) => [
						...prevState,
						e.target.files[i],
					]);
				}
			}
		}
	}

	function openFileExplorer() {
		inputRef.current.value = "";
		inputRef.current.click();
	}

 * 
 * <form
					className={`${
						dragActive ? "bg-blue-400" : "bg-blue-100"
					}  p-4 w-1/3 rounded-lg  min-h-[10rem] text-center flex flex-col items-center justify-center`}
					onDragEnter={handleDragEnter}
					onSubmit={(e) => e.preventDefault()}
					onDrop={handleDrop}
					onDragLeave={handleDragLeave}
					onDragOver={handleDragOver}
				>
					<input
						placeholder="fileInput"
						className="hidden w-full h-full"
						ref={inputRef}
						type="file"
						multiple={true}
						onChange={handleChange}
						accept="image/*"
					/>
					<p>
						Drag & Drop files or{" "}
						<span
							className="font-bold text-blue-600 cursor-pointer"
							onClick={openFileExplorer}
						>
							<u>Select files</u>
						</span>{" "}
						to upload
					</p>
				</form>
 */
