import { useToast, VStack } from "native-base";
import { createContext, useCallback, useEffect, useState } from "react";
import { getLastLogIn, getUserFromLocalStorage, saveLastLogIn, saveUserToLocalStorage } from "../lib/session";
import { User } from "../lib/users";
import { CustomError } from "./CustomError";
import { LoadingText } from "./LoadingText";

export interface CurrentUser {
  userId: number;
  username: string;
  phoneNumber: string;
}

type UpdateCurrentUser = (newCurrentUser: CurrentUser | undefined) => void;

type CustomContext = {
  currentUser: CurrentUser;
  updateCurrentUser: UpdateCurrentUser;
  login: (newCurrentUser: User) => Promise<void>;
  logout: () => void;
}

export const CurrentUserContext = createContext<CustomContext>({
  currentUser: { userId: 0, username: "", phoneNumber: "" },
  updateCurrentUser: (_) => { },
  login: (_) => Promise.resolve(),
  logout: () => { },
});

interface Props {
  children: React.ReactNode;
}

export function CurrentUserProvider (props: Props) {
  const { children } = props;

  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [retryToggle, setRetryToggle] = useState(false);
  const [currentUser, setCurrentUser] = useState<CurrentUser>({
    userId: 0, username: "", phoneNumber: "",
  });

  const updateCurrentUser = useCallback(async (newCurrentUser: CurrentUser | undefined) => {
    const details: CurrentUser = {
      userId: newCurrentUser?.userId || 0,
      username: newCurrentUser?.username || "",
      phoneNumber: newCurrentUser?.phoneNumber || ""
    }
    setCurrentUser(details);
    await saveUserToLocalStorage(details);
  }, [saveUserToLocalStorage]);

  const login = useCallback(async (newCurrentUser: User) => {
    updateCurrentUser({
      userId: newCurrentUser.id,
      username: newCurrentUser.username,
      phoneNumber: newCurrentUser.phoneNumber,
    });
    await saveLastLogIn(new Date().getTime());
  }, [updateCurrentUser, saveLastLogIn]);

  const logout = useCallback(() => {
    updateCurrentUser({
      userId: 0,
      username: "",
      phoneNumber: "",
    });
  }, [updateCurrentUser]);

  useEffect(() => {
    init();
    async function init () {
      try {
        setIsLoading(true);
        const currentUser = await getUserFromLocalStorage();
        setCurrentUser(currentUser);
      } catch ({ message }) {
        setError(message as string || "Failed to fetch current user, please try again");
      } finally {
        setIsLoading(false);
      }
    }
  }, [getUserFromLocalStorage, retryToggle]);

  useEffect(() => {
    const CHECK_LOGOUT_INTERVAL = 1000 * 30;
    const interval = setInterval(() => checkLogout(), CHECK_LOGOUT_INTERVAL);
    async function checkLogout () {
      console.log("Checking logout...");
      if (!currentUser.userId) {
        console.log("Already logged out.");
        return;
      }
      const LOGOUT_INTERVAL = 1000 * 60 * 5; // 5 minutes
      const lastLogIn = await getLastLogIn();
      if (!lastLogIn) {
        console.log("Last log in not found, logging out...");
        toast.show({ description: "Your session has expired" });
        return logout();
      }
      const now = new Date().getTime();
      if (now - lastLogIn > LOGOUT_INTERVAL) {
        console.log("Interval reached, logging out...");
        toast.show({ description: "Your session has expired" });
        return logout();
      }
      console.log("Interval not reached, waiting for next check...");
    }
    return () => clearInterval(interval);
  }, [getLastLogIn, currentUser.userId, logout]);

  const toggleRetry = useCallback(() => setRetryToggle(prevState => !prevState), []);

  const value = { currentUser, updateCurrentUser, logout, login }

  return (
    <CurrentUserContext.Provider value={value}>
      {isLoading && (
        <VStack justifyContent={"center"} alignItems="stretch" style={{ height: "100%" }} p={2}>
          <LoadingText />
        </VStack>
      )}
      {Boolean(error) && (
        <VStack justifyContent={"center"} alignItems="stretch" style={{ height: "100%" }} p={2}>
          <CustomError retry={toggleRetry}>{error}</CustomError>
        </VStack>
      )}
      {!isLoading && !Boolean(error) && children}
    </CurrentUserContext.Provider>
  )
}