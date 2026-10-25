import { apiRequest } from './client';
import type {
  CompleteProfileCommand,
  MeDto,
  MyCertificateDto,
  MyConsentDto,
  PolicyType,
} from './types';

// Phone confirmation for the signed-in user. The OpenAPI document lists 200 for both, but the
// backend answers the send call with 202 and an empty body, which does not prove an SMS was
// delivered. The confirmed state is only read back from GET /api/me.
// Email is not confirmed here: the backend uses the link from the confirmation email
// (GET /api/auth/confirmEmail), not a code.

// `phoneNumber` must be in international (E.164) format, e.g. +201001234567.
export function sendPhoneConfirmationCode(phoneNumber: string): Promise<void> {
  return apiRequest<void>('/api/me/phone', { method: 'POST', body: { phoneNumber }, auth: true });
}

export function confirmPhoneCode(phoneNumber: string, code: string): Promise<void> {
  return apiRequest<void>('/api/me/phone/confirm', {
    method: 'POST',
    body: { phoneNumber, code },
    auth: true,
  });
}

export function completeProfile(body: CompleteProfileCommand): Promise<MeDto> {
  return apiRequest<MeDto>('/api/me/profile', {
    method: 'PUT',
    body,
    auth: true,
  });
}

export function getMyConsents(): Promise<MyConsentDto[]> {
  return apiRequest<MyConsentDto[]>('/api/me/consents', { auth: true });
}

export function giveConsent(
  policyType: PolicyType,
  channel: 'Web' | 'Mobile' = 'Web'
): Promise<void> {
  return apiRequest<void>('/api/me/consents', {
    method: 'POST',
    body: { policyType, channel },
    auth: true,
  });
}

export function revokeConsent(
  policyType: PolicyType,
  channel: 'Web' | 'Mobile' = 'Web'
): Promise<void> {
  return apiRequest<void>(`/api/me/consents/${encodeURIComponent(policyType)}/revoke`, {
    method: 'POST',
    body: { channel },
    auth: true,
  });
}

export function getMyCertificates(): Promise<MyCertificateDto[]> {
  return apiRequest<MyCertificateDto[]>('/api/me/certificates', { auth: true });
}
