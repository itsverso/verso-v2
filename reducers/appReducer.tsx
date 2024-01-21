import { AppType } from "../constants/types";
import { ActionMap } from "./types";

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
