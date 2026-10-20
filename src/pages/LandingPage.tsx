import React, { useEffect, useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { Navbar } from '../components/landing/Navbar'
import { Hero } from '../components/landing/Hero'
import { LearningJourney } from '../components/landing/LearningJourney'
import { ExperienceSection } from '../components/landing/ExperienceSection'
import { MentorshipSection } from '../components/landing/MentorshipSection'
import { CourseSection } from '../components/landing/CourseSection'
import { InternshipSection } from '../components/landing/InternshipSection'
import { PricingSection } from '../components/landing/PricingSection'
import { TestimonialsSection } from '../components/landing/TestimonialsSection'
import { Footer } from '../components/landing/Footer'

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
    <div className="min-h-screen bg-white text-slate-900 flex flex-col selection:bg-purple-200 selection:text-purple-950">
      <Navbar activeSection="home" />
      <div className={`flex flex-col flex-grow ${animClass}`}>
        <main className="flex-grow">
          <Hero />
          <LearningJourney />
          <ExperienceSection />
          <MentorshipSection />
          <CourseSection />
          <InternshipSection />
          <PricingSection />
          <TestimonialsSection />
        </main>
        <Footer />
      </div>
    </div>
  )
}

export default LandingPage
