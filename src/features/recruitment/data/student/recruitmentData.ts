import agreementsJson from '@/features/recruitment/data/student/agreements.json';
import applicantJson from '@/features/recruitment/data/student/applicant.json';
import applicationsJson from '@/features/recruitment/data/student/applications.json';
import consentJson from '@/features/recruitment/data/student/consent.json';
import eligibilityJson from '@/features/recruitment/data/student/eligibility.json';

import type {
  AgreementRecord,
  Applicant,
  ApplicationRecord,
  ApplicationStageId,
  TalentDirectoryConsent,
} from '@/features/recruitment/types/recruitment';

// Student recruitment flow (PR #31) data: local JSON from src/data/recruitment, not an API.
// Read by the lib/recruitment/*Service modules (which the pages call), CompositeScoreCard,
// RecruitmentTopBar, the application/agreement pages and the router (default ids). The consent
// service keeps the Talent Directory choice in memory only, so it resets on reload.
export const CURRENT_APPLICANT = applicantJson as Applicant;

export const ELIGIBILITY_SAMPLE = eligibilityJson;

export const TALENT_DIRECTORY_CONSENT = consentJson as TalentDirectoryConsent;

export const APPLICATIONS = applicationsJson as ApplicationRecord[];

export const AGREEMENTS = agreementsJson as AgreementRecord[];

export const APPLICATION_STAGES: ApplicationStageId[] = [
  'applied',
  'profile-viewed',
  'interview',
  'employer-decision',
  'agreement',
  'completed',
];

export const DEFAULT_APPLICATION_ID = 'designcraft-ui-ux';

export const DEFAULT_AGREEMENT_ID = 'agr-designcraft-ui-ux';
