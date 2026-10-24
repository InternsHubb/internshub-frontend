import { AGREEMENTS, CURRENT_APPLICANT } from './data';
import type { AgreementDetail } from './types';

export async function getAgreementById(
  agreementId: string,
): Promise<AgreementDetail | null> {
  const agreement = AGREEMENTS.find((item) => item.id === agreementId);
  if (!agreement) return null;

  return {
    ...agreement,
    applicant: CURRENT_APPLICANT,
  };
}
