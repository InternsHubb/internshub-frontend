import { APPLICATIONS, APPLICATION_STAGES, CURRENT_APPLICANT } from './data';
import type { ApplicationDetail } from './types';

export async function getApplicationById(
  applicationId: string,
): Promise<ApplicationDetail | null> {
  const application = APPLICATIONS.find((item) => item.id === applicationId);
  if (!application) return null;

  return {
    ...application,
    applicant: CURRENT_APPLICANT,
    stages: APPLICATION_STAGES,
  };
}
