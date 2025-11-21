import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { getToken } from '../../redux/selectors/authSelector';
import { logout, testToken } from '../../redux/reducers/authSlice.ts';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../redux/store.ts';

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const token = getToken();

  useEffect(() => {
    // @typescript-eslint/no-explicit-any
    dispatch(testToken()).then((unwrapResult) => {
      if (unwrapResult.meta.requestStatus !== 'fulfilled') {
        dispatch(logout()).then(() => {
          navigate('/login');
        });
      }
    });
  }, [dispatch, navigate]);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
