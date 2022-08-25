import { CurrentUser } from "../components/CurrentUserProvider";
import { getFromLocalStorage, saveToLocalStorage } from "./local-storage";

const CURRENT_USER_ID = "CURRENT_USER_ID";
const CURRENT_USERNAME = "CURRENT_USERNAME";
const CURRENT_PHONENUMBER = "CURRENT_PHONENUMBER";

export async function saveUserToLocalStorage (user: CurrentUser) {
  await Promise.all([
    saveToLocalStorage(CURRENT_USER_ID, user.userId.toString()),
    saveToLocalStorage(CURRENT_USERNAME, user.username),
    saveToLocalStorage(CURRENT_PHONENUMBER, user.phoneNumber)
  ]);
}

export async function getUserFromLocalStorage () {
  const [userId, username, phoneNumber] = await Promise.all([
    getFromLocalStorage(CURRENT_USER_ID),
    getFromLocalStorage(CURRENT_USERNAME),
    getFromLocalStorage(CURRENT_PHONENUMBER),
  ]);
  return {
    userId: Number(userId || "0"),
    username: username || "",
    phoneNumber: phoneNumber || "",
  }
}