import { useTranslation } from 'react-i18next';
import { Check, CircleSlash, Mic, MicOff, PauseCircle, X } from 'lucide-react';
import {
  BackArrow,
  BODY_TEXT,
  CARD,
  ForwardArrow,
  GRADIENT_BG,
  MUTED_TEXT,
  Notice,
  PrimaryButton,
  SampleBadge,
  SecondaryButton,
  StatusPill,
  TextButton,
  TITLE_TEXT,
} from './parts';
import { mediaActionKey, requiredChecksReady, screenActionKey } from './deviceStatus';
import { CameraPreview } from './devicePreview';
import { CopyGuard } from './CopyGuard';
import { FullscreenWarning } from './FullscreenWarning';
import { SAMPLE_QUESTION_KEYS } from './mockInterview';
import { isScreenAccepted } from './useDeviceCheck';
import type { DeviceCheckApi } from './useDeviceCheck';
import type { IntegritySnapshot } from './integrity/integrityMonitor';
import type { AnswerPhase, InterviewType } from './types';

// Question screen (Figma 24:284 answering, 24:447 answered). The questions and transcript are
// labelled samples and nothing is recorded: the badge says "Not recorded (demo)" where Figma shows
// "Recording". If the camera, microphone or screen share stops, the interview pauses until it is
// restored (research §18.6). If the candidate leaves fullscreen, the question is replaced by the
// fullscreen warning until they return (§17.4). Page-hidden and focus-loss intervals are kept by
// the integrity monitor without any message to the candidate (§18.6).

type AppPrompt = <T>(prompt: () => Promise<T>) => Promise<T>;

type InterviewSessionProps = {
  devices: DeviceCheckApi;
  integrity: IntegritySnapshot;
  onReturnToFullscreen: () => Promise<boolean>;
  // Re-acquiring a device opens a browser prompt; the monitor tags what that prompt causes.
  withAppPrompt: AppPrompt;
  type: InterviewType;
  track: string;
  questionIndex: number;
  phase: AnswerPhase;
  onAnswered: () => void;
  onBack: () => void;
  onNext: () => void;
};

function PausedBanner({ devices, withAppPrompt }: { devices: DeviceCheckApi; withAppPrompt: AppPrompt }) {
  const { t } = useTranslation();
  const { camera, microphone, screen } = devices;
  return (
    <Notice tone="warning" icon={PauseCircle} title={t('onboarding.interview.session.pausedTitle')}>
      <p>{t('onboarding.interview.session.pausedBody')}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {camera.status !== 'ready' && (
          <SecondaryButton
            disabled={camera.status === 'checking'}
            onClick={() => void withAppPrompt(() => devices.checkCamera())}
          >
            {t(mediaActionKey('camera', camera))}
          </SecondaryButton>
        )}
        {microphone.status !== 'ready' && (
          <SecondaryButton
            disabled={microphone.status === 'checking'}
            onClick={() => void withAppPrompt(() => devices.checkMicrophone())}
          >
            {t(mediaActionKey('microphone', microphone))}
          </SecondaryButton>
        )}
        {!isScreenAccepted(screen) && (
          <SecondaryButton
            disabled={screen.status === 'checking'}
            onClick={() => void withAppPrompt(() => devices.shareScreen())}
          >
            {t(screenActionKey(screen))}
          </SecondaryButton>
        )}
      </div>
    </Notice>
  );
}

function DeviceStatusList({ devices, integrity }: { devices: DeviceCheckApi; integrity: IntegritySnapshot }) {
  const { t } = useTranslation();
  const screenOk = isScreenAccepted(devices.screen);
  const rows = [
    { label: t('onboarding.interview.deviceCheck.camera'), ok: devices.camera.status === 'ready' },
    { label: t('onboarding.interview.deviceCheck.microphone'), ok: devices.microphone.status === 'ready' },
    { label: t('onboarding.interview.deviceCheck.screen'), ok: screenOk },
    // Shown only when fullscreen is in use for this attempt.
    ...(integrity.fullscreen === 'off'
      ? []
      : [{ label: t('onboarding.interview.fullscreen.statusLabel'), ok: integrity.fullscreen === 'active' }]),
  ];
  return (
    <section className={`${CARD} p-5`}>
      <h2 className={`border-b border-[#e7dbe9] pb-2 text-xs font-bold uppercase tracking-[0.06em] ${BODY_TEXT}`}>
        {t('onboarding.interview.session.deviceStatus')}
      </h2>
      <ul>
        {rows.map((row) => (
          <li key={row.label} className={`flex items-center justify-between border-b border-[#f1eaf4] py-2.5 text-sm ${TITLE_TEXT}`}>
            {row.label}
            {row.ok ? (
              <Check aria-hidden="true" size={18} className="text-[#16a34a]" />
            ) : (
              <X aria-hidden="true" size={18} className="text-[#be123c]" />
            )}
            <span className="sr-only">{t(`onboarding.interview.status.${row.ok ? 'ready' : 'stopped'}`)}</span>
          </li>
        ))}
      </ul>
      {screenOk && (
        <p className="mt-3 flex items-center gap-2 rounded-[10px] border border-[#bbf7d0] bg-[#f0fdf4] px-3 py-2 text-xs font-semibold text-[#15803d]">
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#16a34a]" />
          {t('onboarding.interview.session.screenActive')}
        </p>
      )}
    </section>
  );
}

