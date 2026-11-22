/**
 * Canonical application route paths & typed path builders.
 *
 * All features and navigation links should import paths from `@/app/routes`
 * rather than hardcoding URL strings.
 */
export const ROUTES = {
  // Feature: landing
  home: '/',
  internship: '/internship',
  internshipDetails: '/internships/:id',
  seniors: '/seniors',
  seniorProfile: '/seniors/:id',

  // Feature: authentication
  login: '/auth',
  register: '/register',
  authRegister: '/auth/register',
  forgotPassword: '/auth/forgot-password',
  phoneOtp: '/auth/phone-otp',
  microsoftCallback: '/auth/microsoft/callback',

  // Feature: onboarding
  onboarding: '/onboarding',

  // Feature: internships (Student Dashboard Home + Internship Journey & Project)
  dashboard: '/dashboard',
  dashboardInternship: '/dashboard/internship',
  dashboardProject: '/dashboard/internship/project',
  dashboardProjectDetails: '/dashboard/internship/project/details',
  dashboardProjectReview: '/dashboard/internship/project/review',
  dashboardProjectDone: '/dashboard/internship/project/done',
  dashboardProjectCompleted: '/dashboard/internship/project/completed',
  dashboardProjectFinalReview: '/dashboard/internship/project/final-review',
  dashboardProjectResults: '/dashboard/internship/project/results',

  // Feature: courses
  courses: '/courses',
  courses3m: '/courses-3m',
  courses6m: '/courses-6m',
  courses12m: '/courses-12m',
  dashboardCourses: '/dashboard/courses',
  dashboardPlans: '/dashboard/courses/plans',
  courseDetails: '/courses/:id',
  courseDetailsDefault: '/course-details',
  courseVideo: '/courses/:id/video',
  courseVideoDefault: '/course-video',
  courseQuiz: '/courses/:id/quiz',
  courseQuizDefault: '/course-quiz',

  // Feature: mentorship (Mentorship Flow + Mentor Chat)
  mentorship: '/mentorship',
  mentorshipMentors: '/mentorship/mentors',
  mentorshipMentorProfile: '/mentorship/mentors/:id',
  mentorshipBookSession: '/mentorship/book/:id',
  mentorshipConfirmBooking: '/mentorship/book/confirm',
  mentorshipBookingSuccess: '/mentorship/book/success',
  mentorshipSessionDetails: '/mentorship/sessions/:id',
  mentorshipSessionCancelled: '/mentorship/sessions/:id/cancelled',
  mentorshipFeedback: '/mentorship/sessions/:id/feedback',
  chat: '/dashboard/chat',

  // Feature: recruitment (Student Recruitment + Employer Recruitment)
  recruitment: '/recruitment',
  recruitmentEligibility: '/recruitment/eligibility',
  recruitmentProfile: '/recruitment/profile',
  recruitmentOpportunities: '/recruitment/opportunities',
  recruitmentTalentDirectory: '/recruitment/talent-directory',
  recruitmentApplications: '/recruitment/applications',
  recruitmentInterview: '/recruitment/interview',
  recruitmentAgreements: '/recruitment/agreements',
  recruitmentNotifications: '/recruitment/notifications',
  recruitmentCompletion: '/recruitment/completion',
  employer: '/employer',
} as const;

export const EMPLOYER_ROUTES = {
  root: '/employer',
  pipeline: '/employer/pipeline',
  completion: '/employer/completion',
  scheduleInterview: (applicationId: string) =>
    `/employer/interviews/${encodeURIComponent(applicationId)}/schedule`,
  decision: (applicationId: string) =>
    `/employer/applications/${encodeURIComponent(applicationId)}/decision`,
  decisionSubmitted: (applicationId: string) =>
    `/employer/applications/${encodeURIComponent(applicationId)}/decision/submitted`,
  agreement: (applicationId: string) =>
    `/employer/applications/${encodeURIComponent(applicationId)}/agreement`,
  dashboard: '/employer/dashboard',
  talent: '/employer/talent',
  candidate: (id: string | number = ':candidateId') => `/employer/talent/${id}`,
  shortlist: '/employer/shortlist',
  interviews: '/employer/interviews',
  sendOpportunity: '/employer/send-opportunity',
  opportunitySent: '/employer/opportunity-sent',
} as const;

export const seniorProfilePath = (id: string) => `/seniors/${encodeURIComponent(id)}`;
export const internshipDetailsPath = (id: string) => `/internships/${encodeURIComponent(id)}`;
export const courseDetailsPath = (id: string) => `/courses/${encodeURIComponent(id)}`;
export const courseVideoPath = (id: string) => `/courses/${encodeURIComponent(id)}/video`;
export const courseQuizPath = (id: string) => `/courses/${encodeURIComponent(id)}/quiz`;
export const recruitmentApplicationPath = (applicationId: string) =>
  `${ROUTES.recruitmentApplications}/${encodeURIComponent(applicationId)}`;
export const recruitmentAgreementPath = (agreementId: string) =>
  `${ROUTES.recruitmentAgreements}/${encodeURIComponent(agreementId)}`;

/** Legacy hash anchors supported for backward compatibility. */
export const REGISTER_HASHES: ReadonlyArray<string> = ['#signup', '#register'];
