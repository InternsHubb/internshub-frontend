# Landing Feature (`src/features/landing/`)

**Owner:** Developer 1 — Public Marketing & Discovery Pages

## Owned Routes (`routes.tsx`)

| Route | Component | Access |
|---|---|---|
| `/` | `pages/LandingPage.tsx` | Public |
| `/internship/*` | `pages/InternshipPage.tsx` | Public |
| `/internships/:id` | `pages/InternshipDetailsPage.tsx` | Public |
| `/seniors/:id` | `pages/SeniorJourneyPage.tsx` | Public |
| `/seniors` | Redirect → `/#experience` | Public |

## Folder Structure

- `pages/` — `LandingPage`, `InternshipPage`, `InternshipDetailsPage`, `SeniorJourneyPage`
- `components/` — Marketing sections (`HeroSection`, `JourneySection`, `ExperienceSection`, `MentorshipSection`, `CoursesSection`, `InternshipSection`, `LandingInternshipsSection`, `RecruitmentSection`, `PricingSection`, `TestimonialsSection`, `VideoShowcaseSection`), `internship-showcase/`, and public internship sub-components
- `data/` — Static marketing/showcase data (`coursesLandingData.ts`, `landingInternshipsData.ts`, `seniorsData.ts`)
- `locales/` — `en.json` and `ar.json` (namespace: `landing`)
- `routes.tsx` & `index.ts` — Route registration and public feature exports

## Existing Preserved Content

All marketing sections, scroll reveal animations, interactive carousels, senior mentor journey profiles, and public internship program detail pages are preserved intact. Shared navigation (`Navbar`, `Footer`) lives in `@/shared/components/navigation`.

## Future Backend Dependencies

- Optional newsletter subscription callback on `<Footer onSubscribe={...} />`
- Optional dynamic courses/tracks/mentors showcase API once published in `src/backend/`
