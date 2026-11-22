import { useTranslation } from 'react-i18next';

import { cn } from '@/shared/utils/cn';

import { ONBOARDING_TRACKS, TRACK_ERROR_ID, type TrackId } from '@/features/onboarding/constants/packages';
import { PathFieldError } from '@/features/onboarding/components/PathFieldError';

// "02 Choose your technology track" on onboarding step 04 "Path" (buttons 22:19237–22:19270).
// No track is preselected (Figma shows every radio empty); like the packages, the cards are a
// native radio group inside the step's form, so the same validation covers Confirm and Enter.

type TrackSelectionProps = {
  value: TrackId | null;
  onChange: (value: TrackId) => void;
  hasError: boolean;
};

export function TrackSelection({ value, onChange, hasError }: TrackSelectionProps) {
  const { t } = useTranslation();

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#DD6F0D]">02</span>
          <h2 id="track-heading" className="text-xl font-normal text-[#111827]">{t('onboarding.path.tracksHeading')}</h2>
        </div>
        <span className="text-[11px] text-[#6B7280]">{t('onboarding.path.catalogNote')}</span>
      </div>

      {hasError && <PathFieldError id={TRACK_ERROR_ID}>{t('onboarding.path.trackRequired')}</PathFieldError>}

      <div
        role="radiogroup"
        aria-labelledby="track-heading"
        aria-describedby={hasError ? TRACK_ERROR_ID : undefined}
        aria-required="true"
        aria-invalid={hasError || undefined}
        className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4"
      >
        {ONBOARDING_TRACKS.map((track) => {
          const isSelected = value === track.id;
          return (
            <label
              key={track.id}
              className={cn(
                'relative flex min-h-[138px] cursor-pointer items-start gap-3 rounded-[20px] border-[0.8px] bg-white p-5 pe-8 transition',
                'has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-[#5C1D87]',
                isSelected
                  ? 'border-[#5C1D87] shadow-[0_0_0_1.5px_#5C1D87,0_8px_12px_rgba(34,2,60,0.08)]'
                  : cn('shadow-[0_8px_12px_rgba(34,2,60,0.04)] hover:border-[#CCB8D8]', hasError ? 'border-[#B42318]/40' : 'border-[#E8E2EC]'),
              )}
            >
              <input
                type="radio"
                name="track"
                value={track.id}
                checked={isSelected}
                onChange={() => onChange(track.id)}
                className="sr-only"
              />
              <span
                aria-hidden="true"
                className={cn(
                  'absolute end-3.5 top-3.5 flex size-3 items-center justify-center rounded-full border-[0.8px]',
                  isSelected ? 'border-[#5C1D87]' : 'border-[#C8BECD]',
                )}
              >
                {isSelected && <span className="size-1.5 rounded-full bg-[#5C1D87]" />}
              </span>
              <span
                aria-hidden="true"
                className="flex h-[38px] w-[33px] shrink-0 items-center justify-center rounded-[12px] rounded-es-[4px] bg-[linear-gradient(141deg,#6F2C99_6%,#3A0353_94%)] text-[10px] text-white"
              >
                {track.code}
              </span>
              <span className="flex min-w-0 flex-col gap-1">
                <span className="text-xs leading-[18px] text-[#111827]">{t(`onboarding.path.tracks.${track.id}.name`)}</span>
                <span className="text-[10px] leading-[15px] text-[#5C1D87]">{t(`onboarding.path.tracks.${track.id}.tech`)}</span>
                <span className="text-[12.8px] leading-[17.92px] text-[#6B7280]">{t(`onboarding.path.tracks.${track.id}.description`)}</span>
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

export default TrackSelection;
