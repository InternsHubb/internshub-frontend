# Onboarding Feature (`src/features/onboarding/`)

**Owner:** Developer 3 — Account Setup, CV Upload/Review, Payment Checkout & AI Interview

## Owned Routes (`routes.tsx`)

| Route | Component | Guard |
|---|---|---|
| `/onboarding` | `pages/OnboardingFlowPage.tsx` | `ProtectedRoute` (`requireOnboardingComplete={false}`) |

## Folder Structure

- `pages/` — `OnboardingFlowPage.tsx` (multi-step wizard controller)
- `components/` — `OnboardingHeader`, `VerifyAccountStep`, `ProfileStep`, `PackageSelection`, `TrackSelection`, `PolicyConsent`, `CvUploadStep`, `PaymentPanel`, `cv-review/` (`CvReview`, `RecordEditor`, `SkillsEditor`), `interview/` (setup, device check, recording consent, call stage, integrity monitor, result/appeal screens)
- `ai-interviewer/` — 3D Three.js/WebGL interviewer avatar stage, lip-sync & expressions (nested inside `onboarding` as part of the AI Interview step)
- `hooks/` — `useEnrollmentChoice.ts`, `useMyCv.ts`, `usePaymentCheckout.ts`
- `schemas/` — `profileValidation.ts`
- `constants/` — `packages.ts`
- `services/` — `onboardingService.ts` (clean future backend boundary)
- `types/` — `onboarding.types.ts`
- `locales/` — `en.json` and `ar.json` (namespace: `onboarding`)

## Existing Preserved Content

All 10 onboarding steps (Account, Verify, Profile, Path, CV Upload + Review, Payment, Interview Setup/Session + 3D Avatar, Result/Appeal, Squad, Mentorship preview) are preserved intact.

## Future Backend Dependencies (`services/onboardingService.ts`)

- Phone verification SMS send/confirm
- Profile completion (`fullName`, `dateOfBirth`, locale/timeZone)
- Policies list, signed policy document download, and consent recording
- Packages & tracks catalog and enrollment create/update
- Signed file upload URL creation, upload confirm, CV submission & async parse polling
- Career profile CRUD (skills search/add/update, education & work experience add/update)
- Payment checkout session creation & invoice polling
- Live AI interview start/resume, audio answer upload & submission
