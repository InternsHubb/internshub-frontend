import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import type { StudentRouteHandle } from '@/shared/layouts';
import {
  InternshipSidebarFooter,
  ProjectSidebarFooter,
} from '@/features/internships/components/InternshipSidebarFooter';

const DashboardHomePage = lazy(() => import('@/features/internships/pages/DashboardHomePage'));
const InternshipDashboardPage = lazy(() => import('@/features/internships/pages/InternshipDashboardPage'));
const ProjectPage = lazy(() => import('@/features/internships/pages/ProjectPage'));
const ProjectDetailsPage = lazy(() => import('@/features/internships/pages/ProjectDetailsPage'));
const ProjectReviewPage = lazy(() => import('@/features/internships/pages/ProjectReviewPage'));
const ProjectDonePage = lazy(() => import('@/features/internships/pages/ProjectDonePage'));
const ProjectCompletedPage = lazy(() => import('@/features/internships/pages/ProjectCompletedPage'));
const ProjectFinalReviewPage = lazy(() => import('@/features/internships/pages/ProjectFinalReviewPage'));
const ProjectResultsPage = lazy(() => import('@/features/internships/pages/ProjectResultsPage'));

export const internshipDashboardChildren: RouteObject[] = [
  {
    index: true,
    element: <DashboardHomePage />,
  },
  {
    path: 'internship',
    element: <InternshipDashboardPage />,
    handle: { sidebarFooter: InternshipSidebarFooter } satisfies StudentRouteHandle,
  },
  {
    path: 'internship/project',
    element: <ProjectPage />,
    handle: { sidebarFooter: ProjectSidebarFooter } satisfies StudentRouteHandle,
  },
  {
    path: 'internship/project/details',
    element: <ProjectDetailsPage />,
    handle: { sidebarFooter: ProjectSidebarFooter } satisfies StudentRouteHandle,
  },
  {
    path: 'internship/project/review',
    element: <ProjectReviewPage />,
    handle: { sidebarFooter: ProjectSidebarFooter } satisfies StudentRouteHandle,
  },
  {
    path: 'internship/project/done',
    element: <ProjectDonePage />,
    handle: { sidebarFooter: ProjectSidebarFooter } satisfies StudentRouteHandle,
  },
  {
    path: 'internship/project/completed',
    element: <ProjectCompletedPage />,
    handle: { sidebarFooter: ProjectSidebarFooter } satisfies StudentRouteHandle,
  },
  {
    path: 'internship/project/final-review',
    element: <ProjectFinalReviewPage />,
    handle: { sidebarFooter: ProjectSidebarFooter } satisfies StudentRouteHandle,
  },
  {
    path: 'internship/project/results',
    element: <ProjectResultsPage />,
    handle: { sidebarFooter: ProjectSidebarFooter } satisfies StudentRouteHandle,
  },
];
