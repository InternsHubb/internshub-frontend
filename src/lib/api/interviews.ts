import { apiRequest } from './client';
import type { AnswerQuestionRequest, InterviewDto } from './types';

export function startInterview(): Promise<InterviewDto> {
  return apiRequest<InterviewDto>('/api/interviews', {
    method: 'POST',
    auth: true,
  });
}

export function getInterview(id: string): Promise<InterviewDto> {
  return apiRequest<InterviewDto>(`/api/interviews/${encodeURIComponent(id)}`, { auth: true });
}

export function submitInterviewAnswer(
  interviewId: string,
  body: AnswerQuestionRequest
): Promise<InterviewDto> {
  return apiRequest<InterviewDto>(
    `/api/interviews/${encodeURIComponent(interviewId)}/answers`,
    {
      method: 'POST',
      body,
      auth: true,
    }
  );
}

export function getMyInterviews(): Promise<InterviewDto[]> {
  return apiRequest<InterviewDto[]>('/api/me/interviews', { auth: true });
}
