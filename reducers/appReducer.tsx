import { AppType, ProfileType } from "../constants/types";

type ActionMap<M extends { [index: string]: any }> = {
	[Key in keyof M]: M[Key] extends undefined
		? {
				type: Key;
		  }
		: {
				type: Key;
				payload: M[Key];
		  };
};

export enum AppActionTypes {
	Loading = "SET_APP_LOADING",
	Set_Featured_Item = "SET_FEATURED_ITEM",
}

type AppPayload = {
	[AppActionTypes.Loading]: {
		loading: boolean;
	};
	[AppActionTypes.Set_Featured_Item]: {
		item: any;
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
		default:
			return state;
	}
};
