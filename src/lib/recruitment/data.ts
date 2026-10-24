import agreementsJson from '@/data/recruitment/agreements.json';
import applicantJson from '@/data/recruitment/applicant.json';
import applicationsJson from '@/data/recruitment/applications.json';
import consentJson from '@/data/recruitment/consent.json';
import eligibilityJson from '@/data/recruitment/eligibility.json';

import type {
  AgreementRecord,
  Applicant,
  ApplicationRecord,
  ApplicationStageId,
  TalentDirectoryConsent,
} from './types';

// Student recruitment flow (PR #31) data: local JSON from src/data/recruitment, not an API.
// Read by the lib/recruitment/*Service modules (which the pages call), RecruitmentSidebar,
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
