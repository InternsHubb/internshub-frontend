// Shapes taken from the backend OpenAPI document (https://api.16-171-93-217.sslip.io/openapi/v1.json).

export type AccessTokenResponse = {
  tokenType?: string | null;
  accessToken: string;
  // Seconds until the access token expires. The schema allows a numeric string as well.
  expiresIn: number | string;
  refreshToken: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  email: string;
  password: string;
};

export type Locale = 'Ar' | 'En';

export type OnboardingStep =
  | 'ConfirmEmail'
  | 'ConfirmPhone'
  | 'CompleteProfile'
  | 'AcceptPolicies';

export type UserStatus = 'Active' | 'Suspended' | 'Deleted';

export type MeDto = {
  id: string;
  email: string | null;
  emailConfirmed: boolean;
  phoneNumber: string | null;
  phoneNumberConfirmed: boolean;
  fullName: string | null;
  dateOfBirth: string | null;
  preferredLocale: Locale;
  timeZone: string;
  status: UserStatus;
  roles: string[];
  requiredPoliciesAccepted: boolean;
  missingOnboardingSteps?: OnboardingStep[] | null;
  isOnboardingComplete?: boolean;
};

// RFC 9110 problem details as returned by ASP.NET; `errors` maps a code or field to messages.
export type ProblemDetails = {
  type?: string | null;
  title?: string | null;
  status?: number | string | null;
  detail?: string | null;
  errors?: Record<string, string[]>;
};

export type CursorPage<T> = {
  items: T[];
  nextCursor?: string | null;
};

// ---------------------------------------------------------------------------
// Tracks & Packages
// ---------------------------------------------------------------------------

export type TrackSummaryDto = {
  id: string;
  code: string;
  name: string;
  description: string;
};

export type PackageStageDto = {
  order: number;
  name: string;
  description: string;
  durationWeeks: number;
};

export type PackageDto = {
  id: string;
  code: string;
  name: string;
  durationMonths: number;
  price: number;
  currency: string;
  upgradesToPackageId?: string | null;
  isActive: boolean;
  stages: PackageStageDto[];
};

// ---------------------------------------------------------------------------
// Courses
// ---------------------------------------------------------------------------

export type LessonDto = {
  id: string;
  courseId: string;
  title: string;
  description?: string | null;
  videoUrl?: string | null;
  durationSeconds: number;
  order: number;
  isCompleted?: boolean;
};

export type CourseSummaryDto = {
  id: string;
  title: string;
  description: string;
  trackId: string | null;
  trackName: string | null;
  isPublished: boolean;
  order: number;
  lessonCount: number;
  totalDurationSeconds: number;
  completedLessonsCount?: number | null;
};

export type CourseDetailDto = CourseSummaryDto & {
  lessons: LessonDto[];
};

// ---------------------------------------------------------------------------
// Mentorship
// ---------------------------------------------------------------------------

export type MentorSummaryDto = {
  userId: string;
  fullName: string;
  bio: string;
  trackIds: string[];
};

export type MentorProfileDto = MentorSummaryDto & {
  headline?: string | null;
  yearsOfExperience?: number;
  hourlyRate?: number;
  avatarUrl?: string | null;
  rating?: number;
  reviewsCount?: number;
};

export type MentorSlotDto = {
  id: string;
  startsAt: string;
  endsAt: string;
  isBlocked: boolean;
};

export type MentorBookingStatus = 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed';

export type MentorBookingDto = {
  id: string;
  slotId: string;
  mentorUserId: string;
  mentorName: string | null;
  studentUserId: string;
  studentName: string | null;
  startsAt: string;
  endsAt: string;
  meetingUrl: string | null;
  status: MentorBookingStatus;
  bookedAt: string;
  cancelledAt: string | null;
};

// ---------------------------------------------------------------------------
// Squads, Sprints & Tasks
// ---------------------------------------------------------------------------

export type SquadStatus = 'Forming' | 'Active' | 'Completed' | 'Archived';
export type InterviewLevel = 'Junior' | 'Mid' | 'Senior';

export type SquadMemberDto = {
  userId: string;
  fullName: string;
  role: string;
  avatarUrl?: string | null;
};

export type SquadDetailsDto = {
  id: string;
  trackId: string;
  trackName: string;
  trackCode: string;
  level: InterviewLevel;
  status: SquadStatus;
  seniorUserId: string;
  seniorName: string | null;
  seniorEmail: string | null;
  repositoryUrl: string | null;
  startedAt: string | null;
  createdAt: string;
  members: SquadMemberDto[];
};

export type SprintStatus = 'Planned' | 'Active' | 'Completed';

export type SprintSummaryDto = {
  id: string;
  squadId: string;
  sprintNumber: number;
  status: SprintStatus;
  startsAt: string;
  endsAt: string;
};

export type SquadTaskStatus = 'Todo' | 'InProgress' | 'InReview' | 'ChangesRequested' | 'Done';

