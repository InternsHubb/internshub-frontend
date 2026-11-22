export type InterviewLevel = 'NotReady' | 'Junior' | 'Mid' | 'Advanced';

export type EnrollmentDto = {
  id: string;
  userId?: string;
  packageId: string;
  packageCode?: string;
  trackId: string;
  trackCode?: string;
  source?: string;
  status: 'PendingPayment' | 'Active' | 'Cancelled' | 'Expired' | string;
  chosenAt: string;
  paidAt?: string | null;
  startedAt?: string | null;
  endsAt?: string | null;
};

export type PackageDto = {
  id: string;
  code?: string;
  name: string;
  durationMonths: number;
  price?: number;
  isActive?: boolean;
};

export type TrackSummaryDto = {
  id: string;
  code: string;
  name: string;
};

export type InterviewDto = {
  id: string;
  type: 'Technical' | 'Behavioral' | string;
  status: 'Started' | 'InProgress' | 'Completed' | 'PendingReview' | 'AutoConfirmed' | 'Reviewed' | 'Interrupted' | string;
  startedAt: string;
  result?: {
    level?: InterviewLevel | null;
    score?: number | null;
  } | null;
};

export type CourseSummaryDto = {
  id: string;
  title: string;
  trackName?: string | null;
  order: number;
  lessonCount: number;
  completedLessonsCount: number | null;
  totalDurationSeconds: number;
};

export type SquadMemberDto = {
  userId: string;
  fullName?: string | null;
  email?: string | null;
  joinedAt: string;
};

export type SquadStatus = 'Forming' | 'Active' | 'Completed';

export type SquadDetailsDto = {
  id: string;
  trackId: string;
  trackName: string;
  trackCode: string;
  level: InterviewLevel | string;
  status: SquadStatus;
  seniorUserId: string | null;
  seniorName: string | null;
  seniorEmail?: string | null;
  repositoryUrl: string | null;
  startedAt: string | null;
  createdAt: string;
  members: SquadMemberDto[];
};

export type SprintStatus = 'Planning' | 'Active' | 'Completed';

export type SprintSummaryDto = {
  id: string;
  number: number;
  status: SprintStatus;
  startsAt: string;
  endsAt: string;
  totalTasksCount?: number;
  completedTasksCount?: number;
  createdAt?: string;
};

export type SquadTaskStatus = 'Todo' | 'InProgress' | 'InReview' | 'Done';

export type SquadTaskDto = {
  id: string;
  sprintId?: string;
  title: string;
  description?: string | null;
  status: SquadTaskStatus;
  assigneeUserId?: string | null;
  assigneeName?: string | null;
  pullRequestUrl?: string | null;
  approvedByUserId?: string | null;
  approvedByName?: string | null;
  approvedAt?: string | null;
  createdAt?: string;
  dueAt?: string | null;
};

export type SprintBoardDto = {
  sprintId: string;
  squadId?: string;
  sprintNumber: number;
  status: SprintStatus;
  startsAt: string;
  endsAt: string;
  tasks: SquadTaskDto[];
};

export type MentorBookingDto = {
  id: string;
  mentorUserId: string;
  mentorName?: string | null;
  slotId: string;
  startsAt: string;
  endsAt: string;
  status: 'Booked' | 'Cancelled' | 'Completed' | string;
  meetingUrl?: string | null;
  cancelledAt: string | null;
};
