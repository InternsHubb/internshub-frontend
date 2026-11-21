import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import { ROUTES } from '@/app/routes';
import { CompositeScoreCard } from '@/shared/components/common/CompositeScoreCard';
import type { StudentRouteHandle } from '@/shared/layouts';
import { ProtectedRoute } from '@/shared/routing';

const MentorshipShell = lazy(() => import('@/features/mentorship/components/MentorshipShell'));
const MentorshipDashboardPage = lazy(() => import('@/features/mentorship/pages/MentorshipDashboardPage'));
const MentorsPage = lazy(() => import('@/features/mentorship/pages/MentorsPage'));
const MentorProfilePage = lazy(() => import('@/features/mentorship/pages/MentorProfilePage'));
const BookSessionPage = lazy(() => import('@/features/mentorship/pages/BookSessionPage'));
const ConfirmBookingPage = lazy(() => import('@/features/mentorship/pages/ConfirmBookingPage'));
const BookingSuccessPage = lazy(() => import('@/features/mentorship/pages/BookingSuccessPage'));
const SessionDetailsPage = lazy(() => import('@/features/mentorship/pages/SessionDetailsPage'));
const SessionCancelledPage = lazy(() => import('@/features/mentorship/pages/SessionCancelledPage'));
const SessionFeedbackPage = lazy(() => import('@/features/mentorship/pages/SessionFeedbackPage'));
const ChatPage = lazy(() => import('@/features/mentorship/pages/ChatPage'));

export const mentorshipDashboardChildren: RouteObject[] = [
  {
    path: 'chat',
    element: <ChatPage />,
    handle: { sidebarFooter: CompositeScoreCard } satisfies StudentRouteHandle,
  },
];

export const mentorshipRoutes: RouteObject[] = [
  {
    path: ROUTES.mentorship,
    element: (
      <ProtectedRoute>
        <MentorshipShell />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <MentorshipDashboardPage /> },
      { path: 'mentors', element: <MentorsPage /> },
      { path: 'mentors/:id', element: <MentorProfilePage /> },
      { path: 'book/:id', element: <BookSessionPage /> },
      { path: 'book/confirm', element: <ConfirmBookingPage /> },
      { path: 'book/success', element: <BookingSuccessPage /> },
      { path: 'sessions/:id', element: <SessionDetailsPage /> },
      { path: 'sessions/:id/cancelled', element: <SessionCancelledPage /> },
      { path: 'sessions/:id/feedback', element: <SessionFeedbackPage /> },
    ],
  },
];
