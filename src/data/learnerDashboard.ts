// SAMPLE DATA ONLY for the learner Dashboard home (/dashboard). The backend has no
// journey, course progress, task, session, interview-result or squad endpoints yet (only
// /api/auth/* and /api/me*), so the page renders the values of the "Learner dashboard"
// reference. Replace each export with an API call once the contract exists.

export type JourneyStepStatus = 'done' | 'current' | 'upcoming';

export type LearnerJourneyStep = {
  id: 'payment' | 'aiInterview' | 'courses' | 'technicalInterview' | 'internship' | 'recruitment';
  status: JourneyStepStatus;
};

export const SAMPLE_LEARNER_JOURNEY: ReadonlyArray<LearnerJourneyStep> = [
  { id: 'payment', status: 'done' },
  { id: 'aiInterview', status: 'done' },
  { id: 'courses', status: 'current' },
  { id: 'technicalInterview', status: 'upcoming' },
  { id: 'internship', status: 'upcoming' },
  { id: 'recruitment', status: 'upcoming' },
];

export type InterviewLevel = 'junior' | 'mid' | 'senior';

export const SAMPLE_LEARNER_PROGRESS: {
  interviewLevel: InterviewLevel;
  modulesDone: number;
  modulesTotal: number;
  modulesToInterview: number;
  courseName: string;
  currentModule: number;
  coursePercent: number;
} = {
  interviewLevel: 'junior',
  modulesDone: 5,
  modulesTotal: 8,
  // "You're 3 modules away from your technical interview."
  modulesToInterview: 3,
  courseName: 'Backend with .NET',
  currentModule: 6,
  coursePercent: 62,
};

// Local date-times (no zone), shown in the viewer's time zone as written.
export const SAMPLE_TODAY_TASK = { title: 'Build a paginated GET endpoint', dueAt: '2026-10-23T23:59:00' };
export const SAMPLE_NEXT_SESSION = { mentor: 'Eng. Karim Nabil', startsAt: '2026-10-29T21:00:00' };

export type InterviewMetric = {
  id: 'technicalAccuracy' | 'communication' | 'problemSolving' | 'depth';
  score: number;
};

export const INTERVIEW_SCORE_MAX = 10;

export const SAMPLE_INTERVIEW_RESULT: { metrics: ReadonlyArray<InterviewMetric>; focusMetric: InterviewMetric['id'] } = {
  metrics: [
    { id: 'technicalAccuracy', score: 6.8 },
    { id: 'communication', score: 7.5 },
    { id: 'problemSolving', score: 6.1 },
    { id: 'depth', score: 5.4 },
  ],
  // Highlighted in orange and named in the "Focus area" note.
  focusMetric: 'depth',
};

export type LearnerSquadMember = { id: string; name: string; role: string };

export const SAMPLE_SQUAD_SIZE = 10;

// The learner's own row is added by the page (name from the session, else SAMPLE_PROFILE).
export const SAMPLE_LEARNER_SQUAD: ReadonlyArray<LearnerSquadMember> = [
  { id: 'ahmed-samir', name: 'Ahmed Samir', role: 'Backend developer' },
  { id: 'mariam-tarek', name: 'Mariam Tarek', role: 'Frontend developer' },
  { id: 'salma-wael', name: 'Salma Wael', role: 'UI/UX designer' },
  { id: 'karim-ashraf', name: 'Karim Ashraf', role: 'Data analyst' },
];
