export type PackageId = '3m' | '6m' | '12m';

export type PackageInfo = {
  id: PackageId;
  months: 3 | 6 | 12;
  priceEgp: number;
};

export const PACKAGES: Readonly<Record<PackageId, PackageInfo>> = {
  '3m': { id: '3m', months: 3, priceEgp: 3499 },
  '6m': { id: '6m', months: 6, priceEgp: 5499 },
  '12m': { id: '12m', months: 12, priceEgp: 9500 },
};

export function isPackageId(value: string | null | undefined): value is PackageId {
  return value === '3m' || value === '6m' || value === '12m';
}

export function formatPrice(amountEgp: number, language: string): string {
  return new Intl.NumberFormat(language).format(amountEgp);
}

export function formatPackagePrice(id: PackageId, language: string): string {
  return formatPrice(PACKAGES[id].priceEgp, language);
}
