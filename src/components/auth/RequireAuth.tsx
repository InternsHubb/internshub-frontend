import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/hooks/useAuth';
import type { RedirectState } from '@/lib/auth/redirect';

type RequireAuthProps = {
  children: ReactNode;
};

// Shared sign-in guard used by the router for /onboarding, /recruitment (PR #31) and /employer
// (PR #32). It only checks that a session exists: anonymous users are sent to Login with
// `from` so they return afterwards. It does not check roles (e.g. employer vs student).

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