export type SquadTaskDto = {
  id: string;
  sprintId: string;
  title: string;
  description: string | null;
  assigneeUserId: string | null;
  assigneeName: string | null;
  status: SquadTaskStatus;
  pullRequestUrl: string | null;
  approvedByUserId: string | null;
  approvedByName: string | null;
  approvedAt: string | null;
  createdAt: string;
};

export type SprintBoardDto = {
  sprintId: string;
  squadId: string;
  sprintNumber: number;
  status: SprintStatus;
  startsAt: string;
  endsAt: string;
  tasks: SquadTaskDto[];
};

export type ChatMessageDto = {
  id: string;
  squadId: string;
  senderUserId: string;
  senderName: string | null;
  body: string;
  sentAt: string;
};

export type LeaderboardEntryDto = {
  userId: string;
  fullName: string;
  points: number;
  rank: number;
};

// ---------------------------------------------------------------------------
// Profile, CV & Skills
// ---------------------------------------------------------------------------

export type SkillDto = {
  id: string;
  name: string;
  category: string;
  isActive: boolean;
};

export type ProfileSkillDto = {
  skillId: string;
  skillName: string;
  category: string;
  yearsOfExperience: number;
};

export type WorkExperienceDto = {
  id: string;
  companyName: string;
  jobTitle: string;
  startDate: string;
  endDate?: string | null;
  isCurrent: boolean;
  description?: string | null;
};

export type EducationDto = {
  id: string;
  institutionName: string;
  degree: string;
  fieldOfStudy: string;
  graduationYear?: number | null;
};

export type StudentProfileDto = {
  skills: ProfileSkillDto[];
  workExperience: WorkExperienceDto[];
  education: EducationDto[];
};

export type CvDto = {
  id: string;
  fileName: string;
  fileSize: number;
  contentType: string;
  parsedAt?: string | null;
};

export type SubmitCvResponse = {
  cvId: string;
  parsedProfile?: StudentProfileDto | null;
};

// ---------------------------------------------------------------------------
// Talent & Recruitment
// ---------------------------------------------------------------------------

export type TalentRequestStatus = 'Pending' | 'Accepted' | 'Declined';

export type TalentSummaryDto = {
  userId: string;
  fullName: string;
  trackId: string | null;
  trackName: string | null;
  confirmedLevel: InterviewLevel | null;
  skills: string[];
  squadRepositoryUrl: string | null;
  certificateCode: string | null;
};

export type TalentDetailDto = {
  userId: string;
  fullName: string;
  email: string | null;
  trackId: string | null;
  trackName: string | null;
  confirmedLevel: InterviewLevel | null;
  skills: ProfileSkillDto[];
  workExperience: WorkExperienceDto[];
  education: EducationDto[];
  squadRepositoryUrl: string | null;
  certificateCode: string | null;
  requestStatus: TalentRequestStatus | null;
};

export type TalentRequestDto = {
  id: string;
  employerUserId: string;
  employerName: string;
  studentUserId: string;
  message: string;
  status: TalentRequestStatus;
  createdAt: string;
};

// ---------------------------------------------------------------------------
// Interviews
// ---------------------------------------------------------------------------

export type InterviewType = 'Technical' | 'SoftSkills';
export type InterviewStatus = 'Pending' | 'InProgress' | 'Completed' | 'Failed';

export type InterviewQuestionDto = {
  id: string;
  questionText: string;
  audioUrl?: string | null;
  order: number;
};

export type InterviewResultDto = {
  level: InterviewLevel;
  score: number;
  feedback: string;
  recommendedTrackCode?: string | null;
};

export type InterviewDto = {
  id: string;
  trackId: string;
  type: InterviewType;
  status: InterviewStatus;
  attemptNumber: number;
  startedAt: string;
  endsAt: string;
  completedAt: string | null;
  answeredCount: number;
  maxQuestions: number;
  currentQuestion: InterviewQuestionDto | null;
  closingText: string | null;
  result: InterviewResultDto | null;
};

// ---------------------------------------------------------------------------
// Enrollments
// ---------------------------------------------------------------------------

export type EnrollmentSource = 'Web' | 'Admin' | 'Scholarship';
export type EnrollmentStatus = 'PendingPayment' | 'Active' | 'Completed' | 'Cancelled';

export type EnrollmentDto = {
  id: string;
  userId: string;
  packageId: string;
  packageCode: string;
  trackId: string;
  trackCode: string;
  source: EnrollmentSource;
  status: EnrollmentStatus;
  paidAt: string | null;
  startedAt: string | null;
  endsAt: string | null;
  chosenAt: string;
};

export type CheckoutResultDto = {
  paymentUrl: string;
  orderId: string;
};

// ---------------------------------------------------------------------------
// Notifications
// ---------------------------------------------------------------------------

export type NotificationType = 'Info' | 'Warning' | 'Success' | 'ActionRequired';
export type SubjectType = 'General' | 'Squad' | 'Mentorship' | 'Interview' | 'Payment';

export type NotificationDto = {
  id: string;
  type: NotificationType;
  subjectType: SubjectType;
  subjectId: string;
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string;
  readAt: string | null;
};

export type UnreadCountDto = {
  count: number;
};
