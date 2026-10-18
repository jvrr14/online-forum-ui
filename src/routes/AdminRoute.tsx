import { Navigate, Outlet, useLocation } from 'react-router';
import { useAppSelector } from '../store/hooks';
import { selectAuthStatus, selectUser } from '../features/auth/authSlice';

export function AdminRoute() {
  const status = useAppSelector(selectAuthStatus);
  const user = useAppSelector(selectUser);
  const location = useLocation();

  if (status === 'loading') return <p role="status" className="py-12 text-sm text-muted">Loading your session…</p>;
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  if (user.role !== 'ADMIN') return <Navigate to="/" replace />;
  return <Outlet />;
}
