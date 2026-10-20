import { clearSession, saveSession } from '@/lib/auth/session';
import { ApiError, apiRequest, isAccessTokenResponse } from './client';
import type { AccessTokenResponse, LoginRequest, MeDto, RegisterRequest } from './types';

// Signs in with email + password and stores the returned bearer tokens.
export async function login(credentials: LoginRequest): Promise<void> {
  const tokens = await apiRequest<AccessTokenResponse>('/api/auth/login', {
    method: 'POST',
    body: credentials,
  });
  if (!isAccessTokenResponse(tokens)) {
    throw new ApiError(500, null, 'Login response did not include tokens');
  }
  saveSession(tokens);
}

// Creates the account. The endpoint only accepts email + password and does not sign the user in.
export function register(request: RegisterRequest): Promise<void> {
  return apiRequest<void>('/api/auth/register', { method: 'POST', body: request });
}

// The backend answers the same way whether or not the email is registered.
export function requestPasswordReset(email: string): Promise<void> {
  return apiRequest<void>('/api/auth/forgotPassword', { method: 'POST', body: { email } });
}

export function resendConfirmationEmail(email: string): Promise<void> {
  return apiRequest<void>('/api/auth/resendConfirmationEmail', {
    method: 'POST',
    body: { email },
  });
}

export function fetchCurrentUser(): Promise<MeDto> {
  return apiRequest<MeDto>('/api/me', { auth: true });
}

// Exchanges a Google ID token for an InternsHub session. The OpenAPI document does not describe
// the success body, so the session is only stored when it carries the standard token fields.
export async function signInWithGoogle(idToken: string): Promise<void> {
  const body = await apiRequest<unknown>('/api/auth/external/google', {
    method: 'POST',
    body: { idToken },
  });
  if (!isAccessTokenResponse(body)) {
    throw new ApiError(500, null, 'Google sign-in response did not include tokens');
  }
  saveSession(body);
}

// Same contract as Google: an ID token in, tokens out (success body is not described in OpenAPI).
export async function signInWithMicrosoft(idToken: string): Promise<void> {
  const body = await apiRequest<unknown>('/api/auth/external/microsoft', {
    method: 'POST',
    body: { idToken },
  });
  if (!isAccessTokenResponse(body)) {
    throw new ApiError(500, null, 'Microsoft sign-in response did not include tokens');
  }
  saveSession(body);
}

// Asks the backend to text a sign-in code. `phoneNumber` must be in international (E.164) format,
// e.g. +201001234567; the backend rejects anything else with 400.
export function sendPhoneSignInCode(phoneNumber: string): Promise<void> {
  return apiRequest<void>('/api/auth/otp/send', { method: 'POST', body: { phoneNumber } });
}

// Exchanges the texted code for a session. A wrong or expired code is answered with 401. The
// OpenAPI document does not describe the success body, so the session is only stored when it
// carries the standard token fields.
export async function signInWithPhoneCode(phoneNumber: string, code: string): Promise<void> {
  const body = await apiRequest<unknown>('/api/auth/otp/verify', {
    method: 'POST',
    body: { phoneNumber, code },
  });
  if (!isAccessTokenResponse(body)) {
    throw new ApiError(500, null, 'Phone sign-in response did not include tokens');
  }
  saveSession(body);
}

// The backend has no single-session logout endpoint; dropping the tokens signs this browser out.
export function logout(): void {
  clearSession();
}
