import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/store/auth';

export default function PrivateRoute() {
  const { token } = useAuth();
  if (!token) return <Navigate to="/signin" replace />;
  return <Outlet />;
}
