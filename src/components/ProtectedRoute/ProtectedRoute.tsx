import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
}

interface RootState {
  auth: {
    isAuthenticated: boolean;
  };
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
