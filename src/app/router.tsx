import { createBrowserRouter } from 'react-router-dom';
import { ROUTES } from '@/app/routes';
import { NotFoundPage } from '@/shared/components/common/NotFoundPage';
import { RootLayout, StudentLayout } from '@/shared/layouts';
import { ProtectedRoute } from '@/shared/routing';

import { landingRoutes } from '@/features/landing';
import { authenticationRoutes } from '@/features/authentication';
import { onboardingRoutes } from '@/features/onboarding';
import { internshipDashboardChildren } from '@/features/internships';
import { coursesDashboardChildren, coursesStandaloneRoutes } from '@/features/courses';
import { mentorshipDashboardChildren, mentorshipRoutes } from '@/features/mentorship';
import { recruitmentRoutes } from '@/features/recruitment';

/**
 * Main InternsHub Application Router.
 *
 * Each of the seven official features owns its own route definitions in
 * `src/features/<feature>/routes.tsx` and registers them through its public barrel.
 * Shared dashboard shell routes under `/dashboard` compose children from
 * `internships`, `courses`, and `mentorship` inside `StudentLayout`.
 */
export const router = createBrowserRouter(
  [
    {
      element: <RootLayout />,
      children: [
        // 1. Public marketing & discovery routes (Landing feature)
        ...landingRoutes,

        // 2. Authentication routes (Authentication feature)
        ...authenticationRoutes,

        // 3. Account setup & AI interview onboarding (Onboarding feature)
        ...onboardingRoutes,

        // 4. Courses standalone redirects & viewer routes (Courses feature)
        ...coursesStandaloneRoutes,

        // 5. Shared Student Workspace Shell (/dashboard/*)
        {
          path: ROUTES.dashboard,
          element: (
            <ProtectedRoute>
              <StudentLayout />
            </ProtectedRoute>
          ),
          children: [
            ...internshipDashboardChildren,
            ...coursesDashboardChildren,
            ...mentorshipDashboardChildren,
          ],
        },

        // 6. Mentorship booking & sessions workspace (Mentorship feature)
        ...mentorshipRoutes,

        // 7. Student & Employer Recruitment workflows (Recruitment feature)
        ...recruitmentRoutes,

        // Fallback 404 screen
        {
          path: '*',
          element: <NotFoundPage />,
        },
      ],
    },
  ],
  {
    future: {
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
      v7_partialHydration: true,
      v7_relativeSplatPath: true,
      v7_skipActionErrorRevalidation: true,
    },
  },
);
