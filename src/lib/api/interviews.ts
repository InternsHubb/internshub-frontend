import { apiRequest } from './client';
import type { InterviewDto } from './types';

export function startInterview(trackId: string): Promise<InterviewDto> {
  return apiRequest<InterviewDto>('/api/interviews', {
    method: 'POST',
    body: { trackId },
    auth: true,
  });
}

export function getInterview(id: string): Promise<InterviewDto> {
  return apiRequest<InterviewDto>(`/api/interviews/${encodeURIComponent(id)}`, { auth: true });
}

export function submitInterviewAnswer(
  interviewId: string,
  data: {
    questionId: string;
    answerText?: string;
    audioBase64?: string;
  }
): Promise<InterviewDto> {
  return apiRequest<InterviewDto>(
    `/api/interviews/${encodeURIComponent(interviewId)}/answers`,
    {
      method: 'POST',
      body: data,
      auth: true,
    }
  );
}

export function getMyInterviews(): Promise<InterviewDto[]> {
  return apiRequest<InterviewDto[]>('/api/me/interviews', { auth: true });
}
