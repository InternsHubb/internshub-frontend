import { CURRENT_APPLICANT, ELIGIBILITY_SAMPLE } from './data';
import type { EligibilityResult } from './types';

export async function getEligibilityResult(): Promise<EligibilityResult> {
  const { score, threshold, isSample, reasons } = ELIGIBILITY_SAMPLE;

  return {
    applicant: CURRENT_APPLICANT,
    score,
    threshold,
    isEligible: score >= threshold,
    isSample,
    reasons: reasons as EligibilityResult['reasons'],
  };
}
