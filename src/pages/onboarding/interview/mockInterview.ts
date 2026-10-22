// LOCAL PLACEHOLDER DATA — not from the backend, an AI or a reviewer.
//
// The AI Interview API contract has not been published yet, so the interview screens are built
// against these fixed sample values. Every screen that shows one of them labels it as a sample.
// When the API arrives, replace this module with real session, question, result and appeal data;
// the screens only read the shapes below.

import type { InterviewType } from './types';

// Keys under `onboarding.interview.sample.questions` in the locale files.
export const SAMPLE_QUESTION_KEYS = ['q1', 'q2', 'q3'] as const;

// Keys under `onboarding.interview.levels`.
export type LevelKey = 'junior' | 'mid';

export const SAMPLE_RESULT: { level: LevelKey; appealedLevel: LevelKey } = {
  level: 'junior',
  appealedLevel: 'mid',
};

// Rules from US-2.4 / US-2.5 / US-2.6. The remaining values are sample countdowns.
export const RESUME_WINDOW_HOURS = 1;
export const RESUMES_ALLOWED = 3;
export const RETAKE_AFTER_HOURS = 48;
export const APPEAL_WINDOW_DAYS = 7;
export const APPEAL_REASON_MAX_LENGTH = 500;

// `questionIndex` is where a resumed sample interview picks up (zero-based).
export const SAMPLE_RESUME = { minutesLeft: 42, resumesUsed: 1, questionIndex: 1 };
export const SAMPLE_RETAKE = { hours: 47, minutes: 28 };

const ORIENTATION_PACKAGE = '12 Months';

export function interviewTypeFor(selectedPackage: string): InterviewType {
  return selectedPackage === ORIENTATION_PACKAGE ? 'orientation' : 'technical';
}
