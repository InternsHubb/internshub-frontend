import { lazy } from 'react';
import { Navigate, type RouteObject } from 'react-router-dom';
import { ROUTES } from '@/app/routes';
import LandingPage from '@/features/landing/pages/LandingPage';

const InternshipPage = lazy(() => import('@/features/landing/pages/InternshipPage'));
const SeniorJourneyPage = lazy(() => import('@/features/landing/pages/SeniorJourneyPage'));
const InternshipDetailsPage = lazy(() => import('@/features/landing/pages/InternshipDetailsPage'));

export const landingRoutes: RouteObject[] = [
  {
    path: ROUTES.home,
    element: <LandingPage />,
  },
  {
    path: `${ROUTES.internship}/*`,
    element: <InternshipPage />,
  },
  {
    path: ROUTES.seniorProfile,
    element: <SeniorJourneyPage />,
  },
  {
    path: ROUTES.internshipDetails,
    element: <InternshipDetailsPage />,
  },
  {
    path: ROUTES.seniors,
    element: <Navigate to={`${ROUTES.home}#experience`} replace />,
  },
];
