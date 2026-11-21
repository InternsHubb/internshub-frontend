# Routing Guidelines

InternsHub uses **React Router v6** (`createBrowserRouter`) with centralized route constants and modular, feature-owned route files.

## How Routing Is Organized

1. **Canonical Route Constants (`src/app/routes.ts`)**:
   - All URL paths live in `ROUTES` and `EMPLOYER_ROUTES`, along with dynamic builders (`courseDetailsPath`, `mentorProfilePath`, `employerScheduleInterviewPath`, etc.).
   - Never hardcode URL strings in `<Link to="...">` or `navigate(...)` when a constant or builder exists.

2. **Feature-Owned Route Files (`src/features/<feature>/routes.tsx`)**:
   - Each of the 7 official features defines and lazy-loads its own pages inside `routes.tsx` and exports its route array from `src/features/<feature>/index.ts`.
   - Features that live inside the shared student dashboard shell export `*DashboardChildren: RouteObject[]` (composed under `/dashboard` in `src/app/router.tsx`).

3. **Main Router Composition (`src/app/router.tsx`)**:
   - Composes all 7 feature route modules inside `RootLayout` (which provides `ErrorBoundary`, `ScrollRestoration`, legacy hash redirects, and top-level `Suspense`).
   - Renders `NotFoundPage` on the catch-all `*` route.

## Route Guards (`src/shared/routing/`)

| Guard / Helper | Purpose | Usage |
|---|---|---|
| `isDevAuthBypassEnabled()` | Single shared predicate governing local UI-preview bypass. Returns `true` ONLY when `import.meta.env.DEV === true`, neither `VITE_API_BASE_URL` nor `API_PROXY_TARGET` is configured, AND `VITE_DEV_BYPASS_AUTH === 'true'` is explicitly set. Always `false` in production builds. | Used internally by `ProtectedRoute` and `RoleRoute` |
| `<ProtectedRoute>` | Requires an authenticated session. Also enforces completed student onboarding unless `requireOnboardingComplete={false}` is passed. | `/dashboard/*`, `/mentorship/*`, `/recruitment/*`, `/courses/:id/*`, `/onboarding` (`requireOnboardingComplete={false}`) |
| `<PublicOnlyRoute>` | Guest-only routes; redirects already authenticated users to their post-sign-in workspace. | `/auth/*`, `/register`, `/auth/forgot-password`, `/auth/phone-otp` |
| `<RoleRoute allowedRoles={[...]}>` | Checks user roles via `useAuth().hasAnyRole(...)` and redirects unauthorized roles to `fallbackPath` (`/dashboard`). | `/employer/*` (`allowedRoles={['employer', 'admin']}`) |

### Local Development Guard Behavior
Auth and role guards are **strictly enforced by default** in both development and production. To preview protected feature screens locally before the new backend is connected, add `VITE_DEV_BYPASS_AUTH=true` to `.env.local` (leaving `VITE_API_BASE_URL` and `API_PROXY_TARGET` unset). Once either backend variable is configured—or in any production build—the bypass is completely disabled.

## Layouts (`src/shared/layouts/`)

| Layout | Used By | Notes |
|---|---|---|
| `RootLayout` | Entire app | `ErrorBoundary`, `ScrollRestoration`, global `Suspense`, legacy `#register` / `#home` redirects |
| `PublicLayout` | Public marketing pages (optional wrapper) | Shared `Navbar` + `<main>` + `Footer` |
| `AuthLayout` | Authentication split-screen pages (`LoginPage`, `RegisterPage`) | Brand split-screen shell with reusable `LanguageSwitcher` in the form header |
| `StudentLayout` | `/dashboard/*` and `/recruitment/*` | Shared `Sidebar`, `TopNav` (with `LanguageSwitcher`), route `handle` slots (`sidebarFooter`, `topNavSearch`, `hideSidebar`) |
| `EmployerLayout` | `/employer/*` | Structural employer shell accepting feature-provided `renderSidebar` and `renderTopbar` |

## Adding a New Route in Your Feature

1. Add the path constant (and path builder if parameterized) to `src/app/routes.ts`.
2. Create your page in `src/features/<your-feature>/pages/<YourPage>.tsx`.
3. Register the lazy-loaded route in `src/features/<your-feature>/routes.tsx`.
4. Avoid editing `src/app/router.tsx` unless registering an entirely new top-level route group.
5. Verify both direct URL navigation (page refresh) and in-app navigation links.
