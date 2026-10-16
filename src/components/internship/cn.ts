type ClassValue = string | false | null | undefined

// Joins conditional class names. The internship call sites never pass conflicting utilities,
// so no Tailwind class merging is needed.
export function cn(...classes: ReadonlyArray<ClassValue>): string {
  return classes.filter(Boolean).join(' ')
}
