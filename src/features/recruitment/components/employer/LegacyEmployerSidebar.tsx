import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  GraduationCap,
  Home,
  Layers,
  Star,
  Users,
} from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';
import { EMPLOYER_ROUTES } from '@/app/routes';

// Legacy employer prototype sidebar (PR #30); used only by layouts/EmployerLayout (the router's
// LegacyEmployerLayout). Kept in legacy/ because the PR #32 flow owns
// components/employer/EmployerSidebar.tsx; do not move it back to that path.
// Hardcoded English labels and sample badge counts. Its Pipeline and Completion links open the
// PR #32 flow, which requires sign-in, since those paths belong to that flow.

const items = [
  {
    label: 'Dashboard',
    to: EMPLOYER_ROUTES.dashboard,
    icon: Home,
  },
  {
    label: 'Talent Directory',
    to: EMPLOYER_ROUTES.talent,
    icon: Users,
  },
  {
    label: 'Shortlist',
    to: EMPLOYER_ROUTES.shortlist,
    icon: Star,
    badge: 3,
  },
  {
    label: 'Pipeline',
    to: EMPLOYER_ROUTES.pipeline,
    icon: Layers,
    badge: 4,
  },
  {
    label: 'Interviews',
    to: EMPLOYER_ROUTES.interviews,
    icon: Calendar,
    badge: 1,
  },
  {
    label: 'Completion',
    to: EMPLOYER_ROUTES.completion,
    icon: CheckCircle2,
  },
];

export default function EmployerSidebar() {
  return (
    <aside className="fixed bottom-4 left-4 top-4 z-30 hidden w-[250px] flex-col justify-between overflow-hidden rounded-[36px] bg-[#3B0454] px-4 pb-4 pt-5 text-white shadow-2xl lg:flex">
      
      {/* Brand & Navigation */}
      <div className="relative z-10">
        {/* Brand Header */}
        <Link
          to={EMPLOYER_ROUTES.dashboard}
          className="flex items-center gap-2.5 px-1"
        >
          <GraduationCap
            size={24}
            strokeWidth={2.2}
            className="shrink-0 text-white"
          />
          <span className="whitespace-nowrap text-[17px] font-bold tracking-tight text-white">
            Interns HUB
          </span>
        </Link>

        <p className="mt-0.5 px-1 text-[11.5px] font-normal text-purple-200/60">
          Employer Portal
        </p>

        {/* Company Profile Card */}
        <div className="mt-4 flex items-center gap-3 rounded-[18px] border border-white/10 bg-white/[0.08] p-2.5 backdrop-blur-md">
          {/* Avatar NT */}
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#BA8EC9] via-[#9F65B5] to-[#783792] text-[11px] font-bold tracking-wide text-white shadow-sm">
            NT
          </div>

          {/* Details */}
          <div className="min-w-0 flex-1">
            <p className="truncate text-[12.5px] font-semibold leading-tight text-white">
              NovaTech Solutions
            </p>
            <p className="mt-0.5 truncate text-[10.5px] text-purple-200/70 leading-tight">
              Sarah Mahmoud · HR
            </p>
          </div>

          {/* Active Status Dot */}
          <span className="size-2 shrink-0 rounded-full bg-[#22C55E] shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
        </div>

        {/* Navigation Heading */}
        <p className="mb-2.5 mt-5 px-1 text-[10px] font-semibold tracking-[0.18em] text-[#9A76AB] uppercase">
          RECRUITMENT
        </p>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-1">
          {items.map(({ label, to, icon: Icon, badge }) => (
            <NavLink
              key={to}
              to={to}
              end={label === 'Dashboard'}
              className={({ isActive }) =>
                `relative flex min-h-[38px] items-center gap-3 rounded-[14px] px-3 py-2 text-[13px] transition-all duration-150 ${
                  isActive
                    ? 'bg-white/[0.18] font-semibold text-white shadow-sm backdrop-blur-sm'
                    : 'text-white/80 hover:bg-white/[0.07] hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {/* Left Active Purple Indicator */}
                  {isActive && (
                    <span className="absolute -left-2.5 top-1/2 h-4 w-[3px] -translate-y-1/2 rounded-full bg-[#8B5CF6]" />
                  )}

                  <Icon
                    size={17}
                    strokeWidth={1.8}
                    className="shrink-0"
                  />

                  <span className="min-w-0 flex-1 whitespace-nowrap">
                    {label}
                  </span>

                  {/* Badge Counter */}
                  {badge !== undefined && (
                    <span className="flex h-4 min-w-[18px] shrink-0 items-center justify-center rounded-full bg-white/[0.16] px-1.5 text-[10px] font-semibold text-white/95">
                      {badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Bottom Decorative Landscape Waves (Vector SVG) */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[225px] overflow-hidden">
        <svg
          className="absolute inset-x-0 bottom-0 h-full w-full"
          viewBox="0 0 268 220"
          fill="none"
          preserveAspectRatio="none"
        >
          {/* Layer 1: Back Light Yellow / Cream Wave */}
          <path
            d="M30 160 C 110 160, 150 55, 230 45 C 248 42, 260 50, 268 55 L 268 220 L 0 220 L 0 160 Z"
            fill="#FAD9A5"
          />
          {/* Layer 2: Middle Purple / Lilac Wave */}
          <path
            d="M0 95 C 55 45, 115 55, 165 115 C 205 160, 235 180, 268 195 L 268 220 L 0 220 Z"
            fill="#9566BA"
          />
          {/* Layer 3: Front Warm Amber / Orange Wave */}
          <path
            d="M0 148 C 45 125, 115 122, 168 148 C 215 172, 245 168, 268 162 L 268 220 L 0 220 Z"
            fill="#F8A761"
          />
        </svg>
      </div>

      {/* Switch to Student view Button */}
      <div className="relative z-10 mt-auto pt-2">
        <Link
          to="/"
          className="flex h-11 w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-[#421155]/95 px-3 text-[12.5px] font-medium text-white shadow-lg shadow-black/20 transition-colors hover:bg-[#521769]"
        >
          <ArrowLeft size={15} strokeWidth={2} className="shrink-0" />
          <span className="whitespace-nowrap">
            Switch to Student view
          </span>
        </Link>
      </div>

    </aside>
  );
}
