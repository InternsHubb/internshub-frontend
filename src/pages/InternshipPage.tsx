import '@fontsource-variable/plus-jakarta-sans'
import FAQ from '../components/internship/FAQ'
import Hero from '../components/internship/Hero'
import InternshipFooter from '../components/internship/InternshipFooter'
import InternshipNavbar from '../components/internship/InternshipNavbar'
import PromoBanner from '../components/internship/PromoBanner'
import Testimonials from '../components/internship/Testimonials'
import TracksSection from '../components/internship/TracksSection'
import WhyChooseUs from '../components/internship/WhyChooseUs'

const TRACKS_SECTION_ID = 'choose-your-track'

function scrollToTracks() {
  document.getElementById(TRACKS_SECTION_ID)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

// Mock handlers: these become navigation / API calls once onboarding and the backend exist.
function handleSelectTrack(_trackId: string) {}

function handleSeeAllTracks() {}

function InternshipPage() {
  return (
    <div className="min-h-svh overflow-x-clip bg-[#f4f0f8] font-['Plus_Jakarta_Sans_Variable',sans-serif] text-base tracking-normal text-[#111827] scheme-light">
      <InternshipNavbar />

      <main>
        <Hero onStart={scrollToTracks} />

        <div className="mx-auto flex max-w-[1322px] flex-col px-4 sm:px-10 xl:px-0">
          <div className="mt-12 xl:mt-0">
            <WhyChooseUs />
          </div>

          <div id={TRACKS_SECTION_ID} className="mt-8 scroll-mt-6">
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
        </div>
      </main>

      <InternshipFooter />
    </div>
  )
}

export default InternshipPage
