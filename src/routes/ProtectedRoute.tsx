import { Navigate, Outlet, useLocation } from 'react-router';
import { useAppSelector } from '../store/hooks';
import { selectAuthStatus } from '../features/auth/authSlice';

export function ProtectedRoute() {
  const status = useAppSelector(selectAuthStatus);
  const location = useLocation();

  if (status === 'loading') return <p role="status" className="py-12 text-sm text-muted">Loading your session…</p>;
  if (status === 'unauthenticated') {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return <Outlet />;
}
