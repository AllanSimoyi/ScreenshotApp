import { QueryKey, useQuery } from "react-query";
import { getRequest } from "./get-request";
import { URL_PREFIX } from "./url-prefix";
import { User } from "./users";

export interface Message {
  id: number;

  senderId: number;
  sender: User;

  receiverId: number;
  receiver: User;

  content: string;

  createdAt: Date;
  updatedAt: Date;
}

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