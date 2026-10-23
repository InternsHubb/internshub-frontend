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
  mentorship: '/mentorship',
  mentorshipMentors: '/mentorship/mentors',
  mentorshipMentorProfile: '/mentorship/mentors/:id',
  mentorshipConfirmBooking: '/mentorship/book/confirm',
  mentorshipBookingSuccess: '/mentorship/book/success',
  mentorshipSessionDetails: '/mentorship/sessions/:id',
  mentorshipSessionCancelled: '/mentorship/sessions/:id/cancelled',
  mentorshipFeedback: '/mentorship/sessions/:id/feedback',
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
  scheduleInterview: (applicationId: string) =>
    `/employer/interviews/${encodeURIComponent(applicationId)}/schedule`,
  decision: (applicationId: string) =>
    `/employer/applications/${encodeURIComponent(applicationId)}/decision`,
  decisionSubmitted: (applicationId: string) =>
    `/employer/applications/${encodeURIComponent(applicationId)}/decision/submitted`,
  agreement: (applicationId: string) =>
    `/employer/applications/${encodeURIComponent(applicationId)}/agreement`,
} as const;

export const recruitmentApplicationPath = (applicationId: string) =>
  `${ROUTES.recruitmentApplications}/${applicationId}`;

export const recruitmentAgreementPath = (agreementId: string) =>
  `${ROUTES.recruitmentAgreements}/${agreementId}`;

// Legacy hash links (e.g. "/#signup") that used to open the Register screen.
export const REGISTER_HASHES: ReadonlyArray<string> = [
  '#signup',
  '#register',
];
