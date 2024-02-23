import React, { useEffect, useContext } from "react";
import { AppContext } from "../../context/context";
import { AppActionTypes } from "../../reducers/appReducer";

export const Toaster = () => {
	const { state, dispatch } = useContext(AppContext);

	useEffect(() => {
		setTimeout(() => closeToaster(), 5000);
	}, [state.app.renderToaster]);

	const closeToaster = () => {
		dispatch({
			type: AppActionTypes.Set_Toaster,
			payload: {
				toaster: {
					render: false,
					success: state.app.toasterSuccess,
					message: state.app.toasterMessage,
				},
			},
		});
	};

	if (state.app.renderToaster) {
		return (
			<div className="z-50 fixed top-10 right-0 lg:top-2 lg:right-16 w-screen rounded-md lg:max-w-xs">
				<div
					id="toast-success"
					className={
						`${
							state.app.renderToaster ? "z-50" : "z-0"
						} flex flex-row items-center  px-3 w-full h-16 rounded-md bg-white shadow` +
						(state.app.renderToaster
							? " transition-opacity opacity-100 translate-y-0 transform duration-700"
							: " transition-all delay-100 opacity-0 translate-y-full")
					}
					role="alert"
				>
					{state.app.toasterSuccess ? (
						<div
							className={
								"inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-sm bg-green-100"
							}
						>
							<svg
								aria-hidden="true"
								className="w-5 h-5"
								fill="#0f766e"
								viewBox="0 0 20 20"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									fillRule="evenodd"
									d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
									clipRule="evenodd"
								></path>
							</svg>
							<span className="sr-only">Check icon</span>
						</div>
					) : (
						<div
							className={
								"inline-flex items-center justify-center flex-shrink-0 w-8 h-8 bg-rose-100"
							}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth={1.5}
								stroke="#9f1239"
								className="w-6 h-6"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
								/>
							</svg>
							<span className="sr-only">Alert icon</span>
						</div>
					)}

					<div className="ml-3">
						{state.app.toasterSuccess ? (
							<p className="text-sm lg:text-lg font-sans text-zinc-600">
								{state.app.toasterMessage}
							</p>
						) : (
							<p className="text-sm lg:text-base font-sans text-zinc-600">
								Sorry, something went wrong.
							</p>
						)}
					</div>
					<button
						onClick={() => closeToaster()}
						type="button"
						className="ml-auto -mx-1.5 -my-1.5 focus:ring-2 p-1.5 inline-flex h-8 w-8 text-zinc-800"
						data-dismiss-target="#toast-success"
						aria-label="Close"
					>
						<span className="sr-only">Close</span>
						<svg
							aria-hidden="true"
							className="w-5 h-5"
							fill="currentColor"
							viewBox="0 0 20 20"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								fillRule="evenodd"
								d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
								clipRule="evenodd"
							></path>
						</svg>
					</button>
				</div>
			</div>
		);
	}

	return <div></div>;
};
