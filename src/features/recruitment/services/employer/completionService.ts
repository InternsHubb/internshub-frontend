import { completionData, resolveCandidate } from '@/features/recruitment/data/employer/employerStore';
import type { CompletionView } from '@/features/recruitment/types/employer';

const delay = (ms = 120) => new Promise<void>((resolve) => window.setTimeout(resolve, ms));

export async function getCompletion(): Promise<CompletionView> {
  await delay();
  const { record } = completionData;
  return {
    summaryLabels: completionData.summaryLabels,
    record: {
      id: record.id,
      candidate: resolveCandidate(record.candidateId),
      employer: record.employer,
      role: record.role,
      durationMonths: record.durationMonths,
    },
    footer: completionData.footer,
  };
}
