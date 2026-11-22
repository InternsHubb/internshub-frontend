import React, {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useTranslation } from 'react-i18next'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  Globe,
  Menu,
  X,
} from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ROUTES } from '@/app/routes'
import { useAuth } from '@/shared/auth'
import { isUserDataComplete } from '@/shared/auth'

export type PublicNavItemId =
  | 'home'
  | 'internship'
  | 'recruitment'
  | 'pricing'
  | 'about'
  | 'contact'

interface NavbarProps {
  activeSection?: string
  /** Kept for backwards compatibility with existing callers; cross-route navigation is automatic. */
  sectionLinkBase?: string
  /** Optional inner container override for pages with custom max-widths. */
  containerClassName?: string
}

const DEFAULT_CONTAINER = 'max-w-[1280px] xl:max-w-[1320px] mx-auto px-4 sm:px-6'

/** Ordered homepage section landmarks mapped to public navigation items */
const HOME_SECTION_LANDMARKS: ReadonlyArray<{
  domIds: ReadonlyArray<string>
  navId: PublicNavItemId
}> = [
  { domIds: ['internship'], navId: 'internship' },
  { domIds: ['recruitment'], navId: 'recruitment' },
  { domIds: ['pricing'], navId: 'pricing' },
  { domIds: ['about', 'about-video'], navId: 'about' },
  { domIds: ['contact'], navId: 'contact' },
]

