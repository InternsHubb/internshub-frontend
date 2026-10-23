import { employerCandidate, employerOpportunity, employerProfile } from './data';
import type { Candidate, EmployerProfile, Opportunity } from './types';

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
