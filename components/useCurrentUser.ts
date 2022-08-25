import { useContext } from "react";
import { CurrentUserContext } from "./CurrentUserProvider";

export function useCurrentUser () {
  return useContext(CurrentUserContext);
}