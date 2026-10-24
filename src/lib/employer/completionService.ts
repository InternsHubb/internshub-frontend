import { completionData, resolveCandidate } from './data';
import type { CompletionView } from './types';

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
