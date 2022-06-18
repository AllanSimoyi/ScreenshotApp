import * as SecureStore from 'expo-secure-store';

export const CURRENT_USER_KEY = "CURRENT_USER_KEY";

export async function saveToLocalStorage (key: string, value: string) {
  try {
    const a = await SecureStore.setItemAsync(key, value);
  } catch (error) {
    console.log("Error saving to storage >>>", (error as any).toString())
  }
  const zxc = await getFromLocalStorage(key);
  console.log("++++" + zxc);
}

export async function getFromLocalStorage (key: string) {
  try {
    let result = await SecureStore.getItemAsync(key);
  if (result) {
    return result;
  }
  return undefined;
  } catch (error) {
    console.log("Error getting from storage >>>", (error as any).toString())
  }
}
