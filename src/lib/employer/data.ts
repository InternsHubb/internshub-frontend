import agreementsJson from '@/data/employer/agreements.json';
import completionJson from '@/data/employer/completion.json';
import decisionsJson from '@/data/employer/decisions.json';
import employerJson from '@/data/employer/employer.json';
import interviewsJson from '@/data/employer/interviews.json';
import pipelineJson from '@/data/employer/pipeline.json';
import type {
  AgreementRecord,
  Candidate,
  CompletionData,
  EmployerDecision,
  EmployerProfile,
  InterviewDetails,
  Opportunity,
  PipelineData,
} from './types';

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
