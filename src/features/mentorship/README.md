# Mentorship Feature (`src/features/mentorship/`)

**Owner:** Developer 7 — Mentorship Booking Flow, Session Management & Mentor Chat

## Owned Routes (`routes.tsx`)

### Mentorship Workspace (`/mentorship/*` — `ProtectedRoute` + `MentorshipShell`)
- `/mentorship` — `pages/MentorshipDashboardPage.tsx`
- `/mentorship/mentors` — `pages/MentorsPage.tsx`
- `/mentorship/mentors/:id` — `pages/MentorProfilePage.tsx`
- `/mentorship/book/:id` — `pages/BookSessionPage.tsx`
- `/mentorship/book/confirm` — `pages/ConfirmBookingPage.tsx`
- `/mentorship/book/success` — `pages/BookingSuccessPage.tsx`
- `/mentorship/sessions/:id` — `pages/SessionDetailsPage.tsx`
- `/mentorship/sessions/:id/cancelled` — `pages/SessionCancelledPage.tsx`
- `/mentorship/sessions/:id/feedback` — `pages/SessionFeedbackPage.tsx`

### Dashboard Nested Route (inside `StudentLayout` under `/dashboard`)
- `/dashboard/chat` — `pages/ChatPage.tsx` (with `CompositeScoreCard` sidebar footer)

## Folder Structure

- `pages/` — All 9 mentorship flow pages + `ChatPage`
- `components/` — `MentorshipShell`, `MentorshipTopNav`, `MentorshipParts`, `CancelSessionModal`
- `context/` — `MentorshipContext.tsx`
- `services/` — `mentorshipService.ts` (clean future backend boundary)
- `types/` — `mentorship.ts`
- `utils/` — `mentorship.ts`
- `styles/` — `mentorship.css`
- `locales/` — `en.json` and `ar.json` (namespace: `mentorship`)

## Future Backend Dependencies (`services/mentorshipService.ts`)

- Learner enrollment & mentorship session quota balance
- Track mentor directory & individual mentor available time slots
- Learner bookings list, slot booking & session cancellation (24h cancellation policy)
- Session feedback persistence & real-time mentor chat API/WebSocket
