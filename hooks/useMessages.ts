import { QueryKey, useQuery } from "react-query";
import { getRequest } from "../lib/get-request";
import { Message } from "../lib/messages";
import { URL_PREFIX } from "../lib/url-prefix";

export function useMessages (queryKey: QueryKey) {
  return useQuery<Message[], Error>(queryKey, async () => {
    const [result, err] = await getRequest<{ messages: Message[]; errorMessage: string }>(URL_PREFIX + "/api/messages");
    if (err) {
      throw err;
    }
    if (result?.errorMessage) {
      throw new Error(result?.errorMessage);
    }
    return result?.messages || [];
  });
}