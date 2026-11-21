import { PACKAGES, type PackageId } from '@/shared/constants/packages';

// Packages and technology tracks offered on onboarding step 04 "Path" ("Step 04 Path · Default
// (Package + Track)", 22:19043). Package values are the strings the rest of the flow already
// uses ('12 Months' selects the Orientation interview, see interview/mockInterview.ts). Prices
// come from the shared package config; benefits are the existing prototype values.

export type PackageValue = '3 Months' | '6 Months' | '12 Months';

// Key under onboarding.path.packages.* (name, tag, features).
export type PackageKey = 'threeMonths' | 'sixMonths' | 'twelveMonths';

export type OnboardingPackage = {
  value: PackageValue;
  key: PackageKey;
  id: PackageId;
  priceEgp: number;
  // 5px bar across the top of the card (22:19160, 22:19194, 22:19226).
  barClass: string;
  isPopular?: boolean;
};

export const ONBOARDING_PACKAGES: ReadonlyArray<OnboardingPackage> = [
  { value: '3 Months', key: 'threeMonths', id: '3m', priceEgp: PACKAGES['3m'].priceEgp, barClass: 'bg-[#e5d8ec]' },
  {
    value: '6 Months',
    key: 'sixMonths',
    id: '6m',
    priceEgp: PACKAGES['6m'].priceEgp,
    barClass: 'bg-gradient-to-r from-[#8b5db0] to-[#5c1d87] rtl:bg-gradient-to-l',
    isPopular: true,
  },
  {
    value: '12 Months',
    key: 'twelveMonths',
    id: '12m',
    priceEgp: PACKAGES['12m'].priceEgp,
    barClass: 'bg-gradient-to-r from-[#dd6f0d] to-[#8b5db0] rtl:bg-gradient-to-l',
  },
];

export const PACKAGES_BY_VALUE: Readonly<Record<PackageValue, OnboardingPackage>> = {
  '3 Months': ONBOARDING_PACKAGES[0],
  '6 Months': ONBOARDING_PACKAGES[1],
  '12 Months': ONBOARDING_PACKAGES[2],
};

export const PACKAGE_FEATURE_KEYS = ['one', 'two', 'three', 'four'] as const;

// The existing four tracks of "02 Choose your technology track". Key under
// onboarding.path.tracks.* (name, tech, description).
export type TrackId = 'frontend' | 'backend' | 'mobile' | 'data';

export const ONBOARDING_TRACKS: ReadonlyArray<{ id: TrackId; code: string }> = [
  { id: 'frontend', code: 'FE' },
  { id: 'backend', code: 'BE' },
  { id: 'mobile', code: 'MB' },
  { id: 'data', code: 'DE' },
];

// `code` above is the card's display badge; the backend identifies tracks by these codes
// (GET /api/tracks).
export const BACKEND_TRACK_CODES: Readonly<Record<TrackId, string>> = {
  frontend: 'FRONTEND',
  backend: 'BACKEND',
  mobile: 'MOBILE',
  data: 'DATA_ENGINEERING',
};

// The Profile step: every step after it needs the profile saved on the backend.
export const PROFILE_STEP = 2;

// The Path step: every step after it needs a package and a track.
export const PATH_STEP = 3;

// The CV step: every step after it needs a CV uploaded to the backend.
export const CV_STEP = 4;

export const PACKAGE_ERROR_ID = 'package-error';
export const TRACK_ERROR_ID = 'track-error';
