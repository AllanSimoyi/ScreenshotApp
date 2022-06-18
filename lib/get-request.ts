import axios from "axios"
import { FALLBACK_ERROR_MESSAGE } from "./errors"

export async function getRequest<ReturnType>(
  url: string,
  dontLog?: "dontLog"
): Promise<[ReturnType | undefined, Error | undefined]> {
  try {
    const headers = { "Content-Type": "application/json" }

    const response = await axios.get<ReturnType>(url, {
      headers,
      withCredentials: true,
    })

    if (!dontLog) console.log("GET REPONSE: ", url, response.data)

    return [response.data, undefined]
  } catch (reason: any) {
    return [undefined, new Error(reason?.message || FALLBACK_ERROR_MESSAGE)]
  }
}
