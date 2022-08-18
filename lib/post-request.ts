import axios from "axios"
import { FALLBACK_ERROR_MESSAGE } from "./errors"

export async function postRequest<ReturnType>(
  url: string,
  body: Object
): Promise<[ReturnType | undefined, Error | undefined]> {
  try {
    const headers = { "Content-Type": "application/json" }
    const response = await axios.post<ReturnType>(url, body, {
      headers,
      withCredentials: true,
    });
    // console.log("POST REPONSE: ", url, response.data);
    return [response.data, undefined]
  } catch (reason: any) {
    return [undefined, new Error(reason?.message || FALLBACK_ERROR_MESSAGE)]
  }
}
