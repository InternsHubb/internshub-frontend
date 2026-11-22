import '@fontsource-variable/plus-jakarta-sans'
import FAQ from '@/features/landing/components/internship-showcase/FAQ'
import Hero from '@/features/landing/components/internship-showcase/Hero'
import PromoBanner from '@/features/landing/components/internship-showcase/PromoBanner'
import Testimonials from '@/features/landing/components/internship-showcase/Testimonials'
import TracksSection from '@/features/landing/components/internship-showcase/TracksSection'
import WhyChooseUs from '@/features/landing/components/internship-showcase/WhyChooseUs'
import { PAGE_CONTAINER } from '@/features/landing/components/internship-showcase/layout'
import { Footer } from '@/shared/components/navigation/Footer'
import { Navbar } from '@/shared/components/navigation/Navbar'
import { ROUTES } from '@/app/routes'
import { useScrollReveal } from '@/shared/hooks/useScrollReveal'

const TRACKS_SECTION_ID = 'choose-your-track'

function scrollToTracks() {
  document.getElementById(TRACKS_SECTION_ID)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

// Mock handlers: these become navigation / API calls once onboarding and the backend exist.
function handleSelectTrack(_trackId: string) { }

function handleSeeAllTracks() { }

// Arabic switches to the project's Cairo stack (font-arabic), as html[dir=rtl] does on the landing page.
const PAGE_FONT = "font-['Plus_Jakarta_Sans_Variable',sans-serif] rtl:font-arabic"

function InternshipPage() {
  useScrollReveal()

  return (
    <div className="min-h-svh overflow-x-clip bg-[#f4f0f8] scheme-light">
      {/* Same Navbar as the landing page: own container, and it inherits the same typography as there,
          so the page font below is scoped to the content. Only the active item and link base differ. */}
      <Navbar activeSection="internship" sectionLinkBase={ROUTES.home} />

      <div className={`text-base tracking-normal text-[#111827] ${PAGE_FONT}`}>
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

        <Footer />
      </div>
    </div>
  )
}

export default InternshipPage
