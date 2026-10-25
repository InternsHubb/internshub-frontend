import { apiRequest } from './client';
import type {
  CvDto,
  EducationDto,
  EducationRequest,
  ProficiencyLevel,
  ProfileSkillDto,
  SkillDto,
  StudentProfileDto,
  SubmitCvResponse,
  WorkExperienceDto,
  WorkExperienceRequest,
} from './types';

export function getCareerProfile(): Promise<StudentProfileDto> {
  return apiRequest<StudentProfileDto>('/api/me/career-profile', { auth: true });
}

export function searchSkills(params?: {
  search?: string;
  limit?: number;
}): Promise<SkillDto[]> {
  const query = new URLSearchParams();
  if (params?.search) query.set('search', params.search);
  if (params?.limit) query.set('limit', params.limit.toString());
  const queryString = query.toString() ? `?${query.toString()}` : '';
  return apiRequest<SkillDto[]>(`/api/skills${queryString}`, { auth: true });
}

export function getMyCv(): Promise<CvDto> {
  return apiRequest<CvDto>('/api/me/cv', { auth: true });
}

export function submitCv(fileAssetId: string): Promise<SubmitCvResponse> {
  return apiRequest<SubmitCvResponse>('/api/me/cv', {
    method: 'POST',
    body: { fileAssetId },
    auth: true,
  });
}

export function addMySkill(data: {
  skillId: string;
  proficiencyLevel: ProficiencyLevel | null;
}): Promise<ProfileSkillDto> {
  return apiRequest<ProfileSkillDto>('/api/me/skills', {
    method: 'POST',
    body: data,
    auth: true,
  });
}

export function updateMySkill(
  skillId: string,
  proficiencyLevel: ProficiencyLevel | null
): Promise<ProfileSkillDto> {
  return apiRequest<ProfileSkillDto>(`/api/me/skills/${encodeURIComponent(skillId)}`, {
    method: 'PUT',
    body: { proficiencyLevel },
    auth: true,
  });
}

export function deleteMySkill(skillId: string): Promise<void> {
  return apiRequest<void>(`/api/me/skills/${encodeURIComponent(skillId)}`, {
    method: 'DELETE',
    auth: true,
  });
}

export function addExperience(data: WorkExperienceRequest): Promise<WorkExperienceDto> {
  return apiRequest<WorkExperienceDto>('/api/me/experience', {
    method: 'POST',
    body: data,
    auth: true,
  });
}

export function updateExperience(
  id: string,
  data: WorkExperienceRequest
): Promise<WorkExperienceDto> {
  return apiRequest<WorkExperienceDto>(`/api/me/experience/${encodeURIComponent(id)}`, {
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

export function addEducation(data: EducationRequest): Promise<EducationDto> {
  return apiRequest<EducationDto>('/api/me/education', {
    method: 'POST',
    body: data,
    auth: true,
  });
}

export function updateEducation(
  id: string,
  data: EducationRequest
): Promise<EducationDto> {
  return apiRequest<EducationDto>(`/api/me/education/${encodeURIComponent(id)}`, {
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

export function updateGithubUsername(gitHubUsername: string): Promise<void> {
  return apiRequest<void>('/api/me/github', {
    method: 'PUT',
    body: { gitHubUsername },
    auth: true,
  });
}
