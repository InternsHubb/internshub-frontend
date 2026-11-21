# Internships Feature (`src/features/internships/`)

**Owner:** Developer 6 — Student Dashboard Home, Internship Journey & Squad Project Workspace

## Owned Routes (`routes.tsx`)

All routes compose inside the shared `StudentLayout` under `/dashboard` (`ProtectedRoute`):

| Route | Component | Sidebar Footer Slot |
|---|---|---|
| `/dashboard` (index) | `pages/DashboardHomePage.tsx` | — |
| `/dashboard/internship` | `pages/InternshipDashboardPage.tsx` | `InternshipSidebarFooter` |
| `/dashboard/internship/project` | `pages/ProjectPage.tsx` | `ProjectSidebarFooter` |
| `/dashboard/internship/project/details` | `pages/ProjectDetailsPage.tsx` | `ProjectSidebarFooter` |
| `/dashboard/internship/project/review` | `pages/ProjectReviewPage.tsx` | `ProjectSidebarFooter` |
| `/dashboard/internship/project/done` | `pages/ProjectDonePage.tsx` | `ProjectSidebarFooter` |
| `/dashboard/internship/project/completed` | `pages/ProjectCompletedPage.tsx` | `ProjectSidebarFooter` |
| `/dashboard/internship/project/final-review` | `pages/ProjectFinalReviewPage.tsx` | `ProjectSidebarFooter` |
| `/dashboard/internship/project/results` | `pages/ProjectResultsPage.tsx` | `ProjectSidebarFooter` |

## Folder Structure

- `pages/` — Dashboard home, internship journey page, and all 7 squad project workflow pages
- `components/` — Journey views (`CoursesStageView`, `InterviewReviewView`, `FindingSquadView`, `SquadReadyView`), sprint & kanban board (`SprintSelect`, `TaskBoard`, `ProjectWork`, `ProjectDetailsModal`, `GithubUsernameCard`), `InternshipSidebarFooter`, and `home/` widgets
- `hooks/` — `useInternship.ts`, `useHomeActivity.ts`, `useSquadBoard.ts`
- `data/` — `internshipDashboard.ts`, `internshipPackages.ts`
- `utils/` — `internship.ts`, `homeJourney.ts`, `homeShared.ts`
- `services/` — `internshipsService.ts` (clean future backend boundary)
- `types/` — `internships.types.ts`
- `locales/` — `en.json` and `ar.json` (namespace: `internships`)

## Future Backend Dependencies (`services/internshipsService.ts`)

- Active enrollment, package & track resolution
- Technical interview status & assigned level
- Squad details, formation state & team roster
- Sprint list, sprint task board & drag/drop task status transitions
- GitHub username persistence
- Dashboard home next mentor session & today's active sprint task
