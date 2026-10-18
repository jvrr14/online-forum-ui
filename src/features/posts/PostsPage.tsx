import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { postsApi } from "../../api/posts";
import { useAppSelector } from "../../store/hooks";
import { selectIsAuthenticated } from "../auth/authSlice";
import { Icon } from "../../components/Icon";
import { APP_NAME } from "../../lib/brand";
import type { PostsFetchState } from "./types";

const PAGE_SIZE = 10;
const EXCERPT_LENGTH = 180;

function excerpt(content: string): string {
  const text = content.trim();
  return text.length > EXCERPT_LENGTH
    ? `${text.slice(0, EXCERPT_LENGTH).trimEnd()}…`
    : text;
}

function parsePage(value: string | null): number {
  const page = Number(value);
  return Number.isInteger(page) && page >= 1 ? page : 1;
}

const dateFormat = new Intl.DateTimeFormat(undefined, { dateStyle: "medium" });

export function PostsPage() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parsePage(searchParams.get("page"));
  const search = searchParams.get("q")?.trim() ?? "";
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<PostsFetchState | null>(null);
  const key = JSON.stringify([page, search, attempt]);

  useEffect(() => {
    const controller = new AbortController();
    postsApi
      .getAll({ page, limit: PAGE_SIZE, search: search || undefined }, { signal: controller.signal })
      .then((data) => setState({ key, status: "success", data }))
      .catch((err) => {
        if (controller.signal.aborted) return;
        setState({ key, status: "error", error: err instanceof Error ? err.message : "Something went wrong" });
      });
    return () => controller.abort();
  }, [page, search, key]);

  const current = state?.key === key ? state : null;
  const totalPages = current?.status === "success" ? current.data.meta.totalPages : 1;

  function goToPage(next: number) {
    const params = new URLSearchParams(searchParams);
    if (next > 1) params.set("page", String(next));
    else params.delete("page");
    setSearchParams(params);
  }

  return (
    <div>
      <title>{search ? `“${search}” · ${APP_NAME}` : `Discussions · ${APP_NAME}`}</title>
      <div className="mb-6 border-b border-line pb-6 sm:mb-10 sm:pb-10">
        <p className="eyebrow mb-3 sm:mb-4">{APP_NAME} community</p>
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <h1 className="page-title">Discussions</h1>
            <p className="mt-3 text-[15px] leading-relaxed text-muted">Questions, ideas, and things worth sharing.</p>
          </div>
          {isAuthenticated && <Link to="/posts/new" className="text-link hidden items-center gap-2 text-sm sm:inline-flex">Start a discussion <Icon name="arrow" /></Link>}
        </div>
      </div>

      <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_248px] lg:gap-12">
        <section aria-label="Discussion feed" className="min-w-0">
          <form role="search" className="relative mb-5 sm:mb-7" onSubmit={(event) => {
            event.preventDefault();
            const query = String(new FormData(event.currentTarget).get("q") ?? "").trim();
            setSearchParams(query ? { q: query } : {});
          }}>
            <label htmlFor="post-search" className="sr-only">Search discussions</label>
            <Icon name="search" className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted sm:left-4" />
            <input key={search} id="post-search" type="search" name="q" defaultValue={search} placeholder="Search discussions…" className="field min-h-12 py-3 pr-19 pl-9 sm:pl-11" />
            <button type="submit" className="absolute inset-y-0.5 right-0.5 min-h-11 rounded px-3 text-xs font-semibold text-brand hover:bg-brand-soft">Search</button>
          </form>

          <div className="mb-1 flex min-h-11 items-start justify-between gap-4 border-b border-line">
            <h2 className="flex min-w-0 items-center gap-2 text-sm font-semibold">
              {search ? "Search results" : "All discussions"}
              {current?.status === "success" && <span className="rounded bg-brand-soft px-2 py-0.5 text-xs font-medium text-brand">{current.data.meta.total}</span>}
            </h2>
            {search && <Link to="/" className="-mt-3 inline-flex min-h-11 shrink-0 items-center text-sm text-muted hover:text-brand">Clear search</Link>}
          </div>
          {search && <p className="mt-4 wrap-anywhere text-sm text-muted">Results for “{search}”</p>}

          {!current && <div role="status" className="py-12 text-sm text-muted">Loading discussions…</div>}
          {current?.status === "error" && <div role="alert" className="my-6 rounded-md border border-line bg-white p-6">
            <h3 className="font-semibold">We couldn't load discussions</h3>
            <p className="mt-2 text-sm text-muted">{current.error}</p>
            <button type="button" className="button button-secondary mt-5" onClick={() => setAttempt((n) => n + 1)}>Try again</button>
          </div>}

          {current?.status === "success" && <>
            {current.data.data.length === 0 ? <div className="py-14 text-center">
              <Icon name="message" width="28" height="28" className="mx-auto mb-4 text-muted" />
              <h3 className="font-semibold">{search ? "No matching discussions" : page > 1 ? "No posts on this page" : "Be the first to start a conversation"}</h3>
              <p className="mt-2 text-sm text-muted">{search ? "Try a different keyword, or clear your search." : "Ask a question or share an idea to get things going."}</p>
              {!search && isAuthenticated && <Link to="/posts/new" className="button button-primary mt-5"><Icon name="plus" />Create a post</Link>}
            </div> : <ul className="divide-y divide-line">
              {current.data.data.map((post) => <li key={post.id}>
                <article className="group -mx-3 flex gap-3 rounded-lg px-3 py-5 transition-colors hover:bg-white sm:-mx-4 sm:gap-4 sm:px-4 sm:py-6">
                  <div aria-hidden="true" className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full border border-brand/10 bg-brand-soft text-xs font-semibold text-brand sm:size-10 sm:text-sm">{post.author.username.slice(0, 2).toUpperCase()}</div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted">
                      <span className="max-w-full wrap-anywhere font-medium text-ink">{post.author.username}</span>
                      <span aria-hidden="true">·</span>
                      <time dateTime={post.createdAt}>{dateFormat.format(new Date(post.createdAt))}</time>
                    </div>
                    <h3 className="text-lg leading-snug font-semibold tracking-[-0.02em] sm:text-xl">
                      <Link to={`/posts/${post.id}`} className="wrap-anywhere transition-colors hover:text-brand">{post.title}</Link>
                    </h3>
                    {post.content && <p className="mt-2 wrap-anywhere text-sm leading-6 text-muted">{excerpt(post.content)}</p>}
                    <div className="mt-3 flex items-center gap-1.5 text-xs text-muted sm:mt-4"><Icon name="eye" width="15" height="15" />{post.views.toLocaleString()} {post.views === 1 ? "view" : "views"}</div>
                  </div>
                </article>
              </li>)}
            </ul>}
            {totalPages > 1 && <nav aria-label="Pagination" className="mt-6 flex items-center justify-between gap-2 border-t border-line pt-5">
              <button type="button" className="button button-secondary px-3" onClick={() => goToPage(page - 1)} disabled={page <= 1}><Icon name="chevron-left" />Previous</button>
              <span className="text-center text-xs text-muted" aria-live="polite">Page {page} of {totalPages}</span>
              <button type="button" className="button button-secondary px-3" onClick={() => goToPage(page + 1)} disabled={page >= totalPages}>Next<Icon name="chevron-right" /></button>
            </nav>}
          </>}
        </section>

        <aside aria-label="About the community" className="space-y-7 border-t border-line pt-7 lg:border-0 lg:pt-0">
          <section className="rounded-lg border border-line bg-[#f1f3ed] p-6">
            <span className="mb-5 flex size-9 items-center justify-center rounded-full border border-brand/15 text-brand"><Icon name="message" /></span>
            <h2 className="text-base font-semibold tracking-tight">About {APP_NAME}</h2>
            <p className="mt-3 text-sm leading-6 text-muted">A friendly space to share what you’re working on, ask questions, and pass on what you’ve learned.</p>
            {isAuthenticated && <Link to="/posts/new" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand hover:underline">Write a post<Icon name="arrow" width="16" height="16" /></Link>}
          </section>
          <section className="px-1">
            <h2 className="eyebrow mb-5">Before you post</h2>
            <ol className="space-y-5 text-sm leading-5 text-muted">
              {[
                ["Give it a clear title", "Help others find your discussion."],
                ["Add a little context", "Details make it easier to help."],
                ["Keep it considerate", "Different perspectives are welcome."],
              ].map(([title, description], index) => <li key={title} className="flex gap-3"><span className="pt-0.5 font-mono text-xs text-muted/70">0{index + 1}</span><div><p className="font-medium text-ink">{title}</p><p className="mt-1 text-xs leading-5">{description}</p></div></li>)}
            </ol>
          </section>
        </aside>
      </div>
    </div>
  );
}
