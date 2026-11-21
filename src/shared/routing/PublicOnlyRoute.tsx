import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { postSignInPath, redirectFromState, useAuth } from '@/shared/auth';

interface PublicOnlyRouteProps {
  children: ReactNode;
}

/**
 * Guards guest-only pages (Login, Register, Forgot Password, Phone OTP).
 * Redirects already-authenticated users to their appropriate workspace.
 */
export function PublicOnlyRoute({ children }: PublicOnlyRouteProps) {
  const { status, user } = useAuth();
  const location = useLocation();

  if (status === 'authenticated' && user) {
    return <Navigate to={postSignInPath(user, redirectFromState(location.state))} replace />;
  }

  return <>{children}</>;
}

export default PublicOnlyRoute;
