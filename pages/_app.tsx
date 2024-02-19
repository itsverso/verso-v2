import "../styles/globals.css";
import Head from "next/head";
import type { AppProps } from "next/app";
import { AppProvider } from "@/context/context";
import { Header } from "@/components/common/Header";
import { PrivyProvider, User } from "@privy-io/react-auth";
import { optimismGoerli, optimism } from "viem/chains";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { createUser } from "@/resources/users/createUser";
import { UserProvider } from "@/context/user-context";
import localFont from "next/font/local";

const hedvig = localFont({
	src: [
		{
			path: "../public/fonts/HedvigLettersSerif-Regular-VariableFont_opsz.ttf",
			weight: "400",
		},
	],
	variable: "--font-hedvig",
});

function MyApp({ Component, pageProps }: AppProps) {
	const onWalletSuccess = async (user: User, isNewUser: boolean) => {
		if (user.wallet?.address && isNewUser) {
			// Create user on background
			createUser(user);
		}
	};

	const privy_ID =
		process.env.NEXT_PUBLIC_DEV == "true"
			? (process.env.NEXT_PUBLIC_PRIVY_APP_ID as string)
			: "clqfdmrmn024gi90foc0ag2uc";

	return (
		<>
			<PrivyProvider
				appId={privy_ID}
				config={{
					embeddedWallets: {
						createOnLogin: "users-without-wallets",
					},
					defaultChain:
						process.env.NEXT_PUBLIC_DEV == "true"
							? optimismGoerli
							: optimism,
					supportedChains: [optimism, optimismGoerli],
					loginMethods: ["email", "wallet"],
					appearance: {
						theme: "light",
						accentColor: "#676FFF",
						showWalletLoginFirst: false,
						logo: "https://i.postimg.cc/4dHggB9X/Group-3logo.png",
					},
				}}
				onSuccess={onWalletSuccess}
			>
				<AppProvider>
					<UserProvider>
						<Head>
							<title>Verso App</title>
							<meta
								name="description"
								content="A crypto-native social network for the arts."
							/>
							<meta name="theme-color" content="#FFFFFF" />
						</Head>
						<main
							className={`${GeistSans.variable} ${GeistMono.variable} ${hedvig.variable}`}
						>
							<Header />
							<Component {...pageProps} />
						</main>
					</UserProvider>
				</AppProvider>
			</PrivyProvider>
		</>
	);
}

export default MyApp;
