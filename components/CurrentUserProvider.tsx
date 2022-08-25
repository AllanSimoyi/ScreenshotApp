import { VStack } from "native-base";
import { createContext, useCallback, useEffect, useState } from "react";
import { getUserFromLocalStorage, saveUserToLocalStorage } from "../lib/session";
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
}

export const CurrentUserContext = createContext<CustomContext>({
  currentUser: { userId: 0, username: "", phoneNumber: "" },
  updateCurrentUser: (_) => { }
});

interface Props {
  children: React.ReactNode;
}

export function CurrentUserProvider (props: Props) {
  const { children } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [retryToggle, setRetryToggle] = useState(false);
  const [currentUser, setCurrentUser] = useState<CurrentUser>({
    userId: 0, username: "", phoneNumber: "",
  });
  const value = {
    currentUser,
    updateCurrentUser: async (newCurrentUser: CurrentUser | undefined) => {
      const details: CurrentUser = {
        userId: newCurrentUser?.userId || 0,
        username: newCurrentUser?.username || "",
        phoneNumber: newCurrentUser?.phoneNumber || ""
      }
      setCurrentUser(details);
      await saveUserToLocalStorage(details);
    }
  }
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
  const toggleRetry = useCallback(() => setRetryToggle(prevState => !prevState), []);
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