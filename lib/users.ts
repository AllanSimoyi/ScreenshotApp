import { postRequest } from "../lib/post-request";
import { URL_PREFIX } from "../lib/url-prefix";
import { GetCurrentUser } from "../lib/validations";

export interface User {
  id: number;
  username: string;
  role: string;
  phoneNumber: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProfileDetails {
  userId: number;
  username: string;
  phoneNumber: string;
}

export function createEmptyUser () {
  const currentUser: User = {
    id: 0,
    username: "",
    phoneNumber: "",
    role: "",
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  return currentUser;
}

export async function fetchCurrentUser (input: GetCurrentUser) {
  const [result, err] = await postRequest<{ currentUser: User; errorMessage: string; }>(URL_PREFIX + "/api/custom-current-user", input);
  if (err) {
    throw err;
  }
  if (result?.errorMessage) {
    throw new Error(result?.errorMessage);
  }
  return result?.currentUser || undefined;
}