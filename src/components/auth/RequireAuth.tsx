import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/hooks/useAuth';
import type { RedirectState } from '@/lib/auth/redirect';

type RequireAuthProps = {
  children: ReactNode;
};

export function RequireAuth({ children }: RequireAuthProps) {
  const { status } = useAuth();
  const location = useLocation();

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white" role="status" aria-label="Loading">
        <div className="size-8 animate-spin rounded-full border-3 border-purple-600 border-t-transparent" />
      </div>
    );
  }

  if (status === 'anonymous') {
    const state: RedirectState = { from: `${location.pathname}${location.search}${location.hash}` };
    return <Navigate to={ROUTES.login} replace state={state} />;
  }

  return <>{children}</>;
}

export default RequireAuth;
