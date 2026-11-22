import { lazy } from 'react';
import { Navigate, type RouteObject } from 'react-router-dom';
import { ROUTES } from '@/app/routes';
import { ProtectedRoute } from '@/shared/routing';

const CoursesPage = lazy(() => import('@/features/courses/pages/CoursesPage'));
const PlansPage = lazy(() => import('@/features/courses/pages/PlansPage'));
const CourseDetailsPage = lazy(() => import('@/features/courses/pages/CourseDetailsPage'));
const CourseVideoPage = lazy(() => import('@/features/courses/pages/CourseVideoPage'));
const CourseQuizPage = lazy(() => import('@/features/courses/pages/CourseQuizPage'));

export const coursesDashboardChildren: RouteObject[] = [
  {
    path: 'courses',
    children: [
      { index: true, element: <CoursesPage /> },
      { path: 'plans', element: <PlansPage /> },
    ],
  },
];

export const coursesStandaloneRoutes: RouteObject[] = [
  {
    path: ROUTES.courses3m,
    element: <Navigate to={ROUTES.dashboardCourses} replace />,
  },
  {
    path: ROUTES.courses6m,
    element: <Navigate to={ROUTES.dashboardCourses} replace />,
  },
  {
    path: ROUTES.courses12m,
    element: <Navigate to={ROUTES.dashboardCourses} replace />,
  },
  {
    path: '/courses',
    element: <Navigate to={ROUTES.dashboardCourses} replace />,
  },
  {
    path: ROUTES.courseDetails,
    element: (
      <ProtectedRoute>
        <CourseDetailsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.courseDetailsDefault,
    element: (
      <ProtectedRoute>
        <CourseDetailsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.courseVideo,
    element: (
      <ProtectedRoute>
        <CourseVideoPage />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.courseVideoDefault,
    element: (
      <ProtectedRoute>
        <CourseVideoPage />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.courseQuiz,
    element: (
      <ProtectedRoute>
        <CourseQuizPage />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.courseQuizDefault,
    element: (
      <ProtectedRoute>
        <CourseQuizPage />
      </ProtectedRoute>
    ),
  },
];
