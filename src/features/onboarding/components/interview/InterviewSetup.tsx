import { useTranslation } from 'react-i18next';
import { Camera, Clock, Info, Mic, MonitorUp, ShieldCheck, Wifi } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import {
  BackArrow,
  BODY_TEXT,
  CARD,
  ConsentCheckbox,
  ForwardArrow,
  GRADIENT_BG,
  IconTile,
  MUTED_TEXT,
  Notice,
  PrimaryButton,
  StatusPill,
  TextButton,
  TITLE_TEXT,
} from '@/features/onboarding/components/interview/parts';
import type { PillTone } from '@/features/onboarding/components/interview/parts';
import {
  connectionDisplay,
  mediaActionKey,
  mediaDisplay,
  requiredChecksReady,
  screenActionKey,
  screenDisplay,
} from '@/features/onboarding/components/interview/deviceStatus';
import type { CheckDisplay } from '@/features/onboarding/components/interview/deviceStatus';
import type { DeviceCheckApi } from '@/features/onboarding/components/interview/useDeviceCheck';
import { FullscreenNotice } from '@/features/onboarding/components/interview/FullscreenNotice';
import type { FullscreenInfo } from '@/features/onboarding/components/interview/FullscreenNotice';

// Step 07 "Get Ready for Your Interview" (Figma 22:20176): real camera, microphone, screen and
// network checks plus explicit consent. Start Interview stays disabled until all three required
// checks pass and consent is given; clicking it puts the interview into fullscreen.

const MESSAGE_TONE: Record<PillTone, string> = {
  success: MUTED_TEXT,
  neutral: MUTED_TEXT,
  brand: MUTED_TEXT,
  warning: 'text-[#b45309]',
  danger: 'text-[#be123c]',
};

type CheckCardProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  display: CheckDisplay;
  actionLabel: string;
  busy: boolean;
  onAction: () => void;
};

function CheckCard({ icon, title, description, display, actionLabel, busy, onAction }: CheckCardProps) {
  const { t } = useTranslation();
  const message = display.messageKey ? t(display.messageKey) : description;
  return (
    <article className={`${CARD} flex min-h-[180px] flex-col p-4`}>
      <div className="flex items-start justify-between gap-2">
        <IconTile icon={icon} />
        <StatusPill tone={display.tone}>{t(display.labelKey)}</StatusPill>
      </div>
      <h3 className={`mt-3 text-[15px] font-semibold ${TITLE_TEXT}`}>{title}</h3>
      <p
        aria-live="polite"
        className={`mt-1 flex-1 text-xs leading-[18px] ${display.messageKey ? MESSAGE_TONE[display.tone] : MUTED_TEXT}`}
      >
        {message}
      </p>
      <TextButton onClick={onAction} disabled={busy} className="-ms-3 mt-2 self-start">
        {t(actionLabel)}
      </TextButton>
    </article>
  );
}

type InterviewSetupProps = {
  devices: DeviceCheckApi;
  consented: boolean;
  fullscreen: FullscreenInfo;
  onConsentChange: (consented: boolean) => void;
  onBack: () => void;
  // Requests fullscreen, so it must stay the direct click handler of Start Interview.
  onStart: () => void;
};

