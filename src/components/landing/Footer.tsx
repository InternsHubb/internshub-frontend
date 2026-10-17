import React from 'react'
import { useTranslation } from 'react-i18next'

export const Footer: React.FC = () => {
  const { t } = useTranslation()
  const currentYear = new Date().getFullYear()

  const linksCompany = [
    { label: t('footer.linkAbout'), href: '#about' },
    { label: t('footer.linkBlog'), href: '#blog' },
    { label: t('footer.linkCareers'), href: '#careers' },
    { label: t('footer.linkPartners'), href: '#partners' },
  ]

  const linksCourses = [
    { label: t('footer.linkAllCourses'), href: '#all-courses' },
    { label: t('footer.linkLearningPaths'), href: '#paths' },
    { label: t('footer.linkInstructors'), href: '#mentors' },
    { label: t('footer.linkFreeCourses'), href: '#free' },
  ]

  const linksSupport = [
    { label: t('footer.linkHelp'), href: '#help' },
    { label: t('footer.linkFaq'), href: '#faq' },
    { label: t('footer.linkContact'), href: '#contact' },
  ]

  return (
    <div className="relative mt-24 overflow-x-clip w-full">
      <footer className="w-full bg-[#22023c] text-white pt-[96px] sm:pt-[104px] lg:pt-[112px] pb-12 sm:pb-16 px-6 sm:px-12 lg:px-16 relative">
        {/* Exact Figma Vector 12 (node 1002:1015) layered in front of background */}
        <div className="max-w-[1440px] mx-auto absolute inset-x-0 top-0 pointer-events-none">
          <div
            className="absolute flex items-center justify-center w-[1200px] sm:w-[1500px] lg:w-[1852.277px] h-[120px] sm:h-[150px] lg:h-[184.229px] pointer-events-none select-none z-10"
            style={{
              top: '-92px',
              right: '-70.28px',
            }}
            data-node-id="1002:1015"
            data-name="Vector 12"
          >
            <div className="flex-none rotate-[1.32deg]">
              <div className="relative w-[1200px] sm:w-[1500px] lg:w-[1849.5px] h-[92px] sm:h-[115px] lg:h-[141.5px]">
                <div className="absolute inset-[-36.12%_-3.11%_-56.41%_-3.39%]">
                  <img
                    alt=""
                    className="block max-w-none size-full select-none pointer-events-none"
                    src="/images/footer-wave-ribbon.svg"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Container in normal document flow */}
        <div className="max-w-[1240px] mx-auto relative z-20">
          {/* 4 Column Navigation Grid (Figma node 1002:956) */}
          <div className="flex flex-col sm:flex-row flex-wrap lg:flex-nowrap justify-between items-start gap-10 lg:gap-8 pb-12 border-b border-white/10">
            {/* Column 1: Brand Info (Figma node 1002:957) */}
            <div className="w-full sm:w-[252px] shrink-0 text-start">
              <a href="#home" className="inline-block mb-4 sm:mb-5">
                <span className="text-[16px] font-extrabold tracking-[0.14px] text-white leading-[24px]">
                  {t('footer.colEdtech')}
                </span>
              </a>
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
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-6">
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
