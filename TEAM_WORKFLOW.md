# Team Workflow & Collaboration Rules

This repository is structured for **7 frontend developers** working concurrently on the 7 official features. Following these rules eliminates merge conflicts and keeps `dev` always buildable.

## Git Branching Rules

- **`main`**: Production release branch. **Never commit or push directly to `main`.**
- **`dev`**: Shared integration branch containing the Base Project Foundation. Always branch from the latest `dev`.
- **Feature branches**: Create focused branches from `dev` using the naming pattern:
  ```text
  feature/<feature-name>/<short-task>
  fix/<feature-name>/<short-bug>
  ```
  Examples:
  - `feature/landing/hero-redesign`
  - `feature/courses/video-player-ux`
  - `fix/mentorship/rtl-calendar-alignment`

### Daily Git Routine

```bash
# 1. Sync dev before starting a task
git checkout dev
git pull --ff-only origin dev

# 2. Create your feature branch
git checkout -b feature/<your-feature>/<task>

# 3. Before opening a PR, verify everything passes
npm run typecheck
npm run lint
npm run build
```

## Ownership Boundaries

| Owner | Exclusive Folder | Shared Files Touch Policy |
|---|---|---|
| Developer 1 | `src/features/landing/` | Coordinate before touching `src/shared/` or `src/app/` |
| Developer 2 | `src/features/authentication/` | Coordinate before touching `src/shared/` or `src/app/` |
| Developer 3 | `src/features/onboarding/` | Coordinate before touching `src/shared/` or `src/app/` |
| Developer 4 | `src/features/recruitment/` | Coordinate before touching `src/shared/` or `src/app/` |
| Developer 5 | `src/features/courses/` | Coordinate before touching `src/shared/` or `src/app/` |
| Developer 6 | `src/features/internships/` | Coordinate before touching `src/shared/` or `src/app/` |
| Developer 7 | `src/features/mentorship/` | Coordinate before touching `src/shared/` or `src/app/` |

### High-Contention Files (Coordinate First!)
To prevent merge conflicts across the team, **only edit these files when strictly necessary** and notify the Team Leader:
- `src/app/routes.ts` and `src/app/router.tsx`
- `src/shared/**`
- `src/styles/**`
- `src/i18n/index.ts` and `src/i18n/locales/**`
- `src/backend/**`
- `package.json`

## Pull Request Checklist

Before requesting review into `dev`, confirm:

- [ ] Changes stay strictly inside your assigned feature folder (unless approved for shared code).
- [ ] No new top-level folders created inside `src/features/`.
- [ ] No reverse imports (`shared -> features`) or private cross-feature imports (`features/A -> features/B/components/...`).
- [ ] All new strings added to both `locales/en.json` and `locales/ar.json`.
- [ ] Tested on mobile, tablet, and desktop viewports in **both LTR (English) and RTL (Arabic)**.
- [ ] `npm run typecheck`, `npm run lint`, and `npm run build` all pass with zero errors.
- [ ] No secrets, `.env.local` values, or hardcoded legacy API URLs committed.
