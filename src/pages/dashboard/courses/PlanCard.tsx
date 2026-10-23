import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import divider from '@/assets/dashboard/plan-divider.svg';
import { cn } from '@/lib/cn';

// One package card of "Choose Your Growth Plan" ("courses 3m plan", 30:248) and its expanded
// form with the upgrade price (30:632).

export type PlanCardProps = {
  id: string;
  name: string;
  price: string;
  badgeIcon: string;
  checkIcon: string;
  features: ReadonlyArray<string>;
  tone: 'popular' | 'current';
  badge: string;
  // Footer: the call to action (or "Your Current Plan") and, when expanded, the upgrade box.
  children: ReactNode;
};

export function PlanCard({ id, name, price, badgeIcon, checkIcon, features, tone, badge, children }: PlanCardProps) {
  const { t } = useTranslation();
  const isPopular = tone === 'popular';
  const titleId = `plan-${id}-title`;

  return (
    <article
      aria-labelledby={titleId}
      className={cn(
        'relative flex w-full max-w-[382px] flex-col rounded-[36px] px-4 pb-8 pt-8 sm:px-5',
        isPopular
          ? 'border-[3px] border-[#7a3d9c] bg-[#fcf8ff] shadow-[0_10px_30px_rgba(90,26,143,0.12)]'
          : 'border border-[#a6a6a6] bg-white',
      )}
    >
      <span
        className={cn(
          'absolute inset-x-0 -top-3.5 mx-auto w-fit whitespace-nowrap rounded-full px-4 py-1 text-xs font-bold uppercase leading-4',
          isPopular ? 'bg-[#4e0f7c] text-white' : 'border border-[#4e0f7c] bg-white text-[#4e0f7c]',
        )}
      >
        {badge}
      </span>

      <div className="flex items-center gap-2">
        {/* Figma exports the badge glyph as an alpha mask; it is painted white on the purple disc. */}
        <span aria-hidden="true" className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#5a1a8f]">
          <span
            className="size-8 bg-white"
            style={{ maskImage: `url(${badgeIcon})`, maskSize: 'contain', maskRepeat: 'no-repeat', maskPosition: 'center' }}
          />
        </span>
        <h3 id={titleId} className="text-2xl font-medium text-[#1f1f1f]">{name}</h3>
      </div>

      <div className="mt-6 px-3 text-center">
        <p className="text-[#1f1f1f]">
          <span className="text-[32px] font-bold leading-none">{price}</span>{' '}
          <span className="text-xl">{t('dashboard.plans.perMonth')}</span>
        </p>
        <img src={divider} alt="" aria-hidden="true" className="mt-2 h-px w-full" />
      </div>

      <ul className="mt-8 flex flex-col gap-[22px]">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-lg leading-[26px] text-[#1f1f1f]">
            <img src={checkIcon} alt="" aria-hidden="true" className="mt-0.5 size-[22px] shrink-0" />
            {feature}
          </li>
        ))}
      </ul>

      <div className="mt-auto flex flex-col gap-6 pt-8">{children}</div>
    </article>
  );
}

export default PlanCard;
