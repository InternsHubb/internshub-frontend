export type Applicant = {
  name: string;
  initials: string;
  role: string;
  cohort: string;
  compositeScore: number;
  eligibilityThreshold: number;
  profileVisible: boolean;
  percentile: string;
};

export type EligibilityReason = {
  id: 'courses' | 'performance' | 'mentor';
};

export type EligibilityResult = {
  applicant: Applicant;
  score: number;
  threshold: number;
  isEligible: boolean;
  isSample: boolean;
  reasons: EligibilityReason[];
};

export type ConsentTerm = {
  id: 'profile-visibility' | 'withdrawal';
  required: boolean;
};

export type TalentDirectoryConsent = {
  applicant: Applicant;
  terms: ConsentTerm[];
  visibleFields: string[];
  privateFields: string[];
  consented: boolean;
};

export type ConsentSubmission = {
  consented: boolean;
  acceptedTermIds: ConsentTerm['id'][];
  submittedAt: string;
};

export type ApplicationStatus = 'declined' | 'selected' | 'not-selected';

export type ApplicationStageId =
  | 'applied'
  | 'profile-viewed'
  | 'interview'
  | 'employer-decision'
  | 'agreement'
  | 'completed';

export type JobSummary = {
  title: string;
  company: string;
  companyInitials: string;
  location: string;
  employmentType: 'internship';
  workMode: 'hybrid';
  durationMonths: number;
  startDate: string;
};

export type ApplicationTimeline = {
  completedStages: number;
  activeSegments: number;
  totalSegments: number;
};

export type ApplicationAction = {
  kind: 'agreement' | 'applications' | 'opportunities';
  labelKey: string;
  agreementId?: string;
};

export type ApplicationRecord = {
  id: string;
  status: ApplicationStatus;
  job: JobSummary;
  timeline: ApplicationTimeline;
  action: ApplicationAction;
};

export type ApplicationDetail = ApplicationRecord & {
  applicant: Applicant;
  stages: ApplicationStageId[];
};

export type AgreementStatus = 'waiting-employer' | 'complete';

export type SignatureStatus = 'signed' | 'pending';

export type SignatureParty = {
  id: 'student' | 'employer';
  name: string;
  role: 'student' | 'employer';
  status: SignatureStatus;
  signedAt: string | null;
};

export type AgreementRecord = {
  id: string;
  applicationId: string;
  status: AgreementStatus;
  job: JobSummary;
  parties: SignatureParty[];
};

export type AgreementDetail = AgreementRecord & {
  applicant: Applicant;
};
