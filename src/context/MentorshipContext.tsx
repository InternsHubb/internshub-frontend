import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { apiErrorKey } from '@/lib/api/errors';
import { bookMentorSlot, cancelMyBooking, getMentors, getMentorSlots, getMyBookings } from '@/lib/api/mentors';
import { getMyEnrollments, getPackages } from '@/lib/api/packages';
import { getTracks } from '@/lib/api/tracks';
import type { MentorBookingDto, MentorSlotDto, MentorSummaryDto, PackageDto, TrackSummaryDto } from '@/lib/api/types';
import { currentEnrollment, sortSessions, toBalance, toMentor, toSession, toSlots } from '@/lib/mentorship';
import type { Mentor, MentorSlot, MentorshipBalance, MentorshipSession } from '@/types/mentorship';

// Mentorship data for the /mentorship screens, from the backend:
// - The learner's track and package come from their enrollment (GET /api/me/enrollments),
//   with names from GET /api/tracks and the Mentorship session quota from GET /api/packages.
// - Mentors for that track (GET /api/mentors?trackId=…) and each mentor's open slots
//   (GET /api/mentors/{id}/slots).
// - Sessions are the learner's bookings (GET /api/me/bookings). Booking a slot
//   (POST …/slots/{slotId}/book) and cancelling (POST /api/me/bookings/{id}/cancel) reload them.
// The backend has no session-topic, balance or feedback endpoints: the balance is worked out from
// the package quota and bookings, and there is no topic or feedback to store.

interface BookingDraft {
  mentor: Mentor;
  slot: MentorSlot;
}

type LoadStatus = 'loading' | 'ready' | 'error';

type RawData = {
  trackId: string | null;
  trackName: string | null;
  pkg: PackageDto | undefined;
  tracks: TrackSummaryDto[];
  mentors: MentorSummaryDto[];
  slots: Map<string, MentorSlotDto[] | null>;
  bookings: MentorBookingDto[];
};

interface MentorshipContextType {
  status: LoadStatus;
  errorKey: string | null;
  reload: () => void;
  trackName: string | null;
  mentors: Mentor[];
  sessions: MentorshipSession[];
  balance: MentorshipBalance | null;
  draft: BookingDraft | null;
  setBookingDraft: (draft: BookingDraft | null) => void;
  // Books the draft's slot; resolves with the new session. Throws the API error on failure.
  confirmBooking: () => Promise<MentorshipSession>;
  cancelSession: (sessionId: string) => Promise<void>;
  reminderDismissed: boolean;
  dismissReminder: () => void;
  getSessionById: (id: string) => MentorshipSession | undefined;
  getMentorById: (id: string) => Mentor | undefined;
}

const MentorshipContext = createContext<MentorshipContextType | undefined>(undefined);

async function loadSlots(mentors: MentorSummaryDto[]): Promise<Map<string, MentorSlotDto[] | null>> {
  const results = await Promise.allSettled(mentors.map((mentor) => getMentorSlots(mentor.userId)));
  return new Map(mentors.map((mentor, index) => {
    const result = results[index];
    return [mentor.userId, result.status === 'fulfilled' ? result.value : null];
  }));
}

async function loadAll(): Promise<RawData> {
  const [enrollments, tracks, packages, bookings] = await Promise.all([
    getMyEnrollments(),
    getTracks(),
    getPackages(),
    getMyBookings(),
  ]);
  const enrollment = currentEnrollment(enrollments);
  const trackId = enrollment?.trackId ?? null;
  const mentors = await getMentors(trackId ? { trackId } : undefined);
  return {
    trackId,
    trackName: tracks.find((track) => track.id === trackId)?.name ?? null,
    pkg: packages.find((item) => item.id === enrollment?.packageId),
    tracks,
    mentors,
    slots: await loadSlots(mentors),
    bookings,
  };
}

