import { useEffect } from "react";
import { NextPage } from "next";
import { Info } from "@/resources/icons";
import { CreateCollectionForm } from "@/components/forms/CreateCollectionForm";

const Create: NextPage = () => {
	return (
		<main className="flex flex-row min-h-screen lg:px-96">
			<CreateCollectionForm />
		</main>
	);
};

export default Create;
