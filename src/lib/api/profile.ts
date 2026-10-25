import { apiRequest } from './client';
import type {
  CvDto,
  EducationDto,
  SkillDto,
  StudentProfileDto,
  SubmitCvResponse,
  WorkExperienceDto,
} from './types';

export function getCareerProfile(): Promise<StudentProfileDto> {
  return apiRequest<StudentProfileDto>('/api/me/career-profile', { auth: true });
}

export function getAllSkills(): Promise<SkillDto[]> {
  return apiRequest<SkillDto[]>('/api/skills');
}

export function getMyCv(): Promise<CvDto> {
  return apiRequest<CvDto>('/api/me/cv', { auth: true });
}

export function submitCv(fileId: string): Promise<SubmitCvResponse> {
  return apiRequest<SubmitCvResponse>('/api/me/cv', {
    method: 'POST',
    body: { fileId },
    auth: true,
  });
}

export function addMySkill(data: { skillId: string; yearsOfExperience: number }): Promise<void> {
  return apiRequest<void>('/api/me/skills', {
    method: 'POST',
    body: data,
    auth: true,
  });
}

export function deleteMySkill(skillId: string): Promise<void> {
  return apiRequest<void>(`/api/me/skills/${encodeURIComponent(skillId)}`, {
    method: 'DELETE',
    auth: true,
  });
}

export function addExperience(data: Omit<WorkExperienceDto, 'id'>): Promise<WorkExperienceDto> {
  return apiRequest<WorkExperienceDto>('/api/me/experience', {
    method: 'POST',
    body: data,
    auth: true,
  });
}

export function updateExperience(id: string, data: Partial<WorkExperienceDto>): Promise<void> {
  return apiRequest<void>(`/api/me/experience/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: data,
    auth: true,
  });
}

export function deleteExperience(id: string): Promise<void> {
  return apiRequest<void>(`/api/me/experience/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    auth: true,
  });
}

export function addEducation(data: Omit<EducationDto, 'id'>): Promise<EducationDto> {
  return apiRequest<EducationDto>('/api/me/education', {
    method: 'POST',
    body: data,
    auth: true,
  });
}

export function updateEducation(id: string, data: Partial<EducationDto>): Promise<void> {
  return apiRequest<void>(`/api/me/education/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: data,
    auth: true,
  });
}

export function deleteEducation(id: string): Promise<void> {
  return apiRequest<void>(`/api/me/education/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    auth: true,
  });
}

export function updateGithubUsername(githubUsername: string): Promise<void> {
  return apiRequest<void>('/api/me/github', {
    method: 'PUT',
    body: { githubUsername },
    auth: true,
  });
}
