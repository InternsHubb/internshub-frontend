import React, { useId, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/app/routes'
import { useScrollReveal } from '@/shared/hooks/useScrollReveal'
import cardDeco from '@/assets/footer/card-deco.svg'
import glowLeft from '@/assets/footer/glow-left.svg'
import glowRight from '@/assets/footer/glow-right.svg'
import iconCompany from '@/assets/footer/icon-company.jpg'
import iconCourses from '@/assets/footer/icon-courses.jpg'
import iconSupport from '@/assets/footer/icon-support.jpg'
import sparkle from '@/assets/footer/sparkle.svg'
import socialFacebook from '@/assets/footer/social-facebook.svg'
import socialInstagram from '@/assets/footer/social-instagram.svg'
import socialLinkedin from '@/assets/footer/social-linkedin.svg'
import socialTwitter from '@/assets/footer/social-twitter.svg'

// Shared site footer (Figma "Footer", nodes 16:4153 landing / 16:5481 internship).
// Figma only has the 1440px desktop frame; smaller screens stack the same blocks.
// Blocks use the shared `.reveal-on-scroll` classes, so the page must call useScrollReveal()
// (LandingPage and InternshipPage do); with reduced motion the hook shows them immediately.

interface FooterProps {
  // Called with a validated email when the newsletter form is submitted. There is no
  // newsletter endpoint yet, so pages pass nothing until the backend provides one.
  onSubscribe?: (email: string) => void
}

interface FooterColumn {
  titleKey: string
  icon: string
  links: ReadonlyArray<{ labelKey: string; href: string }>
}

interface SocialLink {
  label: string
  href: string
  icon: string
  // Icon box from Figma; the glyphs are not square.
  iconClassName: string
}

const FOOTER_COLUMNS: ReadonlyArray<FooterColumn> = [
  {
    titleKey: 'footer.colCompany',
    icon: iconCompany,
    links: [
      { labelKey: 'footer.linkAbout', href: '/#about' },
      { labelKey: 'footer.linkBlog', href: '#blog' },
      { labelKey: 'footer.linkCareers', href: '#careers' },
      { labelKey: 'footer.linkPartners', href: '#partners' },
    ],
  },
  {
    titleKey: 'footer.colCourses',
    icon: iconCourses,
    links: [
      { labelKey: 'footer.linkAllCourses', href: '#all-courses' },
      { labelKey: 'footer.linkLearningPaths', href: '#paths' },
      { labelKey: 'footer.linkInstructors', href: '#mentors' },
    ],
  },
  {
    titleKey: 'footer.colSupport',
    icon: iconSupport,
    links: [
      { labelKey: 'footer.linkHelp', href: '#help' },
      { labelKey: 'footer.linkFaq', href: '#faq' },
      { labelKey: 'footer.linkContact', href: '#contact' },
    ],
  },
]

const SOCIAL_LINKS: ReadonlyArray<SocialLink> = [
  { label: 'LinkedIn', href: 'https://linkedin.com', icon: socialLinkedin, iconClassName: 'h-4 w-[14px]' },
  { label: 'Twitter', href: 'https://twitter.com', icon: socialTwitter, iconClassName: 'size-4' },
  { label: 'Instagram', href: 'https://instagram.com', icon: socialInstagram, iconClassName: 'h-4 w-[14px]' },
  { label: 'Facebook', href: 'https://facebook.com', icon: socialFacebook, iconClassName: 'h-4 w-[10px]' },
]

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Two short rounded strokes used as accents next to the logo and inside the newsletter card.
function DecoStrokes({ className, first, second }: { className: string; first: string; second: string }) {
  return (
    <span aria-hidden="true" className={`pointer-events-none absolute rtl:-scale-x-100 ${className}`}>
      <span className={`absolute h-[3px] rounded-[2px] ${first}`} />
      <span className={`absolute h-[3px] rounded-[2px] ${second}`} />
    </span>
  )
}

function NewsletterCard({ onSubscribe }: FooterProps) {
  const { t } = useTranslation()
  const inputId = useId()
  const errorId = useId()
  const [email, setEmail] = useState('')
  const [isInvalid, setIsInvalid] = useState(false)

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const value = email.trim()
    if (!EMAIL_PATTERN.test(value)) {
      setIsInvalid(true)
      return
    }
    setIsInvalid(false)
    onSubscribe?.(value)
  }

  return (
    <div className="relative flex w-full flex-col gap-3 overflow-clip rounded-[24px] border border-[rgba(166,140,250,0.4)] bg-white/[0.06] p-5 sm:p-7 xl:w-[400px] xl:shrink-0">
      <img src={cardDeco} alt="" width={90} height={36} className="block h-9 w-[90px] rtl:-scale-x-100" />
      <DecoStrokes
        className="start-[248px] top-[38px] h-4 w-5"
        first="start-0 top-1 w-4 rotate-35 bg-[#e878fa]"
        second="start-2 top-3 w-3 -rotate-10 bg-[#a68cfa]"
      />
      <p className="text-[22px] leading-[30px] font-bold text-white sm:text-[26px] sm:leading-[34px]">
        {t('footer.newsletterTitle')}
      </p>
      <p className="text-sm leading-[22px] font-medium text-white/70">{t('footer.newsletterBody')}</p>

      <form noValidate onSubmit={handleSubmit}>
        <label htmlFor={inputId} className="sr-only">
          {t('footer.newsletterEmailLabel')}
        </label>
        <div
          className={`flex items-center gap-2 rounded-[28px] border bg-white/5 py-1.5 ps-5 pe-1.5 transition-colors focus-within:border-[#e878fa] ${
            isInvalid ? 'border-[#ff8a8a]' : 'border-white/20'
          }`}
        >
          <input
            id={inputId}
            type="email"
            inputMode="email"
            autoComplete="email"
            dir="ltr"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value)
              if (isInvalid) setIsInvalid(false)
            }}
            placeholder={t('footer.newsletterPlaceholder')}
            aria-invalid={isInvalid}
            aria-describedby={isInvalid ? errorId : undefined}
            className="min-w-0 flex-1 bg-transparent text-sm font-medium text-white placeholder:text-white/50 focus:outline-none rtl:text-right rtl:placeholder:text-right"
          />
          <button
            type="submit"
            className="shrink-0 rounded-[22px] bg-gradient-to-r from-[#bf26d4] to-[#e878fa] px-6 py-[13px] text-sm font-bold text-white transition hover:brightness-110 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#22023c]"
          >
            {t('footer.newsletterCta')}
          </button>
        </div>
        {isInvalid && (
          <p id={errorId} role="alert" className="mt-2 ps-5 text-[13px] font-medium text-[#ffb3b3]">
            {t('footer.newsletterInvalidEmail')}
          </p>
        )}
      </form>
    </div>
  )
}

