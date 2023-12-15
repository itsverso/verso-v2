import React, { createContext, useReducer } from "react";
import { userReducer, UserActions } from "../reducers/userReducer";
import { appReducer, AppActions } from "../reducers/appReducer";
import { InitialStateType, AppProps } from "../constants/types";

const initialState = {
	user: {
		address: undefined,
		name: undefined,
		handle: undefined,
		description: undefined,
		image: undefined,
		collections: [],
	},
	app: {
		loading: false,
	},
};

const AppContext = createContext<{
	state: InitialStateType;
	dispatch: React.Dispatch<UserActions | AppActions>;
}>({
	state: initialState,
	dispatch: () => null,
});

// @ts-ignore
const mainReducer = ({ user, app }, action) => ({
	user: userReducer(user, action),
	app: appReducer(app, action),
});

const AppProvider = (props: AppProps) => {
	const [state, dispatch] = useReducer(mainReducer, initialState);

	return (
		<AppContext.Provider value={{ state, dispatch }}>
			{props.children}
		</AppContext.Provider>
	);
};

export { AppContext, AppProvider };
