import { useEffect } from "react";

export default function Home() {
	return (
		<main className="flex min-h-screen flex-col items-center justify-center p-24">
			<h1 className="font-light">Welcome to Verso.</h1>
			<p className="mt-6">
				Navigate to{" "}
				<a
					className="hover:underline cursor-pointer"
					href="/create-profile"
				>
					/create-profile
				</a>{" "}
				to get started.
			</p>
		</main>
	);
}
