import { BackendError, BackendNotConnectedError, getBackendErrorKey, notConnected } from '@/backend';
import type {
  CareerProfileDto,
  CheckoutSessionDto,
  CompleteProfileRequest,
  CvDto,
  EnrollmentDto,
  InterviewDto,
  InvoiceDto,
  MyConsentDto,
  PackageDto,
  PolicyDto,
  PolicyType,
  ProficiencyLevel,
  SkillDto,
  TrackSummaryDto,
  UploadTargetDto,
  UploadUrlRequest,
} from '@/features/onboarding/types/onboarding.types';

export async function sendPhoneConfirmationCode(_phoneNumber: string): Promise<void> {
  return notConnected('onboarding', 'sendPhoneConfirmationCode');
}

export async function confirmPhoneCode(_phoneNumber: string, _code: string): Promise<void> {
  return notConnected('onboarding', 'confirmPhoneCode');
}

export async function completeProfile(_payload: CompleteProfileRequest): Promise<void> {
  return notConnected('onboarding', 'completeProfile');
}

export async function getCurrentPolicies(): Promise<PolicyDto[]> {
  return notConnected('onboarding', 'getCurrentPolicies');
}

export async function getMyConsents(): Promise<MyConsentDto[]> {
  return notConnected('onboarding', 'getMyConsents');
}

export async function giveConsent(_policyType: PolicyType): Promise<void> {
  return notConnected('onboarding', 'giveConsent');
}

export async function getDownloadUrl(_assetId: string): Promise<{ url: string }> {
  return notConnected('onboarding', 'getDownloadUrl');
}

export async function createUploadUrl(_request: UploadUrlRequest): Promise<UploadTargetDto> {
  return notConnected('onboarding', 'createUploadUrl');
}

export async function uploadToSignedUrl(_target: UploadTargetDto, _file: Blob): Promise<void> {
  return notConnected('onboarding', 'uploadToSignedUrl');
}

export async function confirmUpload(_assetId: string): Promise<void> {
  return notConnected('onboarding', 'confirmUpload');
}

export async function getPackages(): Promise<PackageDto[]> {
  return notConnected('onboarding', 'getPackages');
}

export async function getTracks(): Promise<TrackSummaryDto[]> {
  return notConnected('onboarding', 'getTracks');
}

export async function getMyEnrollments(): Promise<EnrollmentDto[]> {
  return notConnected('onboarding', 'getMyEnrollments');
}

export async function chooseEnrollment(_packageId: string, _trackId: string): Promise<EnrollmentDto> {
  return notConnected('onboarding', 'chooseEnrollment');
}

export async function changeEnrollment(
  _enrollmentId: string,
  _body: { packageId: string; trackId: string },
): Promise<EnrollmentDto> {
  return notConnected('onboarding', 'changeEnrollment');
}

export async function checkoutEnrollment(_enrollmentId: string): Promise<CheckoutSessionDto> {
  return notConnected('onboarding', 'checkoutEnrollment');
}

export async function getMyInvoices(): Promise<InvoiceDto[]> {
  return notConnected('onboarding', 'getMyInvoices');
}

export async function getMyCv(): Promise<CvDto> {
  return notConnected('onboarding', 'getMyCv');
}

export async function submitCv(_assetId: string): Promise<void> {
  return notConnected('onboarding', 'submitCv');
}

export async function getCareerProfile(): Promise<CareerProfileDto> {
  return notConnected('onboarding', 'getCareerProfile');
}

export async function addEducation(_body: Record<string, unknown>): Promise<void> {
  return notConnected('onboarding', 'addEducation');
}

export async function updateEducation(_id: string, _body: Record<string, unknown>): Promise<void> {
  return notConnected('onboarding', 'updateEducation');
}

export async function addExperience(_body: Record<string, unknown>): Promise<void> {
  return notConnected('onboarding', 'addExperience');
}

export async function updateExperience(_id: string, _body: Record<string, unknown>): Promise<void> {
  return notConnected('onboarding', 'updateExperience');
}

export async function searchSkills(_params: { search: string; limit: number }): Promise<SkillDto[]> {
  return notConnected('onboarding', 'searchSkills');
}

export async function addMySkill(_body: { skillId: string; proficiencyLevel: ProficiencyLevel | null }): Promise<void> {
  return notConnected('onboarding', 'addMySkill');
}

export async function updateMySkill(_skillId: string, _level: ProficiencyLevel | null): Promise<void> {
  return notConnected('onboarding', 'updateMySkill');
}

export async function getMyInterviews(): Promise<InterviewDto[]> {
  return notConnected('onboarding', 'getMyInterviews');
}

export async function getInterview(_id: string): Promise<InterviewDto> {
  return notConnected('onboarding', 'getInterview');
}

export async function startInterview(): Promise<InterviewDto> {
  return notConnected('onboarding', 'startInterview');
}

export async function submitInterviewAnswer(
  _interviewId: string,
  _payload: { orderIndex: number; audioAssetId: string },
): Promise<InterviewDto> {
  return notConnected('onboarding', 'submitInterviewAnswer');
}

export function apiErrorKey(error: unknown): string {
  return getBackendErrorKey(error);
}

export function apiErrorDetail(error: unknown): string | null {
  if (error instanceof BackendNotConnectedError) return null;
  if (error instanceof BackendError && typeof error.payload?.detail === 'string') {
    return error.payload.detail;
  }
  return null;
}

export function missingOnboardingSteps(error: unknown): string[] {
  if (error instanceof BackendError && error.payload) {
    const steps = (error.payload as { missingSteps?: unknown }).missingSteps;
    if (Array.isArray(steps)) return steps.filter((s): s is string => typeof s === 'string');
  }
  return [];
}

export function getValidationErrors(error: unknown): Record<string, string[]> | null {
  if (error instanceof BackendError) {
    return error.validationErrors;
  }
  return null;
}

export function phoneVerificationErrorKey(error: unknown, _action: 'send' | 'confirm'): string {
  if (error instanceof BackendNotConnectedError) return 'common.errors.backendNotConnected';
  if (error instanceof BackendError) {
    if (error.status === 429) return 'onboarding.verify.errors.tooMany';
    if (error.status === 0) return 'onboarding.verify.errors.network';
  }
  return 'onboarding.verify.errors.generic';
}
