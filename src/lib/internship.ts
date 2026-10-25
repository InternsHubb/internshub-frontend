import { WAITING_AVATARS, type InternshipStateId, type RequiredCoursesProgress, type SquadMember, type TrackTone } from '@/data/internshipDashboard';
import type { InternshipPlan } from '@/data/internshipPackages';
import type { CourseSummaryDto, InterviewDto, InterviewLevel, SquadDetailsDto, SquadTaskStatus } from '@/lib/api/types';

// Pure mapping from the enrollments, interviews, courses and squads API to the internship
// journey screens (which journey frame to show, squad members, task columns).

const DAY_MS = 24 * 60 * 60 * 1000;

export function planForMonths(months: number): InternshipPlan {
  if (months <= 3) return '3m';
  return months <= 6 ? '6m' : '12m';
}

// Statuses after which the technical interview needs no more answers from the learner.
const FINISHED = new Set<InterviewDto['status']>(['Completed', 'PendingReview', 'AutoConfirmed', 'Reviewed']);

export function latestTechnicalInterview(interviews: InterviewDto[]): InterviewDto | null {
  return [...interviews]
    .filter((item) => item.type === 'Technical')
    .sort((a, b) => b.startedAt.localeCompare(a.startedAt))[0] ?? null;
}

// Share of the track's lessons the learner completed, or null when the track has no lessons.
export function coursesPercent(courses: CourseSummaryDto[]): number | null {
  const total = courses.reduce((sum, course) => sum + course.lessonCount, 0);
  if (total === 0) return null;
  const done = courses.reduce((sum, course) => sum + Math.min(course.completedLessonsCount ?? 0, course.lessonCount), 0);
  return Math.round((done / total) * 100);
}

type JourneyInput = {
  plan: InternshipPlan;
  interview: InterviewDto | null;
  squad: SquadDetailsDto | null;
  coursesPercent: number | null;
};

// Journey frame for the learner's current step. 6- and 12-month packages start with their
// track courses; then the technical interview, the waiting list, the squad and the project.
export function journeyStateId({ plan, interview, squad, coursesPercent: percent }: JourneyInput): InternshipStateId {
  if (squad) return squad.status === 'Forming' ? 'squad-ready-check' : 'squad-all-ready';
  const withCourses = plan !== '3m';
  if (withCourses && (percent ?? 0) < 100) return 'courses-in-progress';
  if (!interview || !FINISHED.has(interview.status)) return withCourses ? 'courses-completed' : 'interview-review';
  return interview.result ? 'finding-squad' : 'interview-review';
}

// Sidebar "Required Courses Progress" card for packages with courses.
export function requiredCoursesFor(stateId: InternshipStateId, percent: number | null): RequiredCoursesProgress {
  const value = percent ?? 0;
  if (stateId === 'courses-in-progress') return { percent: value, status: 'locked' };
  if (stateId === 'courses-completed') return { percent: value, status: 'lockedInterview' };
  if (stateId === 'interview-review') return { percent: value, status: 'lockedReview' };
  return { percent: value, status: 'unlocked' };
}

// "Mid" → "mid": the onboarding.interview.levels.* translation keys.
export function levelKey(level: InterviewLevel): string {
  return `${level.charAt(0).toLowerCase()}${level.slice(1)}`;
}

// Day 1 is the day the learner joined the waiting list.
export function waitingDay(since: string, now: number): number {
  return Math.max(1, Math.floor((now - new Date(since).getTime()) / DAY_MS) + 1);
}

export function trackTone(code: string): TrackTone {
  const value = code.toLowerCase();
  if (/ui|ux|design/.test(value)) return 'uiux';
  if (/front/.test(value)) return 'frontend';
  if (/back/.test(value)) return 'backend';
  if (/ai|data|ml/.test(value)) return 'ai';
  return 'other';
}

// The API gives members' names and emails only (no photo or GitHub username), so each member
// gets one of the illustrated avatars and the squad's track.
export function toSquadMembers(squad: SquadDetailsDto): SquadMember[] {
  return [...squad.members]
    .sort((a, b) => a.joinedAt.localeCompare(b.joinedAt))
    .map((member, index) => ({
      id: member.userId,
      name: member.fullName?.trim() || member.email || '',
      track: squad.trackName,
      trackTone: trackTone(squad.trackCode),
      avatar: WAITING_AVATARS[index % WAITING_AVATARS.length],
      github: '',
      email: member.email ?? '',
    }));
}

export type BoardColumn = 'todo' | 'inProgress' | 'inReview' | 'completed';

export const COLUMN_FOR_STATUS: Record<SquadTaskStatus, BoardColumn> = {
  Todo: 'todo',
  InProgress: 'inProgress',
  InReview: 'inReview',
  Done: 'completed',
};

export const STATUS_FOR_COLUMN: Record<BoardColumn, SquadTaskStatus> = {
  todo: 'Todo',
  inProgress: 'InProgress',
  inReview: 'InReview',
  completed: 'Done',
};

export function daysLeft(endsAt: string, now: number): number {
  return Math.max(0, Math.ceil((new Date(endsAt).getTime() - now) / DAY_MS));
}
