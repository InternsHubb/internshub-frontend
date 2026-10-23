export const ROUTES = {
  home: '/',
  internship: '/internship',
  onboarding: '/onboarding',
  login: '/auth',
  register: '/register',
  authRegister: '/auth/register',
  forgotPassword: '/auth/forgot-password',
  phoneOtp: '/auth/phone-otp',
  microsoftCallback: '/auth/microsoft/callback',
  // Student dashboard (shared sidebar layout).
  dashboard: '/dashboard',
  dashboardInternship: '/dashboard/internship',
  dashboardProject: '/dashboard/internship/project',
  dashboardCourses: '/dashboard/courses',
  dashboardPlans: '/dashboard/courses/plans',
  employer: '/employer',
} as const;

export const REGISTER_HASHES: ReadonlyArray<string> = [
  '#signup',
  '#register',
];

export const EMPLOYER_ROUTES = {
  dashboard: '/employer/dashboard',
  talent: '/employer/talent',
  candidate: (id: string | number = ':candidateId') =>
    `/employer/talent/${id}`,
  shortlist: '/employer/shortlist',
  pipeline: '/employer/pipeline',
  interviews: '/employer/interviews',
  completion: '/employer/completion',
  sendOpportunity: '/employer/send-opportunity',
  opportunitySent: '/employer/opportunity-sent',
} as const;