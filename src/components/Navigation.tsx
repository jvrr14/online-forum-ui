import { useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logout, selectUser } from '../features/auth/authSlice';
import { Icon } from './Icon';
import { APP_NAME } from '../lib/brand';

// Reset the disclosure whenever navigation changes, including browser back/forward.
export function Navigation() {
  const location = useLocation();
  return <Header key={location.key} />;
}

function Header() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const navClass = ({ isActive }: { isActive: boolean }) =>
    `inline-flex min-h-18 items-center border-b-2 text-sm font-medium transition-colors ${isActive ? 'border-brand text-brand' : 'border-transparent text-muted hover:text-ink'}`;
  const mobileNavClass = ({ isActive }: { isActive: boolean }) =>
    `flex min-h-11 items-center rounded-md px-3 text-sm font-medium ${isActive ? 'bg-brand-soft text-brand' : 'text-muted hover:bg-paper hover:text-ink'}`;

  function closeMenu() {
    setMenuOpen(false);
    menuButton.current?.focus();
  }

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/90 backdrop-blur" onKeyDown={(event) => {
      if (event.key === 'Escape' && menuOpen) {
        event.preventDefault();
        closeMenu();
      }
    }}>
      <nav aria-label="Main navigation" className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 sm:px-8 md:h-18 md:gap-8">
        <Link to="/" aria-label={`${APP_NAME} home`} className="flex shrink-0 items-center gap-2 py-2 text-lg font-bold tracking-tight md:gap-2.5 md:text-xl">
          <span className="flex size-8 items-center justify-center rounded-lg bg-brand text-white"><Icon name="message" width="20" height="20" /></span>
          <span>{APP_NAME}<span className="text-brand">.</span></span>
        </Link>
        {user && <div className="hidden gap-6 md:flex">
          <NavLink to="/" end className={navClass}>Discussions</NavLink>
          {user.role === 'ADMIN' && <NavLink to="/admin" className={navClass}>Admin</NavLink>}
        </div>}
        <div className="ml-auto flex shrink-0 items-center gap-2 md:gap-5">
          {user ? <>
            <span className="hidden max-w-36 truncate text-sm text-muted lg:block">{user.username}</span>
            <button type="button" className="hidden min-h-11 text-sm text-muted hover:text-ink md:block" onClick={() => dispatch(logout())}>Log out</button>
            <Link to="/posts/new" className="button button-primary px-3 md:px-4">
              <Icon name="plus" />
              <span>New post</span>
            </Link>
            <button ref={menuButton} type="button" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} aria-controls="mobile-navigation" className="flex size-11 items-center justify-center rounded-md text-ink hover:bg-brand-soft md:hidden" onClick={() => setMenuOpen((open) => !open)}>
              <Icon name={menuOpen ? 'close' : 'menu'} width="22" height="22" />
            </button>
          </> : <>
            <Link to="/login" className="inline-flex min-h-11 items-center px-2 text-sm font-medium text-muted hover:text-ink">Log in</Link>
            <Link to="/register" className="button button-primary px-3 sm:px-4"><span className="sm:hidden">Join</span><span className="hidden sm:inline">Join {APP_NAME}</span></Link>
          </>}
        </div>
      </nav>
      {user && <nav id="mobile-navigation" aria-label="Mobile navigation" hidden={!menuOpen} className="border-t border-line px-4 py-3 sm:px-8 md:hidden">
        <div className="mx-auto max-w-6xl space-y-1">
          <NavLink to="/" end className={mobileNavClass}>Discussions</NavLink>
          {user.role === 'ADMIN' && <NavLink to="/admin" className={mobileNavClass}>Admin</NavLink>}
          <div className="mt-3 flex min-w-0 items-center gap-3 border-t border-line pt-3">
            <span className="min-w-0 flex-1 truncate px-3 text-sm text-muted">{user.username}</span>
            <button type="button" className="min-h-11 shrink-0 rounded-md px-3 text-sm font-medium text-ink hover:bg-brand-soft" onClick={() => { setMenuOpen(false); dispatch(logout()); }}>Log out</button>
          </div>
        </div>
      </nav>}
    </header>
  );
}
