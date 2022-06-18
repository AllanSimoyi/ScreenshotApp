import { useEffect, useState } from "react";
import { postRequest } from "../lib/post-request";
import { CURRENT_USER_KEY, getFromLocalStorage } from "../lib/session";
import { URL_PREFIX } from "../lib/url-prefix";
import { User } from "../lib/users";
import { GetCurrentUser } from "../lib/validations";

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

    async function fetchCurrentUser (input: GetCurrentUser) {
      const [result, err] = await postRequest<{ currentUser: User; errorMessage: string; }>(URL_PREFIX + "/api/custom-current-user", input);
      if (err) {
        throw err;
      }
      if (result?.errorMessage) {
        throw new Error(result?.errorMessage);
      }
      return result?.currentUser || undefined;
    }

    async function init () {
      try {
        setIsLoading(true);
        const currentUserId = await getFromLocalStorage(CURRENT_USER_KEY);
        console.log("currentUserId >>>", currentUserId);
        if (currentUserId) {
          const currentUser = await fetchCurrentUser({ userId: Number(currentUserId) });
          console.log("currentUser >>>", currentUser);
          setDetails({
            userId: currentUser?.id || 0,
            username: currentUser?.username || "",
            phoneNumber: currentUser?.phoneNumber || "",
          });
        } else {
          setDetails({
            userId: 0,
            username: "",
            phoneNumber: "",
          });
        }
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