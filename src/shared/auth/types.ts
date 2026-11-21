export type UserRole = 'student' | 'employer' | 'mentor' | 'admin';

export type AuthStatus = 'loading' | 'authenticated' | 'anonymous';

export type OnboardingStepKey =
  | 'ConfirmEmail'
  | 'ConfirmPhone'
  | 'CompleteProfile'
  | 'AcceptPolicies';

/**
 * Neutral frontend representation of an authenticated user.
 * Populated by the future backend integration in `src/backend/`.
 */
export interface AuthUser {
  id: string;
  email: string | null;
  emailConfirmed: boolean;
  phoneNumber: string | null;
  phoneNumberConfirmed: boolean;
  fullName: string | null;
  dateOfBirth: string | null;
  preferredLocale: 'Ar' | 'En';
  timeZone: string;
  roles: UserRole[];
  requiredPoliciesAccepted: boolean;
  visibleToCompanies: boolean;
  missingOnboardingSteps?: OnboardingStepKey[] | null;
  isOnboardingComplete?: boolean;
}

export interface AuthContextValue {
  status: AuthStatus;
  user: AuthUser | null;
  isAuthenticated: boolean;
  hasRole: (role: UserRole) => boolean;
  hasAnyRole: (roles: ReadonlyArray<UserRole>) => boolean;
  reloadUser: () => Promise<AuthUser | null>;
  signOut: () => void;
}
