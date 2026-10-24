import { format } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';

function toDate(isoDate: string): Date {
  return new Date(`${isoDate}T00:00:00`);
}

export function formatRecruitmentDate(isoDate: string, language: string): string {
  const locale = language.startsWith('ar') ? ar : enUS;
  return format(toDate(isoDate), 'MMM d, yyyy', { locale });
}

export function formatRecruitmentMonth(isoDate: string, language: string): string {
  const locale = language.startsWith('ar') ? ar : enUS;
  return format(toDate(isoDate), 'MMMM yyyy', { locale });
}
