// TEMPORARY: local copy of the footer from the Internship Figma frame, including the "Vector 12" wave.
// Replace with the team's shared Footer once it lands on main.
import footerWave from '../../assets/internship/footer-wave-vector-12.svg'
import socialFacebook from '../../assets/internship/social-facebook.svg'
import socialInstagram from '../../assets/internship/social-instagram.svg'
import socialLinkedin from '../../assets/internship/social-linkedin.svg'
import socialTwitter from '../../assets/internship/social-twitter.svg'

interface FooterColumn {
  title: string
  links: ReadonlyArray<string>
}

interface SocialLink {
  label: string
  icon: string
}

const FOOTER_COLUMNS: ReadonlyArray<FooterColumn> = [
  { title: 'Company', links: ['About Us', 'Blog', 'Careers', 'Partners'] },
  { title: 'Courses', links: ['All Courses', 'Learning Paths', 'Instructors', 'Free Courses'] },
  { title: 'Support', links: ['Help Center', 'FAQ', 'Contact Us'] },
]

const SOCIAL_LINKS: ReadonlyArray<SocialLink> = [
  { label: 'LinkedIn', icon: socialLinkedin },
  { label: 'Twitter', icon: socialTwitter },
  { label: 'Instagram', icon: socialInstagram },
  { label: 'Facebook', icon: socialFacebook },
]

function InternshipFooter() {
  return (
    <footer className="relative mt-[164px] bg-[#22023c]">
      {/* Vector 12: 1849.5 x 141.5 at x = -357 in the 1440 frame, overlapping the footer top by 71px. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute start-[-24.79%] top-0 aspect-[1849.5/141.5] w-[128.44%] -translate-y-[50.2%]"
      >
        <div className="absolute inset-[-18.24%_-1.78%_-38.56%_-2.04%]">
          <img alt="" src={footerWave} className="block size-full max-w-none" />
        </div>
      </div>

      <div className="relative mx-auto max-w-[1440px] px-6 pt-[88px] pb-16 sm:px-16">
        <div className="grid grid-cols-1 gap-10 border-b border-white/10 pb-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-[85px]">
          <div className="flex flex-col gap-5">
            <p className="text-base leading-6 font-extrabold text-white">EdTech</p>
            <p className="max-w-[252px] text-base leading-[26px] font-medium text-white/60">
              A learning platform that helps you build practical skills from zero to pro, with clear paths and real
              projects.
            </p>
          </div>

          {FOOTER_COLUMNS.map((column) => (
            <nav key={column.title} aria-label={column.title} className="flex flex-col gap-5">
              <p className="text-base leading-6 font-extrabold text-white">{column.title}</p>
              <ul className="flex flex-col gap-3">
                {column.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-base leading-6 font-medium text-white/60 transition-colors hover:text-white">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="flex flex-col-reverse items-start gap-6 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-base leading-6 font-medium text-white/60">
            © 2026 EdTech. All rights reserved by SpaceTech.
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
