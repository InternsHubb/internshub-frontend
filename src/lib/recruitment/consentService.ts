import { fetchCurrentUser } from '@/lib/api/auth';
import { setTalentVisibility } from '@/lib/api/talent';
import { CURRENT_APPLICANT, TALENT_DIRECTORY_CONSENT } from './data';
import type {
  ConsentSubmission,
  ConsentTerm,
  TalentDirectoryConsent,
} from './types';

let consented = TALENT_DIRECTORY_CONSENT.consented;

export async function getTalentDirectoryConsent(): Promise<TalentDirectoryConsent> {
  try {
    const me = await fetchCurrentUser();
    if (typeof me.visibleToCompanies === 'boolean') {
      consented = me.visibleToCompanies;
    }
  } catch {
    // Keep last known consent state if not signed in or offline
  }

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

  try {
    await setTalentVisibility(consented);
  } catch {
    // Preserve local consent state smoothly for demo if network or auth is unavailable
  }

  return {
    consented,
    acceptedTermIds,
    submittedAt: new Date().toISOString(),
  };
}
