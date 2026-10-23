export const ROUTES = {
  home: '/',
  internship: '/internship',
  onboarding: '/onboarding',
  recruitment: '/recruitment',
  recruitmentEligibility: '/recruitment/eligibility',
  recruitmentTalentDirectory: '/recruitment/talent-directory',
  recruitmentApplications: '/recruitment/applications',
  recruitmentAgreements: '/recruitment/agreements',
  login: '/auth',
  register: '/register',
  authRegister: '/auth/register',
  forgotPassword: '/auth/forgot-password',
  phoneOtp: '/auth/phone-otp',
  // Must match the redirect URI registered in the Azure app registration.
  microsoftCallback: '/auth/microsoft/callback',
} as const;

export const recruitmentApplicationPath = (applicationId: string) =>
  `${ROUTES.recruitmentApplications}/${applicationId}`;

export const recruitmentAgreementPath = (agreementId: string) =>
  `${ROUTES.recruitmentAgreements}/${agreementId}`;

// Legacy hash links (e.g. "/#signup") that used to open the Register screen.
export const REGISTER_HASHES: ReadonlyArray<string> = ['#signup', '#register'];
