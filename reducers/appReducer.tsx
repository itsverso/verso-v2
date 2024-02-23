import { AppType } from "../constants/types";
import { ActionMap } from "./types";

export enum AppActionTypes {
	Loading = "SET_APP_LOADING",
	Set_Featured_Item = "SET_FEATURED_ITEM",
	Set_Toaster = "SET_TOASTER",
}

type AppPayload = {
	[AppActionTypes.Loading]: {
		loading: boolean;
	};
	[AppActionTypes.Set_Featured_Item]: {
		item: any;
	};
	[AppActionTypes.Set_Toaster]: {
		toaster: {
			render: boolean;
			success: boolean;
			message: string | undefined;
		};
	};
};

export type AppActions = ActionMap<AppPayload>[keyof ActionMap<AppPayload>];

export const appReducer = (state: AppType, action: AppActions) => {
	switch (action.type) {
		case AppActionTypes.Set_Featured_Item:
			return {
				...state,
				featuredItem: action?.payload?.item,
			};
		case AppActionTypes.Set_Toaster:
			let { render, success, message } = action.payload.toaster;
			return {
				...state,
				renderToaster: render,
				toasterSuccess: success,
				toasterMessage: message,
			};
		default:
			return state;
	}
};
