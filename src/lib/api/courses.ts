import { apiRequest } from './client';
import type { CourseDetailDto, CourseSummaryDto } from './types';

export function getCourses(trackId?: string): Promise<CourseSummaryDto[]> {
  const query = trackId ? `?trackId=${encodeURIComponent(trackId)}` : '';
  return apiRequest<CourseSummaryDto[]>(`/api/courses${query}`);
}

export function getPublicCourses(): Promise<CourseSummaryDto[]> {
  return apiRequest<CourseSummaryDto[]>('/api/public/courses');
}

export function getCourseById(id: string): Promise<CourseDetailDto> {
  return apiRequest<CourseDetailDto>(`/api/courses/${encodeURIComponent(id)}`);
}

export function completeLesson(courseId: string, lessonId: string): Promise<void> {
  return apiRequest<void>(
    `/api/courses/${encodeURIComponent(courseId)}/lessons/${encodeURIComponent(lessonId)}/complete`,
    {
      method: 'POST',
      auth: true,
    }
  );
}
