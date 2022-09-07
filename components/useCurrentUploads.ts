import { useContext } from "react";
import { CurrentUploadsContext } from "./CurrentUploadsProvider";

export function useCurrentUploads () {
  return useContext(CurrentUploadsContext);
}