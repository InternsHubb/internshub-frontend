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
  visibleToCompanies: boolean;
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

export type CursorPage<T> = { items: T[]; nextCursor: string | null };

// Tracks & packages
export type TrackSummaryDto = { id: string; code: string; name: string; description: string };
export type FeatureType = 'Courses' | 'Internship' | 'Mentorship';
export type CompletionRule = 'AllRequiredCoursesPassed' | 'FinalProjectApproved' | 'QuotaConsumedOrEnrollmentEnded';
export type PackageStageDto = {
  featureType: FeatureType;
  sequenceOrder: number;
  isGating: boolean;
  completionRule: CompletionRule;
  sessionQuota: number | null;
  minDurationMonths: number | null;
};
export type PackageDto = {
  id: string;
  code: string;
  name: string;
  durationMonths: number;
  price: number;
  currency: string;
  upgradesToPackageId: string | null;
  isActive: boolean;
  stages: PackageStageDto[];
};

// Enrollments, invoices, checkout
export type EnrollmentSource = 'Purchase' | 'Upgrade' | 'AdminGrant';
export type EnrollmentStatus =
  | 'PendingPayment'
  | 'Active'
  | 'Suspended'
  | 'Upgraded'
  | 'Completed'
  | 'Expired'
  | 'Cancelled';
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
export type ChooseEnrollmentCommand = { packageId: string; trackId: string };
export type CancelEnrollmentRequest = { reason: string | null };
export type CheckoutResultDto = { invoiceId: string; redirectUrl: string };
export type InvoiceStatus = 'Pending' | 'Paid' | 'Failed' | 'Cancelled' | 'RequiresReview';
export type InvoiceDto = {
  id: string;
  enrollmentId: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
  paidAt: string | null;
};

// Courses
export type LessonDto = {
  id: string;
  courseId: string;
  title: string;
  order: number;
  durationSeconds: number;
  isCompleted: boolean;
  playUrl: string | null;
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
  completedLessonsCount: number | null;
};
export type CourseDetailDto = Omit<CourseSummaryDto, 'completedLessonsCount'> & {
  isEntitled: boolean;
  isCompleted: boolean;
  lessons: LessonDto[];
};
export type PublicTrackCoursesDto = { trackId: string; trackName: string; courseTitles: string[] };

// Mentorship
export type MentorSummaryDto = { userId: string; fullName: string; bio: string; trackIds: string[] };
export type FeaturedMentorDto = {
  userId: string;
  fullName: string;
  bio: string;
  profilePhotoAssetId: string | null;
  tracks: TrackSummaryDto[];
};
export type MentorProfileDto = {
  userId: string;
  bio: string;
  meetingUrl: string | null;
  isAcceptingBookings: boolean;
  isFeatured: boolean;
  trackIds: string[];
};
export type UpdateMyMentorProfileCommand = {
  bio: string | null;
  meetingUrl: string | null;
  isAcceptingBookings: boolean;
};
export type MentorSlotDto = { id: string; startsAt: string; endsAt: string; isBlocked: boolean };
export type MentorBookingStatus = 'Booked' | 'Cancelled';
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

