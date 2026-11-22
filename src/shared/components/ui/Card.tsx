import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/shared/utils/cn';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  padded?: boolean;
}

export function Card({ children, padded = true, className, ...rest }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-[var(--radius-card)] border border-border-subtle bg-white shadow-[var(--shadow-card)]',
        padded && 'p-5',
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

export default Card;
