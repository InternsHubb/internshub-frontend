
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
const MicrosoftCallback = lazy(
  () => import('@/pages/auth/MicrosoftCallback')
);
const Courses6mPage = lazy(() => import('@/pages/Courses6mPage'));
const CourseDetailsPage = lazy(() => import('@/pages/CourseDetailsPage'));
const CourseVideoPage = lazy(() => import('@/pages/CourseVideoPage'));
const CourseQuizPage = lazy(() => import('@/pages/CourseQuizPage'));

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
          path: ROUTES.courses6m,
          element: <Courses6mPage />,
        },
        {
          path: '/courses',
          element: <Courses6mPage />,
        },
        {
          path: ROUTES.courseDetails,
          element: <CourseDetailsPage />,
        },
        {
          path: ROUTES.courseDetailsDefault,
          element: <CourseDetailsPage />,
        },
        {
          path: ROUTES.courseVideo,
          element: <CourseVideoPage />,
        },
        {
          path: ROUTES.courseVideoDefault,
          element: <CourseVideoPage />,
        },
        {
          path: ROUTES.courseQuiz,
          element: <CourseQuizPage />,
        },
        {
          path: ROUTES.courseQuizDefault,
          element: <CourseQuizPage />,
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
