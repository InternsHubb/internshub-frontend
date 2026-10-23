export const ROUTES = {
  home: '/',
  internship: '/internship',
  onboarding: '/onboarding',
  login: '/auth',
  register: '/register',
  authRegister: '/auth/register',
  forgotPassword: '/auth/forgot-password',
  phoneOtp: '/auth/phone-otp',
  // Must match the redirect URI registered in the Azure app registration.
  microsoftCallback: '/auth/microsoft/callback',
  // Student dashboard (shared sidebar layout).
  dashboard: '/dashboard',
  dashboardInternship: '/dashboard/internship',
  dashboardProject: '/dashboard/internship/project',
  dashboardCourses: '/dashboard/courses',
  dashboardPlans: '/dashboard/courses/plans',
} as const;

// Legacy hash links (e.g. "/#signup") that used to open the Register screen.
export const REGISTER_HASHES: ReadonlyArray<string> = ['#signup', '#register'];
