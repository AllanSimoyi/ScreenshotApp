import { QueryKey, useInfiniteQuery } from "react-query";
import { getRequest } from "../lib/get-request";
import { Post } from "../lib/posts";
import { URL_PREFIX } from "../lib/url-prefix";

interface PayloadType {
  posts: Post[];
  errorMessage: string;
}

export function useInfinitePosts (queryKey: QueryKey, userId?: number, search?: string, category?: string) {
  async function fetchPosts ({ pageParam = 0 }: any) {
    const baseUrl = URL_PREFIX + "/api/posts_v3";
    const queryParams: [string, string][] = [
      ["lastPostId", pageParam.toString()],
      ["userId", userId?.toString() || ""],
      ["search", search || ""],
      ["category", category || ""],
    ];
    const finalUrl = baseUrl + "?" + queryParams
      .filter(el => el[1] !== "")
      .map(([key, value]) => `${ key }=${ value }`).join("&");
    const [result, err] = await getRequest<PayloadType>(finalUrl);
    if (err) {
      throw err;
    }
    if (result?.errorMessage) {
      throw new Error(result?.errorMessage);
    }
    return result?.posts || [];
  }
  return useInfiniteQuery<Post[], Error, Post[], QueryKey>([queryKey, userId, search, category], fetchPosts, {
    getNextPageParam: (lastPage) => {
      return lastPage?.[(lastPage?.length || 1) - 1]?.id || undefined;
    },
  });
}