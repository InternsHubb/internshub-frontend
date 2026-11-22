import type {
  MentorshipEnrollmentDto as EnrollmentDto,
  MentorBookingDto,
  MentorSlotDto,
  MentorSummaryDto,
  MentorshipPackageDto as PackageDto,
  MentorshipTrackDto as TrackSummaryDto,
} from '@/features/mentorship/services/mentorshipService';
import { safeHttpUrl } from '@/shared/utils/url';
import type { Mentor, MentorSlot, MentorshipBalance, MentorshipSession } from '@/features/mentorship/types/mentorship';

// Pure mapping from the mentors, bookings and packages API to the mentorship screens' models.

const MINUTE_MS = 60_000;
// Cancelling less than this long before the start keeps the session credit used (shown policy).
export const LATE_CANCELLATION_MS = 24 * 60 * MINUTE_MS;

// The enrollment mentorship belongs to: the active one, else the most recently chosen live one.
export function currentEnrollment(enrollments: EnrollmentDto[]): EnrollmentDto | null {
  const live = enrollments.filter((item) => item.status !== 'Cancelled' && item.status !== 'Expired');
  const active = live.find((item) => item.status === 'Active');
  if (active) return active;
  return [...live].sort((a, b) => b.chosenAt.localeCompare(a.chosenAt))[0] ?? null;
}

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

function localDayKey(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

type Formatted = {
  dayKey: string;
  weekday: string;
  dayOfMonth: string;
  month: string;
  date: string;
  time: string;
  duration: string;
};

export function formatRange(startsAt: string, endsAt: string, language: string): Formatted {
  const start = new Date(startsAt);
  const end = new Date(endsAt);
  const minutes = Math.max(0, Math.round((end.getTime() - start.getTime()) / MINUTE_MS));
  const time = new Intl.DateTimeFormat(language, { hour: 'numeric', minute: '2-digit' });
  return {
    dayKey: localDayKey(start),
    weekday: new Intl.DateTimeFormat(language, { weekday: 'short' }).format(start),
    dayOfMonth: new Intl.DateTimeFormat(language, { day: 'numeric' }).format(start),
    month: new Intl.DateTimeFormat(language, { month: 'short' }).format(start),
    date: new Intl.DateTimeFormat(language, { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' }).format(start),
    time: `${time.format(start)} – ${time.format(end)}`,
    duration: new Intl.NumberFormat(language, { style: 'unit', unit: 'minute', unitDisplay: 'short' }).format(minutes),
  };
}

// Open slots that haven't started, soonest first, without slots the learner already booked.
export function toSlots(slots: MentorSlotDto[], bookedSlotIds: Set<string>, language: string, now: number): MentorSlot[] {
  return slots
    .filter((slot) => !slot.isBlocked && !bookedSlotIds.has(slot.id) && new Date(slot.startsAt).getTime() > now)
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt))
    .map((slot) => {
      const formatted = formatRange(slot.startsAt, slot.endsAt, language);
      return {
        id: slot.id,
        startsAt: slot.startsAt,
        endsAt: slot.endsAt,
        dayKey: formatted.dayKey,
        weekday: formatted.weekday,
        dayOfMonth: formatted.dayOfMonth,
        date: formatted.date,
        time: formatted.time,
        duration: formatted.duration,
      };
    });
}

export function toMentor(mentor: MentorSummaryDto, tracks: TrackSummaryDto[]): Omit<Mentor, 'slots' | 'slotsError'> {
  const names = new Map(tracks.map((track) => [track.id, track.name]));
  return {
    id: mentor.userId,
    name: mentor.fullName,
    bio: mentor.bio,
    trackNames: mentor.trackIds.map((id) => names.get(id)).filter((name): name is string => Boolean(name)),
  };
}

export function isLateCancellation(booking: Pick<MentorBookingDto, 'startsAt' | 'cancelledAt'>): boolean {
  if (!booking.cancelledAt) return false;
  return new Date(booking.startsAt).getTime() - new Date(booking.cancelledAt).getTime() < LATE_CANCELLATION_MS;
}

export function toSession(booking: MentorBookingDto, language: string, now: number): MentorshipSession {
  const formatted = formatRange(booking.startsAt, booking.endsAt, language);
  const status = booking.status === 'Cancelled'
    ? 'Cancelled'
    : new Date(booking.endsAt).getTime() <= now ? 'Completed' : 'Upcoming';
  return {
    id: booking.id,
    mentorId: booking.mentorUserId,
    mentorName: booking.mentorName ?? '',
    startsAt: booking.startsAt,
    endsAt: booking.endsAt,
    month: formatted.month,
    day: formatted.dayOfMonth,
    fullDate: formatted.date,
    time: formatted.time,
    duration: formatted.duration,
    status,
    meetingUrl: safeHttpUrl(booking.meetingUrl),
    cancelledAt: booking.cancelledAt,
    isLateCancellation: isLateCancellation(booking),
  };
}

// Upcoming sessions first (soonest first), then past ones (latest first).
export function sortSessions(sessions: MentorshipSession[]): MentorshipSession[] {
  const upcoming = sessions.filter((item) => item.status === 'Upcoming').sort((a, b) => a.startsAt.localeCompare(b.startsAt));
  const rest = sessions.filter((item) => item.status !== 'Upcoming').sort((a, b) => b.startsAt.localeCompare(a.startsAt));
  return [...upcoming, ...rest];
}

// Booked sessions and late cancellations use a credit; on-time cancellations don't.
export function toBalance(pkg: PackageDto | undefined, sessions: MentorshipSession[]): MentorshipBalance | null {
  const quota = pkg?.stages.find((stage) => stage.featureType === 'Mentorship')?.sessionQuota;
  if (!pkg || quota === null || quota === undefined) return null;
  const used = sessions.filter((item) => item.status !== 'Cancelled' || item.isLateCancellation).length;
  const completed = sessions.filter((item) => item.status === 'Completed').length;
  return { total: quota, used, completed, remaining: Math.max(0, quota - used), packageName: pkg.name };
}
