import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { CenteredSpinner } from '../components/ui/Spinner.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { PATHS } from './paths.js';

export const ProtectedRoute = ({ allowedRoles = null }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <CenteredSpinner label="Verificando sesion" />;
  }

  if (!user) {
    return <Navigate to={PATHS.LOGIN} state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={PATHS.FORBIDDEN} replace />;
  }

  return <Outlet />;
};

export const PublicRoute = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <CenteredSpinner label="Verificando sesion" />;
  }

  if (user) {
    return <Navigate to={PATHS.DASHBOARD} replace />;
  }

  return <Outlet />;
};