export const Footer: React.FC<FooterProps> = ({ onSubscribe }) => {
  const { t } = useTranslation()
  useScrollReveal()
  const currentYear = new Date().getFullYear()

  const handleBrandClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (window.location.pathname !== ROUTES.home) return
    event.preventDefault()
    if (window.location.hash) window.history.pushState(null, '', ROUTES.home)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer id="contact" className="relative mt-16 w-full overflow-clip bg-[#22023c] text-white sm:mt-24 scroll-mt-24">
      {/* Background glows (Figma "Glow Left" / "Glow Right"), anchored to the bottom corners as in the
          459px desktop frame. The SVGs include their own 140px blur margin. */}
      <img
        src={glowLeft}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -start-[280px] bottom-[-221px] h-[520px] w-[740px] max-w-none select-none"
      />
      <img
        src={glowRight}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -end-[240px] bottom-[-211px] h-[480px] w-[740px] max-w-none select-none"
      />

      <div className="relative mx-auto max-w-[1440px] px-4 sm:px-10 lg:px-16">
        <div className="flex flex-col gap-10 pt-12 pb-10 xl:flex-row xl:items-start xl:gap-0 xl:pb-4">
          <div className="flex flex-col gap-10 lg:flex-row lg:gap-9 xl:pt-6">
            {/* Brand */}
            <div className="relative flex flex-col gap-4 lg:w-[320px] lg:shrink-0 xl:pb-[38px] reveal-on-scroll">
              <Link
                to={ROUTES.home}
                onClick={handleBrandClick}
                className="relative inline-flex w-fit rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#a68cfa]"
              >
                <span dir="ltr" className="text-[40px] leading-[48px] font-extrabold tracking-[0.35px] text-white">
                  Ed
                  <span className="bg-gradient-to-r from-[#a68cfa] to-[#e878fa] bg-clip-text text-transparent">Tech</span>
                </span>
                <DecoStrokes
                  className="-end-[36px] top-1 h-5 w-[22px]"
                  first="start-0 top-[6px] w-[18px] rotate-55 bg-[#a68cfa]"
                  second="start-2 top-[17px] w-3 rotate-10 bg-[#e878fa]"
                />
              </Link>
              <p className="max-w-[252px] text-base leading-[26px] font-medium text-white/[0.72]">
                {t('footer.brandDescription')}
              </p>
              <img
                src={sparkle}
                alt=""
                aria-hidden="true"
                width={22}
                height={22}
                className="pointer-events-none absolute start-[86px] top-[244px] hidden size-[22px] xl:block"
              />
            </div>

            {/* Link columns */}
            <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 lg:flex lg:gap-3 xl:pt-2 reveal-on-scroll reveal-delay-100">
              {FOOTER_COLUMNS.map((column) => (
                <nav key={column.titleKey} aria-label={t(column.titleKey)} className="flex flex-col gap-5 lg:w-[140px]">
                  <p className="flex items-center gap-2.5 text-base leading-6 font-extrabold text-white">
                    <img
                      src={column.icon}
                      alt=""
                      width={34}
                      height={34}
                      className="size-[34px] shrink-0 rounded-[10px] object-cover"
                    />
                    {t(column.titleKey)}
                  </p>
                  <ul className="flex flex-col gap-3">
                    {column.links.map((link) => (
                      <li key={link.labelKey}>
                        <a
                          href={link.href}
                          className="text-base leading-6 font-medium text-white/[0.68] transition-colors hover:text-white focus:outline-none focus-visible:text-white focus-visible:underline"
                        >
                          {t(link.labelKey)}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              ))}
            </div>
          </div>

          <div className="xl:ms-auto reveal-on-scroll reveal-scale reveal-delay-200">
            <NewsletterCard onSubscribe={onSubscribe} />
          </div>
        </div>

        {/* Divider + bottom bar */}
        <div className="flex flex-col-reverse items-start gap-5 border-t border-white/10 pt-8 pb-8 sm:flex-row sm:items-center sm:justify-between sm:pt-11 sm:pb-6 reveal-on-scroll reveal-delay-150">
          <p className="text-sm leading-6 font-medium text-white/60">
            © {currentYear} {t('footer.copyright')}
          </p>
          <ul aria-label={t('footer.socialLabel')} className="flex items-center gap-3">
            {SOCIAL_LINKS.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex size-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <img src={social.icon} alt="" className={`block ${social.iconClassName}`} />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  )
}

export default Footer
