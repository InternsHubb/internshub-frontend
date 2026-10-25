import { useMemo } from 'react';

import { packageIdForMonths, type PackagePrices } from '@/constants/packages';
import { getPackages } from '@/lib/api/packages';
import type { PackageDto } from '@/lib/api/types';

import { useApiResource } from './useApiResource';

// Package prices as the backend offers them (GET /api/packages, no sign-in needed). Only active
// packages are priced; a package the backend doesn't return stays unpriced instead of guessed.
export function pricesFromPackages(packages: ReadonlyArray<PackageDto>): PackagePrices {
  const prices: PackagePrices = {};
  for (const pkg of packages) {
    const id = packageIdForMonths(Number(pkg.durationMonths));
    const amount = Number(pkg.price);
    if (id && pkg.isActive && Number.isFinite(amount)) prices[id] = amount;
  }
  return prices;
}

export function usePackagePrices() {
  const { data, isLoading, error, reload } = useApiResource(() => getPackages(), []);
  const prices = useMemo(() => pricesFromPackages(data ?? []), [data]);
  return { prices, isLoading, error, reload };
}
