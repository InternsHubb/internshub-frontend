import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import arTranslation from './locales/ar.json'
import employerAr from './locales/employer.ar.json'
import employerEn from './locales/employer.en.json'
import enTranslation from './locales/en.json'
import recruitmentAr from './locales/recruitment.ar.json'
import recruitmentEn from './locales/recruitment.en.json'

const mergeTranslations = (
  base: Record<string, unknown>,
  employer: Record<string, unknown>,
  recruitment: unknown,
): Record<string, unknown> => ({
  ...base,
  ...employer,
  nav: { ...(base.nav as Record<string, unknown> | undefined), ...(employer.nav as Record<string, unknown> | undefined) },
  recruitment,
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
    resources: {
      en: { translation: mergeTranslations(enTranslation, employerEn, recruitmentEn) },
      ar: { translation: mergeTranslations(arTranslation, employerAr, recruitmentAr) },
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
