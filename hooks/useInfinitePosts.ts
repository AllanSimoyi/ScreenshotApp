import { QueryKey, useInfiniteQuery } from "react-query";
import { getRequest } from "../lib/get-request";
import { Post } from "../lib/posts";
import { URL_PREFIX } from "../lib/url-prefix";

interface PayloadType {
  posts: Post[];
  errorMessage: string;
}

export function useInfinitePosts (queryKey: QueryKey, userId?: number, search?: string) {
  async function fetchPosts ({ pageParam = 0 }: any) {
    console.log("Running search:", search);
    const [result, err] = await getRequest<PayloadType>(URL_PREFIX + "/api/posts_v3?lastPostId=" + pageParam + "&userId=" + (userId || "0").toString() + "&search=" + (search || "") );
    if (err) {
      throw err;
    }
    if (result?.errorMessage) {
      throw new Error(result?.errorMessage);
    }
    return result?.posts || [];
  }
  return useInfiniteQuery<Post[], Error, Post[], QueryKey>([queryKey, userId, search], fetchPosts, {
    getNextPageParam: (lastPage) => {
      return lastPage?.[(lastPage?.length || 1) - 1]?.id || undefined;
    },
  });
}