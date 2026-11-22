import React, { useEffect, useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useScrollReveal } from '@/shared/hooks/useScrollReveal'
import { Navbar } from '@/shared/components/navigation/Navbar'
import { Hero } from '@/features/landing/components/sections/Hero'
import { LearningJourney } from '@/features/landing/components/sections/LearningJourney'
import { ExperienceSection } from '@/features/landing/components/sections/ExperienceSection'
import { MentorshipSection } from '@/features/landing/components/sections/MentorshipSection'
import { CourseSection } from '@/features/landing/components/sections/CourseSection'
import { SeniorProfilesSection } from '@/features/landing/components/sections/InternshipSection'
import { LandingInternshipsSection } from '@/features/landing/components/sections/LandingInternshipsSection'
import { RecruitmentSection } from '@/features/landing/components/sections/RecruitmentSection'
import { PricingSection } from '@/features/landing/components/sections/PricingSection'
import { TestimonialsSection } from '@/features/landing/components/sections/TestimonialsSection'
import { VideoShowcase } from '@/features/landing/components/sections/VideoShowcase'
import { Footer } from '@/shared/components/navigation/Footer'

export const LandingPage: React.FC = () => {
  const { i18n } = useTranslation()
  const prevLangRef = useRef(i18n.language)
  const [animClass, setAnimClass] = useState('euveka-page-enter')

  useScrollReveal({ dependencies: [animClass, i18n.language] })

  useEffect(() => {
    const handleLanguageChanged = (lng: string) => {
      if (prevLangRef.current !== lng) {
        prevLangRef.current = lng
        setAnimClass((prev) =>
          prev === 'euveka-lang-fade-a' ? 'euveka-lang-fade-b' : 'euveka-lang-fade-a'
        )
      }
    }

    i18n.on('languageChanged', handleLanguageChanged)
    return () => {
      i18n.off('languageChanged', handleLanguageChanged)
    }
  }, [i18n])

  return (
    <div id="home" className="min-h-screen bg-white text-slate-900 flex flex-col selection:bg-purple-200 selection:text-purple-950">
      <Navbar activeSection="home" />
      <div className={`flex flex-col flex-grow ${animClass}`}>
        <main className="flex-grow">
          <Hero />
          <LearningJourney />
          <ExperienceSection />
          <MentorshipSection />
          <CourseSection />
          <SeniorProfilesSection />
          <LandingInternshipsSection />
          <RecruitmentSection />
          <PricingSection />
          <TestimonialsSection />
          <VideoShowcase />
        </main>
        <Footer />
      </div>
    </div>
  )
}

export default LandingPage
