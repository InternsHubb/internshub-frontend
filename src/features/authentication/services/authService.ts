import { BackendError, BackendNotConnectedError, notConnected } from '@/backend';

export type CredentialsPayload = {
  email: string;
  password: string;
};

export type PasswordResetErrorKind = 'network' | 'tooMany' | 'server' | 'invalidCode' | 'weakPassword' | 'rejected';

export type PhoneOtpError = 'phoneInvalid' | 'codeInvalid' | 'tooMany' | 'network' | 'server' | 'rejected';

export type RegisterErrorResult = {
  formKey: string | null;
  fieldKeys: Partial<Record<'email' | 'password', string>>;
};

export async function login(_payload: CredentialsPayload): Promise<void> {
  return notConnected('authentication', 'login');
}

export async function register(_payload: CredentialsPayload): Promise<void> {
  return notConnected('authentication', 'register');
}

export async function requestPasswordReset(_email: string): Promise<void> {
  return notConnected('authentication', 'requestPasswordReset');
}

export async function resetPassword(_email: string, _code: string, _newPassword: string): Promise<void> {
  return notConnected('authentication', 'resetPassword');
}

export async function resendConfirmationEmail(_email: string): Promise<void> {
  return notConnected('authentication', 'resendConfirmationEmail');
}

export async function sendPhoneSignInCode(_phoneNumber: string): Promise<void> {
  return notConnected('authentication', 'sendPhoneSignInCode');
}

export async function signInWithPhoneCode(_phoneNumber: string, _code: string): Promise<void> {
  return notConnected('authentication', 'signInWithPhoneCode');
}

export async function signInWithGoogle(_idToken: string): Promise<void> {
  return notConnected('authentication', 'signInWithGoogle');
}

export async function signInWithMicrosoft(_idToken: string): Promise<void> {
  return notConnected('authentication', 'signInWithMicrosoft');
}

export function isEmailNotConfirmedError(error: unknown): boolean {
  return error instanceof BackendError && error.payload?.code === 'EMAIL_NOT_CONFIRMED';
}

export function genericErrorKey(error: unknown): string {
  if (error instanceof BackendNotConnectedError) return 'common.errors.backendNotConnected';
  if (error instanceof BackendError) {
    if (error.status === 0) return 'auth.login.errors.network';
    if (error.status === 429) return 'auth.login.errors.tooMany';
  }
  return 'auth.login.errors.generic';
}

export function loginErrorKey(error: unknown): string {
  if (error instanceof BackendNotConnectedError) return 'common.errors.backendNotConnected';
  if (isEmailNotConfirmedError(error)) return 'auth.login.errors.notConfirmed';
  if (error instanceof BackendError) {
    if (error.status === 401) return 'auth.login.errors.invalidCredentials';
    if (error.status === 429) return 'auth.login.errors.tooMany';
    if (error.status === 0) return 'auth.login.errors.network';
  }
  return 'auth.login.errors.generic';
}

export function registerErrorResult(error: unknown): RegisterErrorResult {
  if (error instanceof BackendNotConnectedError) {
    return { formKey: 'common.errors.backendNotConnected', fieldKeys: {} };
  }
  return { formKey: genericErrorKey(error), fieldKeys: {} };
}

export function passwordResetError(error: unknown): PasswordResetErrorKind {
  if (error instanceof BackendError) {
    if (error.status === 0) return 'network';
    if (error.status === 429) return 'tooMany';
    if (error.payload?.code === 'INVALID_CODE') return 'invalidCode';
    if (error.payload?.code === 'WEAK_PASSWORD') return 'weakPassword';
  }
  return 'server';
}

export function phoneOtpError(error: unknown): PhoneOtpError {
  if (error instanceof BackendError) {
    if (error.status === 0) return 'network';
    if (error.status === 429) return 'tooMany';
    if (error.payload?.code === 'INVALID_CODE') return 'codeInvalid';
    if (error.payload?.code === 'INVALID_PHONE') return 'phoneInvalid';
  }
  return 'server';
}

export function externalSignInErrorKey(error: unknown, provider: 'google' | 'microsoft'): string {
  if (error instanceof BackendNotConnectedError) {
    return provider === 'google'
      ? 'auth.login.errors.googleUnavailable'
      : 'auth.login.errors.microsoftUnavailable';
  }
  return provider === 'google' ? 'auth.login.errors.googleFailed' : 'auth.login.errors.microsoftFailed';
}
