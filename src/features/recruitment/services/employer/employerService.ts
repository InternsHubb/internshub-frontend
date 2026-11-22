import { employerCandidate, employerOpportunity, employerProfile } from '@/features/recruitment/data/employer/employerStore';
import type { Candidate, EmployerProfile, Opportunity } from '@/features/recruitment/types/employer';

export type EmployerContext = {
  profile: EmployerProfile;
  candidate: Candidate;
  opportunity: Opportunity;
};

const delay = (ms = 120) => new Promise<void>((resolve) => window.setTimeout(resolve, ms));

export async function getEmployerContext(): Promise<EmployerContext> {
  await delay();
  return {
    profile: employerProfile,
    candidate: employerCandidate,
    opportunity: employerOpportunity,
  };
}
