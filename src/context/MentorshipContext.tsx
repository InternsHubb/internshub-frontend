import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_BALANCE,
  INITIAL_MENTORS,
  INITIAL_SESSIONS,
} from '@/data/mentorshipData';
import type {
  Mentor,
  MentorSlot,
  MentorshipBalance,
  MentorshipSession,
} from '@/types/mentorship';

interface BookingDraft {
  mentor: Mentor;
  slot: MentorSlot;
  topic: string;
  subtopic?: string;
}

interface MentorshipContextType {
  mentors: Mentor[];
  sessions: MentorshipSession[];
  balance: MentorshipBalance;
  draft: BookingDraft | null;
  reminderDismissed: boolean;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  dismissReminder: () => void;
  setBookingDraft: (draft: BookingDraft | null) => void;
  confirmBooking: () => MentorshipSession;
  cancelSession: (sessionId: string, isLate: boolean) => void;
  submitFeedback: (sessionId: string, rating: number, feedback: string) => void;
  getSessionById: (id: string) => MentorshipSession | undefined;
  getMentorById: (id: string) => Mentor | undefined;
}

const MentorshipContext = createContext<MentorshipContextType | undefined>(undefined);

export const MentorshipProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mentors] = useState<Mentor[]>(INITIAL_MENTORS);
  const [sessions, setSessions] = useState<MentorshipSession[]>(() => {
    const saved = localStorage.getItem('mentorship_sessions_v2');
    return saved ? JSON.parse(saved) : INITIAL_SESSIONS;
  });
  const [balance, setBalance] = useState<MentorshipBalance>(() => {
    const saved = localStorage.getItem('mentorship_balance_v2');
    return saved ? JSON.parse(saved) : INITIAL_BALANCE;
  });
  const [draft, setDraft] = useState<BookingDraft | null>(() => {
    const defaultMentor = INITIAL_MENTORS[0];
    const defaultSlot = defaultMentor.slots[0];
    return {
      mentor: defaultMentor,
      slot: defaultSlot,
      topic: 'React state management in a large application',
      subtopic: 'Architecture & modularization focus',
    };
  });
  const [reminderDismissed, setReminderDismissed] = useState<boolean>(false);
  const [isDarkMode] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem('mentorship_sessions_v2', JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem('mentorship_balance_v2', JSON.stringify(balance));
  }, [balance]);

  const toggleDarkMode = () => {};
  const dismissReminder = () => setReminderDismissed(true);

  const setBookingDraft = (d: BookingDraft | null) => {
    setDraft(d);
  };

  const confirmBooking = (): MentorshipSession => {
    if (!draft) {
      throw new Error('No draft booking found');
    }

    const newSession: MentorshipSession = {
      id: `session-${Date.now()}`,
      sessionNumber: sessions.filter((s) => s.status === 'Upcoming').length + 1,
      mentorId: draft.mentor.id,
      mentorName: draft.mentor.name,
      mentorRole: draft.mentor.role,
      mentorAvatar: draft.mentor.avatarUrl,
      month: 'OCT',
      day: '1',
      fullDate: draft.slot.date,
      time: draft.slot.time,
      duration: draft.slot.duration,
      topic: draft.topic || 'React state management in a large application',
      subtopic: draft.subtopic || 'Architecture & modularization focus',
      status: 'Upcoming',
      meetingLink: 'https://meet.google.com/abc-defg-hij',
      isStartingSoon: false,
    };

    setSessions((prev) => [newSession, ...prev]);
    setBalance((prev) => ({
      ...prev,
      remaining: Math.max(0, prev.remaining - 1),
    }));

    return newSession;
  };

  const cancelSession = (sessionId: string, isLate: boolean) => {
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id === sessionId) {
          return {
            ...s,
            status: 'Cancelled',
            cancelledAt: new Date().toISOString(),
            isLateCancellation: isLate,
          };
        }
        return s;
      })
    );

    // If cancellation is on-time (>24 hours), return credit to balance!
    if (!isLate) {
      setBalance((prev) => ({
        ...prev,
        remaining: Math.min(prev.total, prev.remaining + 1),
      }));
    }
  };

  const submitFeedback = (sessionId: string, rating: number, feedback: string) => {
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id === sessionId) {
          return {
            ...s,
            status: 'Completed',
            rating,
            feedback,
          };
        }
        return s;
      })
    );
  };

  const getSessionById = (id: string) => {
    return sessions.find((s) => s.id === id);
  };

  const getMentorById = (id: string) => {
    return mentors.find((m) => m.id === id);
  };

  return (
    <MentorshipContext.Provider
      value={{
        mentors,
        sessions,
        balance,
        draft,
        reminderDismissed,
        isDarkMode,
        toggleDarkMode,
        dismissReminder,
        setBookingDraft,
        confirmBooking,
        cancelSession,
        submitFeedback,
        getSessionById,
        getMentorById,
      }}
    >
      {children}
    </MentorshipContext.Provider>
  );
};

export const useMentorship = () => {
  const context = useContext(MentorshipContext);
  if (!context) {
    throw new Error('useMentorship must be used within a MentorshipProvider');
  }
  return context;
};
