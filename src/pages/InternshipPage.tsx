import '@fontsource-variable/plus-jakarta-sans'
import FAQ from '../components/internship/FAQ'
import Hero from '../components/internship/Hero'
import InternshipFooter from '../components/internship/InternshipFooter'
import PromoBanner from '../components/internship/PromoBanner'
import Testimonials from '../components/internship/Testimonials'
import TracksSection from '../components/internship/TracksSection'
import WhyChooseUs from '../components/internship/WhyChooseUs'
import { PAGE_CONTAINER } from '../components/internship/layout'
import { Navbar } from '../components/shared/Navbar'
import { ROUTES } from '@/constants/routes'

const TRACKS_SECTION_ID = 'choose-your-track'

function scrollToTracks() {
  document.getElementById(TRACKS_SECTION_ID)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

// Mock handlers: these become navigation / API calls once onboarding and the backend exist.
function handleSelectTrack(_trackId: string) {}

function handleSeeAllTracks() {}

// Arabic switches to the project's Cairo stack (font-arabic), as html[dir=rtl] does on the landing page.
const PAGE_FONT = "font-['Plus_Jakarta_Sans_Variable',sans-serif] rtl:font-arabic"

function InternshipPage() {
  return (
    <div
      className={`min-h-svh overflow-x-clip bg-[#f4f0f8] text-base tracking-normal text-[#111827] scheme-light ${PAGE_FONT}`}
    >
      <Navbar activeSection="internship" sectionLinkBase={ROUTES.home} containerClassName={PAGE_CONTAINER} />

      {/* Every section, the hero included, shares one container so they all start on the same edge. */}
      <main className={`flex flex-col ${PAGE_CONTAINER}`}>
        <Hero onStart={scrollToTracks} />

        <div className="mt-12 xl:mt-0">
          <WhyChooseUs />
        </div>

        {/* Scroll margin = sticky navbar (99px) + 24px gap, so the heading isn't hidden under it. */}
        <div id={TRACKS_SECTION_ID} className="mt-8 scroll-mt-[123px]">
          <TracksSection onSelectTrack={handleSelectTrack} onSeeAllTracks={handleSeeAllTracks} />
        </div>

        <div className="mt-8">
          <PromoBanner onStart={scrollToTracks} />
        </div>

        <div className="mt-16 md:mt-2">
          <Testimonials />
        </div>

        <div className="mt-[93px]">
          <FAQ />
        </div>
      </main>

      <InternshipFooter />
    </div>
  )
}

export default InternshipPage
