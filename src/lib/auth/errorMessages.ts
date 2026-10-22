import { ApiError } from '@/lib/api/client';

// Maps API failures to translation keys. Messages never echo raw server text, which may carry
// internal details; the backend's machine-readable codes pick the wording instead.

const HTTP_SERVER_ERROR = 500;
const HTTP_UNAUTHORIZED = 401;
const HTTP_BAD_REQUEST = 400;

function commonErrorKey(error: unknown): string | null {
  if (!(error instanceof ApiError)) return 'auth.common.errors.server';
  if (error.status === 0) return 'auth.common.errors.network';
  if (error.status >= HTTP_SERVER_ERROR) return 'auth.common.errors.server';
  return null;
}

// ASP.NET Identity puts the sign-in result in `detail`: Failed, NotAllowed, LockedOut, ...
// NotAllowed means the account exists but its email is not confirmed yet.
export function isEmailNotConfirmedError(error: unknown): boolean {
  return error instanceof ApiError && error.status === HTTP_UNAUTHORIZED && error.problem?.detail === 'NotAllowed';
}

export function loginErrorKey(error: unknown): string {
  const common = commonErrorKey(error);
  if (common) return common;

  const apiError = error as ApiError;
  const detail = apiError.problem?.detail ?? '';
  if (isEmailNotConfirmedError(error)) {
    return 'auth.login.errors.emailNotConfirmed';
  }
  if (apiError.status === HTTP_UNAUTHORIZED && detail === 'LockedOut') {
    return 'auth.login.errors.lockedOut';
  }
  return 'auth.login.errors.invalidCredentials';
}

export type ExternalProvider = 'google' | 'microsoft';

// Failures from POST /api/auth/external/{provider}. These must never read as a wrong password:
// the user typed no password. A 5xx keeps its own wording so a backend fault is not passed off as
// the user's mistake; any 4xx (the backend answered 404 for a rejected Microsoft token) means the
// provider token was not accepted.
export function externalSignInErrorKey(error: unknown, provider: ExternalProvider): string {
  if (error instanceof ApiError && error.status === 0) return 'auth.common.errors.network';
  if (error instanceof ApiError && error.status >= HTTP_SERVER_ERROR) {
    return `auth.login.errors.${provider}Server`;
  }
  if (error instanceof ApiError) return `auth.login.errors.${provider}Rejected`;
  return `auth.login.errors.${provider}Failed`;
}

const HTTP_TOO_MANY_REQUESTS = 429;

export type PhoneOtpError = 'phoneInvalid' | 'codeInvalid' | 'tooMany' | 'network' | 'server' | 'rejected';

// Failures from POST /api/auth/otp/send and /api/auth/otp/verify. The backend answers 400 when the
// number is not in international format and 401 when the code is wrong or expired.
export function phoneOtpError(error: unknown): PhoneOtpError {
  if (!(error instanceof ApiError)) return 'server';
  if (error.status === 0) return 'network';
  if (error.status === HTTP_TOO_MANY_REQUESTS) return 'tooMany';
  if (error.status >= HTTP_SERVER_ERROR) return 'server';
  if (error.status === HTTP_BAD_REQUEST && error.errorCodes.includes('phoneNumber')) return 'phoneInvalid';
  if (error.status === HTTP_UNAUTHORIZED) return 'codeInvalid';
  return 'rejected';
}

export type RegisterErrorResult = {
  // Banner message for the whole form, when the error is not tied to a field.
  formKey?: string;
  // Field-level messages keyed by form field name.
  fieldKeys: Partial<Record<'email' | 'password', string>>;
};

export function registerErrorResult(error: unknown): RegisterErrorResult {
  const common = commonErrorKey(error);
  if (common) return { formKey: common, fieldKeys: {} };

  const apiError = error as ApiError;
  if (apiError.status !== HTTP_BAD_REQUEST) {
    return { formKey: 'auth.register.errors.rejected', fieldKeys: {} };
  }

  const codes = apiError.errorCodes;
  if (codes.some((code) => code === 'DuplicateUserName' || code === 'DuplicateEmail')) {
    return { formKey: 'auth.register.errors.emailTaken', fieldKeys: {} };
  }

  const fieldKeys: RegisterErrorResult['fieldKeys'] = {
    ...(codes.some((code) => code.startsWith('InvalidEmail') || code === 'InvalidUserName')
      ? { email: 'auth.common.errors.emailInvalid' }
      : {}),
    ...(codes.some((code) => code.startsWith('Password'))
      ? { password: 'auth.register.errors.passwordWeak' }
      : {}),
  };
  return Object.keys(fieldKeys).length > 0
    ? { fieldKeys }
    : { formKey: 'auth.register.errors.rejected', fieldKeys: {} };
}

// Failures from POST /api/me/phone (send) and /api/me/phone/confirm. A 400 that names
// `phoneNumber` means the number was refused; any other 400/401 on confirm is treated as a wrong or
// expired code.
export function phoneVerificationErrorKey(error: unknown, stage: 'send' | 'confirm'): string {
  const prefix = 'onboarding.verify.errors';
  if (!(error instanceof ApiError)) return `${prefix}.server`;
  if (error.status === 0) return `${prefix}.network`;
  if (error.status === HTTP_TOO_MANY_REQUESTS) return `${prefix}.tooMany`;
  if (error.status >= HTTP_SERVER_ERROR) return `${prefix}.server`;
  if (error.status === HTTP_BAD_REQUEST && error.errorCodes.includes('phoneNumber')) {
    return `${prefix}.phoneInvalid`;
  }
  if (stage === 'confirm' && (error.status === HTTP_BAD_REQUEST || error.status === HTTP_UNAUTHORIZED)) {
    return `${prefix}.codeInvalid`;
  }
  return `${prefix}.rejected`;
}

export type PasswordResetError = 'network' | 'tooMany' | 'server' | 'invalidCode' | 'weakPassword' | 'rejected';

// Failures from POST /api/auth/forgotPassword and /api/auth/resetPassword. Identity answers
// `InvalidToken` for a wrong or expired code and also for an unknown or unconfirmed email, so the
// message never reveals whether an account exists. Password policy failures arrive as `Password*`.
export function passwordResetError(error: unknown): PasswordResetError {
  if (!(error instanceof ApiError)) return 'server';
  if (error.status === 0) return 'network';
  if (error.status === HTTP_TOO_MANY_REQUESTS) return 'tooMany';
  if (error.status >= HTTP_SERVER_ERROR) return 'server';
  const codes = error.errorCodes;
  if (codes.includes('InvalidToken')) return 'invalidCode';
  if (codes.some((code) => code.startsWith('Password'))) return 'weakPassword';
  return 'rejected';
}

export function genericErrorKey(error: unknown): string {
  return commonErrorKey(error) ?? 'auth.common.errors.server';
}
