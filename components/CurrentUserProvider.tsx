import { createContext, useState } from "react";
import { User } from "../lib/users";

interface CurrentUser {
  userId: number;
  username: string;
  phoneNumber: string;
}

type UpdateCurrentUser = (newCurrentUser: User | undefined) => void;

type CustomContext = {
  currentUser: CurrentUser | undefined;
  updateCurrentUser: UpdateCurrentUser;
}

export const CurrentUserContext = createContext<CustomContext>({
  currentUser: undefined,
  updateCurrentUser: (_) => {}
});

interface Props {
  children: React.ReactNode;
}

export function CurrentUserProvider (props: Props) {
  const { children } = props;
  const [currentUser, setCurrentUser] = useState<CurrentUser | undefined>(undefined);
  const value = {
    currentUser,
    updateCurrentUser: (newCurrentUser: User | undefined) => {
      setCurrentUser({
        userId: newCurrentUser?.id || 0,
        username: newCurrentUser?.username || "",
        phoneNumber: newCurrentUser?.phoneNumber || ""
      });
    }
  }
  return (
    <CurrentUserContext.Provider value={value}>
      {children}
    </CurrentUserContext.Provider>
  )  
}