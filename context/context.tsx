import React, { createContext, useReducer } from "react";
import { appReducer, AppActions } from "../reducers/appReducer";
import { InitialStateType, AppProps } from "../constants/types";

const initialState = {
  app: {
    loading: false,
    featuredItem: undefined,
  },
};

const AppContext = createContext<{
  state: InitialStateType;
  dispatch: React.Dispatch<AppActions>;
}>({
  state: initialState,
  dispatch: () => null,
});

// @ts-ignore
const mainReducer = ({ app }, action) => ({
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