export const MentorshipProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { i18n } = useTranslation();
  const language = i18n.language;
  const [raw, setRaw] = useState<RawData | null>(null);
  const [status, setStatus] = useState<LoadStatus>('loading');
  const [errorKey, setErrorKey] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  const [draft, setDraft] = useState<BookingDraft | null>(null);
  const [reminderDismissed, setReminderDismissed] = useState(false);

  useEffect(() => {
    let active = true;
    setStatus((current) => (current === 'ready' ? current : 'loading'));
    loadAll()
      .then((data) => {
        if (!active) return;
        setRaw(data);
        setStatus('ready');
        setErrorKey(null);
      })
      .catch((error: unknown) => {
        if (!active) return;
        setErrorKey(apiErrorKey(error));
        setStatus('error');
      });
    return () => {
      active = false;
    };
  }, [attempt]);

  const reload = useCallback(() => setAttempt((value) => value + 1), []);

  const view = useMemo(() => {
    if (!raw) return { mentors: [] as Mentor[], sessions: [] as MentorshipSession[], balance: null };
    const now = Date.now();
    const sessions = sortSessions(raw.bookings.map((booking) => toSession(booking, language, now)));
    const bookedSlotIds = new Set(raw.bookings.filter((booking) => booking.status === 'Booked').map((booking) => booking.slotId));
    const mentors = raw.mentors.map((mentor) => {
      const slots = raw.slots.get(mentor.userId);
      return {
        ...toMentor(mentor, raw.tracks),
        slots: slots ? toSlots(slots, bookedSlotIds, language, now) : [],
        slotsError: slots === null,
      };
    });
    return { mentors, sessions, balance: toBalance(raw.pkg, sessions) };
  }, [raw, language]);

  // Reloads the bookings and the booked mentor's slots after a booking change.
  const refreshBookings = useCallback(async (mentorId?: string) => {
    const [bookings, slots] = await Promise.all([
      getMyBookings(),
      mentorId ? getMentorSlots(mentorId).catch(() => null) : Promise.resolve(undefined),
    ]);
    setRaw((current) => {
      if (!current) return current;
      const nextSlots = new Map(current.slots);
      if (mentorId && slots !== undefined) nextSlots.set(mentorId, slots);
      return { ...current, bookings, slots: nextSlots };
    });
    return bookings;
  }, []);

  const confirmBooking = useCallback(async (): Promise<MentorshipSession> => {
    if (!draft) throw new Error('No draft booking found');
    const booking = await bookMentorSlot(draft.mentor.id, draft.slot.id);
    const bookings = await refreshBookings(draft.mentor.id).catch(() => null);
    const saved = bookings?.find((item) => item.id === booking.id) ?? booking;
    setDraft(null);
    return toSession(saved, language, Date.now());
  }, [draft, language, refreshBookings]);

  const cancelSession = useCallback(async (sessionId: string) => {
    const session = view.sessions.find((item) => item.id === sessionId);
    await cancelMyBooking(sessionId);
    await refreshBookings(session?.mentorId).catch(() => undefined);
  }, [refreshBookings, view.sessions]);

  const value: MentorshipContextType = {
    status,
    errorKey,
    reload,
    trackName: raw?.trackName ?? null,
    mentors: view.mentors,
    sessions: view.sessions,
    balance: view.balance,
    draft,
    setBookingDraft: setDraft,
    confirmBooking,
    cancelSession,
    reminderDismissed,
    dismissReminder: () => setReminderDismissed(true),
    getSessionById: (id) => view.sessions.find((item) => item.id === id),
    getMentorById: (id) => view.mentors.find((item) => item.id === id),
  };

  return <MentorshipContext.Provider value={value}>{children}</MentorshipContext.Provider>;
};

export const useMentorship = () => {
  const context = useContext(MentorshipContext);
  if (!context) {
    throw new Error('useMentorship must be used within a MentorshipProvider');
  }
  return context;
};
