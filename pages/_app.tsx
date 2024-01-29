import "../styles/globals.css";
import Head from "next/head";
import type { AppProps } from "next/app";
import { AppProvider } from "@/context/context";
import { Header } from "@/components/common/Header";
import { PrivyProvider } from "@privy-io/react-auth";
import { optimismGoerli } from "viem/chains";
import { GeistSans, GeistMono } from "geist/font";
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
	const privy_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID as string;

	return (
		<>
			<AppProvider>
				<PrivyProvider
					appId={privy_ID}
					createPrivyWalletOnLogin={true}
					config={{
						defaultChain: optimismGoerli,
						supportedChains: [optimismGoerli],
						loginMethods: ["email", "wallet"],
						appearance: {
							theme: "light",
							accentColor: "#676FFF",
							showWalletLoginFirst: false,
							logo: "https://i.postimg.cc/4dHggB9X/Group-3logo.png",
						},
					}}
				>
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
				</PrivyProvider>
			</AppProvider>
		</>
	);
}

export default MyApp;
