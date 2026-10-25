import { apiRequest } from './client';
import type {
  CheckoutResultDto,
  ChooseEnrollmentCommand,
  EnrollmentDto,
  InvoiceDto,
  PackageDto,
} from './types';

export function getPackages(): Promise<PackageDto[]> {
  return apiRequest<PackageDto[]>('/api/packages');
}

export function chooseEnrollment(packageId: string, trackId: string): Promise<EnrollmentDto> {
  return apiRequest<EnrollmentDto>('/api/enrollments', {
    method: 'POST',
    body: { packageId, trackId },
    auth: true,
  });
}

export function changeEnrollment(
  id: string,
  body: ChooseEnrollmentCommand
): Promise<EnrollmentDto> {
  return apiRequest<EnrollmentDto>(`/api/enrollments/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body,
    auth: true,
  });
}

export function checkoutEnrollment(enrollmentId: string): Promise<CheckoutResultDto> {
  return apiRequest<CheckoutResultDto>(
    `/api/enrollments/${encodeURIComponent(enrollmentId)}/checkout`,
    {
      method: 'POST',
      auth: true,
    }
  );
}

export function getMyEnrollments(): Promise<EnrollmentDto[]> {
  return apiRequest<EnrollmentDto[]>('/api/me/enrollments', { auth: true });
}

export function cancelEnrollment(
  enrollmentId: string,
  reason?: string | null
): Promise<EnrollmentDto> {
  return apiRequest<EnrollmentDto>(
    `/api/enrollments/${encodeURIComponent(enrollmentId)}/cancel`,
    {
      method: 'POST',
      body: { reason: reason ?? null },
      auth: true,
    }
  );
}

export function getMyInvoices(): Promise<InvoiceDto[]> {
  return apiRequest<InvoiceDto[]>('/api/me/invoices', { auth: true });
}
