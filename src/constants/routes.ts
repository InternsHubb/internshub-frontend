// Single source of truth for app URLs, shared by every flow and by src/app/router.tsx.
// Each export below must be declared exactly once: when merging branches, combine keys into
// the existing object instead of adding a second `export const` with the same name (a
// duplicate declaration does not compile). Flows: public/auth, student dashboard (dashboard*),
// student recruitment (recruitment*, PR #31), employer (EMPLOYER_ROUTES).
export const ROUTES = {
  home: '/',
  internship: '/internship',
  internshipDetails: '/internships/:id',
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
  // 3-month plan courses: redirects to dashboardCourses, where the 3-month screens live.
  courses3m: '/courses-3m',
  courses6m: '/courses-6m',
  courses12m: '/courses-12m',
  courses: '/courses',
  courseDetails: '/courses/:id',
  courseDetailsDefault: '/course-details',
  courseVideo: '/courses/:id/video',
  courseVideoDefault: '/course-video',
  courseQuiz: '/courses/:id/quiz',
  courseQuizDefault: '/course-quiz',
  // Mentorship Flow
  mentorship: '/mentorship',
  mentorshipMentors: '/mentorship/mentors',
  mentorshipMentorProfile: '/mentorship/mentors/:id',
  mentorshipBookSession: '/mentorship/book/:id',
  mentorshipConfirmBooking: '/mentorship/book/confirm',
  mentorshipBookingSuccess: '/mentorship/book/success',
  mentorshipSessionDetails: '/mentorship/sessions/:id',
  mentorshipSessionCancelled: '/mentorship/sessions/:id/cancelled',
  mentorshipFeedback: '/mentorship/sessions/:id/feedback',
  // Seniors Experience & Journeys
  seniors: '/seniors',
  seniorProfile: '/seniors/:id',
  // Student dashboard (shared sidebar layout).
  dashboard: '/dashboard',
  dashboardInternship: '/dashboard/internship',
  dashboardProject: '/dashboard/internship/project',
  dashboardProjectDetails: '/dashboard/internship/project/details',
  dashboardProjectReview: '/dashboard/internship/project/review',
  dashboardCourses: '/dashboard/courses',
  dashboardPlans: '/dashboard/courses/plans',
  employer: '/employer',
} as const;

export const seniorProfilePath = (id: string) =>
  `/seniors/${encodeURIComponent(id)}`;

export const internshipDetailsPath = (id: string) =>
  `/internships/${encodeURIComponent(id)}`;

export const recruitmentApplicationPath = (applicationId: string) =>
  `${ROUTES.recruitmentApplications}/${applicationId}`;

export const recruitmentAgreementPath = (agreementId: string) =>
  `${ROUTES.recruitmentAgreements}/${agreementId}`;

// Legacy hash links (e.g. "/#signup") that used to open the Register screen.
export const REGISTER_HASHES: ReadonlyArray<string> = ['#signup', '#register'];

// Shared by both employer flows, so keys are added here, never in a second object. The router
// gives /employer, `pipeline` and `completion` to the PR #32 decision/agreement flow; the legacy
// PR #30 prototype also links to those two keys, which therefore open PR #32 pages. Keys under
// "Legacy prototype" are routed only by the legacy group in router.tsx.
export const EMPLOYER_ROUTES = {
  root: '/employer',
  pipeline: '/employer/pipeline',
  completion: '/employer/completion',
  // Decision / agreement flow (PR #32).
  scheduleInterview: (applicationId: string) =>
    `/employer/interviews/${encodeURIComponent(applicationId)}/schedule`,
  decision: (applicationId: string) => `/employer/applications/${encodeURIComponent(applicationId)}/decision`,
  decisionSubmitted: (applicationId: string) =>
    `/employer/applications/${encodeURIComponent(applicationId)}/decision/submitted`,
  agreement: (applicationId: string) =>
    `/employer/applications/${encodeURIComponent(applicationId)}/agreement`,
  // Legacy prototype (PR #30).
  dashboard: '/employer/dashboard',
  talent: '/employer/talent',
  candidate: (id: string | number = ':candidateId') =>
    `/employer/talent/${id}`,
  shortlist: '/employer/shortlist',
  interviews: '/employer/interviews',
  sendOpportunity: '/employer/send-opportunity',
  opportunitySent: '/employer/opportunity-sent',
} as const;
