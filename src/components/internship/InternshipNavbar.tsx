// TEMPORARY: local copy of the navbar from the Internship Figma frame.
// Replace with the team's shared Navbar once it lands on main.
import { useState } from 'react'
import { cn } from './cn'

interface MenuIconProps {
  isOpen: boolean
}

// Hamburger / close glyphs for the mobile menu toggle (the Figma frame has no mobile nav icon).
function MenuIcon({ isOpen }: MenuIconProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      className="size-6"
    >
      {isOpen ? <path d="M18 6 6 18M6 6l12 12" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
    </svg>
  )
}

interface NavLink {
  label: string
  href: string
}

const NAV_LINKS: ReadonlyArray<NavLink> = [
  { label: 'Courses', href: '#' },
  { label: 'Internship', href: '/internship' },
  { label: 'Mentorship', href: '#' },
  { label: 'Pricing', href: '#' },
  { label: 'About Us', href: '#' },
]

const ACTIVE_LINK = 'Internship'

function InternshipNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="relative z-20">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex max-w-[1440px] items-center justify-between gap-6 px-4 py-4 sm:px-10 xl:justify-center xl:gap-[138px]"
      >
        <a href="/" className="p-[10px] text-2xl font-semibold text-[#4c0585]">
          EdTech
        </a>

        <ul className="hidden items-start gap-[10px] p-[10px] lg:flex">
          {NAV_LINKS.map((link) => {
            const isActive = link.label === ACTIVE_LINK
            return (
              <li key={link.label}>
                <a
                  href={link.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={cn(
                    'flex p-[10px] text-xl transition-colors hover:text-[#5a198f]',
                    isActive
                      ? 'border-b-2 border-[#4c0585] font-semibold text-[#5a198f]'
                      : 'text-[#393939]',
                  )}
                >
                  {link.label}
                </a>
              </li>
            )
          })}
        </ul>

        <div className="hidden items-center gap-4 lg:flex">
          <a href="#" className="text-sm font-semibold text-[#374151] hover:text-[#5a198f]">
            Log In
          </a>
          <a
            href="#"
            className="rounded-full bg-[#5a198f] px-5 py-[10px] text-sm font-semibold text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.05)] transition-colors hover:bg-[#3b0454]"
          >
            Sign Up Free
          </a>
        </div>

        <button
          type="button"
          aria-expanded={isMenuOpen}
          aria-controls="internship-mobile-menu"
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setIsMenuOpen((open) => !open)}
          className="rounded-full p-2 text-[#3b0454] lg:hidden"
        >
          <MenuIcon isOpen={isMenuOpen} />
        </button>
      </nav>

      {isMenuOpen && (
        <div
          id="internship-mobile-menu"
          className="absolute inset-x-4 top-full rounded-2xl bg-white p-4 shadow-lg lg:hidden"
        >
          <ul className="flex flex-col">
            {NAV_LINKS.map((link) => {
              const isActive = link.label === ACTIVE_LINK
              return (
                <li key={link.label}>
                  <a
                    href={link.href}
                    aria-current={isActive ? 'page' : undefined}
                    className={cn(
                      'block rounded-xl px-3 py-3 text-base',
                      isActive ? 'bg-[#f4f0f8] font-semibold text-[#5a198f]' : 'text-[#393939]',
                    )}
                  >
                    {link.label}
                  </a>
                </li>
              )
            })}
          </ul>
          <div className="mt-3 flex items-center gap-4 border-t border-[#e4e7ec] px-3 pt-4">
            <a href="#" className="text-sm font-semibold text-[#374151]">
              Log In
            </a>
            <a href="#" className="rounded-full bg-[#5a198f] px-5 py-[10px] text-sm font-semibold text-white">
              Sign Up Free
            </a>
          </div>
        </div>
      )}
    </header>
  )
}

export default InternshipNavbar
