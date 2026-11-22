# Authentication Feature (`src/features/authentication/`)

**Owner:** Developer 2 — Sign-In, Registration, Password Recovery & OTP Flows

## Owned Routes (`routes.tsx`)

| Route | Component | Guard |
|---|---|---|
| `/auth/*` | `pages/LoginPage.tsx` | `PublicOnlyRoute` |
| `/register`, `/auth/register` | `pages/RegisterPage.tsx` | `PublicOnlyRoute` |
| `/auth/forgot-password` | `pages/ForgotPasswordPage.tsx` | `PublicOnlyRoute` |
| `/auth/phone-otp` | `pages/PhoneOtpPage.tsx` | `PublicOnlyRoute` |
| `/auth/microsoft/callback` | `pages/OAuthCallbackPage.tsx` | Public callback |

## Folder Structure

- `pages/` — `LoginPage`, `RegisterPage`, `ForgotPasswordPage`, `PhoneOtpPage`, `OAuthCallbackPage`, `PhoneOTP.css`
- `components/` — `LoginLayout`, `RegisterLayout`, `AuthFormParts`, `RegisterCheckEmail`, `ResendConfirmation`, `LegalModal`, `PhoneInputStep`, `OtpVerificationStep`, `forgot-password/` (`ResetCodeStep`, `NewPasswordStep`, icons & tokens)
- `hooks/` — `useSocialSignIn.ts` (clean OAuth hook boundary)
- `services/` — `authService.ts` (all auth operations delegated to `@/backend` `notConnected()` + clean error-key mappers)
- `locales/` — `en.json` and `ar.json` (namespace: `authentication`)
- `routes.tsx` & `index.ts` — Route registration and public export of `ResendConfirmation`

## Existing Preserved Content

All RHF + Zod validation schemas, password visibility toggles, Egyptian national ID & phone validations, legal modal, 3-step forgot-password flow, and 2-step Phone OTP UI are fully preserved.

## Future Backend Dependencies (`services/authService.ts`)

- Email/password login & registration
- Email confirmation resend
- Password reset request & reset confirmation
- Phone OTP send & verify
- Google & Microsoft OAuth token exchange
- Session/current-user refresh wired into `@/shared/auth/AuthProvider.tsx`
