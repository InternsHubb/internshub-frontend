// Mentorship view models, built from the mentors and bookings API (see context/MentorshipContext).
// Dates are already formatted for the learner's language and local time zone.

export interface MentorSlot {
  id: string;
  startsAt: string;
  endsAt: string;
  // Local calendar day (YYYY-MM-DD), used to group slots by date.
  dayKey: string;
  weekday: string;
  dayOfMonth: string;
  date: string;
  time: string;
  duration: string;
}

export interface Mentor {
  id: string;
  name: string;
  bio: string;
  trackNames: string[];
  // Open, future slots, soonest first. Empty when the mentor has none or they failed to load.
  slots: MentorSlot[];
  slotsError: boolean;
}

export type SessionStatus = 'Upcoming' | 'Completed' | 'Cancelled';

export interface MentorshipSession {
  id: string;
  mentorId: string;
  mentorName: string;
  startsAt: string;
  endsAt: string;
  month: string;
  day: string;
  fullDate: string;
  time: string;
  duration: string;
  status: SessionStatus;
  // Only an http(s) URL from the backend; null until the mentor has set one.
  meetingUrl: string | null;
  cancelledAt: string | null;
  // Cancelled less than 24 hours before the start, so the session credit is used.
  isLateCancellation: boolean;
}

// From the Mentorship stage quota of the learner's package and their bookings.
export interface MentorshipBalance {
  total: number;
  used: number;
  completed: number;
  remaining: number;
  packageName: string;
}