export function InterviewSession({
  devices,
  integrity,
  onReturnToFullscreen,
  withAppPrompt,
  type,
  track,
  questionIndex,
  phase,
  onAnswered,
  onBack,
  onNext,
}: InterviewSessionProps) {
  const { t } = useTranslation();
  const k = (key: string, options?: Record<string, unknown>) => t(`onboarding.interview.session.${key}`, options);
  const total = SAMPLE_QUESTION_KEYS.length;
  const questionKey = SAMPLE_QUESTION_KEYS[questionIndex] ?? SAMPLE_QUESTION_KEYS[0];
  const isLast = questionIndex >= total - 1;
  const devicesPaused = !requiredChecksReady(devices);
  const paused = devicesPaused || integrity.fullscreenWarning;
  const answered = phase === 'answered';

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#e7dbe9] pb-5">
        <div>
          <h1 className={`text-2xl font-semibold tracking-[-0.02em] ${TITLE_TEXT}`}>{t(`onboarding.interview.types.${type}`)}</h1>
          <p className={`text-sm ${BODY_TEXT}`}>{track}</p>
        </div>
        <StatusPill tone="brand">{k('progress', { current: questionIndex + 1, total })}</StatusPill>
      </div>

      {devicesPaused && <PausedBanner devices={devices} withAppPrompt={withAppPrompt} />}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
        <CopyGuard className="min-w-0 space-y-5">
          {integrity.fullscreenWarning ? (
            <FullscreenWarning onReturn={onReturnToFullscreen} />
          ) : (
            <>
              <div className="flex flex-wrap items-center gap-2">
                <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold text-white ${GRADIENT_BG}`}>
                  {k('question', { number: questionIndex + 1 })}
                </span>
                <SampleBadge />
              </div>

              <section className={`${CARD} p-6 sm:p-8`}>
                <p className="text-xs font-bold uppercase tracking-[0.06em] text-[#5a127a]">{k('currentQuestion')}</p>
                <p className={`mt-3 text-xl font-semibold leading-[1.45] sm:text-2xl ${TITLE_TEXT}`}>
                  {t(`onboarding.interview.sample.questions.${questionKey}`)}
                </p>
              </section>

              <section className="rounded-[16px] border border-[#e7dbe9] bg-[#fbf0fe] p-6 sm:p-8">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#e7dbe9] pb-4">
                  <h2 className={`text-lg font-semibold ${TITLE_TEXT}`}>{k(answered ? 'yourAnswer' : 'voiceResponse')}</h2>
                  {answered ? (
                    <SampleBadge label={k('sampleTranscript')} />
                  ) : (
                    <StatusPill tone="neutral" dot={false}>
                      <MicOff aria-hidden="true" size={12} />
                      {k('notRecorded')}
                    </StatusPill>
                  )}
                </div>

                {answered ? (
                  <div className="py-5">
                    <p className={`rounded-[12px] border border-[#e7dbe9] bg-white p-5 text-sm leading-[1.7] ${BODY_TEXT}`}>
                      {t(`onboarding.interview.sample.transcripts.${questionKey}`)}
                    </p>
                    <p className={`mt-2 text-xs ${MUTED_TEXT}`}>{k('transcriptNote')}</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center py-8 text-center">
                    <span aria-hidden="true" className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-[#5a127a] shadow-[0_4px_14px_rgba(59,4,84,0.12)]">
                      {paused ? <CircleSlash size={26} /> : <Mic size={26} />}
                    </span>
                    <p className={`mt-4 text-lg font-semibold ${TITLE_TEXT}`}>{k('answeringTitle')}</p>
                    <p className={`mt-1 max-w-[440px] text-sm ${BODY_TEXT}`}>{k('answeringBody')}</p>
                  </div>
                )}

                <div className="flex flex-col-reverse gap-3 border-t border-[#e7dbe9] pt-5 sm:flex-row sm:items-center sm:justify-end">
                  <TextButton onClick={onBack}>
                    <BackArrow />
                    {t('onboarding.interview.common.back')}
                  </TextButton>
                  {answered ? (
                    <PrimaryButton size="lg" disabled={paused} onClick={onNext}>
                      {k(isLast ? 'finish' : 'continue')}
                      <ForwardArrow />
                    </PrimaryButton>
                  ) : (
                    <PrimaryButton size="lg" disabled={paused} onClick={onAnswered}>
                      {k('done')}
                      <ForwardArrow />
                    </PrimaryButton>
                  )}
                </div>
              </section>
              <p className={`text-xs ${MUTED_TEXT}`}>{k('copyDisabled')}</p>
            </>
          )}
        </CopyGuard>

        <aside className="space-y-5">
          <div className={`${CARD} p-2`}>
            <CameraPreview stream={devices.cameraStream} label={k(devices.cameraStream ? 'cameraOn' : 'cameraOff')} />
          </div>
          <DeviceStatusList devices={devices} integrity={integrity} />
        </aside>
      </div>
    </div>
  );
}
