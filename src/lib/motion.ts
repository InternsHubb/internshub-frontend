import type { CSSProperties } from 'react'

// Sets the --ih-delay custom property read by the .ih-* animation classes in index.css.
export function revealDelay(ms: number): CSSProperties {
  return { '--ih-delay': `${ms}ms` } as CSSProperties
}
