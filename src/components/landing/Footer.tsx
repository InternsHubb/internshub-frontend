import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'

export const Footer: React.FC = () => {
  const { t } = useTranslation()
  const currentYear = new Date().getFullYear()

  const linksCompany = useMemo(
    () => [
      { label: t('footer.linkAbout'), href: '#about' },
      { label: t('footer.linkBlog'), href: '#blog' },
      { label: t('footer.linkCareers'), href: '#careers' },
      { label: t('footer.linkPartners'), href: '#partners' },
    ],
    [t],
  )

  const linksCourses = useMemo(
    () => [
      { label: t('footer.linkAllCourses'), href: '#all-courses' },
      { label: t('footer.linkLearningPaths'), href: '#paths' },
      { label: t('footer.linkInstructors'), href: '#mentors' },
      { label: t('footer.linkFreeCourses'), href: '#free' },
    ],
    [t],
  )

  const linksSupport = useMemo(
    () => [
      { label: t('footer.linkHelp'), href: '#help' },
      { label: t('footer.linkFaq'), href: '#faq' },
      { label: t('footer.linkContact'), href: '#contact' },
    ],
    [t],
  )

  return (
    <div className="relative mt-16 sm:mt-24 w-full">
      <footer id="contact" className="w-full bg-[#22023c] text-white py-12 sm:py-16 px-6 sm:px-12 lg:px-16 relative">
        {/* Content Container in normal document flow */}
        <div className="max-w-[1240px] mx-auto relative z-20">
          {/* 4 Column Navigation Grid (Figma node 1002:956) */}
          <div className="flex flex-col sm:flex-row flex-wrap lg:flex-nowrap justify-between items-start gap-10 lg:gap-8 pb-12 border-b border-white/10 reveal-on-scroll">
            {/* Column 1: Brand Info (Figma node 1002:957) */}
            <div className="w-full sm:w-[252px] shrink-0 text-start">
              <Link
                to={ROUTES.home}
                onClick={(e) => {
                  if (window.location.pathname === ROUTES.home) {
                    e.preventDefault()
                    if (window.location.hash) {
                      window.history.pushState(null, '', ROUTES.home)
                    }
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }
                }}
                className="inline-block mb-4 sm:mb-5"
              >
                <span className="text-[16px] font-extrabold tracking-[0.14px] text-white leading-[24px]">
                  {t('footer.colEdtech')}
                </span>
              </Link>
              <p className="text-[16px] font-medium text-white/90 leading-[26px]">
                {t('footer.brandDescription')}
              </p>
            </div>

            {/* Column 2: Company (Figma node 1002:961) */}
            <div className="w-full sm:w-[254px] shrink-0 text-start">
              <h4 className="text-[16px] font-extrabold text-white mb-4 sm:mb-5 tracking-[0.08px] leading-[24px]">
                {t('footer.colCompany')}
              </h4>
              <ul className="space-y-3">
                {linksCompany.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-[16px] font-medium text-white/80 hover:text-white transition-colors duration-200 leading-[24px] inline-block"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Courses (Figma node 1002:973) */}
            <div className="w-full sm:w-[254px] shrink-0 text-start">
              <h4 className="text-[16px] font-extrabold text-white mb-4 sm:mb-5 tracking-[0.14px] leading-[24px]">
                {t('footer.colCourses')}
              </h4>
              <ul className="space-y-3">
                {linksCourses.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-[16px] font-medium text-white/80 hover:text-white transition-colors duration-200 leading-[24px] inline-block"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: Support (Figma node 1002:985) */}
            <div className="w-full sm:w-[254px] shrink-0 text-start">
              <h4 className="text-[16px] font-extrabold text-white mb-4 sm:mb-5 tracking-[0.06px] leading-[24px]">
                {t('footer.colSupport')}
              </h4>
              <ul className="space-y-3">
                {linksSupport.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-[16px] font-medium text-white/80 hover:text-white transition-colors duration-200 leading-[24px] inline-block"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Bar: Copyright & White Social Circles (Figma node 1002:995) */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-6 reveal-on-scroll reveal-delay-150">
            <p className="text-[16px] font-medium text-white/90 leading-[24px] text-center sm:text-start">
              © {currentYear} {t('footer.copyright')}
            </p>

            {/* 4 White Circular Social Icons (Figma node 1002:998) */}
            <div className="flex items-center gap-3">
              {/* LinkedIn */}
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="size-[40px] rounded-full bg-white flex items-center justify-center hover:bg-[#E8CCFE] hover:scale-110 active:scale-95 transition-all duration-200 shadow-sm shrink-0"
              >
                <img
                  src="/images/footer-linkedin.svg"
                  alt="LinkedIn"
                  className="w-[14px] h-[16px] block select-none pointer-events-none"
                />
              </a>

              {/* Twitter / X */}
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="size-[40px] rounded-full bg-white flex items-center justify-center hover:bg-[#E8CCFE] hover:scale-110 active:scale-95 transition-all duration-200 shadow-sm shrink-0"
              >
                <img
                  src="/images/footer-twitter.svg"
                  alt="Twitter"
                  className="w-[16px] h-[16px] block select-none pointer-events-none"
                />
              </a>

              {/* Instagram */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="size-[40px] rounded-full bg-white flex items-center justify-center hover:bg-[#E8CCFE] hover:scale-110 active:scale-95 transition-all duration-200 shadow-sm shrink-0"
              >
                <img
                  src="/images/footer-instagram.svg"
                  alt="Instagram"
                  className="w-[14px] h-[16px] block select-none pointer-events-none"
                />
              </a>

              {/* Facebook */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="size-[40px] rounded-full bg-white flex items-center justify-center hover:bg-[#E8CCFE] hover:scale-110 active:scale-95 transition-all duration-200 shadow-sm shrink-0"
              >
                <img
                  src="/images/footer-facebook.svg"
                  alt="Facebook"
                  className="w-[10px] h-[16px] block select-none pointer-events-none"
                />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Footer
