import type { CSSProperties } from 'react';

export function revealDelay(ms: number): CSSProperties {
  return { '--ih-delay': `${ms}ms` } as CSSProperties;
}
