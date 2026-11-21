import { employerStore } from '@/features/recruitment/data/employer/employerStore';
import type { DecisionOutcome, EmployerDecision } from '@/features/recruitment/types/employer';

const delay = (ms = 120) => new Promise<void>((resolve) => window.setTimeout(resolve, ms));

export async function getDecision(applicationId: string): Promise<EmployerDecision> {
  await delay();
  if (employerStore.decision.applicationId !== applicationId) {
    throw new Error('Decision not found');
  }
  return { ...employerStore.decision };
}

export async function submitDecision(
  applicationId: string,
  outcome: DecisionOutcome,
  reason: string,
): Promise<EmployerDecision> {
  await delay();
  employerStore.decision = {
    applicationId,
    outcome,
    reason,
    status: 'submitted',
  };
  return { ...employerStore.decision };
}
