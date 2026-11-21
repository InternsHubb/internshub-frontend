import { Suspense } from 'react';
import { Navigate, Outlet, ScrollRestoration, useLocation } from 'react-router-dom';
import { REGISTER_HASHES, ROUTES } from '@/app/routes';
import { ErrorBoundary } from '@/shared/components/common/ErrorBoundary';
import { Loader } from '@/shared/components/ui/Loader';

export function RootLayout() {
  const { hash } = useLocation();

  if (REGISTER_HASHES.includes(hash)) {
    return <Navigate to={ROUTES.register} replace />;
  }

  if (hash === '#home') {
    return <Navigate to={ROUTES.home} replace />;
  }

  return (
    <ErrorBoundary>
      <ScrollRestoration />
      <Suspense fallback={<Loader fullScreen />}>
        <Outlet />
      </Suspense>
    </ErrorBoundary>
  );
}

export default RootLayout;
