import { apiRequest } from './client';
import type {
  MentorBookingDto,
  MentorProfileDto,
  MentorSlotDto,
  MentorSummaryDto,
} from './types';

export function getMentors(params?: {
  trackId?: string;
  limit?: number;
}): Promise<MentorSummaryDto[]> {
  const query = new URLSearchParams();
  if (params?.trackId) query.set('trackId', params.trackId);
  if (params?.limit) query.set('limit', params.limit.toString());
  const queryString = query.toString() ? `?${query.toString()}` : '';
  return apiRequest<MentorSummaryDto[]>(`/api/mentors${queryString}`);
}

export function getPublicMentors(): Promise<MentorSummaryDto[]> {
  return apiRequest<MentorSummaryDto[]>('/api/public/mentors');
}

export function getMentorSlots(mentorUserId: string): Promise<MentorSlotDto[]> {
  return apiRequest<MentorSlotDto[]>(`/api/mentors/${encodeURIComponent(mentorUserId)}/slots`);
}

export function bookMentorSlot(
  mentorUserId: string,
  slotId: string,
  topic?: string
): Promise<MentorBookingDto> {
  return apiRequest<MentorBookingDto>(
    `/api/mentors/${encodeURIComponent(mentorUserId)}/slots/${encodeURIComponent(slotId)}/book`,
    {
      method: 'POST',
      body: topic ? { topic } : {},
      auth: true,
    }
  );
}

export function getMyBookings(): Promise<MentorBookingDto[]> {
  return apiRequest<MentorBookingDto[]>('/api/me/bookings', { auth: true });
}

export function cancelMyBooking(bookingId: string): Promise<void> {
  return apiRequest<void>(`/api/me/bookings/${encodeURIComponent(bookingId)}/cancel`, {
    method: 'POST',
    auth: true,
  });
}

export function getMyMentorProfile(): Promise<MentorProfileDto> {
  return apiRequest<MentorProfileDto>('/api/mentors/me', { auth: true });
}

export function updateMyMentorProfile(bio: string): Promise<void> {
  return apiRequest<void>('/api/mentors/me', {
    method: 'PUT',
    body: { bio },
    auth: true,
  });
}
