// Internship journey frames and shared screen types. Which frame the learner sees, and the
// squad, sprint and task data, come from the API (hooks/useInternship, lib/internship).

import avatarBandana from '@/assets/dashboard/avatar-bandana.svg';
import avatarBeanie from '@/assets/dashboard/avatar-beanie.svg';
import avatarCurly from '@/assets/dashboard/avatar-curly.svg';
import avatarGirl from '@/assets/dashboard/avatar-girl.svg';

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

export type ProjectState = JourneyExtras & { kind: 'project'; stepper: StepperState };

export type InternshipState = CoursesState | InterviewReviewState | WaitingState | SquadState | ProjectState;

const coursesStepper = (currentIndex: number): StepperState => ({ firstNumber: 1, currentIndex, withCourses: true });

// One entry per Figma frame in the "3 months" section (31:32160). lib/internship
// (journeyStateId) picks the learner's frame from their enrollment, interview, courses and squad.
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

// Illustrated avatars: the API has no member photos.
export const WAITING_AVATARS: ReadonlyArray<string> = [avatarCurly, avatarGirl, avatarBandana, avatarBeanie];

// Seats shown on the squad screen; a squad with more members shows them all.
export const SQUAD_SEATS = 4;

export const EMPTY_SEAT_AVATAR = avatarBandana;

export const SAMPLE_REQUIRED_COURSES = { percent: 100 };

