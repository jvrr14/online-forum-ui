import type { ReactNode } from 'react';
import { APP_NAME } from '../lib/brand';

export function AuthForm({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return <section className="mx-auto max-w-md py-1 sm:py-8">
    <title>{`${title} · ${APP_NAME}`}</title>
    <p className="eyebrow mb-4">{APP_NAME}</p>
    <h1 className="page-title">{title}</h1>
    <p className="mt-3 text-sm leading-6 text-muted">{description}</p>
    <div className="mt-6 rounded-lg border border-line bg-white p-5 sm:mt-8 sm:p-8">{children}</div>
  </section>;
}
