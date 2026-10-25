// SAMPLE DATA ONLY. The backend has no internship, squad, project, task or subscription
// endpoints yet (only /api/auth/* and /api/me*), so the dashboard renders these Figma
// values. Replace each export with an API call once the contract exists.

import avatarBandana from '@/assets/dashboard/avatar-bandana.svg';
import avatarBeanie from '@/assets/dashboard/avatar-beanie.svg';
import avatarCurly from '@/assets/dashboard/avatar-curly.svg';
import avatarGirl from '@/assets/dashboard/avatar-girl.svg';
import seniorPhoto from '@/assets/dashboard/senior-photo.png';

export type TrackTone = 'uiux' | 'frontend' | 'backend' | 'ai' | 'other';

export type SquadMember = {
  id: string;
  name: string;
  track: string;
  trackTone: TrackTone;
  avatar: string;
  github: string;
  email: string;
};

// Journey stepper (Figma "Header" in every "3 months" frame). The 6- and 12-month packages
// start with their required courses, so their frames ("6 and 12 months", 35:9387) add a
// "Courses" step in front.
export const JOURNEY_STEPS = ['technicalInterview', 'waitingForSquad', 'squadReady', 'project'] as const;
export const COURSES_JOURNEY_STEPS = ['courses', ...JOURNEY_STEPS] as const;
export type JourneyStep = (typeof COURSES_JOURNEY_STEPS)[number];
export type StepperState = {
  // "internship plan 3 and 11" numbers the steps 02–05; the other frames use 01–04.
  firstNumber: number;
  currentIndex: number;
  withCourses?: boolean;
};

// Sidebar "Required Courses Progress" card of the 6- and 12-month frames.
export type RequiredCoursesStatus = 'locked' | 'lockedInterview' | 'lockedReview' | 'unlocked';
export type RequiredCoursesProgress = { percent: number; status: RequiredCoursesStatus };

export type GithubStatus = 'add' | 'invalid' | 'saved';
export type SquadNotice = 'pressReady' | 'youAreReady' | 'allSet';

type JourneyExtras = { requiredCourses?: RequiredCoursesProgress };

// Course stage of the 6- and 12-month packages: "internship plan 6 or 12 incase uncompleted
// courses" (35:9388) and "completed courses" (35:9544).
export type CoursesState = JourneyExtras & { kind: 'courses'; status: 'inProgress' | 'completed'; stepper?: StepperState };

export type InterviewReviewState = JourneyExtras & { kind: 'interviewReview'; stepper: StepperState };

export type WaitingState = JourneyExtras & {
  kind: 'waiting';
  stepper: StepperState;
  packageMonths: 3 | 6 | 12;
  // Package-specific policy is resolved by internshipPackages.ts.
  packageCard: 'timeline' | 'active';
  github: GithubStatus;
  githubUsername: string;
};

export type SquadState = JourneyExtras & {
  kind: 'squad';
  stepper: StepperState;
  notice: SquadNotice;
  hasPressedReady: boolean;
  membersReady: number;
  // "internship plan 3 and 10" (35:12438) fills seat 4.
  isSquadFull?: boolean;
};

export type InternshipState = CoursesState | InterviewReviewState | WaitingState | SquadState;

const coursesStepper = (currentIndex: number): StepperState => ({ firstNumber: 1, currentIndex, withCourses: true });

