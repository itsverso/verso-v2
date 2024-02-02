import { ActionMap } from "@/reducers/types";
import { getUserProfile } from "@/resources/users/getProfile";
import { Profile } from "@/resources/users/types";
import { ConnectedWallet, usePrivy, useWallets } from "@privy-io/react-auth";
import { useEffect } from "react";
import { Dispatch } from "react";
import { createContext, useContext, useReducer } from "react";

export const UserContext = createContext<User | null>(null);
export const UserDispatchContext = createContext<Dispatch<UserActions> | null>(
  null
);

export interface User {
  wallet: ConnectedWallet | null;
  profile: Profile | null;
  loading: boolean;
}

const initialUser: User = {
  wallet: null,
  profile: null,
  loading: false,
};

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, dispatch] = useReducer(userReducer, initialUser);
  const { wallets } = useWallets();
  const { authenticated, ready, logout } = usePrivy();

  useEffect(() => {
    if (wallets[0] && authenticated && ready) {
      const wallet = wallets[0];
      dispatch({ type: UserActionTypes.SET_WALLET, payload: { wallet } });
    } else {
      dispatch({ type: UserActionTypes.SET_WALLET, payload: { wallet: null } });
    }
  }, [wallets, authenticated, ready, logout]);

  // If wallet, get profile
  useEffect(() => {
    (async () => {
      if (!user?.wallet?.address) {
        return;
      }

      dispatch({
        type: UserActionTypes.SET_LOADING,
        payload: { loading: true },
      });

      try {
        const profile = await getUserProfile(user.wallet.address);

        dispatch({
          type: UserActionTypes.SET_PROFILE,
          payload: { profile },
        });
        dispatch({
          type: UserActionTypes.SET_LOADING,
          payload: { loading: false },
        });
      } catch (e) {
        dispatch({
          type: UserActionTypes.SET_LOADING,
          payload: { loading: false },
        });
        throw e;
      }
    })();
  }, [user?.wallet]);

  return (
    <UserContext.Provider value={user}>
      <UserDispatchContext.Provider value={dispatch}>
        {children}
      </UserDispatchContext.Provider>
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}

export function useUserDispatch() {
  return useContext(UserDispatchContext);
}

export enum UserActionTypes {
  SET_PROFILE = "SET_PROFILE",
  SET_WALLET = "SET_WALLET",
  SET_LOADING = "SET_LOADING",
}

type UserPayload = {
  [UserActionTypes.SET_WALLET]: {
    wallet: ConnectedWallet | null;
  };
  [UserActionTypes.SET_PROFILE]: {
    profile: Profile | null;
  };
  [UserActionTypes.SET_LOADING]: {
    loading: boolean;
  };
};

type UserActions = ActionMap<UserPayload>[keyof ActionMap<UserPayload>];

function userReducer(user: User, action: UserActions) {
  switch (action.type) {
    case UserActionTypes.SET_PROFILE: {
      return {
        ...user,
        profile: action.payload.profile,
      };
    }
    case UserActionTypes.SET_WALLET: {
      return {
        ...user,
        wallet: action.payload.wallet,
      };
    }
    case UserActionTypes.SET_LOADING: {
      return {
        ...user,
        loading: action.payload.loading,
      };
    }
  }
}
