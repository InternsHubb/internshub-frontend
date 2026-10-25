import { useTranslation } from 'react-i18next';

import checkIcon from '@/assets/dashboard/path-check.svg';
import { formatPrice } from '@/constants/packages';
import { cn } from '@/lib/cn';

import { ONBOARDING_PACKAGES, PACKAGE_ERROR_ID, PACKAGE_FEATURE_KEYS, type PackageValue } from './packages';
import { PathFieldError } from './PathFieldError';

// "01 Select your package" on onboarding step 04 "Path" (articles 22:19127, 22:19161, 22:19195).
// The cards are one native radio group: arrow keys move between them, and Enter submits the
// step's form, so the same validation runs for the Confirm button, Enter and the progress bar.
// Temporary display prices requested for these selection cards only. Remove this override
// once the backend's prices are final; shared pricing and checkout amounts are unchanged.
const SELECTION_PRICES: Record<PackageValue, number> = {
  '3 Months': 1000,
  '6 Months': 2000,
  '12 Months': 3000,
};

type PackageSelectionProps = {
  value: PackageValue | null;
  onChange: (value: PackageValue) => void;
  hasError: boolean;
};

export function PackageSelection({ value, onChange, hasError }: PackageSelectionProps) {
  const { t, i18n } = useTranslation();

  return (
    <div>
      <div className="mb-5 flex items-center gap-2">
        <span className="text-xs font-bold text-[#DD6F0D]">01</span>
        <h2 id="package-heading" className="text-xl font-normal text-[#111827]">{t('onboarding.path.packagesHeading')}</h2>
      </div>

      {hasError && <PathFieldError id={PACKAGE_ERROR_ID}>{t('onboarding.path.packageRequired')}</PathFieldError>}

      <div
        role="radiogroup"
        aria-labelledby="package-heading"
        aria-describedby={hasError ? PACKAGE_ERROR_ID : undefined}
        aria-required="true"
        aria-invalid={hasError || undefined}
        className="grid grid-cols-1 gap-[18px] md:grid-cols-3"
      >
        {ONBOARDING_PACKAGES.map((item) => {
          const isSelected = value === item.value;
          const name = t(`onboarding.path.packages.${item.key}.name`);
          return (
            <label
              key={item.value}
              className={cn(
                'relative flex min-h-[460px] cursor-pointer flex-col overflow-hidden rounded-[24px] border-[0.8px] bg-white p-6 transition',
                'has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-[#5C1D87]',
                isSelected
                  ? 'border-[#5C1D87] shadow-[0_0_0_2px_#5C1D87,0_12px_28px_rgba(58,3,83,0.14)]'
                  : cn(
                      'shadow-[0_10px_34px_rgba(34,2,60,0.04)] hover:border-[#CCB8D8]',
                      hasError ? 'border-[#B42318]/40' : 'border-[rgba(58,3,83,0.09)]',
                    ),
              )}
            >
              <input
                type="radio"
                name="package"
                value={item.value}
                checked={isSelected}
                onChange={() => onChange(item.value)}
                aria-describedby={`package-${item.key}-price`}
                className="sr-only"
              />
              <span aria-hidden="true" className={cn('absolute inset-x-0 top-0 h-[5px]', item.barClass)} />

              <div className="flex min-h-[30px] items-start justify-end">
                {item.isPopular && (
                  <span className="rounded-full bg-[#F3E9FA] px-2.5 py-1.5 text-[9px] font-bold tracking-[0.72px] text-[#5C1D87]">
                    {t('onboarding.path.popular')}
                  </span>
                )}
              </div>
              <span className="text-[9px] font-bold uppercase tracking-[0.9px] text-[#8B5DB0]">{t(`onboarding.path.packages.${item.key}.tag`)}</span>
              <h3 className="pb-[5px] pt-1 text-[28px] font-normal leading-[42px] text-[#111827]">{name}</h3>
              <p id={`package-${item.key}-price`} className="flex flex-wrap items-end gap-[5px]">
                <span className="text-xs font-bold text-[rgba(52,48,58,0.7)]">{t('onboarding.path.currency')}</span>
                <span className="text-[28px] font-bold leading-none text-[#3A0353]">{formatPrice(SELECTION_PRICES[item.value], i18n.language)}</span>
                <span className="text-[11px] text-[rgba(52,48,58,0.6)]">{t('onboarding.path.perPackage')}</span>
              </p>
              <ul className="flex flex-1 flex-col gap-3 py-6">
                {PACKAGE_FEATURE_KEYS.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-[11px] leading-[15.4px] text-[#5C5C5C]">
                    <img src={checkIcon} alt="" aria-hidden="true" width={15} height={20} className="-mt-0.5 shrink-0" />
                    {t(`onboarding.path.packages.${item.key}.features.${feature}`)}
                  </li>
                ))}
              </ul>
              <span
                aria-hidden="true"
                className={cn(
                  'flex min-h-[50px] w-full items-center justify-center gap-1.5 rounded-[13px] px-6 text-[13px] font-bold tracking-[0.13px] transition',
                  isSelected
                    ? 'bg-gradient-to-r from-[#4C0585] to-[#3A0353] text-white shadow rtl:bg-gradient-to-l'
                    : 'border-[0.8px] border-[#CCB8D8] bg-white text-[#3A0353]',
                )}
              >
                {isSelected ? `✓ ${t('onboarding.path.selected')}` : t('onboarding.path.choose', { name })}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

export default PackageSelection;
