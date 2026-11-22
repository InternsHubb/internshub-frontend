# InternsHub Frontend Architecture

## High-Level Structure

InternsHub uses a **strict feature-based modular architecture** designed for 7 frontend developers working in parallel without stepping on each other's files.

```text
src/
├── main.tsx                 # Single application bootstrap entry point
├── vite-env.d.ts            # Typed environment variable contract
├── app/                     # App composition: App.tsx, providers.tsx, router.tsx, routes.ts
├── assets/                  # Static visual assets grouped by domain
├── backend/                 # Future backend integration boundary (config, httpClient, errors, services)
├── i18n/                    # i18next bootstrap, RTL/LTR sync, and shared common locales
├── styles/                  # Tailwind CSS v4 design tokens, base styles, and keyframes
├── shared/                  # Cross-feature UI primitives, layouts, navigation, auth state, guards, hooks, utils
└── features/                # EXACTLY seven official business feature modules
    ├── landing/
    ├── authentication/
    ├── onboarding/
    ├── recruitment/
    ├── courses/
    ├── internships/
    └── mentorship/
```

## Layer Responsibilities

### 1. `src/app/` — Application Composition
- `App.tsx`: Renders `<AppProviders>` and `<RouterProvider router={router} />`.
- `providers.tsx`: Wraps global providers (`AuthProvider`).
- `routes.ts`: Single source of truth for canonical URL path constants (`ROUTES`, `EMPLOYER_ROUTES`) and dynamic path builders.
- `router.tsx`: Composes the route arrays exported by all 7 features under `RootLayout`, wraps `/dashboard` in `StudentLayout`, and registers the catch-all `NotFoundPage`.

### 2. `src/features/<feature>/` — Feature Ownership Modules
Each feature is self-contained and typically follows this internal shape:
```text
src/features/<feature>/
├── index.ts          # Public barrel (routes & explicitly shared exports only)
├── routes.tsx        # Feature-owned React Router RouteObject[] definitions
├── README.md         # Feature ownership, routes, content inventory & backend dependencies
├── pages/            # Route-level page components
├── components/       # Feature-specific UI components & shells
├── hooks/            # Feature-specific hooks
├── services/         # Feature backend boundary calling src/backend/
├── types/            # Feature domain DTOs and interfaces
├── data/             # Static/catalog/reference UI data where applicable
├── schemas/          # Zod validation schemas (where applicable)
├── utils/            # Pure feature helpers
└── locales/          # Feature-owned translations (en.json & ar.json)
```

### 3. `src/shared/` — Cross-Feature Infrastructure
Contains only genuinely reusable building blocks with **zero business feature logic**:
- `auth/`: Neutral `AuthContext`, `AuthProvider`, `useAuth`, `AuthUser` types, post-sign-in redirect helpers, and display identity helpers.
- `routing/`: `ProtectedRoute`, `PublicOnlyRoute`, and `RoleRoute`.
- `layouts/`: `RootLayout`, `PublicLayout`, `AuthLayout`, `StudentLayout`, `EmployerLayout`.
- `components/ui/`: Neutral reusable UI primitives (`Button`, `Input`, `Select`, `Modal`, `Card`, `Badge`, `Loader`, `EmptyState`, `ErrorState`, `PageContainer`, `FormField`).
- `components/navigation/`: `Navbar`, `Footer`, `Sidebar`, `Topbar`, `UserMenu`, `NotificationsMenu`.
- `components/common/`: `ErrorBoundary`, `NotFoundPage`, `ScrollReveal`, `CompositeScoreCard`, `LockedCoursesIllustration`.
- `hooks/`: `useResource`, `useScrollReveal`, `useCooldown`.
- `utils/`: `cn`, `format`, `initials`, `motion`, `phone`, `url`.
- `constants/`: `packages.ts`.

### 4. `src/backend/` — Future Backend Integration Layer
Isolated transport and contract layer ready for the new backend API. All obsolete legacy backend URLs, clients, and endpoints have been removed. Feature services delegate unimplemented operations to `notConnected(feature, operation)` until backend contracts are finalized.

## Import Boundary Rules (Strictly Enforced)

```text
app ────────► features (public index.ts only) ──► shared ──► backend
  └──────────────────────────────────────────────► shared ──► backend
```

1. **No reverse imports from `shared/` to `features/`:** `src/shared/**` must NEVER import anything from `src/features/**`.
2. **No private cross-feature imports:** Feature A must NEVER import internal files from `src/features/B/components/...` or `src/features/B/hooks/...`. If a component is genuinely shared between features, either:
   - Promote it to `src/shared/` (with Team Leader approval), or
   - Import only from Feature B's explicit public barrel `@/features/B`.
3. **No direct `fetch()` in components:** Components and pages must call their feature's `services/*` functions, which in turn use `@/backend`.
4. **No circular dependencies:** Keep dependencies strictly acyclic across layers and within features.
5. **Path aliases:** Always use `@/` (mapped to `src/`) for cross-directory imports rather than deep relative paths (`../../../`).