// Squads, sprints, tasks, gamification
export type InterviewLevel = 'NotReady' | 'Junior' | 'Mid' | 'Advanced';
export type SquadStatus = 'Forming' | 'Active' | 'Completed';
export type SquadMemberDto = {
  userId: string;
  fullName: string | null;
  email: string | null;
  joinedAt: string;
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
export type SprintStatus = 'Planning' | 'Active' | 'Completed';
export type SprintSummaryDto = {
  id: string;
  number: number;
  status: SprintStatus;
  startsAt: string;
  endsAt: string;
  totalTasksCount: number;
  completedTasksCount: number;
  createdAt: string;
};
export type SquadTaskStatus = 'Todo' | 'InProgress' | 'InReview' | 'Done';
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
export type CreateSprintRequest = { startsAt: string; endsAt: string };
export type AddTaskRequest = { title: string; description?: string | null; assigneeUserId?: string | null };
export type ChatMessageDto = {
  id: string;
  squadId: string;
  senderUserId: string;
  senderName: string | null;
  body: string;
  sentAt: string;
};
export type LeaderboardEntryDto = {
  rank: number;
  userId: string;
  studentName: string;
  points: number;
  streak: number;
  isTopPerformer: boolean;
};
export type PointsSummaryDto = {
  balance: number;
  breakdown: Record<string, unknown>;
  percentile: number;
  currentStreak: number;
  freezesLeft: number;
  roundId: string | null;
};

// Profile, skills, CV
export type ProficiencyLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
export type ProfileSource = 'Parsed' | 'Manual';
export type SkillDto = { id: string; name: string; category: string; isActive: boolean };
export type ProfileSkillDto = {
  skillId: string;
  name: string;
  category: string;
  proficiencyLevel: ProficiencyLevel | null;
  source: ProfileSource;
};
export type WorkExperienceDto = {
  id: string;
  companyName: string;
  jobTitle: string;
  startDate: string;
  endDate: string | null;
  description: string;
  source: ProfileSource;
};
export type WorkExperienceRequest = {
  companyName: string;
  jobTitle: string;
  startDate: string;
  endDate: string | null;
  description: string | null;
};
export type EducationDto = {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string | null;
  source: ProfileSource;
};
export type EducationRequest = {
  institution: string;
  degree: string;
  fieldOfStudy: string | null;
  startDate: string;
  endDate: string | null;
};
export type StudentProfileDto = {
  skills: ProfileSkillDto[];
  workExperience: WorkExperienceDto[];
  education: EducationDto[];
};
export type CVParseStatus = 'Pending' | 'Processing' | 'Parsed' | 'Failed';
export type CvDto = {
  id: string;
  userId: string;
  fileAssetId: string;
  parseStatus: CVParseStatus;
  parsedSummary: string | null;
  failureReason: string | null;
  uploadedAt: string;
  parsedAt: string | null;
  downloadUrl?: string | null;
};
export type SubmitCvResponse = { cvId: string; parseStatus: CVParseStatus; message: string };
export type CompleteProfileCommand = {
  fullName: string;
  dateOfBirth: string | null;
  preferredLocale: Locale | null;
  timeZone: string | null;
};

// Files
export type AssetKind = 'Image' | 'Video' | 'Audio' | 'Document' | 'Archive';
export type AssetVisibility = 'Private' | 'Internal' | 'Public';
export type UploadStatus = 'Uploading' | 'Processing' | 'Ready' | 'Failed' | 'Purged';
export type ScanStatus = 'Pending' | 'Clean' | 'Infected';
export type CreateUploadUrlCommand = { kind: AssetKind; mimeType: string; sizeBytes: number };
export type UploadUrlDto = {
  assetId: string;
  url: string;
  method: string;
  headers: Record<string, string>;
  expiresAt: string;
};
export type FileDto = {
  id: string;
  kind: AssetKind;
  mimeType: string;
  sizeBytes: number;
  visibility: AssetVisibility;
  uploadStatus: UploadStatus;
  scanStatus: ScanStatus;
  uploadedAt: string | null;
};
export type DownloadUrlDto = { url: string; expiresAt: string };

// Policies & consents
export type PolicyType =
  | 'TermsOfService'
  | 'PrivacyPolicy'
  | 'InterviewRecording'
  | 'PartnerDataSharing'
  | 'CodeOwnership';
export type ConsentChannel = 'Web' | 'Mobile';
export type ConsentDecision = 'Granted' | 'Revoked';
export type PolicyDto = {
  id: string;
  policyType: PolicyType;
  version: number;
  documentAssetId: string;
  effectiveFrom: string;
  isRequired: boolean;
};
export type MyConsentDto = {
  policyType: PolicyType;
  isRequired: boolean;
  currentVersion: number | null;
  decision: ConsentDecision | null;
  decidedVersion: number | null;
  decidedAt: string | null;
  needsAcceptance: boolean;
};

// Talent
export type TalentRequestStatus = 'Sent' | 'Accepted' | 'Declined';
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
  companyUserId: string;
  companyName: string | null;
  studentUserId: string;
  studentName: string | null;
  studentEmail: string | null;
  message: string;
  status: TalentRequestStatus;
  createdAt: string;
  respondedAt: string | null;
};

// Interviews
export type InterviewType = 'Technical' | 'Orientation';
export type InterviewStatus =
  | 'InProgress'
  | 'Interrupted'
  | 'Completed'
  | 'AutoConfirmed'
  | 'PendingReview'
  | 'Reviewed'
  | 'Abandoned';
export type OrientationResult = 'Fit' | 'OtherTrackRecommended' | 'NeedsPreparation';
export type ReviewSource = 'Auto' | 'Human' | 'Appeal';
export type InterviewQuestionDto = {
  orderIndex: number;
  topic: string | null;
  text: string;
  audioBase64: string | null;
  audioMimeType: string | null;
};
export type InterviewResultDto = {
  level: InterviewLevel | null;
  orientationResult: OrientationResult | null;
  recommendedTrackId: string | null;
  decidedBy: ReviewSource;
  decidedAt: string;
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
  closingAudioBase64: string | null;
  closingAudioMimeType: string | null;
  result: InterviewResultDto | null;
};
export type AnswerQuestionRequest = { orderIndex: number; audioAssetId: string };

// Certificates
export type MyCertificateDto = {
  id: string;
  squadId: string;
  trackId: string;
  trackName: string;
  level: string;
  code: string;
  issuedAt: string;
  pdfAssetId: string | null;
};

// Notifications
export type NotificationType =
  | 'RoleGranted'
  | 'RoleRemoved'
  | 'CvParsed'
  | 'CvParseFailed'
  | 'EnrollmentActivated'
  | 'InterviewReviewed'
  | 'SquadStarted'
  | 'TaskAssigned'
  | 'TaskApproved'
  | 'ProjectApproved'
  | 'MentorBookingConfirmed'
  | 'MentorBookingCancelled'
  | 'CourseCompleted'
  | 'TalentRequestReceived'
  | 'TalentRequestResponded'
  | 'CertificateIssued'
  | 'RewardGranted'
  | 'RepositoryInviteFailed';
export type SubjectType =
  | 'User'
  | 'Role'
  | 'Asset'
  | 'ConsentPolicy'
  | 'UserConsent'
  | 'Notification'
  | 'Track'
  | 'Package'
  | 'Enrollment'
  | 'Interview'
  | 'Squad'
  | 'Sprint'
  | 'SquadTask'
  | 'ChatMessage'
  | 'CV'
  | 'Skill'
  | 'WorkExperience'
  | 'Education'
  | 'MentorProfile'
  | 'MentorAvailabilitySlot'
  | 'MentorBooking'
  | 'Course'
  | 'Lesson'
  | 'TalentRequest'
  | 'Certificate'
  | 'PointsEntry'
  | 'Reward'
  | 'AuditLog'
  | 'OutboxMessage';
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
export type UnreadCountDto = { count: number };
