import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import badge3m from '@/assets/dashboard/plan-badge-3m-mask.png';
import badge6m from '@/assets/dashboard/plan-badge-mask.png';
import check3m from '@/assets/dashboard/plan-check-3m.svg';
import check6m from '@/assets/dashboard/plan-check.svg';
import { PACKAGES } from '@/constants/packages';
import { useInternship } from '@/hooks/useInternship';
import {
  checkoutEnrollment,
  getMyEnrollments,
  getMyInvoices,
  getPackages,
  getUpgradeQuote,
  requestUpgrade,
} from '@/lib/api/packages';
import type { EnrollmentDto, PackageDto, PlanChangeQuoteDto } from '@/lib/api/types';
import { openCheckoutWindow } from '@/pages/onboarding/usePaymentCheckout';

import { CoursesEmptyState } from './CoursesEmptyState';
import { PlanCard } from './PlanCard';

// "Choose Your Growth Plan" under the locked courses state ("courses 3m plan", 30:179) and
// the selected 6-month card with the upgrade price (30:632).
// Prices come from backend package and quote APIs, falling back to shared package config.
const CURRENT_PRICE = PACKAGES['3m'].priceEgp;
const UPGRADE_PLAN_PRICE = PACKAGES['6m'].priceEgp;
const FALLBACK_UPGRADE_PRICE = UPGRADE_PLAN_PRICE - CURRENT_PRICE;

const PILL_BUTTON =
  'flex min-h-[52px] w-full items-center justify-center rounded-full px-6 text-base font-medium outline-none transition focus-visible:ring-2 focus-visible:ring-[#5a198f] focus-visible:ring-offset-2';
const PRIMARY_BUTTON = `${PILL_BUTTON} bg-[#5a1a8f] text-white shadow-[0_10px_22px_rgba(90,26,143,0.28)] hover:bg-[#4e0f7c] disabled:opacity-60 disabled:cursor-not-allowed`;

function isSafeRedirect(url: string): boolean {
  try {
    return new URL(url).protocol === 'https:';
  } catch {
    return false;
  }
}

type UpgradeDetailsProps = {
  quote: PlanChangeQuoteDto | null;
  quoteLoading: boolean;
  quoteError: string | null;
  isUpgrading: boolean;
  upgradeError: string | null;
  upgradeSuccess: boolean;
  onUpgrade: () => void;
  fallbackPrice: number;
};

function UpgradeDetails({
  quote,
  quoteLoading,
  quoteError,
  isUpgrading,
  upgradeError,
  upgradeSuccess,
  onUpgrade,
  fallbackPrice,
}: UpgradeDetailsProps) {
  const { t } = useTranslation();
  const priceRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    priceRef.current?.focus();
  }, []);

  const upgradeAmount = quote ? quote.amountDue : fallbackPrice;

  return (
    <>
      {/* Focus moves here when the card expands, because the button that opened it is gone. */}
      <div
        ref={priceRef}
        tabIndex={-1}
        className="rounded-[20px] bg-[#f2f2f2] px-6 py-6 text-start shadow-[0_4px_4px_rgba(0,0,0,0.25)] outline-none"
      >
        <p className="text-base font-medium text-[#1f1f1f]">{t('dashboard.plans.upgradePriceTitle')}</p>
        <p className="mt-4 text-base text-[#1f1f1f]">
          {quoteLoading
            ? t('dashboard.plans.quoteLoading')
            : t('dashboard.plans.amount', { value: upgradeAmount })}
        </p>
        <p className="mt-4 text-sm leading-6 text-[#6b6b6b]">{t('dashboard.plans.upgradePriceHint')}</p>
      </div>

      <button
        type="button"
        onClick={onUpgrade}
        disabled={isUpgrading || quoteLoading || upgradeSuccess}
        className={PRIMARY_BUTTON}
      >
        {isUpgrading
          ? t('dashboard.plans.upgrading')
          : upgradeSuccess
          ? t('dashboard.plans.upgradeSuccess')
          : t('dashboard.plans.upgradeWithPrice', { value: upgradeAmount })}
      </button>

      {quoteError && (
        <p role="alert" className="rounded-[14px] bg-[#fff1f0] px-4 py-3 text-center text-sm text-[#cf1322]">
          {quoteError}
        </p>
      )}

      {upgradeError && (
        <p role="alert" className="rounded-[14px] bg-[#fff1f0] px-4 py-3 text-center text-sm text-[#cf1322]">
          {upgradeError}
        </p>
      )}

      {upgradeSuccess && (
        <p role="status" className="rounded-[14px] bg-[#f6ffed] px-4 py-3 text-center text-sm text-[#389e0d]">
          {t('dashboard.plans.upgradeSuccess')}
        </p>
      )}
    </>
  );
}

