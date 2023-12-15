import React from "react";

type Props = {
	children: React.ReactNode;
	isOpen: boolean;
	setIsOpen: (isOpen: boolean) => void;
};

export function Drawer(props: Props) {
	const { children, isOpen, setIsOpen } = props;

	return (
		<main
			className={
				" fixed overflow-hidden z-20 bg-zinc800 bg-opacity-25 inset-0 transform ease-in-out " +
				(isOpen
					? " transition-opacity opacity-100 duration-500 translate-x-0  "
					: " transition-all delay-500 opacity-0 translate-x-full  ")
			}
		>
			<section
				className={
					"w-screen max-w-72 sm:max-w-md right-0 absolute bg-zinc50 h-full shadow-xl delay-400 duration-500 ease-in-out transition-all transform  " +
					(isOpen ? " translate-x-0 " : " translate-x-full ")
				}
			>
				{children}
			</section>
			<section
				className=" w-screen h-full cursor-pointer "
				onClick={() => {
					setIsOpen(false);
				}}
			></section>
		</main>
	);
}
