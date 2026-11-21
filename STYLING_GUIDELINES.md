# Styling Guidelines

InternsHub uses **Tailwind CSS v4** (`@tailwindcss/vite`) with centralized design tokens in `src/styles/`.

## Style Architecture

```text
src/styles/
├── index.css        # Single CSS entry point imported in src/main.tsx
├── tokens.css       # @theme color, font, spacing, radius & shadow tokens
├── base.css         # Resets, RTL Arabic font rules, scroll behavior & utilities
└── animations.css   # Shared keyframes & unified prefers-reduced-motion guard
```

All global CSS is imported once from `src/main.tsx` (`import './styles/index.css'`).

## Design Tokens (`src/styles/tokens.css`)

Prefer Tailwind theme utility classes backed by the actual `@theme` tokens defined in `src/styles/tokens.css`:

### Brand, Ink & Surface Colors
- `ink` (`#22023c`) — `text-ink`, `bg-ink`
- `ink-deep` (`#3a0353`) — `text-ink-deep`, `bg-ink-deep`
- `brand` (`#4c0585`) — `bg-brand`, `text-brand`
- `brand-primary` (`#5a198f`) — `bg-brand-primary`, `text-brand-primary`
- `brand-link` (`#5c1d87`) — `text-brand-link`
- `glow` (`#8b5db0`) — `bg-glow`, `text-glow`
- `glow-warm` (`#dd6f0d`) — `bg-glow-warm`
- `lilac` (`#d2c1e1`) — `bg-lilac`, `border-lilac`
- `surface` (`#f4f0f8`) — `bg-surface`
- `surface-subtle` (`#f8f6fa`) — `bg-surface-subtle`
- `border-subtle` (`#e9dcf8`) — `border-border-subtle`
- `accent` (`#dc6e0d`) / `accent-soft` (`#e7aa6f`)
- `muted` (`#6b7280`) / `label` (`#34303a`)
- `onbrand` (`#d8c9df`) / `onbrand-soft` (`#cfbdd9`) / `onbrand-bright` (`#e9d9f2`)

### Semantic Status Colors
- Success: `text-success` (`#16794a`), `bg-success-soft` (`#eaf8f0`)
- Warning: `text-warning` (`#c45b0a`), `bg-warning-soft` (`#fff3e8`)
- Danger: `text-danger` (`#b42318`), `bg-danger-soft` (`#fef0ef`)
- Info: `text-info` (`#4c0585`), `bg-info-soft` (`#f5eaf9`)

### Layout, Radius & Shadow Tokens
- Spacing CSS variables: `--spacing-container` (`80rem`), `--spacing-sidebar-expanded` (`16rem`), `--spacing-sidebar-collapsed` (`7.375rem`), `--spacing-topbar` (`5rem`)
- Radius CSS variables: `--radius-card` (`1rem`), `--radius-card-lg` (`1.5rem`), `--radius-panel` (`2.25rem`), `--radius-control` (`0.75rem`), `--radius-pill` (`9999px`)
- Shadow CSS variables: `--shadow-card`, `--shadow-elevated`, `--shadow-popover`

### Typography
- English (LTR): `Plus Jakarta Sans` (bundled via `@fontsource-variable/plus-jakarta-sans`).
- Arabic (RTL): `Cairo` (automatically applied whenever `html[lang="ar"]` or `html[dir="rtl"]` is active via `src/styles/base.css`).

## Class Composition (`cn`)

Always merge conditional Tailwind classes with `@/shared/utils/cn`:

```tsx
import { cn } from '@/shared/utils/cn';

<button className={cn('rounded-xl px-4 py-2', isActive && 'bg-brand-primary text-white')} />
```

## Feature-Specific Styles
- Prefer Tailwind utility classes inside your feature components.
- If a feature genuinely needs custom CSS (e.g., complex keyframes or third-party overrides), scope it cleanly inside `src/features/<feature>/styles/` and prefix custom class names with the feature name (e.g., `.mentorship-*`) so they never leak into other features.
- Never override global tags (`body`, `h1`, `button`, `a`) from inside a feature stylesheet.

## RTL / LTR Layout Rules
- Use logical properties everywhere: `ps-*`, `pe-*`, `ms-*`, `me-*`, `start-*`, `end-*`, `rounded-s-*`, `rounded-e-*`, `text-start`, `text-end`.
- Flip directional icons (arrows, chevrons) in RTL with `rtl:rotate-180` or `rtl:-scale-x-100`.
- Keep gradients directional-aware where needed (`bg-linear-to-r ... rtl:bg-linear-to-l`).
- Test both languages using the `LanguageSwitcher` control available in public, auth, dashboard, mentorship, and recruitment layouts before merging.
