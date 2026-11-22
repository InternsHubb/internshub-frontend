# Courses Feature (`src/features/courses/`)

**Owner:** Developer 5 — Courses Catalog, Course Player, Quizzes & Plan Upgrades

## Owned Routes (`routes.tsx`)

### Dashboard Nested Routes (inside `StudentLayout` under `/dashboard`)
- `/dashboard/courses` — `pages/CoursesPage.tsx` (embeds `CoursesCatalogPage`)
- `/dashboard/courses/plans` — `pages/PlansPage.tsx` (growth plan comparison & upgrade flow)

### Standalone Protected Routes & Legacy Redirects
- `/courses`, `/courses-3m`, `/courses-6m`, `/courses-12m` → Redirect to `/dashboard/courses`
- `/courses/:id`, `/course-details` — `pages/CourseDetailsPage.tsx` (`ProtectedRoute`)
- `/courses/:id/video`, `/course-video` — `pages/CourseVideoPage.tsx` (`ProtectedRoute`)
- `/courses/:id/quiz`, `/course-quiz` — `pages/CourseQuizPage.tsx` (`ProtectedRoute`)

## Folder Structure

- `pages/` — `CoursesPage`, `CoursesCatalogPage`, `CourseDetailsPage`, `CourseVideoPage`, `CourseQuizPage`, `PlansPage`
- `components/` — `CoursesEmptyState`, `PlanCard`
- `data/` — `coursesCatalog.ts` (full track-specific curriculum & real YouTube lesson embeds preserved from PR #81)
- `services/` — `coursesService.ts` (clean future backend boundary)
- `types/` — `courses.types.ts`
- `locales/` — `en.json` and `ar.json` (namespace: `courses`)

## Future Backend Dependencies (`services/coursesService.ts`)

- Fetching enrolled/available courses catalog & track entitlements
- Fetching course details & video stream URLs
- Persisting lesson completion & quiz results server-side
- Package upgrade quote calculation, upgrade request & payment checkout
