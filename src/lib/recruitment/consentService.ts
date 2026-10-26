import { CURRENT_APPLICANT, TALENT_DIRECTORY_CONSENT } from './data';
import type {
  ConsentSubmission,
  ConsentTerm,
  TalentDirectoryConsent,
} from './types';

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
