import { initialsOf } from '@/shared/utils/initials';
import type { AuthUser } from './types';

export type UserIdentity = {
  primary: string;
  secondary: string;
  initials: string;
};

export function identityOf(user: AuthUser | null): UserIdentity | null {
  const fullName = user?.fullName?.trim() ?? '';
  const email = user?.email?.trim() ?? '';
  const primary = fullName || email;
  if (!primary) return null;
  return {
    primary,
    secondary: fullName ? email : '',
    initials: initialsOf(primary, !fullName),
  };
}
