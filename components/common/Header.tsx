"use client";
import React, { useState, useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { UserDropDown } from "../main/UserDropDown";

export function Header() {
	const [top, setTop] = useState(true);
	const { ready, authenticated, user, login, logout } = usePrivy();

	useEffect(() => {
		const scrollHandler = () => {
			window.pageYOffset > 10 ? setTop(false) : setTop(true);
		};
		window.addEventListener("scroll", scrollHandler);
		return () => window.removeEventListener("scroll", scrollHandler);
	}, [top]);

	function LoginButton() {
		return (
			<div className="h-10 w-20 rounded-md bg-neutral-300 flex items-center justify-center hover:opacity-80">
				<button
					className="h-full w-full font-mono text-sm font-light"
					onClick={login}
				>
					Log in
				</button>
			</div>
		);
	}

	return (
		<div
			className={`z-20 w-full h-20 lg:h-16 fixed top-0 flex flex-row ${
				!top && "shadow-md"
			}`}
		>
			<div className="w-1/3 md:w-1/5 flex flex-col justify-end lg:justify-center pl-5 lg:pl-6">
				<div className="py-4 lg:p-4 z-50 overflow-visible cursor-pointer">
					<h4 className="text-xl md:text-2xl font-lora tracking-wide leading-none text-zinc800 lg:text-lg">
						verso<span className="text-versoMint text-2xl">.</span>
					</h4>
				</div>
			</div>
			<div className="w-1/3 md:w-3/5"></div>
			<div className="w-1/3 md:w-1/5 pr-5 lg:pr-10 flex flex-col items-end justify-center">
				{ready ? (
					<div>
						{authenticated ? <UserDropDown /> : <LoginButton />}
					</div>
				) : null}
			</div>
		</div>
	);
}
