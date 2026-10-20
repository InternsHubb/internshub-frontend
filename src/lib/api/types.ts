// Shapes taken from the backend OpenAPI document (https://internshub.runasp.net/openapi/v1.json).
// Only the endpoints the frontend calls are modelled here.

export type AccessTokenResponse = {
  tokenType?: string | null;
  accessToken: string;
  // Seconds until the access token expires. The schema allows a numeric string as well.
  expiresIn: number | string;
  refreshToken: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  email: string;
  password: string;
};

export type Locale = 'Ar' | 'En';

export type OnboardingStep =
  | 'ConfirmEmail'
  | 'ConfirmPhone'
  | 'CompleteProfile'
  | 'AcceptPolicies';

export type UserStatus = 'Active' | 'Suspended' | 'Deleted';

export type MeDto = {
  id: string;
  email: string | null;
  emailConfirmed: boolean;
  phoneNumber: string | null;
  phoneNumberConfirmed: boolean;
  fullName: string | null;
  dateOfBirth: string | null;
  preferredLocale: Locale;
  timeZone: string;
  status: UserStatus;
  roles: string[];
  requiredPoliciesAccepted: boolean;
  missingOnboardingSteps?: OnboardingStep[] | null;
  isOnboardingComplete?: boolean;
};

// RFC 9110 problem details as returned by ASP.NET; `errors` maps a code or field to messages.
export type ProblemDetails = {
  type?: string | null;
  title?: string | null;
  status?: number | string | null;
  detail?: string | null;
  errors?: Record<string, string[]>;
};
