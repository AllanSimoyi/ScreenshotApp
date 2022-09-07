import { useMutation } from 'react-query';
import { postRequest } from '../lib/post-request';
import { Post } from "../lib/posts";
import { URL_PREFIX } from '../lib/url-prefix';
import { CreatePost } from '../lib/validations';

interface Props {
  onSuccess: (newPost: Post | undefined) => void;
  onError: (error: unknown, post: Post) => void;
}

export function usePostMutation (props: Props) {
  const { onSuccess, onError } = props;
  return useMutation(async (newPost: CreatePost) => {
    const [result, err] = await postRequest<{ post: Post; errorMessage: string; }>(URL_PREFIX + "/api/create-post_v2", newPost);
    if (err) {
      throw err;
    }
    if (result?.errorMessage) {
      throw new Error(result?.errorMessage);
    }
    return result?.post || undefined;
  }, {
    onSuccess,
    onError: (error, variables) => {
      onError(error, {
        ...variables,
        id: 1,
        userId: Number(variables.userId),
        resourceUrl: variables.resourceBase64 || "",
        description: variables.description || "",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    },
  });
}