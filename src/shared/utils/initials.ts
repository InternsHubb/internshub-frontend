export function initialsOf(text: string, isEmail = false): string {
  const source = isEmail ? text.split('@')[0] : text;
  const parts = source.split(isEmail ? /[._+-]+/ : /\s+/).filter(Boolean);
  const first = Array.from(parts[0] ?? '')[0] ?? '';
  const last = parts.length > 1 ? (Array.from(parts[parts.length - 1])[0] ?? '') : '';
  return `${first}${last}`.toLocaleUpperCase();
}
