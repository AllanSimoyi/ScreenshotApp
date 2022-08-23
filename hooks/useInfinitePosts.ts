import { QueryKey, useInfiniteQuery } from "react-query";
import { getRequest } from "../lib/get-request";
import { Post } from "../lib/posts";
import { URL_PREFIX } from "../lib/url-prefix";

interface PayloadType {
  posts: Post[]; 
  errorMessage: string;
}

async function fetchProjects ({ pageParam = 0 }) {
  const [result, err] = await getRequest<PayloadType>(URL_PREFIX + "/api/posts_v2?cursor" + pageParam);
    if (err) {
      throw err;
    }
    if (result?.errorMessage) {
      throw new Error(result?.errorMessage);
    }
    return result?.posts || [];
}

export function useInfinitePosts (queryKey: QueryKey) {
  return useInfiniteQuery<Post[], Error, Post[], QueryKey>(queryKey, fetchProjects, {
    getNextPageParam: (lastPage) => {
      return lastPage?.[lastPage.length - 1].id || undefined;
    },
  });
}