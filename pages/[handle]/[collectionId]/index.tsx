import { useEffect, useRef, useState } from "react";
import { CollectionFeed } from "@/components/feeds/CollectionFeed";
import { AddMediaButton } from "@/components/main/AddMediaButton";
import useGetCollectionTokens from "@/hooks/useGetCollectionTokens";

import { NextPage } from "next";
import { GetStaticPaths } from "next";

export const getStaticPaths: GetStaticPaths<{ handle: string }> = async () => {
	return {
		paths: [],
		fallback: "blocking",
	};
};

export async function getStaticProps({ params }: any) {
	let id = params.collectionId;
	return { props: { id } };
}

const Collection: NextPage = (props: any) => {
	const [dragActive, setDragActive] = useState<boolean>(false);
	const inputRef = useRef<any>(null);
	const [files, setFiles] = useState<any>([]);

	const { data, error, isLoading, mutate } = useGetCollectionTokens(props.id);

	useEffect(() => {
		console.log(data);
	}, [data]);

	return (
		<main className="flex flex-col px-32 py-20 min-w-screen min-h-screen">
			<div className="w-full h-32 flex items-center justify-center">
				<h1>Rebirth of Detroit</h1>
			</div>
			<div className="h-full w-full">
				<CollectionFeed items={files} />
			</div>
			<AddMediaButton />
		</main>
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
