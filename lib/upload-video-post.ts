import axios from "axios"
import { FALLBACK_ERROR_MESSAGE } from "./errors"

export async function uploadVideoPost<ReturnType> (
  url: string, body: { uri: string }
): Promise<[ReturnType | undefined, Error | undefined]> {
  const data = new FormData();
  Object.entries(body).forEach(entry => {
    const [key, value] = entry;
    data.append(key, value);
  });
  data.append('video', { name: 'video', type: 'video/mov', uri: body.uri } as any);
  try {
    const headers = { 'Content-Type': 'multipart/form-data' }
    const response = await axios.post<ReturnType>(url, data, {
      headers,
      withCredentials: true,
    });
    console.log(response.data, 'Successfully uploaded video');
    return [response.data, undefined];
  } catch (reason: any) {
    return [undefined, new Error(reason?.message || FALLBACK_ERROR_MESSAGE)]
  }
}
