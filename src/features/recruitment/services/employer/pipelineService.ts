import { employerStore, pipelineData, resolveCandidate, resolveOpportunity } from '@/features/recruitment/data/employer/employerStore';
import type { PipelineRecordView, PipelineStage, PipelineView } from '@/features/recruitment/types/employer';

const delay = (ms = 120) => new Promise<void>((resolve) => window.setTimeout(resolve, ms));

export async function getPipeline(stage: PipelineStage = 'all'): Promise<PipelineView> {
  await delay();

  const records: PipelineRecordView[] = pipelineData.records.map((record) => ({
    id: record.id,
    candidate: resolveCandidate(record.candidateId),
    opportunity: resolveOpportunity(record.opportunityId),
    stage: record.stage,
    interview: record.interview
      ? {
          ...record.interview,
          date: employerStore.interview.date,
          startTime: employerStore.interview.startTime,
          endTime: employerStore.interview.endTime,
          status: employerStore.interview.status,
        }
      : null,
  }));

  return {
    filters: pipelineData.filters,
    records: stage === 'all' ? records : records.filter((record) => record.stage === stage),
  };
}
