import React, { lazy, Suspense } from 'react';
import {
  Navigate,
  Outlet,
  ScrollRestoration,
  createBrowserRouter,
  useLocation,
} from 'react-router-dom';

import { RequireAuth } from '@/components/auth/RequireAuth';
import { RequiredCoursesCard } from '@/components/dashboard/RequiredCoursesCard';
import type { DashboardRouteHandle } from '@/components/layout/DashboardLayout';
import { CoursesSearch } from '@/pages/dashboard/courses/CoursesSearch';
import { InternshipSidebarFooter } from '@/pages/dashboard/internship/InternshipSidebarFooter';
import { REGISTER_HASHES, ROUTES } from '@/constants/routes';
import LandingPage from '@/pages/LandingPage';

// Code-split secondary heavy routes so home page bundle remains lightweight
const InternshipPage = lazy(() => import('@/pages/InternshipPage'));
const OnboardingFlow = lazy(() => import('@/pages/onboarding/OnboardingFlow'));
const RegisterScreen = lazy(() => import('@/components/RegisterScreen'));
const ForgotPassword = lazy(() => import('@/pages/auth/ForgotPassword'));
const Login = lazy(() => import('@/pages/auth/Login'));
const PhoneOTP = lazy(() => import('@/pages/auth/PhoneOTP'));
const MicrosoftCallback = lazy(() => import('@/pages/auth/MicrosoftCallback'));
const DashboardLayout = lazy(() => import('@/components/layout/DashboardLayout'));
const DashboardHome = lazy(() => import('@/pages/dashboard/home/DashboardHome'));
const InternshipDashboard = lazy(() => import('@/pages/dashboard/internship/InternshipDashboard'));
const ProjectPage = lazy(() => import('@/pages/dashboard/internship/ProjectPage'));
const CoursesPage = lazy(() => import('@/pages/dashboard/courses/CoursesPage'));
const PlansPage = lazy(() => import('@/pages/dashboard/courses/PlansPage'));

const PageFallback: React.FC = () => (
  <div className="min-h-screen bg-white flex items-center justify-center">
    <div className="size-8 rounded-full border-3 border-purple-600 border-t-transparent animate-spin" />
  </div>
);

function RootLayout() {
  const { hash } = useLocation();

  // Older links such as "/#signup" opened the Register screen on any path.
  if (REGISTER_HASHES.includes(hash)) {
    return <Navigate to={ROUTES.register} replace />;
  }

  if (hash === '#home') {
    return <Navigate to={ROUTES.home} replace />;
  }

  return (
    <>
      <ScrollRestoration />
      <Suspense fallback={<PageFallback />}>
        <Outlet />
      </Suspense>
    </>
  );
}

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: ROUTES.home, element: <LandingPage /> },
      // Sub-paths keep rendering the Internship page, as before.
      { path: `${ROUTES.internship}/*`, element: <InternshipPage /> },
      {
        path: ROUTES.dashboard,
        element: <DashboardLayout />,
        children: [
          { index: true, element: <DashboardHome /> },
          {
            path: 'internship',
            element: <InternshipDashboard />,
            handle: { sidebarFooter: InternshipSidebarFooter } satisfies DashboardRouteHandle,
          },
          {
            path: 'internship/project',
            element: <ProjectPage />,
            handle: { sidebarFooter: RequiredCoursesCard } satisfies DashboardRouteHandle,
          },
          {
            path: 'courses',
            handle: { topNavSearch: CoursesSearch } satisfies DashboardRouteHandle,
            children: [
              { index: true, element: <CoursesPage /> },
              { path: 'plans', element: <PlansPage /> },
            ],
          },
        ],
      },
      {
        path: ROUTES.onboarding,
        element: (
          <RequireAuth>
            <OnboardingFlow />
          </RequireAuth>
        ),
      },
      { path: ROUTES.register, element: <RegisterScreen /> },
      { path: ROUTES.authRegister, element: <RegisterScreen /> },
      { path: ROUTES.forgotPassword, element: <ForgotPassword /> },
      { path: ROUTES.phoneOtp, element: <PhoneOTP /> },
      { path: ROUTES.microsoftCallback, element: <MicrosoftCallback /> },
      // Any other /auth path shows Login, as before.
      { path: `${ROUTES.login}/*`, element: <Login /> },
      { path: '*', element: <Navigate to={ROUTES.home} replace /> },
    ],
  },
], {
  // Opt into React Router v7 behavior now; this also silences its dev warnings.
  future: {
    v7_fetcherPersist: true,
    v7_normalizeFormMethod: true,
    v7_partialHydration: true,
    v7_relativeSplatPath: true,
    v7_skipActionErrorRevalidation: true,
  },
});
