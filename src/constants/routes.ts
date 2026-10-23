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
  microsoftCallback: '/auth/microsoft/callback',
  // Student dashboard (shared sidebar layout).
  dashboard: '/dashboard',
  dashboardInternship: '/dashboard/internship',
  dashboardProject: '/dashboard/internship/project',
  dashboardCourses: '/dashboard/courses',
  dashboardPlans: '/dashboard/courses/plans',
  employer: '/employer',
} as const;

export const EMPLOYER_ROUTES = {
  root: '/employer',
  pipeline: '/employer/pipeline',
  scheduleInterview: (applicationId: string) =>
    `/employer/interviews/${encodeURIComponent(applicationId)}/schedule`,
  decision: (applicationId: string) => `/employer/applications/${encodeURIComponent(applicationId)}/decision`,
  decisionSubmitted: (applicationId: string) =>
    `/employer/applications/${encodeURIComponent(applicationId)}/decision/submitted`,
  agreement: (applicationId: string) =>
    `/employer/applications/${encodeURIComponent(applicationId)}/agreement`,
  completion: '/employer/completion',
} as const;
export const recruitmentApplicationPath = (applicationId: string) =>
  `${ROUTES.recruitmentApplications}/${applicationId}`;

export const recruitmentAgreementPath = (agreementId: string) =>
  `${ROUTES.recruitmentAgreements}/${agreementId}`;

// Legacy hash links (e.g. "/#signup") that used to open the Register screen.
export const REGISTER_HASHES: ReadonlyArray<string> = ['#signup', '#register'];
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
