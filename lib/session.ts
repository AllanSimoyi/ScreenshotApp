import * as SecureStore from 'expo-secure-store';

export const CURRENT_USER_KEY = "CURRENT_USER_KEY";

export async function saveToLocalStorage (key: string, value: string) {
  try {
    await SecureStore.setItemAsync(key, value);
  } catch (error) {
    console.error("Error saving to storage >>>", (error as any).toString())
  }
  const zxc = await getFromLocalStorage(key);
}

export async function getFromLocalStorage (key: string) {
  try {
    let result = await SecureStore.getItemAsync(key);
    return result || undefined;
  } catch (error) {
    console.error("Error getting from storage >>>", (error as any).toString())
  }
}
