export const ROUTES = {
  home: '/',
  internship: '/internship',
  onboarding: '/onboarding',
  login: '/auth',
  register: '/register',
  authRegister: '/auth/register',
  forgotPassword: '/auth/forgot-password',
  phoneOtp: '/auth/phone-otp',
} as const;

// Legacy hash links (e.g. "/#signup") that used to open the Register screen.
export const REGISTER_HASHES: ReadonlyArray<string> = ['#signup', '#register'];
