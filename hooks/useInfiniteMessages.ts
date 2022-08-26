import { QueryKey, useInfiniteQuery } from "react-query";
import { getRequest } from "../lib/get-request";
import { Message } from "../lib/messages";
import { URL_PREFIX } from "../lib/url-prefix";

interface PayloadType {
  messages: Message[];
  errorMessage: string;
}

export function useInfiniteMessages (queryKey: QueryKey, userId: number) {
  async function fetchMessages ({ pageParam = 0 }) {
    const [result, err] = await getRequest<PayloadType>(URL_PREFIX + `/api/messages_v3?userId=${ userId }&lastMessageId=${ pageParam }`);
    if (err) {
      throw err;
    }
    if (result?.errorMessage) {
      throw new Error(result?.errorMessage);
    }
    return result?.messages || [];
  }
  return useInfiniteQuery<Message[], Error, Message[], QueryKey>(queryKey, fetchMessages, {
    getNextPageParam: (lastPage) => {
      return lastPage?.[(lastPage?.length || 1) - 1]?.id || undefined;
    },
    enabled: !!userId,
  });
}