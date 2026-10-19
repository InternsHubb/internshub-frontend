// TEMPORARY: local copy of the footer from the Internship Figma frame, without the "Vector 12" wave ribbon.
// Replace with the team's shared Footer once it lands on main.
// Labels reuse the landing Footer's `footer.*` translation keys.
import { useTranslation } from 'react-i18next'
import socialFacebook from '../../assets/internship/social-facebook.svg'
import socialInstagram from '../../assets/internship/social-instagram.svg'
import socialLinkedin from '../../assets/internship/social-linkedin.svg'
import socialTwitter from '../../assets/internship/social-twitter.svg'
import { PAGE_CONTAINER } from './layout'

interface FooterColumn {
  titleKey: string
  linkKeys: ReadonlyArray<string>
}

interface SocialLink {
  label: string
  icon: string
}

const FOOTER_COLUMNS: ReadonlyArray<FooterColumn> = [
  {
    titleKey: 'footer.colCompany',
    linkKeys: ['footer.linkAbout', 'footer.linkBlog', 'footer.linkCareers', 'footer.linkPartners'],
  },
  {
    titleKey: 'footer.colCourses',
    linkKeys: ['footer.linkAllCourses', 'footer.linkLearningPaths', 'footer.linkInstructors', 'footer.linkFreeCourses'],
  },
  { titleKey: 'footer.colSupport', linkKeys: ['footer.linkHelp', 'footer.linkFaq', 'footer.linkContact'] },
]

const SOCIAL_LINKS: ReadonlyArray<SocialLink> = [
  { label: 'LinkedIn', icon: socialLinkedin },
  { label: 'Twitter', icon: socialTwitter },
  { label: 'Instagram', icon: socialInstagram },
  { label: 'Facebook', icon: socialFacebook },
]

function InternshipFooter() {
  const { t } = useTranslation()

  return (
    <footer className="relative mt-24 bg-[#22023c]">
      <div className={`relative py-16 ${PAGE_CONTAINER}`}>
        <div className="grid grid-cols-1 gap-10 border-b border-white/10 pb-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-[85px]">
          <div className="flex flex-col gap-5">
            <p className="text-base leading-6 font-extrabold text-white">{t('footer.colEdtech')}</p>
            <p className="max-w-[252px] text-base leading-[26px] font-medium text-white/60">
              {t('footer.brandDescription')}
            </p>
          </div>

          {FOOTER_COLUMNS.map((column) => (
            <nav key={column.titleKey} aria-label={t(column.titleKey)} className="flex flex-col gap-5">
              <p className="text-base leading-6 font-extrabold text-white">{t(column.titleKey)}</p>
              <ul className="flex flex-col gap-3">
                {column.linkKeys.map((linkKey) => (
                  <li key={linkKey}>
                    <a href="#" className="text-base leading-6 font-medium text-white/60 transition-colors hover:text-white">
                      {t(linkKey)}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="flex flex-col-reverse items-start gap-6 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-base leading-6 font-medium text-white/60">
            © 2026 {t('footer.copyright')}
          </p>
          <ul className="flex items-center gap-3">
            {SOCIAL_LINKS.map((social) => (
              <li key={social.label}>
                <a
                  href="#"
                  aria-label={social.label}
                  className="flex size-10 items-center justify-center rounded-full bg-[#a266bc] transition-colors hover:bg-[#8b5db0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  <img alt="" src={social.icon} />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  )
}

export default InternshipFooter