function hashToNavItem(hash: string): PublicNavItemId | null {
  const clean = hash.replace(/^#/, '').trim().toLowerCase()
  if (!clean || clean === 'home') return null
  if (clean === 'internship') return 'internship'
  if (clean === 'recruitment') return 'recruitment'
  if (clean === 'pricing') return 'pricing'
  if (clean === 'about' || clean === 'about-video') return 'about'
  if (clean === 'contact') return 'contact'
  return null
}

function findSectionElement(navId: PublicNavItemId): HTMLElement | null {
  const landmark = HOME_SECTION_LANDMARKS.find((item) => item.navId === navId)
  if (!landmark) return null
  for (const domId of landmark.domIds) {
    const el = document.getElementById(domId)
    if (el) return el
  }
  return null
}

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

/** Hexagonal purple EdTech emblem with isometric cube/graduation-cap mark matching reference */
function EdTechLogoMark({ className = 'size-9' }: { className?: string }) {
  const gradId = useId()
  return (
    <svg
      viewBox="0 0 38 42"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <defs>
        <linearGradient id={gradId} x1="4" y1="2" x2="34" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#6624C9" />
          <stop offset="100%" stopColor="#460F94" />
        </linearGradient>
      </defs>
      {/* Rounded pointy-top hexagon */}
      <path
        d="M17.25 1.85C18.33 1.23 19.67 1.23 20.75 1.85L33.5 9.21C34.58 9.83 35.25 10.99 35.25 12.24V26.96C35.25 28.21 34.58 29.37 33.5 29.99L20.75 37.35C19.67 37.97 18.33 37.97 17.25 37.35L4.5 29.99C3.42 29.37 2.75 28.21 2.75 26.96V12.24C2.75 10.99 3.42 9.83 4.5 9.21L17.25 1.85Z"
        fill={`url(#${gradId})`}
      />
      {/* Isometric graduation-cap / 3D cube top diamond */}
      <path
        d="M19 10.6L27.4 15.25L19 19.9L10.6 15.25L19 10.6Z"
        fill="#FFFFFF"
      />
      {/* Left & right cube facets */}
      <path
        d="M12.35 17.55L18.25 20.82V27.95L12.35 24.62V17.55Z"
        fill="#FFFFFF"
        fillOpacity="0.9"
      />
      <path
        d="M25.65 17.55L19.75 20.82V27.95L25.65 24.62V17.55Z"
        fill="#E9DCFF"
        fillOpacity="0.88"
      />
      {/* Subtle tassel accent on left side */}
      <path
        d="M10.15 15.6V22.4"
        stroke="#FFFFFF"
        strokeOpacity="0.85"
        strokeWidth="1.45"
        strokeLinecap="round"
      />
      <circle cx="10.15" cy="23.2" r="1.05" fill="#FFFFFF" />
    </svg>
  )
}

export const Navbar: React.FC<NavbarProps> = ({
  activeSection = 'home',
  containerClassName = DEFAULT_CONTAINER,
}) => {
  const { t, i18n } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()
  const { status, user, signOut } = useAuth()

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [langMenuOpen, setLangMenuOpen] = useState(false)

  const headerRef = useRef<HTMLElement>(null)
  const navRef = useRef<HTMLElement>(null)
  const itemRefs = useRef<Partial<Record<PublicNavItemId, HTMLAnchorElement | null>>>({})
  const langMenuRef = useRef<HTMLDivElement>(null)
  const prevPathnameRef = useRef<string>(location.pathname)
  const programmaticScrollLockRef = useRef<{
    id: PublicNavItemId
    until: number
  } | null>(null)

  const isHome = location.pathname === ROUTES.home
  const isRtl = i18n.dir() === 'rtl'
  const currentLang = i18n.language?.startsWith('ar') ? 'ar' : 'en'

  // 'loading' means a stored session is being checked: it is still a signed-in browser.
  const isSignedIn = status !== 'anonymous'
  const isDataComplete = isUserDataComplete(user)
  const accountDestination = isDataComplete ? ROUTES.dashboard : ROUTES.onboarding
  const accountLabel = isDataComplete ? t('nav.dashboard', 'Dashboard') : t('nav.account')

  // Active section state when on the homepage
  const [homeActiveSection, setHomeActiveSection] = useState<PublicNavItemId>(() => {
    if (location.pathname === ROUTES.home) {
      return hashToNavItem(location.hash) ?? 'home'
    }
    return 'home'
  })

  // Derive authoritative active navigation item from current route + homepage scroll state
  const resolvedActiveItem: PublicNavItemId = useMemo(() => {
    if (isHome) {
      return homeActiveSection
    }
    if (
      location.pathname === ROUTES.internship ||
      location.pathname.startsWith(`${ROUTES.internship}/`) ||
      location.pathname.startsWith('/internships/')
    ) {
      return 'internship'
    }
    if (
      activeSection === 'internship' ||
      activeSection === 'recruitment' ||
      activeSection === 'pricing' ||
      activeSection === 'about' ||
      activeSection === 'contact'
    ) {
      return activeSection
    }
    return 'home'
  }, [isHome, homeActiveSection, location.pathname, activeSection])

  // Standard 6 public navigation items in exact required order (Courses & Mentorship removed)
  const navItems = useMemo(
    () =>
      [
        {
          id: 'home' as const,
          label: t('nav.home', 'Home'),
          to: ROUTES.home,
          kind: 'home' as const,
        },
        {
          id: 'internship' as const,
          label: t('nav.internship', 'Internship'),
          to: ROUTES.internship,
          kind: 'route' as const,
        },
        {
          id: 'recruitment' as const,
          label: t('nav.recruitment', 'Recruitment'),
          to: `${ROUTES.home}#recruitment`,
          hash: '#recruitment',
          kind: 'section' as const,
        },
        {
          id: 'pricing' as const,
          label: t('nav.pricing', 'Pricing'),
          to: `${ROUTES.home}#pricing`,
          hash: '#pricing',
          kind: 'section' as const,
        },
        {
          id: 'about' as const,
          label: t('nav.about', 'About Us'),
          to: `${ROUTES.home}#about`,
          hash: '#about',
          kind: 'section' as const,
        },
        {
          id: 'contact' as const,
          label: t('nav.contact', 'Contact Us'),
          to: `${ROUTES.home}#contact`,
          hash: '#contact',
          kind: 'section' as const,
        },
      ] as const,
    [t],
  )

  const getHeaderOffset = useCallback(() => {
    const headerHeight = headerRef.current?.offsetHeight ?? 86
    return headerHeight + 16
  }, [])

  const scrollToHomeSection = useCallback(
    (navId: PublicNavItemId, behavior: ScrollBehavior) => {
      const targetEl = findSectionElement(navId)
      if (!targetEl) return false
      const rect = targetEl.getBoundingClientRect()
      const rawTop = rect.top + window.scrollY - getHeaderOffset()
      const maxScroll = Math.max(
        0,
        document.documentElement.scrollHeight - window.innerHeight,
      )
      const destinationY = Math.max(0, Math.min(rawTop, maxScroll))
      window.scrollTo({ top: destinationY, behavior })
      return true
    },
    [getHeaderOffset],
  )

  // Close menus on route/hash navigation
  useEffect(() => {
    setMobileMenuOpen(false)
    setLangMenuOpen(false)
  }, [location.pathname, location.hash])

  // Close dropdown/mobile menu on Escape or outside click
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setLangMenuOpen(false)
        setMobileMenuOpen(false)
      }
    }
    const handlePointerDown = (event: MouseEvent) => {
      if (
        langMenuOpen &&
        langMenuRef.current &&
        !langMenuRef.current.contains(event.target as Node)
      ) {
        setLangMenuOpen(false)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('mousedown', handlePointerDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mousedown', handlePointerDown)
    }
  }, [langMenuOpen])

  // Cross-route & history (Back/Forward) hash synchronization on the homepage
  useEffect(() => {
    const cameFromOtherRoute = prevPathnameRef.current !== location.pathname
    prevPathnameRef.current = location.pathname

    if (location.pathname !== ROUTES.home) {
      programmaticScrollLockRef.current = null
      return
    }

    const hashTarget = hashToNavItem(location.hash)
    const behavior: ScrollBehavior = prefersReducedMotion() ? 'auto' : 'smooth'

    if (hashTarget) {
      setHomeActiveSection(hashTarget)
      programmaticScrollLockRef.current = {
        id: hashTarget,
        until: performance.now() + 1400,
      }

      let cancelled = false
      let attempts = 0
      const timers: number[] = []
      const targetBehavior: ScrollBehavior = cameFromOtherRoute ? 'auto' : behavior

      const tryScroll = () => {
        if (cancelled) return
        const found = scrollToHomeSection(hashTarget, targetBehavior)
        if (!found && attempts < 25) {
          attempts += 1
          timers.push(window.setTimeout(tryScroll, 40))
        }
      }

      // Run after React Router's ScrollRestoration layout effect settles
      const rafId = window.requestAnimationFrame(() => {
        tryScroll()
        if (cameFromOtherRoute) {
          // Re-align deterministically if above-the-fold images/fonts expand layout height
          for (const delay of [90, 220, 400]) {
            timers.push(
              window.setTimeout(() => {
                if (!cancelled) scrollToHomeSection(hashTarget, 'auto')
              }, delay),
            )
          }
        }
      })

      return () => {
        cancelled = true
        window.cancelAnimationFrame(rafId)
        timers.forEach((id) => window.clearTimeout(id))
      }
    }

    // Navigated to '/' with empty hash (e.g. from '/internship' or Back from '/#pricing')
    setHomeActiveSection('home')
    programmaticScrollLockRef.current = {
      id: 'home',
      until: performance.now() + 1300,
    }
    const rafId = window.requestAnimationFrame(() => {
      window.scrollTo({
        top: 0,
        behavior: cameFromOtherRoute ? 'auto' : behavior,
      })
    })
    return () => window.cancelAnimationFrame(rafId)
  }, [location.pathname, location.hash, location.key, scrollToHomeSection])

  // Homepage manual scroll-spy (keeps sensible active state without flickering across unmapped sections)
  useEffect(() => {
    if (!isHome) return

    let ticking = false

    const computeActiveFromScroll = () => {
      ticking = false
      const lock = programmaticScrollLockRef.current
      if (lock && performance.now() < lock.until) {
        return
      }
      if (lock) {
        programmaticScrollLockRef.current = null
      }

      const scrollY = window.scrollY
      if (scrollY < 80) {
        setHomeActiveSection((prev) => (prev === 'home' ? prev : 'home'))
        return
      }

      // Near bottom of document -> Contact Us (Footer)
      const docHeight = document.documentElement.scrollHeight
      if (window.innerHeight + scrollY >= docHeight - 72) {
        setHomeActiveSection((prev) => (prev === 'contact' ? prev : 'contact'))
        return
      }

      const activationY =
        scrollY + getHeaderOffset() + Math.min(220, window.innerHeight * 0.26)

      let matched: PublicNavItemId = 'home'
      for (const landmark of HOME_SECTION_LANDMARKS) {
        const el = findSectionElement(landmark.navId)
        if (!el) continue
        const top = el.getBoundingClientRect().top + scrollY
        if (top <= activationY) {
          matched = landmark.navId
        }
      }

      setHomeActiveSection((prev) => (prev === matched ? prev : matched))
    }

    const onScroll = () => {
      if (!ticking) {
        ticking = true
        window.requestAnimationFrame(computeActiveFromScroll)
      }
    }

    const releaseProgrammaticLock = () => {
      programmaticScrollLockRef.current = null
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    window.addEventListener('wheel', releaseProgrammaticLock, { passive: true })
    window.addEventListener('touchmove', releaseProgrammaticLock, { passive: true })

    // Sync initial scroll position on mount
    computeActiveFromScroll()

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      window.removeEventListener('wheel', releaseProgrammaticLock)
      window.removeEventListener('touchmove', releaseProgrammaticLock)
    }
  }, [isHome, getHeaderOffset])

  // Smoothly moving desktop purple pill geometry
  const [pillGeometry, setPillGeometry] = useState<{
    left: number
    width: number
    ready: boolean
    animate: boolean
  }>({ left: 0, width: 0, ready: false, animate: false })
  const prevLangForPillRef = useRef(i18n.language)

  const updatePillGeometry = useCallback(
    (allowAnimate: boolean) => {
      const navEl = navRef.current
      const activeEl = itemRefs.current[resolvedActiveItem]
      if (!navEl || !activeEl) return
      const left = activeEl.offsetLeft
      const width = activeEl.offsetWidth
      if (width <= 0) return

      setPillGeometry((prev) => {
        if (
          prev.ready &&
          prev.left === left &&
          prev.width === width &&
          prev.animate === allowAnimate
        ) {
          return prev
        }
        return {
          left,
          width,
          ready: true,
          animate: prev.ready && allowAnimate && !prefersReducedMotion(),
        }
      })
    },
    [resolvedActiveItem],
  )

  useLayoutEffect(() => {
    const langChanged = prevLangForPillRef.current !== i18n.language
    prevLangForPillRef.current = i18n.language
    updatePillGeometry(!langChanged)
  }, [resolvedActiveItem, i18n.language, navItems, updatePillGeometry])

  useEffect(() => {
    const navEl = navRef.current
    if (!navEl || typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(() => updatePillGeometry(false))
    ro.observe(navEl)
    Object.values(itemRefs.current).forEach((el) => {
      if (el) ro.observe(el)
    })
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => updatePillGeometry(false)).catch(() => {})
    }
    return () => ro.disconnect()
  }, [navItems, updatePillGeometry])

  // Click handlers
  const handleHomeOrLogoClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    setMobileMenuOpen(false)
    if (isHome) {
      event.preventDefault()
      setHomeActiveSection('home')
      programmaticScrollLockRef.current = {
        id: 'home',
        until: performance.now() + 800,
      }
      if (location.hash) {
        navigate(ROUTES.home)
      } else {
        window.scrollTo({
          top: 0,
          behavior: prefersReducedMotion() ? 'auto' : 'smooth',
        })
      }
    }
  }

  const handleInternshipClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    setMobileMenuOpen(false)
    if (location.pathname === ROUTES.internship) {
      event.preventDefault()
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion() ? 'auto' : 'smooth',
      })
    }
  }

  const handleSectionItemClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    navId: PublicNavItemId,
    hash: string,
  ) => {
    event.preventDefault()
    setMobileMenuOpen(false)
    const behavior: ScrollBehavior = prefersReducedMotion() ? 'auto' : 'smooth'

    if (isHome) {
      setHomeActiveSection(navId)
      programmaticScrollLockRef.current = {
        id: navId,
        until: performance.now() + 900,
      }
      if (location.hash !== hash) {
        navigate({ pathname: ROUTES.home, hash })
      } else {
        scrollToHomeSection(navId, behavior)
      }
      return
    }

    navigate({ pathname: ROUTES.home, hash })
  }

  const selectLanguage = (lang: 'en' | 'ar') => {
    setLangMenuOpen(false)
    if (currentLang !== lang) {
      i18n.changeLanguage(lang)
    }
  }

  const handleSignOut = () => {
    setMobileMenuOpen(false)
    signOut()
    navigate(ROUTES.home, { replace: true })
  }

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-50 w-full border-b border-[#EDE4F8]/80 bg-[#FDFBFF]/92 backdrop-blur-md shadow-[0_4px_24px_-14px_rgba(76,18,150,0.1)] transition-colors euveka-nav-enter"
    >
      {/* Clipped ambient lavender glows matching the visual specification */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-clip">
        <div className="absolute start-0 -top-12 h-36 w-[300px] rounded-full bg-[radial-gradient(ellipse_at_25%_50%,rgba(218,195,255,0.48)_0%,rgba(235,222,255,0.2)_52%,transparent_78%)]" />
        <div className="absolute end-0 -bottom-12 h-36 w-[300px] rounded-full bg-[radial-gradient(ellipse_at_75%_50%,rgba(218,195,255,0.44)_0%,rgba(235,222,255,0.18)_52%,transparent_78%)]" />
      </div>

      <div className={`relative ${containerClassName}`}>
        <div className="flex h-[74px] lg:h-[86px] items-center justify-between gap-3 xl:gap-6">
          {/* Far Left: InternsHub Hexagonal Logo & Wordmark */}
          <div className="flex shrink-0 items-center">
            <Link
              to={ROUTES.home}
              onClick={handleHomeOrLogoClick}
              aria-label={t('nav.homeLabel')}
              dir="ltr"
              className="group inline-flex items-center gap-2.5 rounded-xl py-1 pe-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6D28D9] focus-visible:ring-offset-2"
            >
              <EdTechLogoMark className="h-[36px] w-[33px] sm:h-[38px] sm:w-[35px] shrink-0 transition-transform duration-200 group-hover:scale-[1.03]" />
              <span className="font-sans text-[20px] min-[360px]:text-[22px] sm:text-[24px] font-extrabold tracking-[-0.025em] text-[#4B1196]">
                {t('nav.brand')}
              </span>
            </Link>
          </div>

          {/* Center (Desktop): Long Rounded White Pill Navigation Container */}
          <nav
            ref={navRef}
            aria-label="Main Navigation"
            className="relative hidden lg:flex items-center gap-0.5 xl:gap-1 rounded-full border border-[#EFE7FB] bg-white/96 p-1.5 shadow-[0_8px_28px_-8px_rgba(88,28,135,0.11),0_1px_4px_rgba(88,28,135,0.04)]"
          >
            {/* Smoothly gliding purple active pill */}
            {pillGeometry.ready && (
              <span
                aria-hidden="true"
                style={{
                  transform: `translate3d(${pillGeometry.left}px, -50%, 0)`,
                  width: `${pillGeometry.width}px`,
                }}
                className={`pointer-events-none absolute left-0 top-1/2 h-[calc(100%-12px)] rounded-full bg-[linear-gradient(135deg,#7E46EC_0%,#6428D8_100%)] shadow-[0_6px_16px_-3px_rgba(100,40,216,0.42)] ${
                  pillGeometry.animate
                    ? 'transition-[transform,width] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none'
                    : ''
                }`}
              />
            )}

            {navItems.map((item) => {
              const isActive = resolvedActiveItem === item.id
              const fallbackActivePill =
                isActive && !pillGeometry.ready
                  ? 'bg-[linear-gradient(135deg,#7E46EC_0%,#6428D8_100%)] shadow-[0_6px_16px_-3px_rgba(100,40,216,0.42)]'
                  : ''

              const itemClassName = `relative z-10 inline-flex items-center justify-center whitespace-nowrap rounded-full px-3 xl:px-5 py-2 text-[13px] xl:text-[14px] font-semibold transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6D28D9] focus-visible:ring-offset-1 ${fallbackActivePill} ${
                isActive
                  ? 'text-white'
                  : 'text-[#3A4356] hover:text-[#5B189A] hover:bg-[#F7F2FF]/75'
              }`

              if (item.kind === 'home') {
                return (
                  <Link
                    key={item.id}
                    ref={(el) => {
                      itemRefs.current[item.id] = el
                    }}
                    to={item.to}
                    onClick={handleHomeOrLogoClick}
                    aria-current={isActive ? 'page' : undefined}
                    className={itemClassName}
                  >
                    {item.label}
                  </Link>
                )
              }

              if (item.kind === 'route') {
                return (
                  <Link
                    key={item.id}
                    ref={(el) => {
                      itemRefs.current[item.id] = el
                    }}
                    to={item.to}
                    onClick={handleInternshipClick}
                    aria-current={isActive ? 'page' : undefined}
                    className={itemClassName}
                  >
                    {item.label}
                  </Link>
                )
              }

              return (
                <Link
                  key={item.id}
                  ref={(el) => {
                    itemRefs.current[item.id] = el
                  }}
                  to={item.to}
                  onClick={(e) => handleSectionItemClick(e, item.id, item.hash)}
                  aria-current={isActive ? 'location' : undefined}
                  className={itemClassName}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>

          {/* Far Right (Desktop): Language Selector, Log In, Outlined Sign Up Free */}
          <div className="hidden lg:flex shrink-0 items-center gap-2.5 xl:gap-5">
            {/* Language Selector Dropdown Pill */}
            <div ref={langMenuRef} className="relative">
              <button
                type="button"
                onClick={() => setLangMenuOpen((prev) => !prev)}
                aria-haspopup="menu"
                aria-expanded={langMenuOpen}
                aria-label={t('nav.languageSelector', 'Select language')}
                className="inline-flex h-[38px] items-center gap-1.5 xl:gap-2 rounded-full border border-[#E9DDF9] bg-[#F3EEFC] px-3 xl:px-3.5 text-[13px] font-semibold text-[#3B4458] transition-all duration-150 hover:border-[#D8C2F8] hover:bg-[#ECE3FB] hover:text-[#4B1196] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6D28D9] focus-visible:ring-offset-2 cursor-pointer"
              >
                <Globe className="size-4 shrink-0 text-[#6B21A8]" aria-hidden="true" />
                <span className="leading-none">{t('nav.toggleLanguage')}</span>
                <ChevronDown
                  aria-hidden="true"
                  className={`size-3.5 shrink-0 text-[#6B21A8] transition-transform duration-200 ${
                    langMenuOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {langMenuOpen && (
                <div
                  role="menu"
                  aria-label={t('nav.languageSelector', 'Select language')}
                  className="absolute end-0 mt-2 w-40 origin-top-end rounded-2xl border border-[#EAE0F8] bg-white p-1.5 shadow-[0_14px_34px_-8px_rgba(76,18,150,0.18)] backdrop-blur-md z-50"
                >
                  <button
                    type="button"
                    role="menuitemradio"
                    aria-checked={currentLang === 'en'}
                    onClick={() => selectLanguage('en')}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-[13px] font-semibold transition-colors cursor-pointer ${
                      currentLang === 'en'
                        ? 'bg-[#F4EEFD] text-[#5B189A]'
                        : 'text-[#3A4356] hover:bg-[#FAF6FF] hover:text-[#5B189A]'
                    }`}
                  >
                    <span dir="ltr">English</span>
                    {currentLang === 'en' && (
                      <Check className="size-3.5 text-[#6D28D9]" aria-hidden="true" />
                    )}
                  </button>
                  <button
                    type="button"
                    role="menuitemradio"
                    aria-checked={currentLang === 'ar'}
                    onClick={() => selectLanguage('ar')}
                    className={`mt-0.5 flex w-full items-center justify-between rounded-xl px-3 py-2 text-[13px] font-semibold transition-colors cursor-pointer ${
                      currentLang === 'ar'
                        ? 'bg-[#F4EEFD] text-[#5B189A]'
                        : 'text-[#3A4356] hover:bg-[#FAF6FF] hover:text-[#5B189A]'
                    }`}
                  >
                    <span dir="rtl">العربية</span>
                    {currentLang === 'ar' && (
                      <Check className="size-3.5 text-[#6D28D9]" aria-hidden="true" />
                    )}
                  </button>
                </div>
              )}
            </div>

            {isSignedIn ? (
              <>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="px-1.5 text-[14px] font-semibold text-[#5B189A] transition-colors hover:text-[#3B0764] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6D28D9] rounded-lg whitespace-nowrap cursor-pointer"
                >
                  {t('nav.signOut')}
                </button>
                <Link
                  to={accountDestination}
                  className="inline-flex h-[40px] items-center justify-center rounded-full border-[1.5px] border-[#7C3AED] bg-white px-5 xl:px-6 text-[13.5px] xl:text-[14px] font-semibold text-[#5B189A] shadow-[0_2px_10px_rgba(124,58,237,0.06)] transition-all duration-200 hover:border-[#5B189A] hover:bg-[#F6F0FF] hover:shadow-[0_6px_16px_-4px_rgba(91,24,154,0.18)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6D28D9] focus-visible:ring-offset-2 whitespace-nowrap"
                >
                  <span>{accountLabel}</span>
                </Link>
              </>
            ) : (
              <>
                {/* Log In Link */}
                <Link
                  to={ROUTES.login}
                  className="px-1.5 text-[14px] xl:text-[14.5px] font-semibold text-[#5B189A] transition-colors hover:text-[#3B0764] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6D28D9] rounded-lg whitespace-nowrap"
                >
                  {t('nav.login')}
                </Link>

                {/* Outlined Purple Sign Up Free Pill Button */}
                <Link
                  to={ROUTES.register}
                  className="inline-flex h-[40px] items-center justify-center rounded-full border-[1.5px] border-[#7C3AED] bg-white px-4 xl:px-6 text-[13px] xl:text-[14px] font-semibold text-[#5B189A] shadow-[0_2px_10px_rgba(124,58,237,0.06)] transition-all duration-200 hover:border-[#5B189A] hover:bg-[#F6F0FF] hover:shadow-[0_6px_16px_-4px_rgba(91,24,154,0.18)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6D28D9] focus-visible:ring-offset-2 whitespace-nowrap"
                >
                  <span>{t('nav.signUp')}</span>
                </Link>
              </>
            )}
          </div>

          {/* Tablet / Mobile Controls */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              type="button"
              onClick={() => selectLanguage(currentLang === 'ar' ? 'en' : 'ar')}
              aria-label={`Switch to ${currentLang === 'ar' ? 'English' : 'Arabic'}`}
              className="inline-flex h-9 items-center gap-1.5 rounded-full border border-[#E9DDF9] bg-[#F3EEFC] px-3 text-xs font-semibold text-[#4B1196] transition-colors hover:bg-[#EAE1FA] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6D28D9]"
            >
              <Globe className="size-3.5 text-[#6B21A8]" aria-hidden="true" />
              <span>{t('nav.toggleLanguage')}</span>
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-expanded={mobileMenuOpen}
              aria-controls="public-mobile-navigation"
              aria-label={mobileMenuOpen ? t('nav.closeMenu') : t('nav.openMenu')}
              className="inline-flex size-10 items-center justify-center rounded-full border border-[#ECE2F9] bg-white text-[#4B1196] shadow-2xs transition-colors hover:bg-[#F6F0FF] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6D28D9]"
            >
              {mobileMenuOpen ? (
                <X className="size-5" aria-hidden="true" />
              ) : (
                <Menu className="size-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Responsive Mobile & Tablet Navigation Drawer */}
      {mobileMenuOpen && (
        <div
          id="public-mobile-navigation"
          className="lg:hidden border-t border-[#EFE7FA] bg-white/98 backdrop-blur-xl shadow-[0_20px_40px_-15px_rgba(76,18,150,0.14)]"
        >
          <div className="mx-auto max-w-[1280px] px-4 pt-3 pb-6 sm:px-6">
            <nav aria-label="Mobile Navigation" className="flex flex-col gap-1">
              {navItems.map((item) => {
                const isActive = resolvedActiveItem === item.id
                const mobileItemClass = `flex items-center justify-between rounded-full px-4 py-2.5 text-[15px] font-semibold transition-all ${
                  isActive
                    ? 'bg-[linear-gradient(135deg,#7E46EC_0%,#6428D8_100%)] text-white shadow-[0_6px_16px_-4px_rgba(100,40,216,0.4)]'
                    : 'text-[#3A4356] hover:bg-[#F6F0FF] hover:text-[#5B189A]'
                }`

                if (item.kind === 'home') {
                  return (
                    <Link
                      key={item.id}
                      to={item.to}
                      onClick={handleHomeOrLogoClick}
                      aria-current={isActive ? 'page' : undefined}
                      className={mobileItemClass}
                    >
                      <span>{item.label}</span>
                    </Link>
                  )
                }

                if (item.kind === 'route') {
                  return (
                    <Link
                      key={item.id}
                      to={item.to}
                      onClick={handleInternshipClick}
                      aria-current={isActive ? 'page' : undefined}
                      className={mobileItemClass}
                    >
                      <span>{item.label}</span>
                    </Link>
                  )
                }

                return (
                  <Link
                    key={item.id}
                    to={item.to}
                    onClick={(e) => handleSectionItemClick(e, item.id, item.hash)}
                    aria-current={isActive ? 'location' : undefined}
                    className={mobileItemClass}
                  >
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </nav>

            {/* Mobile Language Selector Row */}
            <div className="mt-4 flex items-center justify-between rounded-2xl border border-[#EFE7FA] bg-[#FAF7FF] px-3.5 py-2.5">
              <span className="inline-flex items-center gap-2 text-xs font-semibold text-[#5B189A]">
                <Globe className="size-4 text-[#6B21A8]" aria-hidden="true" />
                <span>{t('nav.languageSelector', 'Select language')}</span>
              </span>
              <div className="inline-flex items-center gap-1 rounded-full bg-white p-1 border border-[#EAE0F8]">
                <button
                  type="button"
                  onClick={() => selectLanguage('en')}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                    currentLang === 'en'
                      ? 'bg-[#6D28D9] text-white'
                      : 'text-[#3A4356] hover:text-[#5B189A]'
                  }`}
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => selectLanguage('ar')}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                    currentLang === 'ar'
                      ? 'bg-[#6D28D9] text-white'
                      : 'text-[#3A4356] hover:text-[#5B189A]'
                  }`}
                >
                  العربية
                </button>
              </div>
            </div>

            {/* Mobile Auth Actions */}
            <div className="mt-4 pt-4 border-t border-[#EFE7FA] flex flex-col sm:flex-row items-center gap-3">
              {isSignedIn ? (
                <>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="w-full sm:w-auto sm:flex-1 rounded-full py-2.5 text-center text-sm font-semibold text-[#5B189A] hover:bg-[#F6F0FF] transition-colors"
                  >
                    {t('nav.signOut')}
                  </button>
                  <Link
                    to={accountDestination}
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full sm:w-auto sm:flex-1 inline-flex items-center justify-center gap-2 rounded-full border-[1.5px] border-[#7C3AED] bg-white py-2.5 px-6 text-sm font-semibold text-[#5B189A] shadow-2xs hover:bg-[#F6F0FF] transition-all"
                  >
                    <span>{accountLabel}</span>
                    {isRtl ? (
                      <ArrowLeft className="size-4" aria-hidden="true" />
                    ) : (
                      <ArrowRight className="size-4" aria-hidden="true" />
                    )}
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to={ROUTES.login}
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full sm:w-auto sm:flex-1 rounded-full py-2.5 text-center text-sm font-semibold text-[#5B189A] hover:bg-[#F6F0FF] transition-colors"
                  >
                    {t('nav.login')}
                  </Link>
                  <Link
                    to={ROUTES.register}
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full sm:w-auto sm:flex-1 inline-flex items-center justify-center gap-2 rounded-full border-[1.5px] border-[#7C3AED] bg-white py-2.5 px-6 text-sm font-semibold text-[#5B189A] shadow-2xs hover:bg-[#F6F0FF] transition-all"
                  >
                    <span>{t('nav.signUp')}</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
