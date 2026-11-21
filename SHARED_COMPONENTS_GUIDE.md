# Shared Components Guide

All reusable, feature-agnostic UI primitives, layouts, and navigation components live in `src/shared/components/` and `src/shared/layouts/`.

> **Design Philosophy:** Shared UI primitives are intentionally clean, neutral, and composable so each feature developer can style and customize their feature's final UI/UX without fighting opinionated widgets.

## UI Primitives (`@/shared/components/ui`)

Import directly from `@/shared/components/ui` (or `@/shared/components`):

| Component | Purpose | Actual Props |
|---|---|---|
| `Button` | Accessible button primitive | `variant` (`'primary' \| 'secondary' \| 'outline' \| 'ghost' \| 'danger'`), `size` (`'sm' \| 'md' \| 'lg'`), `isLoading`, `leftIcon`, `rightIcon`, standard `<button>` props |
| `Input` | Accessible text/email/password input (`forwardRef`) | `hasError`, standard `<input>` props |
| `Select` | Accessible native select dropdown (`forwardRef`) | `options` (`ReadonlyArray<SelectOption>`), `placeholder`, `hasError`, `children`, standard `<select>` props |
| `FormField` | Field wrapper with label, hint & error message | `id`, `label`, `hint`, `error`, `required`, `children`, `className` |
| `Card` | Surface container | `padded` (boolean, default `true`), `children`, standard `<div>` props |
| `Badge` | Compact status pill | `tone` (`'neutral' \| 'brand' \| 'success' \| 'warning' \| 'danger'`), `children`, `className` |
| `Modal` | Accessible Radix Dialog modal | `open`, `onOpenChange`, `title`, `description`, `children`, `footer`, `className`, `closeLabel` |
| `Loader` | Spinner indicator | `size` (`'sm' \| 'md' \| 'lg'`), `label`, `fullScreen`, `className` |
| `EmptyState` | Honest empty-list state | `icon`, `title`, `description`, `action`, `className` |
| `ErrorState` | Recoverable error alert/card | `title`, `message`, `onRetry`, `retryLabel`, `action`, `className` |
| `PageContainer` | Responsive page width wrapper | `maxWidth` (`'md' \| 'lg' \| 'xl' \| 'full'`, default `'xl'`), `children`, standard `<div>` props |

### Example Usage

```tsx
import { Badge, Button, Card, EmptyState, FormField, Input, PageContainer } from '@/shared/components/ui';
```

## Navigation & Shell Components (`@/shared/components/navigation`)

- `LanguageSwitcher`: Reusable EN/AR language switcher (`variant`: `'pill' | 'subtle'`, `className`) updating `i18n`, `html[lang]`, and `html[dir]`. Used in `TopNav`, `AuthLayout`, `MentorshipTopNav`, and `ForgotPasswordPage`.
- `Navbar`: Public marketing header with language toggle, smooth anchor scrolling, and responsive drawer.
- `Footer`: Public site footer with self-contained scroll reveal, navigation columns, and newsletter form hook (`onSubscribe`).
- `Sidebar` / `SidebarProvider` / `SidebarTrigger` / `useSidebar`: Shared collapsible student workspace sidebar (256px expanded, 118px icon rail, mobile Radix drawer) with configurable `footer` slot.
- `TopNav` (`Topbar.tsx`): Shared student dashboard top bar with sidebar trigger, optional search slot, `LanguageSwitcher`, `NotificationsMenu`, and `UserMenu`.
- `UserMenu`: Displays signed-in user initials, name, email, and sign-out action from `useAuth()`.
- `NotificationsMenu`: Backend-free notifications dropdown foundation ready for future notifications API wiring.

## Common Helpers (`@/shared/components/common`)

- `ErrorBoundary`: App-wide React error boundary with reset action.
- `NotFoundPage`: Clean accessible 404 fallback page with a styled `<Link>` back to Home (`/`).
- `ScrollReveal`: IntersectionObserver reveal wrapper.
- `CompositeScoreCard`: Reusable score card displayed in sidebar footer slots.
- `LockedCoursesIllustration`: Shared locked-state visual for courses upgrade flows.

## When to Add to `src/shared/` vs Your Feature

- **Keep it in `src/features/<feature>/components/`** if it is used by only one feature or carries feature-specific branding/logic.
- **Propose moving to `src/shared/`** only when 2+ features need the exact same component with zero feature-specific business coupling (coordinate with the Team Leader before editing `src/shared/`).
