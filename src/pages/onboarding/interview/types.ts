// Technical for 3- and 6-month packages; the 12-month package takes an advice-only Orientation
// interview instead (US-2.9).
export type InterviewType = 'technical' | 'orientation';

// Screens inside onboarding Step 07 (Setup), in journey order.
export type SetupScreen = 'setup' | 'overview' | 'consent' | 'device-check' | 'session';

// Screens shown under Step 08 (Result) once the interview has ended.
export type OutcomeScreen =
  | 'result'
  | 'under-review'
  | 'resume'
  | 'cannot-resume'
  | 'orientation'
  | 'appeal-form'
  | 'appeal-submitted'
  | 'appeal-decision';

export type AnswerPhase = 'answering' | 'answered';

// Everything the interview screens need to survive moving between steps. Media streams are not
// kept here: they stop whenever the user leaves the Setup step.
export type InterviewProgress = {
  screen: SetupScreen;
  consented: boolean;
  questionIndex: number;
  phase: AnswerPhase;
  outcome: OutcomeScreen | null;
  appealReason: string;
};

export type InterviewProgressPatch = Partial<InterviewProgress>;

export const INITIAL_INTERVIEW_PROGRESS: InterviewProgress = {
  screen: 'setup',
  consented: false,
  questionIndex: 0,
  phase: 'answering',
  outcome: null,
  appealReason: '',
};
