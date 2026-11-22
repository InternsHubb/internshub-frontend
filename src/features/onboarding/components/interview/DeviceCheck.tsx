import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle2, Circle, ListChecks, Mic, Monitor, MonitorUp, Video } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import {
  BackArrow,
  BODY_TEXT,
  CARD,
  ForwardArrow,
  GRADIENT_BG,
  GRADIENT_TEXT,
  IconTile,
  MUTED_TEXT,
  PageHeading,
  PANEL,
  PrimaryButton,
  SecondaryButton,
  StatusPill,
  TextButton,
  TITLE_TEXT,
} from '@/features/onboarding/components/interview/parts';
import { mediaActionKey, mediaDisplay, requiredChecksReady, screenActionKey, screenDisplay } from '@/features/onboarding/components/interview/deviceStatus';
import type { CheckDisplay } from '@/features/onboarding/components/interview/deviceStatus';
import { CameraPreview, DeviceSelect, MicMeter } from '@/features/onboarding/components/interview/devicePreview';
import { FullscreenNotice } from '@/features/onboarding/components/interview/FullscreenNotice';
import type { FullscreenInfo } from '@/features/onboarding/components/interview/FullscreenNotice';
import { isScreenAccepted } from '@/features/onboarding/components/interview/useDeviceCheck';
import type { DeviceCheckApi } from '@/features/onboarding/components/interview/useDeviceCheck';

// "Device Check" (Figma 24:73): live camera preview, device pickers, microphone level and the
// screen share, all from the same streams the Setup step opened. Continue needs all three ready;
// if the candidate left the fullscreen started on Setup, the same click re-enters it.

type DevicePanelProps = { icon: LucideIcon; title: string; display: CheckDisplay; tools?: ReactNode; children: ReactNode };

function DevicePanel({ icon, title, display, tools, children }: DevicePanelProps) {
  const { t } = useTranslation();
  return (
    <section className={`${CARD} p-5`}>
      <div className="flex flex-wrap items-center gap-3">
        <IconTile icon={icon} />
        <h2 className={`me-auto text-xl font-semibold ${GRADIENT_TEXT}`}>{title}</h2>
        {tools}
        <StatusPill tone={display.tone}>{t(display.labelKey)}</StatusPill>
      </div>
      <div className="mt-4 space-y-3">{children}</div>
    </section>
  );
}

export function CheckMessage({ display }: { display: CheckDisplay }) {
  const { t } = useTranslation();
  if (!display.messageKey) return null;
  const color = display.tone === 'danger' ? 'text-[#be123c]' : display.tone === 'warning' ? 'text-[#b45309]' : MUTED_TEXT;
  return (
    <p role="status" className={`text-xs leading-[18px] ${color}`}>
      {t(display.messageKey)}
    </p>
  );
}

type DeviceCheckProps = {
  devices: DeviceCheckApi;
  fullscreen: FullscreenInfo;
  onBack: () => void;
  onContinue: () => void;
};

