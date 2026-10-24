import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import arTranslation from './locales/ar.json'
import employerAr from './locales/employer.ar.json'
import employerEn from './locales/employer.en.json'
import enTranslation from './locales/en.json'
import recruitmentAr from './locales/recruitment.ar.json'
import recruitmentEn from './locales/recruitment.en.json'

// Locale files by flow (each has an English and an Arabic file with the same keys):
//   en/ar.json                public site, auth, onboarding and the student dashboard (`dashboard.*`)
//   employer.en/ar.json       employer decision/agreement flow (PR #32), merged at the top level
//   recruitment.en/ar.json    student recruitment flow (PR #31), nested under `recruitment`
// The legacy employer prototype (PR #30) has hardcoded English text and no locale file.
// Employer keys are spread over the base keys, so a new top-level employer key with the same
// name as a base key would replace it; today only `nav` overlaps, and it is merged explicitly.
const mergeEmployerTranslations = (
  base: typeof enTranslation,
  employer: typeof employerEn,
): typeof enTranslation => ({
  ...base,
  ...employer,
  nav: { ...base.nav, ...employer.nav },
})

const getInitialLanguage = (): string => {
  if (typeof window !== 'undefined' && window.localStorage) {
    const saved = window.localStorage.getItem('edtech_lang')
    if (saved && (saved === 'en' || saved === 'ar')) {
      return saved
    }
  }
  return 'en'
}

const initialLanguage = getInitialLanguage()

i18n
  .use(initReactI18next)
  .init({
    // Exactly one entry per language: add a flow's strings into these objects rather than
    // declaring `en` / `ar` again (a repeated key silently replaces the earlier entry).
    resources: {
      en: {
        translation: {
          ...mergeEmployerTranslations(enTranslation, employerEn),
          recruitment: recruitmentEn,
        },
      },
      ar: {
        translation: {
          ...mergeEmployerTranslations(arTranslation, employerAr),
          recruitment: recruitmentAr,
        },
      },
    },
    lng: initialLanguage,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    react: {
      useSuspense: false, // Prevents SSG hydration suspense issues
    },
  })

export const updateHtmlDirection = (lang: string) => {
  if (typeof document !== 'undefined') {
    const dir = lang === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.setAttribute('dir', dir)
    document.documentElement.setAttribute('lang', lang)
  }
}

// Set direction on init
updateHtmlDirection(initialLanguage)

// Update document direction on language changes
i18n.on('languageChanged', (lng: string) => {
  updateHtmlDirection(lng)
  if (typeof window !== 'undefined' && window.localStorage) {
    window.localStorage.setItem('edtech_lang', lng)
  }
})

export default i18n
