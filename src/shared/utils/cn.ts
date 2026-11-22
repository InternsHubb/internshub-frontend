type ClassValue = string | false | null | undefined;

export function cn(...classes: ReadonlyArray<ClassValue>): string {
  return classes.filter(Boolean).join(' ');
}
