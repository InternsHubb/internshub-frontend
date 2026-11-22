function localeFor(language: string): string {
  return language === 'ar' ? 'ar-EG' : 'en-US';
}

export function formatEmployerDate(isoDate: string, language: string): string {
  const date = new Date(`${isoDate}T00:00:00`);
  return new Intl.DateTimeFormat(localeFor(language), {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

export function formatEmployerTime(time: string, language: string): string {
  const [hours, minutes] = time.split(':').map(Number);
  const date = new Date(2026, 0, 1, hours, minutes);
  return new Intl.DateTimeFormat(localeFor(language), {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date);
}

export function formatEmployerTimeRange(startTime: string, endTime: string, language: string): string {
  return `${formatEmployerTime(startTime, language)}–${formatEmployerTime(endTime, language)}`;
}

export function formatEmployerDateTime(
  isoDate: string,
  startTime: string,
  endTime: string,
  language: string,
): string {
  return `${formatEmployerDate(isoDate, language)} · ${formatEmployerTimeRange(startTime, endTime, language)}`;
}
