// The three InternsHub packages, shared by every page that shows a package (landing pricing,
// onboarding Path and Payment, Courses → Plans). Prices are not kept here: they come from the
// backend (GET /api/packages, see usePackagePrices) and the amount charged is the backend invoice.

export type PackageId = '3m' | '6m' | '12m';

export type PackageInfo = {
  id: PackageId;
  months: 3 | 6 | 12;
};

export const PACKAGES: Readonly<Record<PackageId, PackageInfo>> = {
  '3m': { id: '3m', months: 3 },
  '6m': { id: '6m', months: 6 },
  '12m': { id: '12m', months: 12 },
};

// Backend package prices by package, for the packages the backend currently offers.
export type PackagePrices = Partial<Record<PackageId, number>>;

// Shown in place of a price the backend hasn't returned (still loading, failed, or not offered).
export const PRICE_UNAVAILABLE = '—';

export function isPackageId(value: string | null | undefined): value is PackageId {
  return value === '3m' || value === '6m' || value === '12m';
}

export function packageIdForMonths(months: number): PackageId | undefined {
  return (Object.keys(PACKAGES) as PackageId[]).find((id) => PACKAGES[id].months === months);
}

// Prices are EGP amounts, grouped for the current language (1,000 / ١٬٠٠٠).
export function formatPrice(amountEgp: number, language: string): string {
  return new Intl.NumberFormat(language, { maximumFractionDigits: 2 }).format(amountEgp);
}

export function formatPackagePrice(prices: PackagePrices, id: PackageId, language: string): string {
  const amount = prices[id];
  return amount === undefined ? PRICE_UNAVAILABLE : formatPrice(amount, language);
}
