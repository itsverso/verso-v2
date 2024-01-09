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
		<main className="flex flex-row min-h-screen lg:px-96">
			<CreateCollectionForm />
		</main>
	);
};

export default Create;
