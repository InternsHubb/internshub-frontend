import React, { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Menu, X, Globe, ArrowRight, ArrowLeft } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'
import { useAuth } from '@/hooks/useAuth'

interface NavbarProps {
  activeSection?: string
  // Prefix for the landing-section anchors. Pages other than the landing page pass
  // ROUTES.home so "#courses" becomes "/#courses" and leads back to that section.
  sectionLinkBase?: string
  // Width/padding of the inner row. Pages with a wider content container pass theirs
  // so the logo and actions line up with the page content below.
  containerClassName?: string
}

const DEFAULT_CONTAINER = 'max-w-[1240px] mx-auto px-4 sm:px-6'

export const Navbar: React.FC<NavbarProps> = ({
  activeSection = 'home',
  sectionLinkBase = '',
  containerClassName = DEFAULT_CONTAINER,
}) => {
  const { t, i18n } = useTranslation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { status, signOut } = useAuth()
  const isHome = location.pathname === ROUTES.home
  const isRtl = i18n.dir() === 'rtl'
  // 'loading' means a stored session is being checked: it is still a signed-in browser.
  const isSignedIn = status !== 'anonymous'

  const handleSignOut = () => {
    setMobileMenuOpen(false)
    signOut()
    navigate(ROUTES.home, { replace: true })
  }

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'ar' ? 'en' : 'ar'
    i18n.changeLanguage(nextLang)
  }

  const handleHomeClick = (e: React.MouseEvent) => {
    if (isHome) {
      e.preventDefault()
      if (window.location.hash) {
        window.history.pushState(null, '', ROUTES.home)
      }
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const navLinks = useMemo(
    () => [
      { id: 'home', label: t('nav.home'), href: ROUTES.home, isRoute: true },
      { id: 'courses', label: t('nav.courses'), href: `${sectionLinkBase}#courses` },
      // The Internship item opens its own page; the rest scroll to landing sections.
      { id: 'internship', label: t('nav.internship'), href: ROUTES.internship, isRoute: true },
      { id: 'mentorship', label: t('nav.mentorship'), href: `${sectionLinkBase}#mentorship` },
      { id: 'pricing', label: t('nav.pricing'), href: `${sectionLinkBase}#pricing` },
      { id: 'about', label: t('nav.about'), href: `${sectionLinkBase}#about` },
      { id: 'contact', label: t('nav.contact'), href: `${sectionLinkBase}#contact` },
    ],
    [t, sectionLinkBase],
  )

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-100/60 transition-colors euveka-nav-enter">
      <div className={containerClassName}>
        <div className="flex items-center justify-between h-[99px]">
          {/* Logo (Figma node 1002:933) */}
          <div className="flex-shrink-0 flex items-center">
            <Link
              to={ROUTES.home}
              onClick={handleHomeClick}
              className="flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 rounded-lg"
            >
              <span className="text-[26px] sm:text-[24px] font-bold tracking-tight text-[#5a198f] font-sans">
                EdTech
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links (Figma node 1002:935) */}
          <nav
            className="hidden lg:flex items-center gap-7 xl:gap-9"
            aria-label="Main Navigation"
          >
            {navLinks.map((link) => {
              const isActive = activeSection === link.id
              const className = `text-[16px] transition-colors relative py-1.5 ${
                isActive
                  ? 'text-[#5a198f] font-bold after:content-[""] after:absolute after:bottom-0 after:start-0 after:end-0 after:h-[2.5px] after:bg-[#5a198f] after:rounded-full'
                  : 'text-[#2d3748] hover:text-[#5a198f] font-medium'
              }`
              return link.isRoute ? (
                <Link
                  key={link.id}
                  to={link.href}
                  onClick={link.id === 'home' ? handleHomeClick : undefined}
                  className={className}
                >
                  {link.label}
                </Link>
              ) : (
                <a key={link.id} href={link.href} className={className}>
                  {link.label}
                </a>
              )
            })}
          </nav>

          {/* Desktop Right Side Actions (Figma node 1002:948) */}
          <div className="hidden lg:flex items-center gap-5">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-[#5a198f] bg-slate-100/80 hover:bg-purple-50 rounded-full transition-all focus:outline-none"
              aria-label={`Switch to ${i18n.language === 'ar' ? 'English' : 'Arabic'}`}
            >
              <Globe className="w-3.5 h-3.5 text-[#5a198f]" />
              <span>{t('nav.toggleLanguage')}</span>
            </button>

            {isSignedIn ? (
              <>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="text-[16px] font-medium text-[#2d3748] hover:text-[#5a198f] transition-colors px-1"
                >
                  {t('nav.signOut')}
                </button>
                <Link
                  to={ROUTES.onboarding}
                  className="inline-flex items-center justify-center px-6 py-2.5 text-[14px] sm:text-[15px] font-semibold text-white bg-[#5a198f] hover:bg-[#481275] rounded-full shadow-xs hover:shadow transition-all duration-200"
                >
                  <span>{t('nav.account')}</span>
                </Link>
              </>
            ) : (
              <>
                {/* Log In Link (Figma node 1002:949) */}
                <Link
                  to={ROUTES.login}
                  className="text-[16px] font-medium text-[#2d3748] hover:text-[#5a198f] transition-colors px-1"
                >
                  {t('nav.login')}
                </Link>

                {/* Sign Up Free Button (Figma node 1002:951) */}
                <Link
                  to={ROUTES.register}
                  className="inline-flex items-center justify-center px-6 py-2.5 text-[14px] sm:text-[15px] font-semibold text-white bg-[#5a198f] hover:bg-[#481275] rounded-full shadow-xs hover:shadow transition-all duration-200"
                >
                  <span>{t('nav.signUp')}</span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu & Language Toggle */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={toggleLanguage}
              type="button"
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 rounded-full"
              aria-label="Toggle language"
            >
              <Globe className="w-3.5 h-3.5 text-[#5a198f]" />
              <span>{t('nav.currentLanguage')}</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-xl text-slate-700 hover:text-purple-950 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-600"
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? t('nav.closeMenu') : t('nav.openMenu')}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-100 bg-white/95 backdrop-blur-xl animate-in slide-in-from-top-2 duration-200">
          <div className="px-4 pt-3 pb-6 space-y-1 sm:px-6">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id
              const className = `block px-4 py-2.5 rounded-xl text-base font-medium transition-colors ${
                isActive
                  ? 'text-[#5a198f] font-bold bg-purple-50'
                  : 'text-slate-700 hover:text-[#5a198f] hover:bg-purple-50/50'
              }`
              const handleClick = (e: React.MouseEvent) => {
                setMobileMenuOpen(false)
                if (link.id === 'home') {
                  handleHomeClick(e)
                }
              }
              return link.isRoute ? (
                <Link key={link.id} to={link.href} onClick={handleClick} className={className}>
                  {link.label}
                </Link>
              ) : (
                <a key={link.id} href={link.href} onClick={handleClick} className={className}>
                  {link.label}
                </a>
              )
            })}

            <div className="pt-4 mt-2 border-t border-slate-100 flex flex-col gap-3">
              {isSignedIn ? (
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="w-full text-center py-2.5 text-sm font-semibold text-slate-700 hover:text-[#5a198f] rounded-xl"
                >
                  {t('nav.signOut')}
                </button>
              ) : (
                <Link
                  to={ROUTES.login}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 text-sm font-semibold text-slate-700 hover:text-[#5a198f] rounded-xl"
                >
                  {t('nav.login')}
                </Link>
              )}
              <Link
                to={isSignedIn ? ROUTES.onboarding : ROUTES.register}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full inline-flex items-center justify-center gap-2 py-3 text-sm font-bold text-white bg-[#5a198f] hover:bg-[#481275] rounded-full shadow"
              >
                <span>{isSignedIn ? t('nav.account') : t('nav.signUp')}</span>
                {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
