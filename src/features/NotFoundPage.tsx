import { Link } from "react-router";
import { APP_NAME } from "../lib/brand";

export function NotFoundPage() {
  return (
    <section className="mx-auto max-w-md py-16 text-center">
      <title>{`Page not found · ${APP_NAME}`}</title>
      <p className="eyebrow mb-4">Error 404</p>
      <h1 className="page-title">We couldn't find that page.</h1>
      <p className="mt-3 text-sm leading-6 text-muted">
        The link may be broken, or the page may have moved.
      </p>
      <Link to="/" className="button button-primary mt-8">Back to discussions</Link>
    </section>
  );
}
