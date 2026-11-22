# Recruitment Feature (`src/features/recruitment/`)

**Owner:** Developer 4 — Student Recruitment Flow & Employer Hiring Portal

## Owned Routes (`routes.tsx`)

### Student Recruitment (`/recruitment/*` — `ProtectedRoute` + `RecruitmentStudentShell`)
- `/recruitment` — Dashboard
- `/recruitment/eligibility` — Eligibility breakdown
- `/recruitment/profile` — Student recruitment profile
- `/recruitment/opportunities` & `/recruitment/opportunities/:opportunityId`
- `/recruitment/talent-directory` — Talent directory consent
- `/recruitment/applications` & `/recruitment/applications/:applicationId`
- `/recruitment/interview`, `/recruitment/agreements`, `/recruitment/agreements/:agreementId`
- `/recruitment/notifications`, `/recruitment/completion`

### Employer Portal (`/employer/*` — `ProtectedRoute` + `RoleRoute(['employer', 'admin'])`)
- **Primary flow (`RecruitmentEmployerShell` → `@/shared/layouts/EmployerLayout`):** `/employer` (redirects to `/employer/pipeline`), `/employer/pipeline`, `/employer/interviews/:applicationId/schedule`, `/employer/applications/:applicationId/decision`, `/employer/applications/:applicationId/decision/submitted`, `/employer/applications/:applicationId/agreement`, `/employer/completion`
- **Discovery & shortlist flow (`LegacyEmployerShell`):** `/employer/dashboard`, `/employer/talent`, `/employer/talent/:candidateId`, `/employer/shortlist`, `/employer/interviews`, `/employer/send-opportunity`, `/employer/opportunity-sent`

## Folder Structure

- `pages/student/` & `pages/employer/` — All student & employer recruitment pages
- `components/student/` & `components/employer/` — Layout shells (`RecruitmentStudentShell`, `RecruitmentEmployerShell`, `LegacyEmployerShell`), sidebars, topbars, tables, filters & badges
- `data/student/` & `data/employer/` — Existing UI reference data & stores
- `services/` — `consentService.ts` (decoupled from old backend)
- `types/` — Recruitment & employer domain types
- `locales/` — `en.json` and `ar.json` (namespace: `recruitment`)

## Future Backend Dependencies

- Talent directory visibility consent read/write
- Student eligibility, opportunities, applications, interviews & agreements APIs
- Employer candidate search, shortlist, opportunity invites, pipeline status, interview scheduling, hiring decisions & partner agreements
