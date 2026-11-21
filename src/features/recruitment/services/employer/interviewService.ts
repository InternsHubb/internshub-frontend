import { employerStore } from '@/features/recruitment/data/employer/employerStore';
import type { InterviewDetails, InterviewFormValues } from '@/features/recruitment/types/employer';

const delay = (ms = 120) => new Promise<void>((resolve) => window.setTimeout(resolve, ms));

export async function getInterview(applicationId: string): Promise<InterviewDetails> {
  await delay();
  if (employerStore.interview.applicationId !== applicationId) {
    throw new Error('Interview not found');
  }
  return { ...employerStore.interview };
}

export async function scheduleInterview(
  applicationId: string,
  values: InterviewFormValues,
): Promise<InterviewDetails> {
  await delay();
  employerStore.interview = {
    ...employerStore.interview,
    ...values,
    applicationId,
    status: 'scheduled',
  };
  return { ...employerStore.interview };
}