// One entry per Figma frame in the "3 months" section (31:32160). The page picks one with
// `?state=<id>` so every frame can be reviewed until the API decides the real state.
export const INTERNSHIP_STATES = {
  // "internship plan 6 or 12 incase uncompleted courses" (31:32161)
  'interview-review': { kind: 'interviewReview', stepper: { firstNumber: 1, currentIndex: 0 } },
  // "internship plan 3 and 11" (31:32569)
  'finding-squad': {
    kind: 'waiting',
    stepper: { firstNumber: 1, currentIndex: 1 },
    packageMonths: 3,
    packageCard: 'timeline',
    github: 'add',
    githubUsername: 's.kassem',
  },
  // "internship plan 3 and 12" (31:32719)
  'github-invalid': {
    kind: 'waiting',
    stepper: { firstNumber: 1, currentIndex: 1 },
    packageMonths: 3,
    packageCard: 'timeline',
    github: 'invalid',
    githubUsername: 's.kassem',
  },
  'github-missing': {
    kind: 'waiting',
    stepper: { firstNumber: 1, currentIndex: 1 },
    packageMonths: 3,
    packageCard: 'timeline',
    github: 'add',
    githubUsername: '',
  },
  // "internship plan 14" (31:35111)
  'github-saved': {
    kind: 'waiting',
    stepper: { firstNumber: 1, currentIndex: 1 },
    packageMonths: 3,
    packageCard: 'timeline',
    github: 'saved',
    githubUsername: 's.kassem',
  },
  // "squad completed" (31:32872)
  'squad-ready-check': {
    kind: 'squad',
    stepper: { firstNumber: 1, currentIndex: 2 },
    notice: 'pressReady',
    hasPressedReady: false,
    membersReady: 2,
  },
  // "internship plan 3 and 13" (31:33620)
  'squad-you-ready': {
    kind: 'squad',
    stepper: { firstNumber: 1, currentIndex: 2 },
    notice: 'youAreReady',
    hasPressedReady: true,
    membersReady: 2,
  },
  // Latest 3-month completed squad (49:39516): four seats and four ready members.
  'squad-all-ready': {
    kind: 'squad',
    stepper: { firstNumber: 1, currentIndex: 3 },
    notice: 'allSet',
    hasPressedReady: true,
    membersReady: 4,
    isSquadFull: true,
  },

  // Shared visual states; internshipPackages.ts resolves each package independently.
  // "internship plan 6 or 12 incase uncompleted courses" (35:9388): no stepper in Figma.
  'courses-in-progress': {
    kind: 'courses',
    status: 'inProgress',
    requiredCourses: { percent: 65, status: 'locked' },
  },
  // "completed courses" (35:9544)
  'courses-completed': {
    kind: 'courses',
    status: 'completed',
    stepper: coursesStepper(1),
    requiredCourses: { percent: 100, status: 'lockedInterview' },
  },
  // "interview in review" (35:9725)
  'courses-interview-review': {
    kind: 'interviewReview',
    stepper: coursesStepper(1),
    requiredCourses: { percent: 100, status: 'lockedReview' },
  },
  // "waiting for dquad " (35:10280)
  'courses-finding-squad': {
    kind: 'waiting',
    stepper: coursesStepper(2),
    packageMonths: 6,
    packageCard: 'timeline',
    github: 'add',
    githubUsername: 's.kassem',
    requiredCourses: { percent: 100, status: 'unlocked' },
  },
  // "waiting for squad " (35:13202)
  'courses-github-saved': {
    kind: 'waiting',
    stepper: coursesStepper(2),
    packageMonths: 6,
    packageCard: 'timeline',
    github: 'saved',
    githubUsername: 's.kassem',
    requiredCourses: { percent: 100, status: 'unlocked' },
  },
  // "internship plan 13" (35:13370)
  'courses-github-invalid': {
    kind: 'waiting',
    stepper: coursesStepper(2),
    packageMonths: 6,
    packageCard: 'timeline',
    github: 'invalid',
    githubUsername: 's.kassem',
    requiredCourses: { percent: 100, status: 'unlocked' },
  },
  // "squad completed" (35:10482). The squad frames' sidebar card reads "Locked - Take
  // Technical Interview" at 100%, as in Figma.
  'courses-squad-ready-check': {
    kind: 'squad',
    stepper: coursesStepper(3),
    notice: 'pressReady',
    hasPressedReady: false,
    membersReady: 2,
    requiredCourses: { percent: 100, status: 'lockedInterview' },
  },
  // "internship plan 3 and 9" (35:11672)
  'courses-squad-you-ready': {
    kind: 'squad',
    stepper: coursesStepper(3),
    notice: 'youAreReady',
    hasPressedReady: true,
    membersReady: 3,
    requiredCourses: { percent: 100, status: 'lockedInterview' },
  },
  // "internship plan 3 and 10" (35:12438): 4/4 seats, 4/4 ready.
  'courses-squad-all-ready': {
    kind: 'squad',
    stepper: coursesStepper(4),
    notice: 'allSet',
    hasPressedReady: true,
    membersReady: 4,
    isSquadFull: true,
    requiredCourses: { percent: 100, status: 'lockedInterview' },
  },
} as const satisfies Record<string, InternshipState>;

export type InternshipStateId = keyof typeof INTERNSHIP_STATES;
export const DEFAULT_INTERNSHIP_STATE: InternshipStateId = 'finding-squad';

export const SAMPLE_INTERNSHIP = {
  track: 'UI/UX',
  levelKey: 'intermediate',
  waitingSince: '2026-10-20',
  waitingDay: 3,
};

export const WAITING_AVATARS: ReadonlyArray<string> = [avatarCurly, avatarGirl, avatarBandana, avatarBeanie];

export const SQUAD_SEATS = 4;

// Seat 4 is still empty in Figma ("Member 4", "TRACK 4", "Username", "Gmail address").
export const SAMPLE_SQUAD: ReadonlyArray<SquadMember | null> = [
  { id: 'merna', name: 'Merna Adel', track: 'UI/UX', trackTone: 'uiux', avatar: avatarGirl, github: 'Merna.Adel2', email: 'Merna22adel@gmail.com' },
  { id: 'ahmed', name: 'Ahmed Ali', track: 'FRONTEND', trackTone: 'frontend', avatar: avatarCurly, github: 'Merna.Adel2', email: 'Merna22adel@gmail.com' },
  { id: 'sama', name: 'Sama Kassem', track: 'AI', trackTone: 'ai', avatar: avatarBeanie, github: 'Merna.Adel2', email: 'Merna22adel@gmail.com' },
  null,
];
// "internship plan 3 and 10" (35:12438): seat 4 is Ali Ahmed (Backend).
export const SAMPLE_FULL_SQUAD: ReadonlyArray<SquadMember> = [
  ...SAMPLE_SQUAD.filter((member): member is SquadMember => member !== null),
  { id: 'ali', name: 'Ali Ahmed', track: 'Backend', trackTone: 'backend', avatar: avatarBandana, github: 'Merna.Adel2', email: 'Merna22adel@gmail.com' },
];
export const EMPTY_SEAT_AVATAR = avatarBandana;

