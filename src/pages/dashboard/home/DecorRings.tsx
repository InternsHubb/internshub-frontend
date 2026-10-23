import { cn } from '@/lib/cn';

// Concentric circle pattern of the "Learner dashboard" hero and hub banners: two
// translucent white discs form a light ring around a dark core. Purely decorative.
export function DecorRings({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn('pointer-events-none absolute aspect-square rounded-full bg-white/[0.06]', className)}>
      <div className="absolute inset-[14%] rounded-full bg-white/[0.06]" />
      <div className="absolute inset-[28%] rounded-full bg-black/25" />
    </div>
  );
}

export default DecorRings;
