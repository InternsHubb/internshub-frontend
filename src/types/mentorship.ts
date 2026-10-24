export interface MentorSlot {
  id: string;
  date: string;
  time: string;
  duration: string;
  isoDateTime: string;
}

export interface Mentor {
  id: string;
  name: string;
  role: string;
  companySubtitle: string;
  tracks: string[];
  status: 'Available Slots' | 'No available slots';
  avatarUrl: string;
  description: string;
  about: string;
  expertise: string[];
  profiles: {
    linkedin?: string;
    github?: string;
    portfolio?: string;
  };
  nextAvailable: string;
  slots: MentorSlot[];
}

export interface MentorshipSession {
  id: string;
  sessionNumber: number;
  mentorId: string;
  mentorName: string;
  mentorRole: string;
  mentorAvatar: string;
  month: string;
  day: string;
  fullDate: string;
  time: string;
  duration: string;
  topic: string;
  subtopic?: string;
  status: 'Upcoming' | 'Completed' | 'Cancelled';
  meetingLink: string;
  isStartingSoon?: boolean;
  cancelledAt?: string;
  isLateCancellation?: boolean;
  rating?: number;
  feedback?: string;
}

export interface MentorshipBalance {
  total: number;
  completed: number;
  remaining: number;
  packageName: string;
  active: boolean;
}
