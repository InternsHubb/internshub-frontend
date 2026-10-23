
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
import {
  EMPLOYER_ROUTES,
  REGISTER_HASHES,
  ROUTES,
} from '@/constants/routes';
import LandingPage from '@/pages/LandingPage';

// Existing application pages
const InternshipPage = lazy(() => import('@/pages/InternshipPage'));
const OnboardingFlow = lazy(
  () => import('@/pages/onboarding/OnboardingFlow')
);
const RegisterScreen = lazy(
  () => import('@/components/RegisterScreen')
);
const ForgotPassword = lazy(
  () => import('@/pages/auth/ForgotPassword')
);
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
const MicrosoftCallback = lazy(
  () => import('@/pages/auth/MicrosoftCallback')
);

// Student dashboard pages
const DashboardLayout = lazy(() => import('@/components/layout/DashboardLayout'));
const DashboardHome = lazy(() => import('@/pages/dashboard/home/DashboardHome'));
const InternshipDashboard = lazy(() => import('@/pages/dashboard/internship/InternshipDashboard'));
const ProjectPage = lazy(() => import('@/pages/dashboard/internship/ProjectPage'));
const CoursesPage = lazy(() => import('@/pages/dashboard/courses/CoursesPage'));
const PlansPage = lazy(() => import('@/pages/dashboard/courses/PlansPage'));

// Employer Recruitment Flow pages
const EmployerLayout = lazy(
  () => import('@/layouts/EmployerLayout')
);
const Dashboard = lazy(
  () => import('@/pages/employer/Dashboard')
);
const TalentDirectory = lazy(
  () => import('@/pages/employer/TalentDirectory')
);
const CandidateProfile = lazy(
  () => import('@/pages/employer/CandidateProfile')
);
const Shortlist = lazy(
  () => import('@/pages/employer/Shortlist')
);
const Pipeline = lazy(
  () => import('@/pages/employer/Pipeline')
);
const Interviews = lazy(
  () => import('@/pages/employer/Interviews')
);
const Completion = lazy(
  () => import('@/pages/employer/Completion')
);
const SendOpportunity = lazy(
  () => import('@/pages/employer/SendOpportunity')
);
const OpportunitySent = lazy(
  () => import('@/pages/employer/OpportunitySent')
);

const PageFallback: React.FC = () => (
  <div className="flex min-h-screen items-center justify-center bg-white">
    <div className="size-8 animate-spin rounded-full border-3 border-purple-600 border-t-transparent" />
  </div>
);

function RootLayout() {
  const { hash } = useLocation();

  // Keep support for older registration links.
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

export const router = createBrowserRouter(
  [
    {
      element: <RootLayout />,
      children: [
        // Existing application routes
        {
          path: ROUTES.home,
          element: <LandingPage />,
        },
        {
          path: `${ROUTES.internship}/*`,
          element: <InternshipPage />,
        },

        // Student dashboard
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
        {
          path: ROUTES.register,
          element: <RegisterScreen />,
        },
        {
          path: ROUTES.authRegister,
          element: <RegisterScreen />,
        },
        {
          path: ROUTES.forgotPassword,
          element: <ForgotPassword />,
        },
        {
          path: ROUTES.phoneOtp,
          element: <PhoneOTP />,
        },
        {
          path: ROUTES.microsoftCallback,
          element: <MicrosoftCallback />,
        },
        {
          path: `${ROUTES.login}/*`,
          element: <Login />,
        },

        // Employer Recruitment Flow
        {
          path: ROUTES.employer,
          element: <EmployerLayout />,
          children: [
            {
              index: true,
              element: (
                <Navigate
                  to={EMPLOYER_ROUTES.dashboard}
                  replace
                />
              ),
            },
            {
              path: 'dashboard',
              element: <Dashboard />,
            },
            {
              path: 'talent',
              element: <TalentDirectory />,
            },
            {
              path: 'talent/:candidateId',
              element: <CandidateProfile />,
            },
            {
              path: 'shortlist',
              element: <Shortlist />,
            },
            {
              path: 'pipeline',
              element: <Pipeline />,
            },
            {
              path: 'interviews',
              element: <Interviews />,
            },
            {
              path: 'completion',
              element: <Completion />,
            },
            {
              path: 'send-opportunity',
              element: <SendOpportunity />,
            },
            {
              path: 'opportunity-sent',
              element: <OpportunitySent />,
            },
          ],
        },

        // Keep the fallback route last.
        {
          path: '*',
          element: <Navigate to={ROUTES.home} replace />,
        },
      ],
    },
  ],
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
