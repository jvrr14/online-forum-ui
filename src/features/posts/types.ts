import type { PostList } from "../../types";

// `key` identifies the request (page + retry attempt) the result belongs to,
// so a stale result is never shown for a different page.
export type PostsFetchState =
  | { key: string; status: "success"; data: PostList }
  | { key: string; status: "error"; error: string };
