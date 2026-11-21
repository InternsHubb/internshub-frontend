# InternsHub Frontend

Team-ready frontend base foundation for **InternsHub**, built with React 19, TypeScript (strict mode), Vite 8, Tailwind CSS v4, React Router v6, and i18next (English LTR & Arabic RTL).

## Quick Start

### Prerequisites

- Node.js 20+
- npm 10+

### Installation & Local Development

```bash
npm install
cp .env.example .env.local
npm run dev
```

The app starts at `http://localhost:5173`.

> **Local UI Preview Mode (Explicit Opt-In):** Auth and role guards are **enforced by default**. While the new backend is not yet connected (both `VITE_API_BASE_URL` and `API_PROXY_TARGET` unset), you may explicitly opt in to local UI preview by adding `VITE_DEV_BYPASS_AUTH=true` to `.env.local`. Any other value (missing or `false`), any configured backend/proxy, or any production build always enforces authentication and role guards strictly.

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite development server with HMR |
| `npm run typecheck` | Run strict TypeScript checking (`tsc --noEmit`) |
| `npm run lint` | Run static analysis with Oxlint (`oxlint src`) |
| `npm run build` | Type-check and build production bundle (`dist/`) |
| `npm run preview` | Preview the production build locally |

## The Seven Official Features

Every developer owns a dedicated top-level feature directory under `src/features/`:

| # | Feature Folder | Primary Routes | Guide |
|---|---|---|---|
| 1 | `src/features/landing/` | `/`, `/internship/*`, `/internships/:id`, `/seniors/:id` | [Landing README](src/features/landing/README.md) |
| 2 | `src/features/authentication/` | `/auth/*`, `/register`, `/auth/forgot-password`, `/auth/phone-otp` | [Authentication README](src/features/authentication/README.md) |
| 3 | `src/features/onboarding/` | `/onboarding` (including `ai-interviewer/`) | [Onboarding README](src/features/onboarding/README.md) |
| 4 | `src/features/recruitment/` | `/recruitment/*` (student) and `/employer/*` (employer) | [Recruitment README](src/features/recruitment/README.md) |
| 5 | `src/features/courses/` | `/dashboard/courses`, `/dashboard/courses/plans`, `/courses/:id/*` | [Courses README](src/features/courses/README.md) |
| 6 | `src/features/internships/` | `/dashboard`, `/dashboard/internship`, `/dashboard/internship/project/*` | [Internships README](src/features/internships/README.md) |
| 7 | `src/features/mentorship/` | `/mentorship/*`, `/dashboard/chat` | [Mentorship README](src/features/mentorship/README.md) |

## Project Documentation

Read these guides before opening your first PR:

- [ARCHITECTURE.md](ARCHITECTURE.md) — Folder layout, module boundaries, and dependency rules
- [DEVELOPMENT_GUIDELINES.md](DEVELOPMENT_GUIDELINES.md) — TypeScript, naming, testing, linting, and code quality rules
- [STYLING_GUIDELINES.md](STYLING_GUIDELINES.md) — Tailwind CSS v4 tokens, animations, and RTL/LTR rules
- [ROUTING_GUIDELINES.md](ROUTING_GUIDELINES.md) — Centralized paths, feature routes, layouts, and route guards
- [SHARED_COMPONENTS_GUIDE.md](SHARED_COMPONENTS_GUIDE.md) — Reusable UI primitives, navigation chrome, and layouts
- [BACKEND_INTEGRATION_GUIDE.md](BACKEND_INTEGRATION_GUIDE.md) — Clean `src/backend/` boundary and feature service contracts
- [TEAM_WORKFLOW.md](TEAM_WORKFLOW.md) — Git branching (`dev` workflow), ownership, PR checklists, and conflict prevention