export const SAMPLE_SENIOR = { name: 'AHMED AHMED ALI', projectName: 'Ahmed Ali Ali', photo: seniorPhoto };

export const SAMPLE_PROJECT = {
  name: 'TaskFlow — Task Management App',
  description:
    'Build a task management application where users can organize tasks, track progress, and collaborate with their team.',
  sprintCount: 4,
};

// Project page team row ("project", 31:35295).
export const SAMPLE_PROJECT_TEAM: ReadonlyArray<SquadMember> = [
  { id: 'merna', name: 'Merna Adel', track: 'UI/UX', trackTone: 'uiux', avatar: avatarGirl, github: '', email: '' },
  { id: 'ali', name: 'Ali Ahmed', track: 'Backend', trackTone: 'backend', avatar: avatarBandana, github: '', email: '' },
  { id: 'ahmed', name: 'Ahmed Ali', track: 'FRONTEND', trackTone: 'frontend', avatar: avatarCurly, github: '', email: '' },
  { id: 'sama', name: 'Sama Kassem', track: 'AI', trackTone: 'ai', avatar: avatarBeanie, github: '', email: '' },
];

export const SAMPLE_SPRINT = {
  number: 4,
  startDate: '2026-10-10',
  endDate: '2026-10-17',
  daysLeft: 4,
  goal: 'Build the core task management features.',
  // Figma shows "45 %" next to "4 of 11 tasks done"; both values are kept as designed.
  progressPercent: 45,
  totalTasks: 11,
  completedTasks: 4,
  remainingTasks: 7,
  storyPoints: 45,
};

export type ProjectLink = { id: string; label: string; provider: string; owner: string; url?: string };

// No link URLs exist in the design, so the items render without an href.
export const SAMPLE_PROJECT_LINKS: ReadonlyArray<ProjectLink> = [
  { id: 'uiux', label: 'UI/UX Link', provider: 'Figma', owner: 'Merna adel' },
  { id: 'frontend-1', label: 'frontend Link', provider: 'github', owner: 'Ahmed ali' },
  { id: 'frontend-2', label: 'Frontend Link', provider: 'github', owner: 'Ahmed ali' },
  { id: 'backend', label: 'Backend Link', provider: 'github', owner: 'Ali ahmed' },
  { id: 'ai', label: 'AI Link', provider: 'github', owner: 'Ahmed ali' },
  { id: 'project', label: 'Project Link', provider: 'github', owner: 'Ali ahmed' },
];

export type TaskStatus = 'todo' | 'inProgress' | 'inReview' | 'completed';

export const SAMPLE_MY_TASK_COUNTS: Readonly<Record<'todo' | 'inProgress' | 'inReview', number>> = {
  todo: 2,
  inProgress: 1,
  inReview: 2,
};

export const SAMPLE_TOP_TASKS: ReadonlyArray<{ id: number; title: string; status: Exclude<TaskStatus, 'completed'> }> = [
  { id: 12, title: 'Build Login Page', status: 'inReview' },
  { id: 15, title: 'Create Task List UI', status: 'inProgress' },
  { id: 18, title: 'Set Up Routing', status: 'todo' },
];

export type BoardTask = { key: string; id: number; title: string; track: string; assigneeId?: string; storyPoints?: number; changesRequested?: boolean };
export const SAMPLE_BOARD_STUDENT_ID = 'merna';

function placeholderTasks(prefix: string, count: number): ReadonlyArray<BoardTask> {
  // Every Figma board card reads "Task # 17 / Create Task List UI / UI/UX".
  return Array.from({ length: count }, (_, index) => ({
    key: `${prefix}-${index}`,
    id: 17,
    title: 'Create Task List UI',
    track: 'UI/UX',
    assigneeId: SAMPLE_BOARD_STUDENT_ID,
    storyPoints: 2,
    changesRequested: prefix === 'progress' && index === 1,
  }));
}

export const SAMPLE_TASK_BOARD: Readonly<Record<TaskStatus, ReadonlyArray<BoardTask>>> = {
  todo: placeholderTasks('todo', 5),
  inProgress: placeholderTasks('progress', 2),
  inReview: placeholderTasks('review', 2),
  completed: placeholderTasks('done', 4),
};

export const SAMPLE_REQUIRED_COURSES = { percent: 100 };

// Fallback profile for the top bar when nobody is signed in (Figma "Top Nav").
export const SAMPLE_PROFILE = { name: 'Merna Adel', subtitle: 'UI/UX Designer' };
