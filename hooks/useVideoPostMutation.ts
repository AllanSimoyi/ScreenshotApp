import { useMutation } from 'react-query';
import { postRequest } from '../lib/post-request';
import { Post } from "../lib/posts";
import { uploadVideoPost } from '../lib/upload-video-post';
import { URL_PREFIX } from '../lib/url-prefix';
import { CreatePost, CreateVideoPost } from '../lib/validations';

interface Props {
  onSuccess: (newPost: Post | undefined) => void;
  onError: (error: unknown, post: Post) => void;
}

export function useVideoPostMutation (props: Props) {
  const { onSuccess, onError } = props;
  return useMutation(async (newPost: CreateVideoPost) => {
    const [result, err] = await uploadVideoPost<{ newPost?: Post, errorMessage?: string }>(URL_PREFIX + "/api/create-video-post", newPost);
    if (err) {
      console.log("Use Video Post Mutation", err.message);
      throw err;
    }
    console.log("Upload Video Mutation Result", result);
    if (result?.errorMessage) {
      throw new Error(result?.errorMessage);
    }
    return result?.newPost || undefined;
  }, {
    onSuccess,
    onError: (error, variables) => {
      onError(error, {
        ...variables,
        id: 1,
        userId: Number(variables.userId),
        resourceUrl: variables.uri || "",
        description: variables.description || "",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    },
  });
}