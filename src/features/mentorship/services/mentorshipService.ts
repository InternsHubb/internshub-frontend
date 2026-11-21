import { notConnected } from '@/backend';

export type MentorshipEnrollmentDto = {
  id: string;
  packageId: string;
  trackId: string;
  status: 'PendingPayment' | 'Active' | 'Cancelled' | 'Expired' | string;
  chosenAt: string;
};

export type MentorshipPackageDto = {
  id: string;
  name: string;
  durationMonths: number;
  stages: Array<{ featureType: string; sessionQuota?: number | null }>;
};

export type MentorshipTrackDto = {
  id: string;
  code: string;
  name: string;
};

export type MentorSummaryDto = {
  userId: string;
  fullName: string;
  bio: string;
  trackIds: string[];
};

export type MentorSlotDto = {
  id: string;
  startsAt: string;
  endsAt: string;
  isBlocked: boolean;
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

export async function getMyEnrollments(): Promise<MentorshipEnrollmentDto[]> {
  return notConnected('mentorship', 'getMyEnrollments');
}

export async function getPackages(): Promise<MentorshipPackageDto[]> {
  return notConnected('mentorship', 'getPackages');
}

export async function getTracks(): Promise<MentorshipTrackDto[]> {
  return notConnected('mentorship', 'getTracks');
}

export async function getMentors(_params?: { trackId?: string }): Promise<MentorSummaryDto[]> {
  return notConnected('mentorship', 'getMentors');
}

export async function getMentorSlots(_mentorId: string): Promise<MentorSlotDto[]> {
  return notConnected('mentorship', 'getMentorSlots');
}

export async function getMyBookings(): Promise<MentorBookingDto[]> {
  return notConnected('mentorship', 'getMyBookings');
}

export async function bookMentorSlot(_mentorId: string, _slotId: string): Promise<MentorBookingDto> {
  return notConnected('mentorship', 'bookMentorSlot');
}

export async function cancelMyBooking(_bookingId: string): Promise<void> {
  return notConnected('mentorship', 'cancelMyBooking');
}
