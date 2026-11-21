import { useCallback, useEffect, useSyncExternalStore } from 'react';

import { PACKAGE_JOURNEYS, type InternshipPlan } from '@/features/internships/data/internshipPackages';
import type { InternshipState, InternshipStateId } from '@/features/internships/data/internshipDashboard';
import { useAuth } from '@/shared/auth';
import { BackendError, getBackendErrorKey } from '@/backend';
import {
  getMyEnrollments,
  getMyInterviews,
  getMySquad,
  getPackages,
  getTrackCourses,
  getTracks,
} from '@/features/internships/services/internshipsService';
import type { EnrollmentDto, InterviewLevel, SquadDetailsDto } from '@/features/internships/types/internships.types';
import { coursesPercent, journeyStateId, latestTechnicalInterview, planForMonths, requiredCoursesFor } from '@/features/internships/utils/internship';

// The learner's internship journey, loaded once per session and shared by the internship page,
// the project page and their sidebar footers:
//   GET /api/me/enrollments (the active one) + /api/packages (its length) + /api/tracks,
//   GET /api/me/interviews (latest technical interview and its level),
//   GET /api/me/squad (404 while on the waiting list),
//   GET /api/courses?trackId (lesson progress) for packages that start with courses.

export type InternshipData = {
  enrollment: EnrollmentDto;
  plan: InternshipPlan;
  months: number;
  trackName: string;
  level: InterviewLevel | null;
  // When the learner joined the waiting list (payment, else start or choice of the package).
  waitingSince: string;
  squad: SquadDetailsDto | null;
  coursesPercent: number | null;
  stateId: InternshipStateId;
  state: InternshipState;
};

// `none`: no active (paid) enrollment, so there is no internship journey yet.
type Status = 'loading' | 'ready' | 'none' | 'error';
type Snapshot = { status: Status; data: InternshipData | null; errorKey: string | null };

const LOADING: Snapshot = { status: 'loading', data: null, errorKey: null };

let snapshot: Snapshot = LOADING;
let loadedFor: string | null = null;
const listeners = new Set<() => void>();

function publish(next: Snapshot) {
  snapshot = next;
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

async function getSquadOrNull(): Promise<SquadDetailsDto | null> {
  try {
    return (await getMySquad()) ?? null;
  } catch (error) {
    if (error instanceof BackendError && error.status === 404) return null;
    throw error;
  }
}

async function fetchInternship(): Promise<InternshipData | null> {
  const [enrollments, packages, tracks, interviews, squad] = await Promise.all([
    getMyEnrollments(),
    getPackages(),
    getTracks(),
    getMyInterviews(),
    getSquadOrNull(),
  ]);
  const enrollment = enrollments.find((item) => item.status === 'Active');
  if (!enrollment) return null;

  const months = packages.find((item) => item.id === enrollment.packageId)?.durationMonths ?? 3;
  const plan = planForMonths(months);
  const percent = plan === '3m' ? null : coursesPercent(await getTrackCourses(enrollment.trackId));
  const interview = latestTechnicalInterview(interviews);
  const stateId = journeyStateId({ plan, interview, squad, coursesPercent: percent });
  const base = PACKAGE_JOURNEYS[plan][stateId];
  const state: InternshipState = plan === '3m' ? base : { ...base, requiredCourses: requiredCoursesFor(stateId, percent) };

  return {
    enrollment,
    plan,
    months,
    trackName: tracks.find((track) => track.id === enrollment.trackId)?.name ?? squad?.trackName ?? '',
    level: interview?.result?.level ?? null,
    waitingSince: enrollment.paidAt ?? enrollment.startedAt ?? enrollment.chosenAt,
    squad,
    coursesPercent: percent,
    stateId,
    state,
  };
}

function load(sessionId: string) {
  loadedFor = sessionId;
  publish(LOADING);
  fetchInternship().then(
    (data) => {
      if (loadedFor !== sessionId) return;
      publish(data ? { status: 'ready', data, errorKey: null } : { status: 'none', data: null, errorKey: null });
    },
    (error: unknown) => {
      if (loadedFor !== sessionId) return;
      publish({ status: 'error', data: null, errorKey: getBackendErrorKey(error) });
    },
  );
}

export function useInternship(): Snapshot & { reload: () => void } {
  const { status: authStatus, user } = useAuth();
  const current = useSyncExternalStore(subscribe, () => snapshot, () => snapshot);
  const sessionId = authStatus === 'authenticated' ? user?.id ?? 'authenticated' : null;

  useEffect(() => {
    if (sessionId && loadedFor !== sessionId) load(sessionId);
  }, [sessionId]);

  const reload = useCallback(() => {
    if (sessionId) load(sessionId);
  }, [sessionId]);

  if (!sessionId) {
    return { status: 'none', data: null, errorKey: null, reload };
  }

  // Another session's data is never shown while this one loads.
  const isCurrent = loadedFor === sessionId;
  return { ...(isCurrent ? current : LOADING), reload };
}
