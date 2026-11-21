import agreementsJson from '@/features/recruitment/data/employer/agreements.json';
import completionJson from '@/features/recruitment/data/employer/completion.json';
import decisionsJson from '@/features/recruitment/data/employer/decisions.json';
import employerJson from '@/features/recruitment/data/employer/employer.json';
import interviewsJson from '@/features/recruitment/data/employer/interviews.json';
import pipelineJson from '@/features/recruitment/data/employer/pipeline.json';
import type {
  AgreementRecord,
  Candidate,
  CompletionData,
  EmployerDecision,
  EmployerProfile,
  InterviewDetails,
  Opportunity,
  PipelineData,
} from '@/features/recruitment/types/employer';

// Employer decision/agreement flow (PR #32) data: local JSON from src/data/employer, not an
// API. Read by the lib/employer/*Service modules (which the pages call) and by the PR #32
// EmployerSidebar / EmployerTopbar. The legacy PR #30 prototype does not use this module.
export const employerProfile = employerJson.profile as EmployerProfile;
export const employerCandidate = employerJson.candidate as Candidate;
export const employerOpportunity = employerJson.opportunity as Opportunity;
export const pipelineData = pipelineJson as PipelineData;
export const completionData = completionJson as CompletionData;
export const agreementData = agreementsJson as AgreementRecord;

export const employerStore = {
  interview: { ...interviewsJson } as InterviewDetails,
  decision: { ...decisionsJson } as EmployerDecision,
};

export function resolveCandidate(candidateId: string): Candidate {
  return candidateId === employerCandidate.id ? employerCandidate : employerCandidate;
}

export function resolveOpportunity(opportunityId: string): Opportunity {
  return opportunityId === employerOpportunity.id ? employerOpportunity : employerOpportunity;
}
