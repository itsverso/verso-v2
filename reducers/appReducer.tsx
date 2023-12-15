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
}

type AppPayload = {
	[AppActionTypes.Loading]: {
		loading: boolean;
	};
};

export type AppActions = ActionMap<AppPayload>[keyof ActionMap<AppPayload>];

export const appReducer = (state: AppType, action: AppActions) => {
	switch (action.type) {
		default:
			return state;
	}
};