export default function PlansPage() {
  const { t } = useTranslation();
  const { reload: reloadInternship } = useInternship();
  const [isUpgradeOpen, setUpgradeOpen] = useState(false);
  const [activeEnrollment, setActiveEnrollment] = useState<EnrollmentDto | null>(null);
  const [targetPackage, setTargetPackage] = useState<PackageDto | null>(null);
  const [currentPackage, setCurrentPackage] = useState<PackageDto | null>(null);
  const [quote, setQuote] = useState<PlanChangeQuoteDto | null>(null);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [quoteError, setQuoteError] = useState<string | null>(null);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [upgradeError, setUpgradeError] = useState<string | null>(null);
  const [upgradeSuccess, setUpgradeSuccess] = useState(false);

  useEffect(() => {
    let active = true;
    Promise.all([getMyEnrollments(), getPackages()])
      .then(([enrollments, pkgs]) => {
        if (!active) return;
        const activeEnr =
          enrollments.find((e) => e.status === 'Active') ||
          enrollments.find((e) => e.status === 'PendingPayment') ||
          null;
        setActiveEnrollment(activeEnr);

        const target = pkgs.find((p) => p.durationMonths === 6 || p.code === '6m') ?? null;
        setTargetPackage(target);

        const current = activeEnr
          ? pkgs.find((p) => p.id === activeEnr.packageId) ??
            pkgs.find((p) => p.durationMonths === 3) ??
            null
          : pkgs.find((p) => p.durationMonths === 3) ?? null;
        setCurrentPackage(current);
      })
      .catch(() => {
        // Fallback to constants if backend list is temporarily unreachable
      });
    return () => {
      active = false;
    };
  }, []);

  // Fetch upgrade quote when the upgrade card is expanded
  useEffect(() => {
    if (!isUpgradeOpen || !activeEnrollment || !targetPackage) return;
    let active = true;
    setQuoteLoading(true);
    setQuoteError(null);
    getUpgradeQuote(activeEnrollment.id, targetPackage.id)
      .then((q) => {
        if (!active) return;
        setQuote(q);
        setQuoteLoading(false);
      })
      .catch(() => {
        if (!active) return;
        setQuoteLoading(false);
        setQuoteError(t('dashboard.plans.quoteError'));
      });
    return () => {
      active = false;
    };
  }, [isUpgradeOpen, activeEnrollment, targetPackage, t]);

  const handleUpgrade = useCallback(async () => {
    if (!activeEnrollment || !targetPackage) {
      setUpgradeError(t('dashboard.plans.noActiveEnrollment'));
      return;
    }
    setIsUpgrading(true);
    setUpgradeError(null);

    const popup = openCheckoutWindow();

    try {
      const upgraded = await requestUpgrade(activeEnrollment.id, targetPackage.id);
      if (upgraded.status === 'PendingPayment') {
        const { invoiceId, redirectUrl } = await checkoutEnrollment(upgraded.id);
        if (!isSafeRedirect(redirectUrl)) {
          if (popup && !popup.closed) popup.close();
          setUpgradeError(t('dashboard.plans.upgradeError'));
          setIsUpgrading(false);
          return;
        }
        try {
          window.sessionStorage.setItem(
            'internshub_pending_checkout',
            JSON.stringify({ invoiceId, enrollmentId: upgraded.id })
          );
        } catch {
          // sessionStorage may be restricted
        }

        let navigated = false;
        if (popup && !popup.closed) {
          try {
            popup.location.replace(redirectUrl);
            popup.focus();
            navigated = true;
          } catch {
            try {
              popup.location.href = redirectUrl;
              popup.focus();
              navigated = true;
            } catch {
              navigated = false;
            }
          }
        }

        if (!navigated) {
          try {
            const fallbackWin = window.open(redirectUrl, '_blank');
            if (fallbackWin) navigated = true;
          } catch {
            navigated = false;
          }
        }

        let active = true;
        let pollCount = 0;
        const maxPolls = 40;
        const poll = async () => {
          pollCount += 1;
          try {
            const invoices = await getMyInvoices();
            const inv = invoices.find((item) => item.id === invoiceId);
            if (!active) return;
            if (inv?.status === 'Paid') {
              window.setTimeout(() => {
                try {
                  if (popup && !popup.closed) popup.close();
                } catch {
                  // ignore
                }
              }, 2000);
              setUpgradeSuccess(true);
              setIsUpgrading(false);
              reloadInternship();
              return;
            }
            if (inv?.status === 'Failed' || inv?.status === 'Cancelled') {
              if (popup && !popup.closed) popup.close();
              setUpgradeError(t('dashboard.plans.upgradeError'));
              setIsUpgrading(false);
              return;
            }
          } catch {
            // retry next poll
          }
          if (active && pollCount < maxPolls) {
            window.setTimeout(poll, 3000);
          } else {
            setIsUpgrading(false);
          }
        };
        void poll();
        return;
      }
      // Immediate upgrade completion (Active status)
      if (popup && !popup.closed) popup.close();
      setUpgradeSuccess(true);
      setIsUpgrading(false);
      reloadInternship();
    } catch {
      if (popup && !popup.closed) popup.close();
      setIsUpgrading(false);
      setUpgradeError(t('dashboard.plans.upgradeError'));
    }
  }, [activeEnrollment, targetPackage, reloadInternship, t]);

  const plan6mFeatures = [1, 2, 3, 4].map((n) => t(`pricing.plan6mFeature${n}`));
  const plan3mFeatures = [1, 2, 3].map((n) => t(`pricing.plan3mFeature${n}`));

  const display6mPrice = targetPackage?.price ?? UPGRADE_PLAN_PRICE;
  const display3mPrice = currentPackage?.price ?? CURRENT_PRICE;
  const fallbackDiff = display6mPrice - display3mPrice > 0 ? display6mPrice - display3mPrice : FALLBACK_UPGRADE_PRICE;

  return (
    <div className="flex flex-col items-center">
      <CoursesEmptyState variant="upgrade" />

      <section aria-labelledby="plans-title" className="mt-14 flex w-full flex-col items-center text-center">
        <h2 id="plans-title" className="text-2xl font-semibold text-[#111] sm:text-[32px]">
          {t('pricing.title')}
        </h2>
        <p className="mt-6 max-w-[820px] text-lg text-[#555] sm:text-2xl">{t('pricing.subtitle')}</p>

        <div className="mt-12 grid w-full max-w-[794px] grid-cols-1 justify-items-center gap-x-[30px] gap-y-10 md:grid-cols-2">
          <PlanCard
            id="6m"
            name={t('pricing.plan6mName')}
            price={String(display6mPrice)}
            badgeIcon={badge6m}
            checkIcon={check6m}
            features={plan6mFeatures}
            tone="popular"
            badge={t('pricing.popularBadge')}
          >
            {isUpgradeOpen ? (
              <UpgradeDetails
                quote={quote}
                quoteLoading={quoteLoading}
                quoteError={quoteError}
                isUpgrading={isUpgrading}
                upgradeError={upgradeError}
                upgradeSuccess={upgradeSuccess}
                onUpgrade={handleUpgrade}
                fallbackPrice={fallbackDiff}
              />
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
            price={String(display3mPrice)}
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
