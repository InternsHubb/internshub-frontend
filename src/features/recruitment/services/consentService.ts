import { CURRENT_APPLICANT, TALENT_DIRECTORY_CONSENT } from '@/features/recruitment/data/student/recruitmentData';
import type {
  ConsentSubmission,
  ConsentTerm,
  TalentDirectoryConsent,
} from '@/features/recruitment/types/recruitment';

// Local UI state until the new backend talent-visibility endpoint is connected in src/backend/.
let consented = TALENT_DIRECTORY_CONSENT.consented;

export async function getTalentDirectoryConsent(): Promise<TalentDirectoryConsent> {
  return {
    applicant: CURRENT_APPLICANT,
    terms: TALENT_DIRECTORY_CONSENT.terms as ConsentTerm[],
    visibleFields: TALENT_DIRECTORY_CONSENT.visibleFields,
    privateFields: TALENT_DIRECTORY_CONSENT.privateFields,
    consented,
  };
}

export async function submitTalentDirectoryConsent(
  acceptedTermIds: ConsentTerm['id'][],
): Promise<ConsentSubmission> {
  consented = acceptedTermIds.length > 0;

  return {
    consented,
    acceptedTermIds,
    submittedAt: new Date().toISOString(),
  };
}
