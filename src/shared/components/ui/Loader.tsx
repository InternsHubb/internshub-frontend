import { cn } from '@/shared/utils/cn';

export interface LoaderProps {
  label?: string;
  fullScreen?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SIZE_MAP = {
  sm: 'size-5 border-2',
  md: 'size-8 border-3',
  lg: 'size-10 border-4',
};

export function Loader({ label = 'Loading...', fullScreen = false, size = 'md', className }: LoaderProps) {
  return (
    <div
      role="status"
      aria-label={label}
      className={cn(
        'flex flex-col items-center justify-center gap-3',
        fullScreen ? 'min-h-screen bg-white' : 'min-h-[200px]',
        className
      )}
    >
      <div
        className={cn(
          'animate-spin rounded-full border-brand-primary border-t-transparent',
          SIZE_MAP[size]
        )}
      />
      <span className="sr-only">{label}</span>
    </div>
  );
}

export default Loader;
