import { useCallback } from 'react';
import { Post } from "../lib/posts";
import { CreatePost } from '../lib/validations';
import { useLocalDb } from './useLocalDb';
import { usePostMutation } from './usePostMutation';

interface Props {
  currentUploads: string[];
  addToCurrentUploads: (uuid: string) => void;
  removeFromCurrentUploads: (uuid: string) => void;
  onSuccess: (newPost: Post | undefined) => void;
  onError: (error: unknown, post: Post) => void;
}

export function useUploadImagePost (props: Props) {
  const { currentUploads, addToCurrentUploads, removeFromCurrentUploads } = props;
  const { onSuccess, onError } = props;
  const { writePostToLocalDB, removePostFromLocalDB } = useLocalDb();

  const { mutate, ...mutation } = usePostMutation({
    onSuccess: (newPost) => {
      if (newPost) {
        removeFromCurrentUploads(newPost.uuid);
        removePostFromLocalDB(newPost.uuid);
      }
      onSuccess(newPost);
    },
    onError: (error, post) => {
      removeFromCurrentUploads(post.uuid);
      onError(error, post);
    }
  });

  const handleImagePostMutation = useCallback(async (post: CreatePost, newPost: "newPost" | undefined) => {
    if (newPost) {
      const details: Post = {
        ...post,
        id: 1,
        userId: Number(post.userId),
        resourceUrl: post.resourceBase64 || "",
        description: post.description || "",
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      const err = await writePostToLocalDB(details);
      if (err) {
        return err;
      }
    }
    const alreadyUploading = currentUploads.some(upload => upload === post.uuid);
    if (alreadyUploading) {
      return;
    }
    addToCurrentUploads(post.uuid);
    mutate(post);
    return undefined;
  }, [addToCurrentUploads, currentUploads, mutate]);

  return { ...mutation, handleImagePostMutation }
}