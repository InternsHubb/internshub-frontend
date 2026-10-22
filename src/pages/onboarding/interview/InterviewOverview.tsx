import { useTranslation } from 'react-i18next';
import { BrainCircuit, Compass, Info, Laptop, Mic, MonitorUp, Video } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import {
  BackArrow,
  BODY_TEXT,
  CARD,
  ForwardArrow,
  IconTile,
  MUTED_TEXT,
  PageHeading,
  PANEL,
  PrimaryButton,
  StatusPill,
  TextButton,
  TITLE_TEXT,
} from './parts';
import type { InterviewType } from './types';

// "AI Interview" overview (Figma 24:1207). Figma's "15-minute" length is left out on purpose:
// interview duration is still an open business decision.

type Requirement = { icon: LucideIcon; title: string; description: string };

type InterviewOverviewProps = {
  type: InterviewType;
  track: string;
  cvUploaded: boolean;
  onBack: () => void;
  onStart: () => void;
};

export function InterviewOverview({ type, track, cvUploaded, onBack, onStart }: InterviewOverviewProps) {
  const { t } = useTranslation();
  const k = (key: string) => t(`onboarding.interview.overview.${key}`);

  const requirements: Requirement[] = [
    { icon: Laptop, title: k('desktopTitle'), description: k('desktopDesc') },
    { icon: Video, title: k('cameraTitle'), description: k('cameraDesc') },
    { icon: Mic, title: k('microphoneTitle'), description: k('microphoneDesc') },
    { icon: MonitorUp, title: k('screenTitle'), description: k('screenDesc') },
  ];

  return (
    <div className="space-y-8">
      <PageHeading title={k('title')} subtitle={k('subtitle')} />

      <section className={`${CARD} p-5 sm:p-8`}>
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#e7dbe9] pb-6">
          <div className="flex min-w-0 items-start gap-3">
            <IconTile icon={Compass} size="lg" />
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className={`text-lg font-semibold ${TITLE_TEXT}`}>{t(`onboarding.interview.types.${type}`)}</h2>
                <span className="rounded-[6px] bg-[#f5eaf9] px-2 py-0.5 text-xs font-semibold text-[#3b0454]">{track}</span>
              </div>
              <p className={`text-sm ${BODY_TEXT}`}>{k('assessment')}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <StatusPill tone="neutral">{k('notStarted')}</StatusPill>
            <StatusPill tone={cvUploaded ? 'success' : 'warning'}>{k(cvUploaded ? 'cvUploaded' : 'cvMissing')}</StatusPill>
          </div>
        </div>

        <div className={`${PANEL} mt-6 flex items-start gap-4 p-5`}>
          <IconTile icon={BrainCircuit} />
          <div className="min-w-0">
            <p className={`text-[11px] font-bold uppercase tracking-[0.06em] ${BODY_TEXT}`}>{k('sessionStatus')}</p>
            <p className="mt-1 text-sm text-[#4c4451]">
              <span className="me-2 text-xl font-semibold text-[#3b0454]">{k('readyToBegin')}</span>
              {k(type === 'orientation' ? 'readyOrientation' : 'readyTechnical')}
            </p>
          </div>
        </div>

        <div className={`${PANEL} mt-4 flex items-start gap-3 p-4`}>
          <Info aria-hidden="true" size={18} className="mt-0.5 shrink-0 text-[#5a127a]" />
          <div className="text-xs leading-[18px]">
            <p className={`text-[13px] font-semibold ${TITLE_TEXT}`}>{k('environmentTitle')}</p>
            <p className={BODY_TEXT}>{k('environmentBody')}</p>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-4 border-t border-[#e7dbe9] pt-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className={`text-base font-semibold ${TITLE_TEXT}`}>{k('readyTitle')}</h3>
            <p className={`text-sm ${BODY_TEXT}`}>{k('readyBody')}</p>
          </div>
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center">
            <TextButton onClick={onBack}>
              <BackArrow />
              {t('onboarding.interview.common.back')}
            </TextButton>
            <PrimaryButton size="lg" onClick={onStart}>
              {k('start')}
              <ForwardArrow />
            </PrimaryButton>
          </div>
        </div>
      </section>

      <section>
        <h2 className={`text-lg font-semibold ${TITLE_TEXT}`}>{k('beforeTitle')}</h2>
        <p className={`text-xs ${MUTED_TEXT}`}>{k('beforeSubtitle')}</p>
        <ul className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          {requirements.map((item) => (
            <li key={item.title} className={`${CARD} flex items-center gap-4 p-4`}>
              <IconTile icon={item.icon} size="lg" />
              <div className="min-w-0">
                <p className={`text-sm font-semibold ${TITLE_TEXT}`}>{item.title}</p>
                <p className={`text-xs ${BODY_TEXT}`}>{item.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