export function InterviewSetup({ devices, consented, fullscreen, onConsentChange, onBack, onStart }: InterviewSetupProps) {
  const { t } = useTranslation();
  const k = (key: string) => t(`onboarding.interview.setup.${key}`);
  const canStart = requiredChecksReady(devices) && consented;
  const connectionChecked = devices.connection !== 'idle';

  const rules = [
    { label: k('resumeWindow'), value: k('resumeWindowValue') },
    { label: k('resumeAttempts'), value: k('resumeAttemptsValue') },
    { label: k('incomplete'), value: k('incompleteValue') },
    { label: k('attemptLimit'), value: k('attemptLimitValue') },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-balance text-[36px] font-extrabold leading-[1.08] tracking-[-0.045em] text-[#21062E] sm:text-[46px] lg:text-[58px]">
          {k('title')}
        </h1>
        <p className="mt-2 text-base text-[#69616D]">{k('subtitle')}</p>
      </div>

      {/* Phones and tablets: the recorded interview needs a desktop browser. */}
      <div className="lg:hidden">
        <Notice tone="warning" icon={Info} title={k('desktopTitle')}>
          {k('desktopBody')}
        </Notice>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <CheckCard
          icon={Camera}
          title={k('cameraTitle')}
          description={k('cameraDesc')}
          display={mediaDisplay('camera', devices.camera)}
          actionLabel={mediaActionKey('camera', devices.camera)}
          busy={devices.camera.status === 'checking'}
          onAction={() => void devices.checkCamera()}
        />
        <CheckCard
          icon={Mic}
          title={k('microphoneTitle')}
          description={k('microphoneDesc')}
          display={mediaDisplay('microphone', devices.microphone)}
          actionLabel={mediaActionKey('microphone', devices.microphone)}
          busy={devices.microphone.status === 'checking'}
          onAction={() => void devices.checkMicrophone()}
        />
        <CheckCard
          icon={MonitorUp}
          title={k('screenTitle')}
          description={k('screenDesc')}
          display={screenDisplay(devices.screen)}
          actionLabel={screenActionKey(devices.screen)}
          busy={devices.screen.status === 'checking'}
          onAction={() => void devices.shareScreen()}
        />
        <CheckCard
          icon={Wifi}
          title={k('connectionTitle')}
          description={k('connectionDesc')}
          display={connectionDisplay(devices.connection)}
          actionLabel={`onboarding.interview.actions.${connectionChecked ? 'checkAgain' : 'runCheck'}`}
          busy={false}
          onAction={devices.checkConnection}
        />
      </div>

      <section className={`${CARD} space-y-4 p-5 sm:p-6`}>
        <div className="flex items-start gap-4">
          <span aria-hidden="true" className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[12px] text-white ${GRADIENT_BG}`}>
            <ShieldCheck size={22} />
          </span>
          <div className="min-w-0">
            <h2 className={`text-lg font-semibold ${TITLE_TEXT}`}>{k('consentTitle')}</h2>
            <p className={`mt-1 text-xs leading-[18px] ${BODY_TEXT}`}>{k('consentBody')}</p>
          </div>
        </div>
        <div className="border-t border-[#e7dbe9] pt-4">
          <ConsentCheckbox
            checked={consented}
            onChange={onConsentChange}
            label={t('onboarding.interview.consent.checkbox')}
          />
        </div>
      </section>

      <div>
        <dl className={`${CARD} grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`}>
          {rules.map((rule, index) => (
            <div
              key={rule.label}
              className={`px-4 py-4 ${index > 0 ? 'border-t border-[#e7dbe9] sm:border-t-0' : ''} ${index % 2 === 0 ? 'sm:border-e sm:border-[#e7dbe9]' : ''} ${index === 1 ? 'lg:border-e lg:border-[#e7dbe9]' : ''} ${index >= 2 ? 'sm:border-t sm:border-[#e7dbe9] lg:border-t-0' : ''}`}
            >
              <dt className={`flex items-center gap-1.5 text-xs font-semibold ${TITLE_TEXT}`}>
                {index === 0 && <Clock aria-hidden="true" size={14} />}
                {rule.label}
              </dt>
              <dd className={`mt-1 text-[11px] leading-4 ${MUTED_TEXT}`}>{rule.value}</dd>
            </div>
          ))}
        </dl>
        <p className={`mt-2 text-[11px] ${MUTED_TEXT}`}>{k('durationNote')}</p>
      </div>

      <FullscreenNotice fullscreen={fullscreen} actionLabel={k('start')} />

      <div className="flex flex-col items-stretch gap-3 pt-2 sm:flex-row sm:items-center sm:justify-end">
        {!canStart && <p className={`text-xs sm:me-auto ${MUTED_TEXT}`}>{k('startHint')}</p>}
        <TextButton onClick={onBack}>
          <BackArrow />
          {t('onboarding.interview.common.back')}
        </TextButton>
        <PrimaryButton size="lg" disabled={!canStart} onClick={onStart}>
          {k('start')}
          <ForwardArrow />
        </PrimaryButton>
      </div>
    </div>
  );
}
