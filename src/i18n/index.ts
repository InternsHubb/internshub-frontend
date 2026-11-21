import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import commonEn from '@/i18n/locales/en/common.json';
import commonAr from '@/i18n/locales/ar/common.json';

import landingEn from '@/features/landing/locales/en.json';
import landingAr from '@/features/landing/locales/ar.json';
import authenticationEn from '@/features/authentication/locales/en.json';
import authenticationAr from '@/features/authentication/locales/ar.json';
import onboardingEn from '@/features/onboarding/locales/en.json';
import onboardingAr from '@/features/onboarding/locales/ar.json';
import recruitmentEn from '@/features/recruitment/locales/en.json';
import recruitmentAr from '@/features/recruitment/locales/ar.json';
import coursesEn from '@/features/courses/locales/en.json';
import coursesAr from '@/features/courses/locales/ar.json';
import internshipsEn from '@/features/internships/locales/en.json';
import internshipsAr from '@/features/internships/locales/ar.json';
import mentorshipEn from '@/features/mentorship/locales/en.json';
import mentorshipAr from '@/features/mentorship/locales/ar.json';

export const SUPPORTED_LANGUAGES = ['en', 'ar'] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const I18N_NAMESPACES = [
  'translation',
  'common',
  'landing',
  'authentication',
  'onboarding',
  'recruitment',
  'courses',
  'internships',
  'mentorship',
] as const;

const STORAGE_KEY = 'edtech_lang';

function composeDefaultBundle(
  common: typeof commonEn,
  landing: typeof landingEn,
  authentication: typeof authenticationEn,
  onboarding: typeof onboardingEn,
  recruitment: typeof recruitmentEn,
  courses: typeof coursesEn,
  internships: typeof internshipsEn,
  mentorship: typeof mentorshipEn,
) {
  return {
    ...common,
    ...landing,
    ...authentication,
    ...onboarding,
    ...courses,
    ...internships,
    ...mentorship,
    ...recruitment,
    // Explicitly merge overlapping top-level namespaces so no keys are clobbered
    nav: {
      ...common.nav,
      ...recruitment.nav,
    },
    common: {
      ...recruitment.common,
      ...common.common,
    },
  };
}

const getInitialLanguage = (): SupportedLanguage => {
  if (typeof window !== 'undefined' && window.localStorage) {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === 'en' || saved === 'ar') {
      return saved;
    }
  }
  return 'en';
};

const initialLanguage = getInitialLanguage();

void i18n.use(initReactI18next).init({
  ns: [...I18N_NAMESPACES],
  defaultNS: 'translation',
  fallbackNS: 'common',
  resources: {
    en: {
      translation: composeDefaultBundle(
        commonEn,
        landingEn,
        authenticationEn,
        onboardingEn,
        recruitmentEn,
        coursesEn,
        internshipsEn,
        mentorshipEn,
      ),
      common: commonEn,
      landing: landingEn,
      authentication: authenticationEn,
      onboarding: onboardingEn,
      recruitment: recruitmentEn,
      courses: coursesEn,
      internships: internshipsEn,
      mentorship: mentorshipEn,
    },
    ar: {
      translation: composeDefaultBundle(
        commonAr,
        landingAr,
        authenticationAr,
        onboardingAr,
        recruitmentAr,
        coursesAr,
        internshipsAr,
        mentorshipAr,
      ),
      common: commonAr,
      landing: landingAr,
      authentication: authenticationAr,
      onboarding: onboardingAr,
      recruitment: recruitmentAr,
      courses: coursesAr,
      internships: internshipsAr,
      mentorship: mentorshipAr,
    },
  },
  lng: initialLanguage,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
});

export const updateHtmlDirection = (lang: string): void => {
  if (typeof document !== 'undefined') {
    const dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.setAttribute('lang', lang);
  }
};

updateHtmlDirection(initialLanguage);

i18n.on('languageChanged', (lng: string) => {
  updateHtmlDirection(lng);
  if (typeof window !== 'undefined' && window.localStorage) {
    window.localStorage.setItem(STORAGE_KEY, lng);
  }
});

export default i18n;
