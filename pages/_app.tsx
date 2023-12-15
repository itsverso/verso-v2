import "../styles/globals.css";
import Head from "next/head";
import type { AppProps } from "next/app";
import { AppProvider } from "@/context/context";
import { Header } from "@/components/common/Header";
import { PrivyProvider } from "@privy-io/react-auth";
import { optimismGoerli } from "viem/chains";

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<>
			<AppProvider>
				<PrivyProvider
					appId="clpispdty00ycl80fpueukbhl"
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
					<Header />
					<Component {...pageProps} />
				</PrivyProvider>
			</AppProvider>
		</>
	);
}

export default MyApp;
