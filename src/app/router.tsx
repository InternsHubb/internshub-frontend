import React, { lazy, Suspense } from 'react';
import {
  Navigate,
  Outlet,
  ScrollRestoration,
  createBrowserRouter,
  useLocation,
} from 'react-router-dom';

import { RequireAuth } from '@/components/auth/RequireAuth';
import { EMPLOYER_ROUTES, REGISTER_HASHES, ROUTES } from '@/constants/routes';
import LandingPage from '@/pages/LandingPage';

// Code-split secondary heavy routes so home page bundle remains lightweight
const InternshipPage = lazy(() => import('@/pages/InternshipPage'));
const OnboardingFlow = lazy(() => import('@/pages/onboarding/OnboardingFlow'));
const RegisterScreen = lazy(() => import('@/components/RegisterScreen'));
const ForgotPassword = lazy(() => import('@/pages/auth/ForgotPassword'));
const Login = lazy(() => import('@/pages/auth/Login'));
const PhoneOTP = lazy(() => import('@/pages/auth/PhoneOTP'));
const MicrosoftCallback = lazy(() => import('@/pages/auth/MicrosoftCallback'));
const EmployerLayout = lazy(() =>
  import('@/components/employer/EmployerLayout').then((module) => ({ default: module.EmployerLayout })),
);
const EmployerPipelinePage = lazy(() =>
  import('@/pages/employer/PipelinePage').then((module) => ({ default: module.PipelinePage })),
);
const EmployerScheduleInterviewPage = lazy(() =>
  import('@/pages/employer/ScheduleInterviewPage').then((module) => ({
    default: module.ScheduleInterviewPage,
  })),
);
const EmployerDecisionPage = lazy(() =>
  import('@/pages/employer/EmployerDecisionPage').then((module) => ({
    default: module.EmployerDecisionPage,
  })),
);
const EmployerDecisionSubmittedPage = lazy(() =>
  import('@/pages/employer/DecisionSubmittedPage').then((module) => ({
    default: module.DecisionSubmittedPage,
  })),
);
const EmployerAgreementPage = lazy(() =>
  import('@/pages/employer/PartnerAgreementPage').then((module) => ({
    default: module.PartnerAgreementPage,
  })),
);
const EmployerCompletionPage = lazy(() =>
  import('@/pages/employer/CompletionPage').then((module) => ({ default: module.CompletionPage })),
);

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
        path: ROUTES.onboarding,
        element: (
          <RequireAuth>
            <OnboardingFlow />
          </RequireAuth>
        ),
      },
      {
        path: EMPLOYER_ROUTES.root,
        element: (
          <RequireAuth>
            <EmployerLayout />
          </RequireAuth>
        ),
        children: [
          { index: true, element: <Navigate to={EMPLOYER_ROUTES.pipeline} replace /> },
          { path: 'pipeline', element: <EmployerPipelinePage /> },
          { path: 'interviews/:applicationId/schedule', element: <EmployerScheduleInterviewPage /> },
          { path: 'applications/:applicationId/decision', element: <EmployerDecisionPage /> },
          {
            path: 'applications/:applicationId/decision/submitted',
            element: <EmployerDecisionSubmittedPage />,
          },
          { path: 'applications/:applicationId/agreement', element: <EmployerAgreementPage /> },
          { path: 'completion', element: <EmployerCompletionPage /> },
          { path: '*', element: <Navigate to={EMPLOYER_ROUTES.pipeline} replace /> },
        ],
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
