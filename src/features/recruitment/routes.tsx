import { lazy } from 'react';
import { Navigate, type RouteObject } from 'react-router-dom';
import { EMPLOYER_ROUTES, ROUTES } from '@/app/routes';
import { ProtectedRoute, RoleRoute } from '@/shared/routing';

// Student recruitment flow
const RecruitmentStudentShell = lazy(
  () => import('@/features/recruitment/components/student/RecruitmentStudentShell'),
);
const TalentDirectoryConsentPage = lazy(
  () => import('@/features/recruitment/pages/student/TalentDirectoryConsentPage'),
);
const RecruitmentDashboard = lazy(() =>
  import('@/features/recruitment/pages/student/StudentRecruitmentPages').then((m) => ({
    default: m.StudentRecruitmentDashboard,
  })),
);
const RecruitmentEligibility = lazy(() =>
  import('@/features/recruitment/pages/student/StudentRecruitmentPages').then((m) => ({
    default: m.StudentRecruitmentEligibility,
  })),
);
const RecruitmentProfile = lazy(() =>
  import('@/features/recruitment/pages/student/StudentRecruitmentPages').then((m) => ({
    default: m.StudentRecruitmentProfile,
  })),
);
const RecruitmentOpportunities = lazy(() =>
  import('@/features/recruitment/pages/student/StudentRecruitmentPages').then((m) => ({
    default: m.StudentRecruitmentOpportunities,
  })),
);
const RecruitmentOpportunityDetails = lazy(() =>
  import('@/features/recruitment/pages/student/StudentRecruitmentPages').then((m) => ({
    default: m.StudentRecruitmentOpportunityDetails,
  })),
);
const RecruitmentApplications = lazy(() =>
  import('@/features/recruitment/pages/student/StudentRecruitmentPages').then((m) => ({
    default: m.StudentRecruitmentApplications,
  })),
);
const RecruitmentApplicationDetails = lazy(() =>
  import('@/features/recruitment/pages/student/StudentRecruitmentPages').then((m) => ({
    default: m.StudentRecruitmentApplicationDetails,
  })),
);
const RecruitmentInterview = lazy(() =>
  import('@/features/recruitment/pages/student/StudentRecruitmentPages').then((m) => ({
    default: m.StudentRecruitmentInterview,
  })),
);
const RecruitmentAgreement = lazy(() =>
  import('@/features/recruitment/pages/student/StudentRecruitmentPages').then((m) => ({
    default: m.StudentRecruitmentAgreement,
  })),
);
const RecruitmentNotifications = lazy(() =>
  import('@/features/recruitment/pages/student/StudentRecruitmentPages').then((m) => ({
    default: m.StudentRecruitmentNotifications,
  })),
);
const RecruitmentCompletion = lazy(() =>
  import('@/features/recruitment/pages/student/StudentRecruitmentPages').then((m) => ({
    default: m.StudentRecruitmentCompletion,
  })),
);

// Employer recruitment flow (primary)
const RecruitmentEmployerShell = lazy(
  () => import('@/features/recruitment/components/employer/RecruitmentEmployerShell'),
);
const EmployerPipelinePage = lazy(() =>
  import('@/features/recruitment/pages/employer/PipelinePage').then((m) => ({
    default: m.PipelinePage,
  })),
);
const EmployerScheduleInterviewPage = lazy(() =>
  import('@/features/recruitment/pages/employer/ScheduleInterviewPage').then((m) => ({
    default: m.ScheduleInterviewPage,
  })),
);
const EmployerDecisionPage = lazy(() =>
  import('@/features/recruitment/pages/employer/EmployerDecisionPage').then((m) => ({
    default: m.EmployerDecisionPage,
  })),
);
const EmployerDecisionSubmittedPage = lazy(() =>
  import('@/features/recruitment/pages/employer/DecisionSubmittedPage').then((m) => ({
    default: m.DecisionSubmittedPage,
  })),
);
const EmployerAgreementPage = lazy(() =>
  import('@/features/recruitment/pages/employer/PartnerAgreementPage').then((m) => ({
    default: m.PartnerAgreementPage,
  })),
);
const EmployerCompletionPage = lazy(() =>
  import('@/features/recruitment/pages/employer/CompletionPage').then((m) => ({
    default: m.CompletionPage,
  })),
);

