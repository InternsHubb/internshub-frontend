import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { ROUTES } from '@/app/routes';
import { useAuth, type UserRole } from '@/shared/auth';
import { isDevAuthBypassEnabled } from './isDevAuthBypassEnabled';

interface RoleRouteProps {
  allowedRoles: ReadonlyArray<UserRole>;
  fallbackPath?: string;
  children: ReactNode;
}

/**
 * Role-based authorization route guard.
 * Checks whether the signed-in user holds at least one role in `allowedRoles`.
 */
export function RoleRoute({
  allowedRoles,
  fallbackPath = ROUTES.dashboard,
  children,
}: RoleRouteProps) {
  const { status, hasAnyRole } = useAuth();

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
    return <Navigate to={ROUTES.login} replace />;
  }

  if (!hasAnyRole(allowedRoles)) {
    return <Navigate to={fallbackPath} replace />;
  }

  return <>{children}</>;
}

export default RoleRoute;
