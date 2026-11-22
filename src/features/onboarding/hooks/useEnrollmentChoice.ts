import { useCallback, useState } from 'react';

import { PACKAGES } from '@/shared/constants/packages';
import { useResource } from '@/shared/hooks/useResource';
import {
  changeEnrollment,
  chooseEnrollment,
  getMyEnrollments,
  getPackages,
  getTracks,
} from '@/features/onboarding/services/onboardingService';
import type { EnrollmentDto, PackageDto, TrackSummaryDto } from '@/features/onboarding/types/onboarding.types';
import { BACKEND_TRACK_CODES, PACKAGES_BY_VALUE, type PackageValue, type TrackId } from '@/features/onboarding/constants/packages';

// The Path step's package + track choice, saved as the learner's enrollment:
// - GET /api/packages and GET /api/tracks give the backend ids for the cards shown on the step;
//   packages are matched by duration, tracks by code. Prices still come from the frontend config
//   until the owner confirms them.
// - GET /api/me/enrollments finds an existing choice. A PendingPayment enrollment is changed with
//   PUT /api/enrollments/{id}; otherwise POST /api/enrollments creates one.

type EnrollmentData = { packages: PackageDto[]; tracks: TrackSummaryDto[]; enrollments: EnrollmentDto[] };

export type EnrollmentChoice = { packageValue: PackageValue; trackId: TrackId };

// Thrown when the choice can't be saved for a reason the learner should see.
export class EnrollmentChoiceError extends Error {
  readonly messageKey: string;
  constructor(messageKey: string) {
    super(messageKey);
    this.messageKey = messageKey;
  }
}

const OPEN_STATUSES = new Set<EnrollmentDto['status']>(['PendingPayment', 'Active']);

async function loadEnrollmentData(): Promise<EnrollmentData> {
  const [packages, tracks, enrollments] = await Promise.all([getPackages(), getTracks(), getMyEnrollments()]);
  return { packages, tracks, enrollments };
}

function backendPackage(packages: PackageDto[], value: PackageValue): PackageDto | undefined {
  const months = PACKAGES[PACKAGES_BY_VALUE[value].id].months;
  return packages.find((item) => item.isActive && Number(item.durationMonths) === months);
}

function backendTrack(tracks: TrackSummaryDto[], trackId: TrackId): TrackSummaryDto | undefined {
  return tracks.find((item) => item.code === BACKEND_TRACK_CODES[trackId]);
}

// The most recently chosen enrollment that is still awaiting payment or running.
function currentEnrollment(enrollments: EnrollmentDto[]): EnrollmentDto | null {
  const open = enrollments.filter((item) => OPEN_STATUSES.has(item.status));
  open.sort((a, b) => b.chosenAt.localeCompare(a.chosenAt));
  return open[0] ?? null;
}

// Converts a saved enrollment back to the step's card values, to preselect them.
function choiceOf(enrollment: EnrollmentDto, data: EnrollmentData): EnrollmentChoice | null {
  const pkg = data.packages.find((item) => item.id === enrollment.packageId);
  const track = data.tracks.find((item) => item.id === enrollment.trackId);
  const packageValue = (Object.keys(PACKAGES_BY_VALUE) as PackageValue[]).find(
    (value) => pkg && PACKAGES[PACKAGES_BY_VALUE[value].id].months === Number(pkg.durationMonths)
  );
  const trackId = (Object.keys(BACKEND_TRACK_CODES) as TrackId[]).find((id) => BACKEND_TRACK_CODES[id] === track?.code);
  return packageValue && trackId ? { packageValue, trackId } : null;
}

export function useEnrollmentChoice() {
  const { data, isLoading, error, reload } = useResource(loadEnrollmentData);
  // The enrollment saved in this session; until then, the one the backend already had.
  const [saved, setSaved] = useState<EnrollmentDto | null>(null);
  const enrollment = saved ?? (data ? currentEnrollment(data.enrollments) : null);
  const savedChoice = enrollment && data ? choiceOf(enrollment, data) : null;

  const save = useCallback(
    async ({ packageValue, trackId }: EnrollmentChoice): Promise<EnrollmentDto> => {
      if (!data) throw new EnrollmentChoiceError('onboarding.path.errors.notLoaded');
      const pkg = backendPackage(data.packages, packageValue);
      const track = backendTrack(data.tracks, trackId);
      if (!pkg || !track) throw new EnrollmentChoiceError('onboarding.path.errors.unavailable');

      const existing = saved ?? currentEnrollment(data.enrollments);
      if (existing && existing.packageId === pkg.id && existing.trackId === track.id) return existing;
      // A running enrollment is changed through an upgrade, not from onboarding.
      if (existing?.status === 'Active') throw new EnrollmentChoiceError('onboarding.path.errors.alreadyEnrolled');

      const body = { packageId: pkg.id, trackId: track.id };
      const result = existing ? await changeEnrollment(existing.id, body) : await chooseEnrollment(pkg.id, track.id);
      setSaved(result);
      return result;
    },
    [data, saved]
  );

  // Re-reads everything from the backend, e.g. after a payment changed the enrollment's status.
  const refresh = useCallback(() => {
    setSaved(null);
    reload();
  }, [reload]);

  return { enrollment, savedChoice, isLoading, error, reload, refresh, save };
}
