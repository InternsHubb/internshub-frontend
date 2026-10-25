import type { MeDto } from '@/lib/api/types';
import { initialsOf } from '@/lib/initials';

export type UserIdentity = {
  // Full name, or the email when no name was registered (registration sends only the email).
  primary: string;
  // The email under the name; empty when the email is already the primary line.
  secondary: string;
  initials: string;
};

// How the signed-in user is named in headers and cards. Null when /api/me gave nothing usable.
export function identityOf(user: MeDto | null): UserIdentity | null {
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
