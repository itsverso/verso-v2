import { NextPage } from "next";
import { CreateCollectionForm } from "@/components/forms/CreateCollectionForm";
import { useUser } from "@/context/user-context";

const Create: NextPage = () => {
	const user = useUser();

	if (!user?.profile) {
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
