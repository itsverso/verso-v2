import { useEffect } from "react";
import { NextPage } from "next";
import { Info } from "@/resources/icons";
import { CreateCollectionForm } from "@/components/forms/CreateCollectionForm";

const Create: NextPage = () => {
	return (
		<main className="flex flex-row min-h-screen">
			<div className="min-h-screen w-1/2 flex flex-col items-start justify-center lg:px-24">
				<div>
					<h1 className="font-semibold text-7xl">Create</h1>
					<h1 className="font-semibold text-7xl">your next</h1>
					<h1 className="font-semibold text-7xl">collection.</h1>
					<p className="text-lg font-extralight mt-6 pr-10">
						Lorem Ipsum is simply dummy text of the printing and
						typesetting industry. Lorem Ipsum has been the
						industry's standard dummy text ever since the 1500s,
						when an unknown printer took a galley of type and
						scrambled it to make a type specimen book.
					</p>
					<div className="mt-4 flex flex-row items-center">
						<Info />
						<p className="ml-2 hover:underline hover:cursor-pointer">
							How does it work?
						</p>
					</div>
				</div>
			</div>
			<div className="min-h-screen w-1/2 flex flex-col">
				<CreateCollectionForm />
			</div>
		</main>
	);
};

export default Create;
