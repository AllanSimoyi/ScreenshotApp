import { useEffect, useState } from "react";
import { CURRENT_USER_KEY, getFromLocalStorage } from "../lib/session";
import { createEmptyUser, fetchCurrentUser, User } from "../lib/users";

export function useProfileDetails () {
  const [details, setDetails] = useState({
    userId: 0,
    username: "",
    phoneNumber: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isRetryToggle, setIsRetryToggle] = useState(false);
  useEffect(() => {
    init();
    async function init () {
      try {
        setIsLoading(true);
        let currentUser: User | undefined = createEmptyUser();
        const currentUserId = await getFromLocalStorage(CURRENT_USER_KEY);
        if (currentUserId) {
          currentUser = await fetchCurrentUser({ userId: Number(currentUserId) });
        }
        setDetails({
          userId: currentUser?.id || 0,
          username: currentUser?.username || "",
          phoneNumber: currentUser?.phoneNumber || "",
        });
      } catch ({ message }) {
        setError((message as string || "Something went wrong, please try again"));
      } finally {
        setIsLoading(false);
      }
    }
  }, [isRetryToggle, setIsLoading, setDetails, setError]);
  return {
    isLoading, setIsLoading,
    details, setDetails,
    error, setError,
    setIsRetryToggle,
  }
}