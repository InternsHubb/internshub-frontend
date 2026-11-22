# Development Guidelines

## Core Engineering Standards

### 1. TypeScript Strict Mode
- `tsconfig.json` enforces `"strict": true`, `"noUnusedLocals": true`, `"noUnusedParameters": true`, and `"noFallthroughCasesInSwitch": true`.
- Never use `any` unless interacting with an untyped third-party boundary (and narrow immediately with type guards or Zod).
- Do not add `@ts-ignore` or `@ts-expect-error` to silence compiler errors.
- Always run `npm run typecheck` before opening a PR.

### 2. Linting & Code Quality
- Static analysis runs via **Oxlint**:
  ```bash
  npm run lint
  ```
- Keep components focused and readable; extract repeated logic into hooks (`hooks/`) or pure helpers (`utils/`).
- Avoid leaving commented-out dead code, unused imports, or console debug logs in production paths.

### 3. Naming Conventions

| Entity | Convention | Example |
|---|---|---|
| React component files | `PascalCase.tsx` | `CourseCard.tsx`, `LoginPage.tsx` |
| Page components | `<Name>Page.tsx` | `MentorshipDashboardPage.tsx` |
| Custom hooks | `use<Name>.ts` | `useScrollReveal.ts`, `useSquadBoard.ts` |
| Services | `<domain>Service.ts` | `authService.ts`, `coursesService.ts` |
| Type files | `<domain>.types.ts` or `<domain>.ts` | `onboarding.types.ts` |
| Utility modules | `camelCase.ts` | `format.ts`, `internship.ts` |
| Constants | `UPPER_SNAKE_CASE` | `ROUTES`, `PACKAGES` |
| Feature folders | lowercase (one of the 7 official names) | `src/features/courses/` |

### 4. Internationalization (EN / AR & RTL / LTR)
- Every user-facing string should have both English and Arabic translations in your feature's locale files:
  - `src/features/<feature>/locales/en.json`
  - `src/features/<feature>/locales/ar.json`
- Shared UI/navigation/error strings belong in `src/i18n/locales/{en,ar}/common.json`.
- Always verify your pages in **both English (LTR) and Arabic (RTL)**!
- Use logical Tailwind spacing & alignment utilities (`ps-`, `pe-`, `ms-`, `me-`, `start-`, `end-`, `text-start`, `text-end`) instead of physical `pl-`, `pr-`, `ml-`, `mr-`, `left-`, `right-`, `text-left`, `text-right`.
- Wrap directional values such as email addresses, phone numbers, URLs, and code identifiers in `dir="ltr"` or `<bdi>` so RTL layout never reverses them.

### 5. Forms & Validation
- Use `react-hook-form` + `zod` (`@hookform/resolvers/zod`) for form validation.
- Store validation schemas in `src/features/<feature>/schemas/`.
- Return translation keys from Zod error messages and resolve them via `t(error.message)` so validation messages react immediately to language switching.

### 6. Accessibility Baseline
- Use semantic HTML (`<main>`, `<nav>`, `<header>`, `<section>`, `<button type="button">`).
- Always provide `aria-label` on icon-only buttons and associate `<label htmlFor="...">` with every input.
- Ensure keyboard focus states (`focus-visible:ring-2`) remain clearly visible.
- Respect `prefers-reduced-motion` (already globally supported in `src/styles/animations.css`).

### 7. Pre-PR Verification Checklist
Run all three commands locally and confirm zero errors:
```bash
npm run typecheck
npm run lint
npm run build
```
