# Backend Integration Guide

All obsolete legacy API clients, hardcoded URLs, and dead auth/payment endpoints have been removed from the frontend. This project now provides a clean, decoupled **future backend integration boundary** under `src/backend/` and per-feature `services/` modules.

## Architecture of the Backend Boundary

```text
src/backend/
├── index.ts              # Public barrel for all backend utilities
├── README.md             # Quick reference for backend wiring
├── config/env.ts         # Reads VITE_API_BASE_URL, timeoutMs, isBackendConfigured() & isApiProxyConfigured()
├── types/common.ts       # Generic ApiErrorPayload, PaginatedResult<T>, ApiResponse<T>, RequestConfig (with timeoutMs)
├── client/
│   ├── errors.ts         # BackendError, BackendNotConnectedError, BackendTimeoutError, getBackendErrorKey()
│   └── httpClient.ts     # Typed fetch wrapper (httpRequest) with AbortController timeout + caller signal support & interceptors
├── endpoints/index.ts    # Placeholder endpoint registry (populate once new API spec is approved)
├── services/index.ts     # Shared notConnected(feature, operation) helper
└── adapters/index.ts     # Placeholder DTO -> view-model adapter registry
```

## How Feature Services Work Today

Each feature that requires backend data owns its own `services/<feature>Service.ts` and `types/<feature>.types.ts`:

| Feature | Service File | Pending Backend Capabilities |
|---|---|---|
| `authentication` | `src/features/authentication/services/authService.ts` | Email/password login & registration, email confirmation resend, password reset, phone OTP sign-in, Google & Microsoft OAuth token exchange, current user (`/me`) session refresh |
| `onboarding` | `src/features/onboarding/services/onboardingService.ts` | Email/phone verification, profile completion, legal policy fetch & consent submission, package/track catalog & enrollment selection, signed file upload & CV parsing, career profile CRUD (skills/education/experience), Paymob checkout & invoice polling, AI interview start/resume/audio answer submission |
| `courses` | `src/features/courses/services/coursesService.ts` | Course catalog & entitlement lookup, lesson completion persistence, package upgrade quote & checkout |
| `internships` | `src/features/internships/services/internshipsService.ts` | Active enrollment journey status, squad details & formation state, sprint list & task board, task status moves, GitHub username update, home next-session & today's-task widgets |
| `mentorship` | `src/features/mentorship/services/mentorshipService.ts` | Track mentors directory, mentor available time slots, learner bookings list, slot booking & cancellation, mentor chat persistence |
| `recruitment` | `src/features/recruitment/services/consentService.ts` | Talent directory visibility consent, student eligibility/opportunities/applications/agreements, employer talent search, shortlist, pipeline, interview scheduling, hiring decisions & partner agreements |
| `landing` | *(none currently)* | Optional future newsletter subscription (`Footer.onSubscribe`), dynamic public catalog/tracks |

Currently, unimplemented backend operations call `notConnected(feature, operation)` which throws `BackendNotConnectedError` (mapped by `getBackendErrorKey` to `common.errors.backendNotConnected`). Requests sent through `httpRequest` enforce `config.timeoutMs ?? BACKEND_CONFIG.timeoutMs` (default `15_000ms`) via `AbortController`, throwing `BackendTimeoutError` (`common.errors.timeout`) on timeout while preserving caller-provided `AbortSignal` cancellations. Pages handle disconnected states honestly without faking authentication, payments, or server state.

## Connecting the New Backend Later (Step-by-Step)

1. **Configure Environment:** Set `VITE_API_BASE_URL` in `.env.local` (or deployment environment variables). If using a local dev proxy, set `API_PROXY_TARGET` (unprefixed) in `.env.local`.
2. **Register Auth Interceptors:** In `src/backend/client/httpClient.ts`, wire the new backend's session mechanism (HTTP-only cookies via `credentials: 'include'` or Bearer header via `addRequestInterceptor`) and 401 refresh handling via `addResponseInterceptor`.
3. **Wire `AuthProvider` (`src/shared/auth/AuthProvider.tsx`):** Connect `reloadUser()` and `signOut()` to the new auth/me endpoints and map the response to `AuthUser`.
4. **Add Endpoint Constants:** Define finalized URL paths in `src/backend/endpoints/index.ts`.
5. **Implement Feature Services:** Replace `notConnected(...)` calls inside `src/features/<feature>/services/*` with `httpRequest<T>(...)` calls and add DTO adapters in `src/backend/adapters/` where backend schemas differ from UI models.

> **Important Rule:** Do not invent API paths, payload fields, or fake auth tokens inside components before backend contracts are officially published. Keep UI components decoupled behind `services/`.
