import "../styles/globals.css";
import Head from "next/head";
import type { AppProps } from "next/app";
import { Header } from "@/components/common/Header";
import { PrivyProvider } from "@privy-io/react-auth";

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<>
			<Head>
				<title>Verso App</title>
				<link rel="manifest" href="/manifest.json" />
				<link rel="icon" href="/favicon.ico" />
				<meta
					name="description"
					content="A crypto-native social network for the arts."
				/>

				<link rel="apple-touch-icon" href="/icon-512x512.png" />
				<meta name="theme-color" content="#000" />
				<meta
					name="apple-mobile-web-app-status-bar-style"
					content="black-translucent"
				/>
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no, viewport-fit=cover"
				/>
				<meta name="theme-color" content="#FFFFFF" />
			</Head>
			<PrivyProvider
				appId="clpispdty00ycl80fpueukbhl"
				createPrivyWalletOnLogin={true}
				config={{
					loginMethods: ["email", "wallet"],
					appearance: {
						theme: "light",
						accentColor: "#676FFF",
						showWalletLoginFirst: false,
						logo: "https://i.postimg.cc/4dHggB9X/Group-3logo.png",
					},
				}}
			>
				<Header />
				<Component {...pageProps} />
			</PrivyProvider>
		</>
	);
}

export default MyApp;
