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
  recruitmentApplicationPath,
} from '@/constants/routes';
import { DEFAULT_APPLICATION_ID } from '@/lib/recruitment/data';
import LandingPage from '@/pages/LandingPage';

// Route map and flow ownership. Each URL prefix has exactly one owning flow:
//   /, /internship, /onboarding, /auth/*, /register   public site + authentication
//   /dashboard/*      student dashboard              DashboardLayout
//   /recruitment/*    student recruitment (PR #31)   RecruitmentLayout, requires sign-in
//   /employer/*       employer decision/agreement flow (PR #32), EmployerLayout, requires sign-in
// The legacy employer prototype (PR #30) keeps only the /employer sub-paths listed in its group
// below; it does not own /employer itself. Keep a single route tree in createBrowserRouter:
// pasting a second tree or a second /employer index/catch-all is what broke dev before.
//
// Authentication: RequireAuth only checks that someone is signed in (anonymous users go to
// /auth and come back afterwards). There is no role check, so any signed-in user can open the
// employer routes.

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

// Student recruitment flow pages (PR #31)
const RecruitmentLayout = lazy(() => import('@/components/recruitment/RecruitmentLayout'));
const EligibilityPage = lazy(() => import('@/pages/recruitment/EligibilityPage'));
const TalentDirectoryConsentPage = lazy(
  () => import('@/pages/recruitment/TalentDirectoryConsentPage'),
);
const ApplicationDetailsPage = lazy(
  () => import('@/pages/recruitment/ApplicationDetailsPage'),
);
const AgreementDetailsPage = lazy(
  () => import('@/pages/recruitment/AgreementDetailsPage'),
);

// Employer decision / agreement flow pages (PR #32): the primary /employer experience.
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

// Legacy employer recruitment prototype pages (PR #30). Its own Pipeline and Completion pages
// (pages/employer/Pipeline.tsx, Completion.tsx) are intentionally not routed: /employer/pipeline
// and /employer/completion belong to the decision / agreement flow above. The "Legacy" prefix
// keeps its layout distinct from the PR #32 EmployerLayout.
const LegacyEmployerLayout = lazy(
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
const Interviews = lazy(
  () => import('@/pages/employer/Interviews')
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
        // Public site: landing page and the public internship pages. No sign-in.
        {
          path: ROUTES.home,
          element: <LandingPage />,
        },
        {
          path: `${ROUTES.internship}/*`,
          element: <InternshipPage />,
        },

        // Student dashboard: home, internship journey (?state= previews), project, courses and
        // plans, inside the shared DashboardLayout. Route `handle` slots customise the layout's
        // sidebar footer and top-bar search. Not wrapped in RequireAuth.
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

        // Onboarding (requires sign-in).
        {
          path: ROUTES.onboarding,
          element: (
            <RequireAuth>
              <OnboardingFlow />
            </RequireAuth>
          ),
        },

        // Student recruitment flow (PR #31): owns /recruitment. Eligibility review, Talent
        // Directory consent, application details and agreements, inside RecruitmentLayout.
        // Requires sign-in. /recruitment redirects to eligibility; /recruitment/applications
        // redirects to the default sample application (local JSON, see lib/recruitment/data).
        {
          path: ROUTES.recruitment,
          element: (
            <RequireAuth>
              <RecruitmentLayout />
            </RequireAuth>
          ),
          children: [
            { index: true, element: <Navigate to={ROUTES.recruitmentEligibility} replace /> },
            { path: 'eligibility', element: <EligibilityPage /> },
            { path: 'talent-directory', element: <TalentDirectoryConsentPage /> },
            {
              path: 'applications',
              element: (
                <Navigate
                  to={recruitmentApplicationPath(DEFAULT_APPLICATION_ID)}
                  replace
                />
              ),
            },
            { path: 'applications/:applicationId', element: <ApplicationDetailsPage /> },
            { path: 'agreements/:agreementId', element: <AgreementDetailsPage /> },
          ],
        },

        // Authentication screens (public). Any other /auth/* path shows Login.
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

        // Employer recruitment flow (PR #32): owns /employer. Pipeline, interview scheduling,
        // application decisions, partner agreement and completion, inside the PR #32
        // EmployerLayout (components/employer). Requires sign-in (no role check).
        // This is the only /employer group allowed an index route and a catch-all:
        //   /employer     -> /employer/pipeline
        //   /employer/*   -> /employer/pipeline for any unknown sub-path.
        // The catch-all yields to more specific /employer/... paths (React Router ranks static
        // segments above a splat), which is how the legacy group below stays reachable. Adding a
        // legacy path here, or a second catch-all, would intercept the other flow's URLs.
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

        // Legacy employer prototype (PR #30): only these static sub-paths, kept on their original
        // URLs inside LegacyEmployerLayout (layouts/EmployerLayout). It must not declare an
        // /employer index, a catch-all, or the pipeline / completion paths owned by PR #32.
        // Not wrapped in RequireAuth (unchanged from PR #30). Its sidebar links to Pipeline and
        // Completion lead into the PR #32 flow.
        {
          path: EMPLOYER_ROUTES.root,
          element: <LegacyEmployerLayout />,
          children: [
            { path: 'dashboard', element: <Dashboard /> },
            { path: 'talent', element: <TalentDirectory /> },
            { path: 'talent/:candidateId', element: <CandidateProfile /> },
            { path: 'shortlist', element: <Shortlist /> },
            { path: 'interviews', element: <Interviews /> },
            { path: 'send-opportunity', element: <SendOpportunity /> },
            { path: 'opportunity-sent', element: <OpportunitySent /> },
          ],
        },

        // App-wide fallback: any URL no group above matches goes home. Keep it last.
        {
          path: '*',
          element: <Navigate to={ROUTES.home} replace />,
        },
      ],
    },
  ],
  {
    // Opt into React Router v7 behavior now; this also silences its dev warnings.
    future: {
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
      v7_partialHydration: true,
      v7_relativeSplatPath: true,
      v7_skipActionErrorRevalidation: true,
    },
  }
);
