import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import { ROUTES } from '@/app/routes';
import { ProtectedRoute } from '@/shared/routing';

const OnboardingFlowPage = lazy(() => import('@/features/onboarding/pages/OnboardingFlowPage'));

export const onboardingRoutes: RouteObject[] = [
  {
    path: ROUTES.onboarding,
    element: (
      <ProtectedRoute requireOnboardingComplete={false}>
        <OnboardingFlowPage />
      </ProtectedRoute>
    ),
  },
];