// Employer recruitment discovery pages (legacy shell preserved for all existing paths)
const LegacyEmployerShell = lazy(
  () => import('@/features/recruitment/components/employer/LegacyEmployerShell'),
);
const EmployerDashboardPage = lazy(
  () => import('@/features/recruitment/pages/employer/EmployerDashboardPage'),
);
const TalentDirectoryPage = lazy(
  () => import('@/features/recruitment/pages/employer/TalentDirectoryPage'),
);
const CandidateProfilePage = lazy(
  () => import('@/features/recruitment/pages/employer/CandidateProfilePage'),
);
const ShortlistPage = lazy(
  () => import('@/features/recruitment/pages/employer/ShortlistPage'),
);
const InterviewsPage = lazy(
  () => import('@/features/recruitment/pages/employer/InterviewsPage'),
);
const SendOpportunityPage = lazy(
  () => import('@/features/recruitment/pages/employer/SendOpportunityPage'),
);
const OpportunitySentPage = lazy(
  () => import('@/features/recruitment/pages/employer/OpportunitySentPage'),
);

export const recruitmentRoutes: RouteObject[] = [
  // Student recruitment workspace (/recruitment/*)
  {
    path: ROUTES.recruitment,
    element: (
      <ProtectedRoute>
        <RecruitmentStudentShell />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <RecruitmentDashboard /> },
      { path: 'eligibility', element: <RecruitmentEligibility /> },
      { path: 'profile', element: <RecruitmentProfile /> },
      { path: 'opportunities', element: <RecruitmentOpportunities /> },
      { path: 'opportunities/:opportunityId', element: <RecruitmentOpportunityDetails /> },
      { path: 'talent-directory', element: <TalentDirectoryConsentPage /> },
      { path: 'applications', element: <RecruitmentApplications /> },
      { path: 'applications/:applicationId', element: <RecruitmentApplicationDetails /> },
      { path: 'interview', element: <RecruitmentInterview /> },
      { path: 'agreements', element: <RecruitmentAgreement /> },
      { path: 'agreements/:agreementId', element: <RecruitmentAgreement /> },
      { path: 'notifications', element: <RecruitmentNotifications /> },
      { path: 'completion', element: <RecruitmentCompletion /> },
    ],
  },

  // Employer pipeline & agreement flow (/employer/*)
  {
    path: EMPLOYER_ROUTES.root,
    element: (
      <ProtectedRoute requireOnboardingComplete={false}>
        <RoleRoute allowedRoles={['employer', 'admin']}>
          <RecruitmentEmployerShell />
        </RoleRoute>
      </ProtectedRoute>
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

  // Employer talent discovery & shortlist flow (preserved existing /employer/* static sub-paths)
  {
    path: EMPLOYER_ROUTES.root,
    element: (
      <ProtectedRoute requireOnboardingComplete={false}>
        <RoleRoute allowedRoles={['employer', 'admin']}>
          <LegacyEmployerShell />
        </RoleRoute>
      </ProtectedRoute>
    ),
    children: [
      { path: 'dashboard', element: <EmployerDashboardPage /> },
      { path: 'talent', element: <TalentDirectoryPage /> },
      { path: 'talent/:candidateId', element: <CandidateProfilePage /> },
      { path: 'shortlist', element: <ShortlistPage /> },
      { path: 'interviews', element: <InterviewsPage /> },
      { path: 'send-opportunity', element: <SendOpportunityPage /> },
      { path: 'opportunity-sent', element: <OpportunitySentPage /> },
    ],
  },
];
