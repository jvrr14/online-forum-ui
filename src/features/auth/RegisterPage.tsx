import { useActionState, useEffect } from "react";
import { AuthForm } from "../../components/AuthForm";
import { FieldError } from "../../components/FieldError";
import { Link, Navigate } from "react-router";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  clearError,
  register,
  selectAuthError,
  selectAuthFieldErrors,
  selectAuthStatus,
  selectIsAuthenticated,
} from "./authSlice";

type FormState = {
  email: string;
  username: string;
};

export function RegisterPage() {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const status = useAppSelector(selectAuthStatus);
  const error = useAppSelector(selectAuthError);
  const fieldErrors = useAppSelector(selectAuthFieldErrors);

  // Don't show a stale error from the login page (or a previous visit).
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const [state, formAction, isPending] = useActionState(
    async (_prev: FormState, formData: FormData): Promise<FormState> => {
      const email = String(formData.get("email") ?? "").trim();
      const password = String(formData.get("password") ?? "");
      const username = String(formData.get("username") ?? "").trim();
      await dispatch(register({ email, password, username }));

      return { email, username };
    },
    { email: "", username: "" },
  );

  if (status === "loading") return <p role="status" className="py-12 text-sm text-muted">Loading your session…</p>;

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Field-level messages replace the generic one; fall back to it otherwise
  // (e.g. email already registered, network failure).
  const formError = fieldErrors ? null : error;

  return (
    <AuthForm title="Create your account" description="Ask questions, share ideas, and learn alongside the community.">
      <form action={formAction} aria-busy={isPending} className="space-y-5">
        {formError && <p role="alert" className="form-error">{formError}</p>}

        <div>
          <label htmlFor="register-username" className="field-label">Username</label>
          <input
            id="register-username"
            className="field"
            defaultValue={state.username}
            type="text"
            name="username"
            placeholder="How should we call you?"
            autoComplete="username"
            maxLength={100}
            required
            aria-invalid={!!fieldErrors?.username}
            aria-describedby={fieldErrors?.username ? "username-error" : undefined}
          />
          <FieldError id="username-error" errors={fieldErrors?.username} />
        </div>

        <div>
          <label htmlFor="register-email" className="field-label">Email address</label>
          <input
            id="register-email"
            className="field"
            defaultValue={state.email}
            type="email"
            name="email"
            placeholder="you@example.com"
            autoComplete="email"
            required
            aria-invalid={!!fieldErrors?.email}
            aria-describedby={fieldErrors?.email ? "email-error" : undefined}
          />
          <FieldError id="email-error" errors={fieldErrors?.email} />
        </div>

        <div>
          <label htmlFor="register-password" className="field-label">Password</label>
          <input
            id="register-password"
            className="field"
            type="password"
            name="password"
            placeholder="At least 8 characters"
            autoComplete="new-password"
            minLength={8}
            maxLength={128}
            required
            aria-invalid={!!fieldErrors?.password}
            aria-describedby={fieldErrors?.password ? "password-error" : undefined}
          />
          <FieldError id="password-error" errors={fieldErrors?.password} />
          <p className="mt-2 text-xs text-muted">Use at least 8 characters.</p>
        </div>

        <button type="submit" disabled={isPending} className="button button-primary w-full">
          {isPending ? "Creating account…" : "Create account"}
        </button>
        <p className="border-t border-line pt-5 text-center text-sm text-muted">
          Already have an account? <Link to="/login" className="text-link">Log in</Link>
        </p>
      </form>
    </AuthForm>
  );
}
