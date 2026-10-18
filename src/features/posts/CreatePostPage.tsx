import { useActionState } from "react";
import { postsApi } from "../../api/posts";
import { Link, useNavigate } from "react-router";
import { Icon } from "../../components/Icon";
import { FieldError } from "../../components/FieldError";
import { APP_NAME } from "../../lib/brand";
import { toFieldErrors, type FieldErrors } from "../../api/errors";

// Values are kept in state because React resets the form after every action,
// which would otherwise wipe the user's draft when the request fails.
type FormState = {
  title: string;
  content: string;
  error: string | null;
  fieldErrors: FieldErrors | null;
};

const initialState: FormState = { title: "", content: "", error: null, fieldErrors: null };


export function CreatePostPage() {
  const navigate = useNavigate();

  const [state, formAction, isPending] = useActionState(
    async (_prev: FormState, formData: FormData): Promise<FormState> => {
      const title = String(formData.get("title") ?? "").trim();
      const content = String(formData.get("content") ?? "").trim();

      try {
        await postsApi.create({ title, content });
        navigate("/");
        return { ...initialState };
      } catch (error: unknown) {
        const fieldErrors = toFieldErrors(error);
        return {
          title,
          content,
          fieldErrors,
          error: fieldErrors
            ? null
            : error instanceof Error
              ? error.message
              : "Error while creating post",
        };
      }
    },
    initialState,
  );

  return (
    <section className="mx-auto max-w-3xl">
      <title>{`Start a discussion · ${APP_NAME}`}</title>
      <Link to="/" className="-mt-2 mb-4 inline-flex min-h-11 items-center gap-1 text-sm text-muted hover:text-brand sm:mt-0 sm:mb-8"><Icon name="chevron-left" />Back to discussions</Link>
      <h1 className="page-title">Start a discussion</h1>
      <p className="mt-3 text-sm leading-6 text-muted">A question, an idea, a useful discovery. Give it a place to grow.</p>
      <form action={formAction} aria-busy={isPending} className="mt-6 space-y-6 rounded-lg border border-line bg-white p-4 sm:mt-8 sm:space-y-7 sm:p-8">
        {state.error && <p role="alert" className="form-error">{state.error}</p>}
        <div>
          <label htmlFor="post-title" className="field-label">Title</label>
          <input id="post-title" className="field" name="title" defaultValue={state.title} placeholder="What would you like to talk about?" maxLength={255} required aria-invalid={!!state.fieldErrors?.title} aria-describedby={state.fieldErrors?.title ? "title-error" : undefined} />
          <FieldError id="title-error" errors={state.fieldErrors?.title} />
        </div>
        <div>
          <label htmlFor="post-content" className="field-label">Your post</label>
          <textarea id="post-content" className="field min-h-64 resize-y leading-7" name="content" defaultValue={state.content} placeholder="Share the details. A little context goes a long way…" rows={10} required aria-invalid={!!state.fieldErrors?.content} aria-describedby={state.fieldErrors?.content ? "content-error content-hint" : "content-hint"} />
          <FieldError id="content-error" errors={state.fieldErrors?.content} />
          <p id="content-hint" className="mt-2 text-xs leading-5 text-muted">Be specific, be considerate, and make it your own.</p>
        </div>
        <div className="flex items-center justify-between gap-4 border-t border-line pt-6">
          <Link to="/" className="button button-secondary">Cancel</Link>
          <button type="submit" disabled={isPending} className="button button-primary">{isPending ? "Creating…" : "Create post"}<Icon name="arrow" /></button>
        </div>
      </form>
    </section>
  );
}
