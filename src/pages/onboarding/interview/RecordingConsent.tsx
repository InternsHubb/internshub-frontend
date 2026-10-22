import { useTranslation } from 'react-i18next';
import { Clock, Info, Mic, Video } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import {
  BackArrow,
  BODY_TEXT,
  CARD,
  ConsentCheckbox,
  ForwardArrow,
  GRADIENT_BG,
  IconTile,
  PageHeading,
  PrimaryButton,
  TextButton,
  TITLE_TEXT,
} from './parts';

// "Recording Consent" (Figma 24:1067). Uses the same consent state as the Setup checkbox, so
// ticking either one shows ticked on both; Continue stays disabled until it is ticked.

type ConsentPoint = { icon: LucideIcon; title: string; description: string };

type RecordingConsentProps = {
  consented: boolean;
  onConsentChange: (consented: boolean) => void;
  onBack: () => void;
  onContinue: () => void;
};

export function RecordingConsent({ consented, onConsentChange, onBack, onContinue }: RecordingConsentProps) {
  const { t } = useTranslation();
  const k = (key: string) => t(`onboarding.interview.consent.${key}`);

  const points: ConsentPoint[] = [
    { icon: Video, title: k('recordingTitle'), description: k('recordingDesc') },
    { icon: Mic, title: k('transcriptionTitle'), description: k('transcriptionDesc') },
    { icon: Clock, title: k('retentionTitle'), description: k('retentionDesc') },
  ];

  return (
    <div className="space-y-6">
      <PageHeading tone="brand" title={k('title')} subtitle={k('subtitle')} />

      <div className={`${CARD} flex items-start gap-4 p-5`}>
        <span aria-hidden="true" className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] text-white ${GRADIENT_BG}`}>
          <Info size={18} />
        </span>
        <div className="min-w-0">
          <p className={`text-base font-semibold ${TITLE_TEXT}`}>{k('noticeTitle')}</p>
          <p className={`mt-0.5 text-sm ${BODY_TEXT}`}>{k('noticeBody')}</p>
        </div>
      </div>

      <ul className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {points.map((point) => (
          <li key={point.title} className={`${CARD} p-5`}>
            <IconTile icon={point.icon} />
            <p className={`mt-4 text-sm font-semibold ${TITLE_TEXT}`}>{point.title}</p>
            <p className={`mt-1 text-xs leading-[19px] ${BODY_TEXT}`}>{point.description}</p>
          </li>
        ))}
      </ul>

      <div className={`${CARD} p-5`}>
        <ConsentCheckbox checked={consented} onChange={onConsentChange} label={k('checkbox')} hint={k('required')} />
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-[#e7dbe9] pt-5 sm:flex-row sm:items-center sm:justify-end">
        <TextButton onClick={onBack}>
          <BackArrow />
          {t('onboarding.interview.common.back')}
        </TextButton>
        <PrimaryButton size="lg" disabled={!consented} onClick={onContinue}>
          {k('continue')}
          <ForwardArrow />
        </PrimaryButton>
      </div>
    </div>
  );
}
