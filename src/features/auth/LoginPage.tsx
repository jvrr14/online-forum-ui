import { useActionState } from "react";
import { AuthForm } from "../../components/AuthForm";
import { Link, Navigate, useLocation } from "react-router";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  login,
  selectAuthError,
  selectAuthStatus,
  selectIsAuthenticated,
} from "./authSlice";

type FormState = {
  email: string;
};

export function LoginPage() {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const status = useAppSelector(selectAuthStatus);
  const error = useAppSelector(selectAuthError);

  const [state, formAction, isPending] = useActionState(
    async (_prev: FormState, formData: FormData): Promise<FormState> => {
      const email = String(formData.get("email") ?? "");
      const password = String(formData.get("password") ?? "");
      await dispatch(login({ email, password }));

      return { email };
    },
    { email: "" },
  );

  if (status === "loading") return <p role="status" className="py-12 text-sm text-muted">Loading your session…</p>;

  if (isAuthenticated) {
    return <Navigate to={location.state?.from?.pathname ?? "/"} replace />;
  }

  return (
    <AuthForm title="Welcome back" description="Log in to pick up the conversation where you left it.">
      <form action={formAction} aria-busy={isPending} className="space-y-5">
        {error && <p role="alert" className="form-error">{error}</p>}
        <div>
          <label htmlFor="login-email" className="field-label">Email address</label>
          <input
            id="login-email"
            className="field"
            defaultValue={state.email}
            type="email"
            name="email"
            placeholder="you@example.com"
            autoComplete="email"
            required
          />
        </div>
        <div>
          <label htmlFor="login-password" className="field-label">Password</label>
          <input
            id="login-password"
            className="field"
            type="password"
            name="password"
            placeholder="Your password"
            autoComplete="current-password"
            required
          />
        </div>
        <button type="submit" disabled={isPending} className="button button-primary w-full">
          {isPending ? "Logging in…" : "Log in"}
        </button>
        <p className="border-t border-line pt-5 text-center text-sm text-muted">
          New to Commons? <Link to="/register" className="text-link">Create an account</Link>
        </p>
      </form>
    </AuthForm>
  );
}
