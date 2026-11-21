import { lazy } from 'react';

// Public API of the AI interviewer character. Import from '@/features/ai-interviewer' only:
// the 3D code (three.js, ~150 KB gzip) loads lazily the first time the avatar renders or is preloaded.
export const InterviewerAvatar3D = lazy(() => import('./InterviewerAvatar3D'));
export type { InterviewerAvatar3DProps } from '@/features/onboarding/ai-interviewer/InterviewerAvatar3D';
export type { AvatarState } from '@/features/onboarding/ai-interviewer/types';
export { preloadInterviewerAvatar } from '@/features/onboarding/ai-interviewer/preload';
