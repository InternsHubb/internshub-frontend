export type InterviewLevel = 'NotReady' | 'Junior' | 'Mid' | 'Advanced';

export type InterviewQuestionDto = {
  orderIndex: number;
  text: string;
  topic?: string | null;
  timeLimitSeconds?: number | null;
  audioUrl?: string | null;
  audioBase64?: string | null;
  audioMimeType?: string | null;
};

export type InterviewDto = {
  id: string;
  type: 'Technical' | 'Orientation' | 'Behavioral' | string;
  status: 'Started' | 'InProgress' | 'Interrupted' | 'Abandoned' | 'Completed' | 'PendingReview' | 'AutoConfirmed' | 'Reviewed' | string;
  startedAt: string;
  answeredCount: number;
  totalQuestions?: number;
  currentQuestion?: InterviewQuestionDto | null;
  closingText?: string | null;
  closingAudioBase64?: string | null;
  closingAudioMimeType?: string | null;
  result?: {
    level?: InterviewLevel | null;
    score?: number | null;
  } | null;
};

export type PolicyType = 'TermsOfService' | 'PrivacyPolicy' | 'InterviewRecording' | string;

export type PolicyDto = {
  id: string;
  policyType: PolicyType;
  version: string;
  documentAssetId: string;
};

export type MyConsentDto = {
  policyType: PolicyType;
  isRequired: boolean;
  needsAcceptance: boolean;
  acceptedAt?: string | null;
};

export type PackageDto = {
  id: string;
  code?: string;
  name: string;
  durationMonths: number;
  price?: number;
  isActive: boolean;
};

export type TrackSummaryDto = {
  id: string;
  code: string;
  name: string;
};

export type EnrollmentDto = {
  id: string;
  packageId: string;
  trackId: string;
  status: 'PendingPayment' | 'Active' | 'Cancelled' | 'Expired' | string;
  chosenAt: string;
  paidAt?: string | null;
  startedAt?: string | null;
};

export type InvoiceDto = {
  id: string;
  status: 'Pending' | 'Paid' | 'Failed' | 'Cancelled' | 'RequiresReview' | string;
  amount: number;
  currency: string;
  paidAt?: string | null;
};

export type CheckoutSessionDto = {
  invoiceId: string;
  redirectUrl: string;
};

export type CvParseStatus = 'Pending' | 'Processing' | 'Parsed' | 'Failed';

export type CvDto = {
  id: string;
  assetId?: string;
  parseStatus: CvParseStatus;
  parsedSummary?: string | null;
  downloadUrl?: string | null;
  uploadedAt: string;
};

export type ProficiencyLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

export type SkillDto = {
  id: string;
  name: string;
  isActive: boolean;
};

export type ProfileSkillDto = {
  skillId: string;
  name: string;
  proficiencyLevel: ProficiencyLevel | null;
};

export type EducationDto = {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy?: string | null;
  startDate: string;
  endDate?: string | null;
};

export type WorkExperienceDto = {
  id: string;
  companyName: string;
  jobTitle: string;
  description?: string | null;
  startDate: string;
  endDate?: string | null;
};

export type CareerProfileDto = {
  skills: ProfileSkillDto[];
  education: EducationDto[];
  workExperience: WorkExperienceDto[];
};

export type UploadUrlRequest = {
  kind: 'Document' | 'Audio' | string;
  mimeType: string;
  sizeBytes: number;
};

export type UploadTargetDto = {
  assetId: string;
  uploadUrl: string;
  headers?: Record<string, string>;
};

export type CompleteProfileRequest = {
  fullName: string;
  dateOfBirth: string;
  preferredLocale: string | null;
  timeZone: string | null;
};
