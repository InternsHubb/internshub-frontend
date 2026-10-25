// Client-side checks for the Profile step (PUT /api/me/profile). The backend stays the authority;
// these only stop submissions it would reject and show the reason in the user's language.

export const MINIMUM_AGE_YEARS = 18;

// `<input type="date">` and the API's `dateOfBirth` (OpenAPI `format: date`) both use YYYY-MM-DD.
const ISO_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

export type CalendarDate = { year: number; month: number; day: number };

export type ProfileFieldErrors = {
  fullName?: 'fullNameRequired';
  dateOfBirth?: 'dateOfBirthRequired' | 'dateOfBirthInvalid' | 'dateOfBirthFuture' | 'underAge';
};

// Rejects impossible dates such as 2007-02-30 instead of letting Date roll them over.
export function parseIsoDate(value: string): CalendarDate | null {
  const match = ISO_DATE_PATTERN.exec(value.trim());
  if (!match) return null;
  const [year, month, day] = match.slice(1).map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  const isRealDate =
    date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
  return isRealDate && year >= 1900 ? { year, month, day } : null;
}

export function toCalendarDate(date: Date): CalendarDate {
  return { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() };
}

export function toIsoDate({ year, month, day }: CalendarDate): string {
  return `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function compareDates(a: CalendarDate, b: CalendarDate): number {
  return a.year - b.year || a.month - b.month || a.day - b.day;
}

// Whole years lived on `today`: one less when this year's birthday hasn't come yet. Someone born on
// 29 February turns a year older on 1 March in non-leap years.
export function ageOn(birth: CalendarDate, today: CalendarDate): number {
  const hadBirthday = today.month > birth.month || (today.month === birth.month && today.day >= birth.day);
  return today.year - birth.year - (hadBirthday ? 0 : 1);
}

// Latest date of birth that is 18 today, used as the date picker's `max`. On 29 February the same
// day 18 years earlier doesn't exist, so it falls back to the 28th.
export function latestAllowedBirthDate(today: CalendarDate): string {
  const year = today.year - MINIMUM_AGE_YEARS;
  const candidate = { ...today, year };
  return toIsoDate(parseIsoDate(toIsoDate(candidate)) ? candidate : { ...candidate, day: 28 });
}

export function validateProfile(
  fullName: string,
  dateOfBirth: string,
  today: CalendarDate = toCalendarDate(new Date())
): ProfileFieldErrors {
  const errors: ProfileFieldErrors = {};
  if (fullName.trim() === '') errors.fullName = 'fullNameRequired';

  if (dateOfBirth.trim() === '') {
    errors.dateOfBirth = 'dateOfBirthRequired';
  } else {
    const birth = parseIsoDate(dateOfBirth);
    if (!birth) errors.dateOfBirth = 'dateOfBirthInvalid';
    else if (compareDates(birth, today) > 0) errors.dateOfBirth = 'dateOfBirthFuture';
    else if (ageOn(birth, today) < MINIMUM_AGE_YEARS) errors.dateOfBirth = 'underAge';
  }
  return errors;
}
