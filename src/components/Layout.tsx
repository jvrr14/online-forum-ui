import { Outlet } from 'react-router';
import { Navigation } from './Navigation';
import { APP_NAME, APP_TAGLINE } from '../lib/brand';

export function Layout() {
  return (
    <div className="flex min-h-svh flex-col">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-white focus:p-4">Skip to content</a>
      <Navigation />
      <main id="main-content" className="mx-auto w-full min-w-0 max-w-6xl flex-1 px-4 py-7 sm:px-8 sm:py-14">
        <Outlet />
      </main>
      <footer className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-2 border-t border-line px-4 py-6 text-xs text-muted sm:px-8">
        <span className="font-medium text-ink">{APP_NAME}</span>
        <span>{APP_TAGLINE}</span>
      </footer>
    </div>
  );
}
