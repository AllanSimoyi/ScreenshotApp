import * as SecureStore from 'expo-secure-store';

export async function saveToLocalStorage (key: string, value: string) {
  try {
    await SecureStore.setItemAsync(key, value);
  } catch (error) {
    console.error("Error saving to storage >>>", (error as any).toString())
  }
}

export async function getFromLocalStorage (key: string) {
  try {
    return SecureStore.getItemAsync(key);
  } catch (error) {
    console.error("Error getting from storage >>>", (error as any).toString())
  }
}

export async function deleteFromLocalStorage (key: string) {
  try {
    await SecureStore.deleteItemAsync(key);
  } catch (error) {
    console.error("Error deleting from storage >>>", (error as any).toString())
  }
}
