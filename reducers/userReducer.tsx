import { UserType, Collection } from "../constants/types";

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

export enum UserActionTypes {
	SET_USER = "SET_USER",
	FETCH = "FETCH",
}

type UserPayload = {
	[UserActionTypes.SET_USER]: {
		user: UserType | undefined;
	};
	[UserActionTypes.FETCH]: {
		fetch: boolean | undefined;
	};
};

export type UserActions = ActionMap<UserPayload>[keyof ActionMap<UserPayload>];

export const userReducer = (state: UserType, action: UserActions) => {
	switch (action.type) {
		case UserActionTypes.SET_USER:
			return {
				...state,
				name: action?.payload?.user?.name,
				description: action?.payload?.user?.description,
				handle: action?.payload?.user?.handle,
				address: action?.payload.user?.address,
				image: action?.payload?.user?.image,
				signer: action?.payload?.user?.signer,
			};
		case UserActionTypes.FETCH:
			return {
				...state,
				fetch: action?.payload?.fetch,
			};
		default:
			return state;
	}
};
