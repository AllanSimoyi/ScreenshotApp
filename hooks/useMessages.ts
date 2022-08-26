import { QueryKey, useMutation, useQuery } from 'react-query';
import { getRequest } from "../lib/get-request";
import { Message } from '../lib/messages';
import { postRequest } from '../lib/post-request';
import { URL_PREFIX } from '../lib/url-prefix';
import { CreateMessage } from '../lib/validations';

export function useMessages (queryKey: QueryKey, enabled: boolean) {
  return useQuery<Message[], Error>(queryKey, async () => {
    const [result, err] = await getRequest<{ messages: Message[]; errorMessage: string }>(URL_PREFIX + "/api/messages");
    if (err) {
      throw err;
    }
    if (result?.errorMessage) {
      throw new Error(result?.errorMessage);
    }
    return result?.messages || [];
  }, { enabled });
}

interface useRecordMessageProps {
  onMutate: (newMessage: CreateMessage) => Promise<any>;
  onError: (error: unknown, newMessage: CreateMessage, context: any) => void;
  onSettled: () => void;
}

export function useRecordMessage (props: useRecordMessageProps) {
  const { onMutate, onError, onSettled } = props;
  return useMutation(async (newMessage: CreateMessage) => {
    const [result, err] = await postRequest<{ message: Message; errorMessage: string; }>(URL_PREFIX + "/api/messages", newMessage);
    if (err) {
      throw err;
    }
    if (result?.errorMessage) {
      throw new Error(result?.errorMessage);
    }
    return result?.message || undefined;
  }, { onMutate, onError, onSettled });
}