import { QueryKey, useQuery } from "react-query";
import { getRequest } from "../lib/get-request";
import { Post } from "../lib/posts";
import { URL_PREFIX } from "../lib/url-prefix";

export function usePosts (queryKey: QueryKey) {
  const query = useQuery<Post[], Error>(queryKey, async () => {
    const [result, err] = await getRequest<{ posts: Post[]; errorMessage: string }>(URL_PREFIX + "/api/feed");
    if (err) {
      throw err;
    }
    if (result?.errorMessage) {
      throw new Error(result?.errorMessage);
    }
    return result?.posts || [];
  });
  return query;
}