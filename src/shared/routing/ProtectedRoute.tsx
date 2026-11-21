import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { EMPLOYER_ROUTES, ROUTES } from '@/app/routes';
import { isUserDataComplete, useAuth, type RedirectState } from '@/shared/auth';
import { isDevAuthBypassEnabled } from './isDevAuthBypassEnabled';

interface ProtectedRouteProps {
  children: ReactNode;
  /** Set to false on routes exempt from student onboarding completion (e.g. /onboarding, /employer). */
  requireOnboardingComplete?: boolean;
}

/**
 * Guards routes that require an authenticated user.
 *
 * Local UI Preview:
 * Disabled by default. Only active in `import.meta.env.DEV` when neither `VITE_API_BASE_URL`
 * nor `API_PROXY_TARGET` is configured AND `VITE_DEV_BYPASS_AUTH=true` is explicitly set.
 * Production builds always enforce authentication and onboarding completion strictly.
 */
export function ProtectedRoute({
  children,
  requireOnboardingComplete = true,
}: ProtectedRouteProps) {
  const { status, user } = useAuth();
  const location = useLocation();

  if (isDevAuthBypassEnabled()) {
    return <>{children}</>;
  }

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white" role="status" aria-label="Loading">
        <div className="size-8 animate-spin rounded-full border-3 border-brand-primary border-t-transparent" />
      </div>
    );
  }

  if (status === 'anonymous') {
    const state: RedirectState = {
      from: `${location.pathname}${location.search}${location.hash}`,
    };
    return <Navigate to={ROUTES.login} replace state={state} />;
  }

  const isExemptFromOnboarding =
    !requireOnboardingComplete ||
    location.pathname === ROUTES.onboarding ||
    location.pathname.startsWith(ROUTES.login) ||
    location.pathname === EMPLOYER_ROUTES.root ||
    location.pathname.startsWith(`${EMPLOYER_ROUTES.root}/`);

  if (!isExemptFromOnboarding && !isUserDataComplete(user)) {
    return <Navigate to={ROUTES.onboarding} replace />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;
