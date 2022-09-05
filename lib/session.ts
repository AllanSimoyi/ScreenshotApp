import { CurrentUser } from "../components/CurrentUserProvider";
import { getFromLocalStorage, saveToLocalStorage } from "./local-storage";

const CURRENT_USER_ID = "CURRENT_USER_ID";
const CURRENT_USERNAME = "CURRENT_USERNAME";
const CURRENT_PHONENUMBER = "CURRENT_PHONENUMBER";

const LAST_LOGOUT = "LAST_LOGOUT";

export async function saveLastLogIn (dateTime: number) {
  await saveToLocalStorage(LAST_LOGOUT, dateTime.toString());
  const lastLogIn = await getFromLocalStorage(LAST_LOGOUT);
  if (!lastLogIn) {
    console.log("Didn't save shit");
  }
}

export async function getLastLogIn () {
  const lastLogIn = await getFromLocalStorage(LAST_LOGOUT);
  return lastLogIn ? Number(lastLogIn) : undefined;
}

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