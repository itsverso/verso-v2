import { useEffect, useContext } from "react";
import { NextPage } from "next";
import { Info } from "@/resources/icons";
import { AppContext } from "@/context/context";
import { CreateCollectionForm } from "@/components/forms/CreateCollectionForm";

const Create: NextPage = () => {
	let { state, dispatch } = useContext(AppContext);

	if (!state.user.handle) {
		return (
			<main className="flex flex-row min-h-screen min-w-screen items-center justify-center">
				<p>Only registered users can create</p>
			</main>
		);
	}

	return (
		<main className="flex flex-col min-h-screen pt-20 md:pt-24 lg:pt-32 md:px-32 lg:px-52 xl:px-96">
			<CreateCollectionForm />
		</main>
	);
};

export default Create;
