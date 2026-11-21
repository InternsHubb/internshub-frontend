import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/shared/utils/cn';

export interface PageContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  maxWidth?: 'md' | 'lg' | 'xl' | 'full';
}

const MAX_WIDTH_CLASSES = {
  md: 'max-w-4xl',
  lg: 'max-w-6xl',
  xl: 'max-w-[var(--spacing-container)]',
  full: 'max-w-none',
};

export function PageContainer({
  children,
  maxWidth = 'xl',
  className,
  ...rest
}: PageContainerProps) {
  return (
    <div
      className={cn('mx-auto w-full px-4 sm:px-6', MAX_WIDTH_CLASSES[maxWidth], className)}
      {...rest}
    >
      {children}
    </div>
  );
}

export default PageContainer;
