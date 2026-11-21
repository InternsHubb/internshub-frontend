import { notConnected } from '@/backend';
import type {
  CourseSummaryDto,
  EnrollmentDto,
  InterviewDto,
  MentorBookingDto,
  PackageDto,
  SprintBoardDto,
  SprintSummaryDto,
  SquadDetailsDto,
  SquadTaskStatus,
  TrackSummaryDto,
} from '@/features/internships/types/internships.types';

export async function getMyEnrollments(): Promise<EnrollmentDto[]> {
  return notConnected('internships', 'getMyEnrollments');
}

export async function getPackages(): Promise<PackageDto[]> {
  return notConnected('internships', 'getPackages');
}

export async function getTracks(): Promise<TrackSummaryDto[]> {
  return notConnected('internships', 'getTracks');
}

export async function getMyInterviews(): Promise<InterviewDto[]> {
  return notConnected('internships', 'getMyInterviews');
}

export async function getMySquad(): Promise<SquadDetailsDto | null> {
  return notConnected('internships', 'getMySquad');
}

export async function getTrackCourses(_trackId: string): Promise<CourseSummaryDto[]> {
  return notConnected('internships', 'getTrackCourses');
}

export async function getMyBookings(): Promise<MentorBookingDto[]> {
  return notConnected('internships', 'getMyBookings');
}

export async function getSquadSprints(_squadId: string): Promise<SprintSummaryDto[]> {
  return notConnected('internships', 'getSquadSprints');
}

export async function getSquadBoard(_squadId: string, _sprintId: string): Promise<SprintBoardDto> {
  return notConnected('internships', 'getSquadBoard');
}

export async function moveTask(_taskId: string, _status: SquadTaskStatus): Promise<void> {
  return notConnected('internships', 'moveTask');
}

export async function updateGithubUsername(_username: string): Promise<void> {
  return notConnected('internships', 'updateGithubUsername');
}
