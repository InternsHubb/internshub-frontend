import blob from '@/assets/dashboard/courses-lock-blob.svg';
import girl from '@/assets/dashboard/courses-girl.svg';
import ground from '@/assets/dashboard/courses-ground.svg';
import lock from '@/assets/dashboard/courses-lock.svg';
import people from '@/assets/dashboard/courses-people.svg';
import { cn } from '@/shared/utils/cn';

// Lock illustration of the courses empty state ("courses 3m plan", 30:446). Figma exports it as
// five layers; each one is placed at its Figma position as a percentage of the 669.41 x 343.6
// group, so the composition keeps its proportions at any width.
const WIDTH = 669.41;
const HEIGHT = 343.6;

const LAYERS = [
  { src: blob, left: 0, top: 6.26, width: 658.888, height: 336.677 },
  { src: lock, left: 340.9, top: 0, width: 293.404, height: 342.105 },
  { src: people, left: 26.97, top: 125.55, width: 271.882, height: 217.004 },
  { src: girl, left: 450.4, top: 41.69, width: 118.745, height: 156.669 },
  { src: ground, left: 3.21, top: 341.83, width: 666.199, height: 1.767 },
] as const;

const percent = (value: number, total: number) => `${(value / total) * 100}%`;

export function LockedCoursesIllustration({ className }: { className?: string }) {
  return (
    // The artwork is not mirrored in RTL: it is a picture, not a directional layout.
    <div
      aria-hidden="true"
      dir="ltr"
      className={cn('relative w-full', className)}
      style={{ aspectRatio: `${WIDTH} / ${HEIGHT}` }}
    >
      {LAYERS.map((layer) => (
        <img
          key={layer.src}
          src={layer.src}
          alt=""
          className="absolute block max-w-none"
          style={{
            left: percent(layer.left, WIDTH),
            top: percent(layer.top, HEIGHT),
            width: percent(layer.width, WIDTH),
            height: percent(layer.height, HEIGHT),
          }}
        />
      ))}
    </div>
  );
}

export default LockedCoursesIllustration;
