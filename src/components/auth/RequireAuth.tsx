import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { EMPLOYER_ROUTES, ROUTES } from '@/constants/routes';
import { useAuth } from '@/hooks/useAuth';
import { isUserDataComplete, type RedirectState } from '@/lib/auth/redirect';

type RequireAuthProps = {
  children: ReactNode;
};

// Shared sign-in guard used by the router for /onboarding, /recruitment (PR #31) and /employer
// (PR #32). It checks that a session exists and enforces that user data is completed before
// allowing access to the dashboard and other protected student features.

export function RequireAuth({ children }: RequireAuthProps) {
  const { status, user } = useAuth();
  const location = useLocation();

  // Local-only preview for frontend work while the verification backend is unavailable.
  // The flag is ignored by production builds, so deployed routes remain protected.
  const localPreview = import.meta.env.DEV &&
    new URLSearchParams(location.search).get('preview') === '1';

  if (localPreview) return <>{children}</>;

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

  // If user is authenticated but their data is not complete, redirect them to onboarding first.
  // Employer routes are exempt: the onboarding steps are the student journey, so an employer
  // account is not expected to complete them.
  const isExcludedFromOnboardingCheck =
    location.pathname === ROUTES.onboarding ||
    location.pathname.startsWith('/auth') ||
    location.pathname === EMPLOYER_ROUTES.root ||
    location.pathname.startsWith(`${EMPLOYER_ROUTES.root}/`);

  if (!isExcludedFromOnboardingCheck && !isUserDataComplete(user)) {
    return <Navigate to={ROUTES.onboarding} replace />;
  }

  return <>{children}</>;
}

export default RequireAuth;
