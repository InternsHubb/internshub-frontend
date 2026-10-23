// Two letters from the first and last word of the name, or from the parts of the email's local part.
export function initialsOf(text: string, isEmail: boolean): string {
  const source = isEmail ? text.split('@')[0] : text;
  const parts = source.split(isEmail ? /[._+-]+/ : /\s+/).filter(Boolean);
  const first = Array.from(parts[0] ?? '')[0] ?? '';
  const last = parts.length > 1 ? (Array.from(parts[parts.length - 1])[0] ?? '') : '';
  return `${first}${last}`.toLocaleUpperCase();
}