export function DeviceCheck({ devices, fullscreen, onBack, onContinue }: DeviceCheckProps) {
  const { t } = useTranslation();
  const k = (key: string) => t(`onboarding.interview.deviceCheck.${key}`);
  const { camera, microphone, screen } = devices;

  const cameraDisplay = mediaDisplay('camera', camera);
  const microphoneDisplay = mediaDisplay('microphone', microphone);
  const sharedDisplay = screenDisplay(screen);
  const ready = requiredChecksReady(devices);

  const requirements = [
    { label: t('onboarding.interview.status.cameraReady'), done: camera.status === 'ready' },
    { label: t('onboarding.interview.status.microphoneReady'), done: microphone.status === 'ready' },
    { label: t('onboarding.interview.session.screenActive'), done: isScreenAccepted(screen) },
  ];

  return (
    <div className="space-y-6">
      <PageHeading tone="brand" title={k('title')} subtitle={k('subtitle')} />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.1fr_1fr]">
        <DevicePanel
          icon={Video}
          title={k('camera')}
          display={cameraDisplay}
          tools={
            <div className="w-full sm:w-[220px]">
              <DeviceSelect
                label={k('selectCamera')}
                devices={devices.cameras}
                value={camera.status === 'ready' ? camera.deviceId : ''}
                disabled={camera.status === 'checking'}
                onChange={(deviceId) => void devices.checkCamera(deviceId)}
              />
            </div>
          }
        >
          <CameraPreview stream={devices.cameraStream} />
          <CheckMessage display={cameraDisplay} />
          {camera.status !== 'ready' && (
            <SecondaryButton disabled={camera.status === 'checking'} onClick={() => void devices.checkCamera()}>
              {t(mediaActionKey('camera', camera))}
            </SecondaryButton>
          )}
        </DevicePanel>

        <div className="space-y-5">
          <DevicePanel icon={Mic} title={k('microphone')} display={microphoneDisplay}>
            <DeviceSelect
              label={k('selectMicrophone')}
              devices={devices.microphones}
              value={microphone.status === 'ready' ? microphone.deviceId : ''}
              disabled={microphone.status === 'checking'}
              onChange={(deviceId) => void devices.checkMicrophone(deviceId)}
            />
            <div className={`${PANEL} space-y-2 p-4`}>
              <p className={`text-xs font-semibold ${TITLE_TEXT}`}>{k('inputVolume')}</p>
              <MicMeter level={microphone.status === 'ready' ? devices.micLevel : 0} />
              <p className={`text-xs ${BODY_TEXT}`}>{k('speakHint')}</p>
            </div>
            <CheckMessage display={microphoneDisplay} />
            {microphone.status !== 'ready' && (
              <SecondaryButton disabled={microphone.status === 'checking'} onClick={() => void devices.checkMicrophone()}>
                {t(mediaActionKey('microphone', microphone))}
              </SecondaryButton>
            )}
          </DevicePanel>

          <DevicePanel icon={MonitorUp} title={k('screen')} display={sharedDisplay}>
            <p className={`text-sm ${BODY_TEXT}`}>{k('screenHint')}</p>
            {screen.status === 'shared' ? (
              <div className={`${PANEL} flex items-center gap-3 p-2.5`}>
                <span aria-hidden="true" className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] text-white ${GRADIENT_BG}`}>
                  <Monitor size={18} />
                </span>
                <span className={`me-auto min-w-0 truncate text-base ${TITLE_TEXT}`}>
                  {k(screen.surface === 'monitor' ? 'sharedEntire' : 'sharedUnknown')}
                </span>
                <SecondaryButton onClick={() => void devices.shareScreen()}>{t(screenActionKey(screen))}</SecondaryButton>
              </div>
            ) : (
              <SecondaryButton disabled={screen.status === 'checking'} onClick={() => void devices.shareScreen()}>
                {t(screenActionKey(screen))}
              </SecondaryButton>
            )}
            <CheckMessage display={sharedDisplay} />
          </DevicePanel>
        </div>
      </div>

      {/* Fullscreen normally started with Start Interview; Continue re-enters it if it was left. */}
      <FullscreenNotice fullscreen={fullscreen} actionLabel={k('continue')} intro={false} />

      <section className={`${CARD} flex flex-col gap-5 p-5 lg:flex-row lg:items-center lg:justify-between`}>
        <div className="min-w-0">
          <h2 className={`flex items-center gap-2 text-lg font-semibold ${GRADIENT_TEXT}`}>
            <ListChecks aria-hidden="true" size={18} className="text-[#5a127a]" />
            {k('requirements')}
          </h2>
          <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
            {requirements.map((item) => (
              <li key={item.label} className={`flex items-center gap-2 text-sm ${item.done ? TITLE_TEXT : MUTED_TEXT}`}>
                {item.done ? (
                  <CheckCircle2 aria-hidden="true" size={18} className="text-[#16a34a]" />
                ) : (
                  <Circle aria-hidden="true" size={18} className="text-[#c9bfd0]" />
                )}
                {item.label}
              </li>
            ))}
          </ul>
          <p className={`mt-3 text-xs ${BODY_TEXT}`}>{k('requirementsNote')}</p>
        </div>
        <div className="flex shrink-0 flex-col-reverse gap-3 sm:flex-row sm:items-center">
          <TextButton onClick={onBack}>
            <BackArrow />
            {k('backToOverview')}
          </TextButton>
          <PrimaryButton size="lg" disabled={!ready} onClick={onContinue}>
            {k('continue')}
            <ForwardArrow />
          </PrimaryButton>
        </div>
      </section>
    </div>
  );
}
