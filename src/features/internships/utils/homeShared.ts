// Shared styles and formatters of the learner Dashboard home.

export const HOME_CARD = 'rounded-[24px] border border-[#ece6f1] bg-white shadow-[0_6px_20px_rgba(59,4,84,0.06)]';
export const EYEBROW = 'text-xs font-semibold uppercase tracking-[0.1em] text-[#6b5d78]';

// API date-times (UTC ISO strings), shown in the viewer's language and time zone.
export function formatSessionDay(iso: string, language: string): string {
  return new Intl.DateTimeFormat(language, { weekday: 'short', day: 'numeric', month: 'short' }).format(new Date(iso));
}

export function formatTime(iso: string, language: string): string {
  return new Intl.DateTimeFormat(language, { hour: 'numeric', minute: '2-digit' }).format(new Date(iso));
}

// Wraps interpolated text (names, track names) in Unicode isolates so Latin text
// inside an Arabic sentence keeps its own direction, like <bdi> does for whole elements.
export function isolate(text: string): string {
  return `\u2068${text}\u2069`;
}
