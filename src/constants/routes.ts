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
} as const;

// Legacy hash links (e.g. "/#signup") that used to open the Register screen.
export const REGISTER_HASHES: ReadonlyArray<string> = ['#signup', '#register'];
