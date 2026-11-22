// LOCAL PLACEHOLDER DATA — not from the backend, an AI or a reviewer.
//
// Questions, answers and the result level come from the backend interview (useLiveInterview). The
// backend has no endpoints for appeals, resume windows or retake countdowns yet, so those screens
// and the outcome preview still use these fixed sample values, and label them as samples.

import type { InterviewType } from '@/features/onboarding/components/interview/types';

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
