import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import badge3m from '@/assets/dashboard/plan-badge-3m-mask.png';
import badge6m from '@/assets/dashboard/plan-badge-mask.png';
import check3m from '@/assets/dashboard/plan-check-3m.svg';
import check6m from '@/assets/dashboard/plan-check.svg';
import { formatPrice, PRICE_UNAVAILABLE } from '@/constants/packages';
import { usePackagePrices } from '@/hooks/usePackagePrices';

import { CoursesEmptyState } from './CoursesEmptyState';
import { PlanCard } from './PlanCard';

// "Choose Your Growth Plan" under the locked courses state ("courses 3m plan", 30:179) and
// the selected 6-month card with the upgrade price (30:632).
// UI ONLY: there is no payment, checkout or subscription API, so "Upgrade Now" only shows a
// notice. Prices are the backend's package prices (GET /api/packages); a dash shows until they
// arrive, and the upgrade amount is only the difference between them, not a backend quote.

const PILL_BUTTON =
  'flex min-h-[52px] w-full items-center justify-center rounded-full px-6 text-base font-medium outline-none transition focus-visible:ring-2 focus-visible:ring-[#5a198f] focus-visible:ring-offset-2';
const PRIMARY_BUTTON = `${PILL_BUTTON} bg-[#5a1a8f] text-white shadow-[0_10px_22px_rgba(90,26,143,0.28)] hover:bg-[#4e0f7c]`;

function UpgradeDetails({ upgradePrice, onUpgrade, isNoticeShown }: { upgradePrice: string; onUpgrade: () => void; isNoticeShown: boolean }) {
  const { t } = useTranslation();
  const priceRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    priceRef.current?.focus();
  }, []);

  return (
    <>
      {/* Focus moves here when the card expands, because the button that opened it is gone. */}
      <div ref={priceRef} tabIndex={-1} className="rounded-[20px] bg-[#f2f2f2] px-6 py-6 text-start shadow-[0_4px_4px_rgba(0,0,0,0.25)] outline-none">
        <p className="text-base font-medium text-[#1f1f1f]">{t('dashboard.plans.upgradePriceTitle')}</p>
        <p className="mt-4 text-base text-[#1f1f1f]">{t('dashboard.plans.amount', { value: upgradePrice })}</p>
        <p className="mt-4 text-sm leading-6 text-[#6b6b6b]">{t('dashboard.plans.upgradePriceHint')}</p>
      </div>
      <button type="button" onClick={onUpgrade} className={PRIMARY_BUTTON}>
        {t('dashboard.plans.upgradeWithPrice', { value: upgradePrice })}
      </button>
      {isNoticeShown && (
        <p role="status" className="rounded-[14px] bg-[#fff7e6] px-4 py-3 text-center text-sm text-[#9a5700]">
          {t('dashboard.plans.paymentUnavailable')}
        </p>
      )}
    </>
  );
}

export default function PlansPage() {
  const { t, i18n } = useTranslation();
  const { prices } = usePackagePrices();
  const currentPrice = prices['3m'];
  const upgradePlanPrice = prices['6m'];
  const format = (amount: number | undefined) => (amount === undefined ? PRICE_UNAVAILABLE : formatPrice(amount, i18n.language));
  const upgradePrice = format(
    currentPrice === undefined || upgradePlanPrice === undefined ? undefined : upgradePlanPrice - currentPrice
  );
  const [isUpgradeOpen, setUpgradeOpen] = useState(false);
  const [isNoticeShown, setNoticeShown] = useState(false);

  const plan6mFeatures = [1, 2, 3, 4].map((n) => t(`pricing.plan6mFeature${n}`));
  const plan3mFeatures = [1, 2, 3].map((n) => t(`pricing.plan3mFeature${n}`));

  return (
    <div className="flex flex-col items-center">
      <CoursesEmptyState variant="upgrade" />

      <section aria-labelledby="plans-title" className="mt-14 flex w-full flex-col items-center text-center">
        <h2 id="plans-title" className="text-2xl font-semibold text-[#111] sm:text-[32px]">{t('pricing.title')}</h2>
        <p className="mt-6 max-w-[820px] text-lg text-[#555] sm:text-2xl">{t('pricing.subtitle')}</p>

        <div className="mt-12 grid w-full max-w-[794px] grid-cols-1 justify-items-center gap-x-[30px] gap-y-10 md:grid-cols-2">
          <PlanCard
            id="6m"
            name={t('pricing.plan6mName')}
            price={format(upgradePlanPrice)}
            badgeIcon={badge6m}
            checkIcon={check6m}
            features={plan6mFeatures}
            tone="popular"
            badge={t('pricing.popularBadge')}
          >
            {isUpgradeOpen ? (
              <UpgradeDetails upgradePrice={upgradePrice} onUpgrade={() => setNoticeShown(true)} isNoticeShown={isNoticeShown} />
            ) : (
              <button
                type="button"
                onClick={() => setUpgradeOpen(true)}
                className={PRIMARY_BUTTON}
              >
                {t('dashboard.plans.startNow')}
              </button>
            )}
          </PlanCard>

          <PlanCard
            id="3m"
            name={t('pricing.plan3mName')}
            price={format(currentPrice)}
            badgeIcon={badge3m}
            checkIcon={check3m}
            features={plan3mFeatures}
            tone="current"
            badge={t('dashboard.plans.currentBadge')}
          >
            <p
              aria-current="true"
              className={`${PILL_BUTTON} bg-[#d9d9d9] text-xl text-[#7a7a7a] shadow-[0_4px_4px_rgba(0,0,0,0.25)]`}
            >
              {t('dashboard.plans.currentPlan')}
            </p>
          </PlanCard>
        </div>

        {!isUpgradeOpen && (
          <button
            type="button"
            onClick={() => setUpgradeOpen(true)}
            className={`${PRIMARY_BUTTON} mt-8 max-w-[790px] min-h-[45px]`}
          >
            {t('dashboard.plans.upgradeNow')}
          </button>
        )}
      </section>
    </div>
  );
}
