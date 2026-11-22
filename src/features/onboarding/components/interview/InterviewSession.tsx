import { useEffect, useRef, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { AlertCircle, Check, Loader2, MicOff, PauseCircle, Volume2 } from 'lucide-react';
import type { AvatarState } from '@/features/onboarding/ai-interviewer';
import {
  BackArrow,
  BODY_TEXT,
  ForwardArrow,
  MUTED_TEXT,
  Notice,
  PrimaryButton,
  SecondaryButton,
  TextButton,
  TITLE_TEXT,
} from '@/features/onboarding/components/interview/parts';
import { mediaActionKey, requiredChecksReady, screenActionKey } from '@/features/onboarding/components/interview/deviceStatus';
import { CallControlBar } from '@/features/onboarding/components/interview/CallControlBar';
import { CopyGuard } from '@/features/onboarding/components/interview/CopyGuard';
import { FullscreenWarning } from '@/features/onboarding/components/interview/FullscreenWarning';
import { InterviewerCallStage } from '@/features/onboarding/components/interview/InterviewerCallStage';
import type { StageStatus } from '@/features/onboarding/components/interview/InterviewerCallStage';
import { isScreenAccepted } from '@/features/onboarding/components/interview/useDeviceCheck';
import type { DeviceCheckApi } from '@/features/onboarding/components/interview/useDeviceCheck';
import type { IntegritySnapshot } from '@/features/onboarding/components/interview/integrity/integrityMonitor';
import type { LiveInterview } from '@/features/onboarding/components/interview/useLiveInterview';
import type { InterviewType } from '@/features/onboarding/components/interview/types';
import { useQuestionSpeech } from '@/features/onboarding/components/interview/useQuestionSpeech';
import { useSpeaking } from '@/features/onboarding/components/interview/useSpeaking';
import { voiceState } from '@/features/onboarding/components/interview/VoiceIndicator';
import type { VoiceState } from '@/features/onboarding/components/interview/VoiceIndicator';

// Question screen, call style: the 3D interviewer reads each question from the backend interview
// (useLiveInterview) aloud, with its audio when the backend sends it and speech synthesis
// otherwise (useQuestionSpeech). Recording starts once he has finished speaking. Done uploads and
// sends the take; the next question follows straight away, with "Answer saved" shown briefly in
// the recording panel (the backend returns no transcript). After the last answer the closing text
// is read and Finish leads to the result. An answer that couldn't be sent is kept: the candidate
// sends it again or records a new one, and no recording runs meanwhile. If the camera, microphone
// or screen share stops, the interview pauses: speech stops and the recording is discarded until
// it is restored (research §18.6). If the candidate leaves fullscreen, the question is replaced by
// the fullscreen warning until they return (§17.4). Page-hidden and focus-loss intervals are kept
// by the integrity monitor without any message to the candidate (§18.6).

const SAVED_NOTICE_MS = 1500;

type AppPrompt = <T>(prompt: () => Promise<T>) => Promise<T>;

type InterviewSessionProps = {
  devices: DeviceCheckApi;
  integrity: IntegritySnapshot;
  onReturnToFullscreen: () => Promise<boolean>;
  // Re-acquiring a device opens a browser prompt; the monitor tags what that prompt causes.
  withAppPrompt: AppPrompt;
  type: InterviewType;
  track: string;
  live: LiveInterview;
  // Back leaves the questions only before the first answer is sent.
  canGoBack: boolean;
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

const VOICE_PILL: Record<VoiceState, { pill: string; dot: string }> = {
  idle: { pill: 'bg-white/10 text-white/80', dot: 'bg-[#c9bfd0]' },
  paused: { pill: 'bg-white/10 text-white/80', dot: 'bg-[#9a939e]' },
  listening: { pill: 'bg-white/10 text-white', dot: 'bg-[#c084fc]' },
  speaking: { pill: 'bg-[#22c55e]/20 text-[#bbf7d0]', dot: 'bg-[#22c55e] motion-safe:animate-pulse' },
  processing: { pill: 'bg-[#f59e0b]/20 text-[#fde68a]', dot: 'bg-[#f59e0b]' },
  error: { pill: 'bg-[#be123c]/30 text-[#fecdd3]', dot: 'bg-[#fb7185]' },
};

// Bar heights relative to the microphone level, so the bars read as a voice shape.
const LEVEL_BARS = [0.55, 0.85, 1, 0.85, 0.55];
const LEVEL_BAR_MIN = 0.15;

const PANEL_BOX = 'rounded-[16px] border border-white/10 bg-white/[0.07] px-5 py-4 backdrop-blur-sm';

// The recording panel under the question: what the candidate should do right now. While the take
// records, "listening" (waiting for the candidate) and "you're speaking" come from the real
// microphone level (useSpeaking), and the bars follow that level.
function AnswerPanel({ voice, level }: { voice: VoiceState; level: number }) {
  const { t } = useTranslation();
  const isTaking = voice === 'listening' || voice === 'speaking';
  const style = VOICE_PILL[voice];
  const label = isTaking
    ? t(`onboarding.interview.session.call.voice.${voice === 'speaking' ? 'userSpeaking' : 'listening'}`)
    : t(`onboarding.interview.session.voice.${voice}`);
  // Screen readers hear the state changes that matter, not every start and stop of speech.
  const announced = voice === 'speaking' ? 'listening' : voice;
  return (
    <div data-voice-state={voice} className={`${PANEL_BOX} flex flex-col items-center gap-2`}>
      <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${style.pill}`}>
        <span aria-hidden="true" className={`h-2 w-2 rounded-full ${style.dot}`} />
        {label}
      </span>
      {isTaking && (
        <div aria-hidden="true" className="flex h-6 items-center gap-1">
          {LEVEL_BARS.map((weight, index) => (
            <span
              key={index}
              className={`h-6 w-1.5 origin-center rounded-full transition-[transform,background-color] duration-100 ease-out motion-reduce:transition-none ${
                voice === 'speaking' ? 'bg-[#4ade80]' : 'bg-white/35'
              }`}
              style={{ transform: `scaleY(${Math.max(LEVEL_BAR_MIN, Math.min(1, level * weight * 1.6))})` }}
            />
          ))}
        </div>
      )}
      <p className="text-sm leading-6 text-white/75">
        <Trans i18nKey="onboarding.interview.session.call.speakNaturally" components={{ b: <strong className="font-semibold text-white" /> }} />
      </p>
      <span className="sr-only" role="status" aria-live="polite">
        {t(`onboarding.interview.session.voice.${announced}`)}
      </span>
    </div>
  );
}

function PanelMessage({ icon: Icon, tone, children }: { icon: typeof Check; tone: 'success' | 'info'; children: string }) {
  return (
    <div className={`${PANEL_BOX} flex items-center justify-center gap-2`}>
      <Icon aria-hidden="true" size={16} className={tone === 'success' ? 'text-[#86efac]' : 'text-[#d8b4fe]'} />
      <p role="status" aria-live="polite" className="text-sm font-semibold text-white">
        {children}
      </p>
    </div>
  );
}

export function InterviewSession({
  devices,
  integrity,
  onReturnToFullscreen,
  withAppPrompt,
  type,
  track,
  live,
  canGoBack,
  onBack,
  onNext,
}: InterviewSessionProps) {
  const { t } = useTranslation();
  const k = (key: string, options?: Record<string, unknown>) => t(`onboarding.interview.session.${key}`, options);
  const {
    interview,
    status,
    errorKey,
    errorDetail,
    recordingErrorKey,
    isRecording,
    hasPendingAnswer,
    startRecording,
    cancelRecording,
    submitAnswer,
    resendAnswer,
    discardPendingAnswer,
    clearRecordingError,
  } = live;
  const { getMicrophoneStream } = devices;
  const devicesPaused = !requiredChecksReady(devices);
  const paused = devicesPaused || integrity.fullscreenWarning;
  const [isSending, setIsSending] = useState(false);
  const [isSavedShown, setIsSavedShown] = useState(false);
  const savedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const question = interview?.currentQuestion ?? null;
  const ended = status === 'ready' && interview !== null && question === null;
  const questionNumber = (interview?.answeredCount ?? 0) + 1;
  // The backend's interview type wins over the one inferred from the package.
  const shownType: InterviewType = interview ? (interview.type === 'Orientation' ? 'orientation' : 'technical') : type;

  // The interviewer reads the question, or the closing text once the interview has ended.
  const speech = useQuestionSpeech({
    id: ended ? 'closing' : question ? `question-${question.orderIndex}` : null,
    text: ended ? (interview?.closingText ?? '') : (question?.text ?? ''),
    audioBase64: ended ? (interview?.closingAudioBase64 ?? null) : (question?.audioBase64 ?? null),
    audioMimeType: ended ? (interview?.closingAudioMimeType ?? null) : (question?.audioMimeType ?? null),
    enabled: !paused && status === 'ready' && !isSending,
  });
  const questionSpoken = speech.spoken;

  const canRecord =
    !isSending &&
    status === 'ready' &&
    question !== null &&
    questionSpoken &&
    !paused &&
    !hasPendingAnswer &&
    recordingErrorKey === null;

  // Records once the question has been read and while the interview isn't paused. A pause, or
  // leaving the questions, discards the take; the candidate answers again once it resumes.
  useEffect(() => {
    if (!canRecord) return;
    startRecording(getMicrophoneStream());
    return cancelRecording;
  }, [canRecord, question?.orderIndex, startRecording, cancelRecording, getMicrophoneStream]);

  useEffect(
    () => () => {
      if (savedTimer.current) clearTimeout(savedTimer.current);
    },
    []
  );

  const isMicLive = isRecording && !isSending && !paused && recordingErrorKey === null;
  const isVoiceHeard = useSpeaking(devices.micLevel, isMicLive);
  const voice = voiceState(
    { isRecording, isProcessing: isSending, isPaused: paused, hasError: recordingErrorKey !== null },
    isVoiceHeard
  );

  const showSaved = () => {
    if (savedTimer.current) clearTimeout(savedTimer.current);
    setIsSavedShown(true);
    savedTimer.current = setTimeout(() => setIsSavedShown(false), SAVED_NOTICE_MS);
  };

  // Done sends the take being recorded; Send again sends the kept one. On success the next
  // question (or the closing screen) comes with the response.
  const sendAnswer = async (send: typeof submitAnswer) => {
    setIsSending(true);
    const next = await send();
    setIsSending(false);
    if (next) showSaved();
  };

  const stage = (): { avatar: AvatarState; status: StageStatus } => {
    if (paused) return { avatar: 'IDLE', status: 'paused' };
    if (isSending || status === 'submitting') return { avatar: 'THINKING', status: 'thinking' };
    if (!questionSpoken) return { avatar: 'SPEAKING', status: 'speaking' };
    if (ended) return { avatar: 'SUCCESS', status: 'finished' };
    if (isRecording) return { avatar: 'LISTENING', status: 'listening' };
    return { avatar: 'IDLE', status: 'idle' };
  };

  const renderPanel = () => {
    if (ended) return <PanelMessage icon={Check} tone="success">{k('endedTitle')}</PanelMessage>;
    if (isSavedShown) return <PanelMessage icon={Check} tone="success">{k('answerSaved')}</PanelMessage>;
    if (!questionSpoken) return <PanelMessage icon={Volume2} tone="info">{k('call.listenFirst')}</PanelMessage>;
    return <AnswerPanel voice={voice} level={isMicLive ? devices.micLevel : 0} />;
  };

  const renderQuestion = () => {
    if (status === 'starting' || (status === 'idle' && !interview)) {
      return <Notice tone="neutral" icon={Loader2} title={k('preparing')} />;
    }
    if (!interview) {
      return (
        <Notice tone="warning" icon={AlertCircle} title={k('startFailed')}>
          {errorDetail ? <p dir="auto">{errorDetail}</p> : errorKey && <p>{t(errorKey)}</p>}
          <div className="mt-3">
            <SecondaryButton onClick={() => void live.start()}>{k('retry')}</SecondaryButton>
          </div>
        </Notice>
      );
    }
    const { avatar, status: stageStatus } = stage();
    const chip = question && (
      <div className="flex flex-wrap items-center justify-center gap-2">
        <span className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-white">
          {k('question', { number: questionNumber })}
        </span>
        {question.topic && (
          <span dir="auto" className="text-xs font-semibold text-white/70">
            {question.topic}
          </span>
        )}
      </div>
    );
    return (
      <>
        <InterviewerCallStage
          avatarState={avatar}
          audioElement={speech.audioElement}
          speakingWithoutAudio={speech.speakingWithoutAudio}
          status={stageStatus}
          chip={chip || undefined}
          text={ended ? (interview.closingText ?? k('endedBody')) : (question?.text ?? '')}
          isQuote={!ended}
          panel={renderPanel()}
          cameraStream={devices.cameraStream}
        />

        {!ended && errorKey && (
          <Notice tone="warning" icon={AlertCircle} title={k('answerFailed')}>
            {errorDetail ? <p dir="auto">{errorDetail}</p> : <p>{t(errorKey)}</p>}
            {hasPendingAnswer && (
              <>
                <p className="mt-1">{k('answerKept')}</p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <SecondaryButton disabled={isSending || paused} onClick={() => void sendAnswer(resendAnswer)}>
                    {k('sendAgain')}
                  </SecondaryButton>
                  <TextButton disabled={isSending} onClick={discardPendingAnswer}>
                    {k('recordNewAnswer')}
                  </TextButton>
                </div>
              </>
            )}
          </Notice>
        )}

        {!ended && recordingErrorKey && (
          <Notice tone="warning" icon={MicOff} title={k('recordingProblem')}>
            <p>{t(recordingErrorKey)}</p>
            <div className="mt-3">
              <SecondaryButton onClick={clearRecordingError}>{k('recordAgain')}</SecondaryButton>
            </div>
          </Notice>
        )}

        <CallControlBar
          isMicActive={devices.microphone.status === 'ready'}
          micLevel={devices.micLevel}
          isRecording={isRecording}
          actions={
            ended ? (
              <PrimaryButton size="lg" disabled={paused} onClick={onNext}>
                {k('finish')}
                <ForwardArrow />
              </PrimaryButton>
            ) : (
              <>
                {canGoBack && (
                  <TextButton onClick={onBack}>
                    <BackArrow />
                    {t('onboarding.interview.common.back')}
                  </TextButton>
                )}
                <PrimaryButton size="lg" disabled={paused || isSending || !isRecording} onClick={() => void sendAnswer(submitAnswer)}>
                  {k('done')}
                  <ForwardArrow />
                </PrimaryButton>
              </>
            )
          }
        />
        <p className={`text-xs ${MUTED_TEXT}`}>{k('copyDisabled')}</p>
      </>
    );
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-[#e7dbe9] pb-5">
        <h1 className={`text-2xl font-semibold tracking-[-0.02em] ${TITLE_TEXT}`}>{t(`onboarding.interview.types.${shownType}`)}</h1>
        <p className={`text-sm ${BODY_TEXT}`}>{track}</p>
      </div>

      {devicesPaused && <PausedBanner devices={devices} withAppPrompt={withAppPrompt} />}

      <CopyGuard className="min-w-0 space-y-5">
        {integrity.fullscreenWarning ? <FullscreenWarning onReturn={onReturnToFullscreen} /> : renderQuestion()}
      </CopyGuard>
    </div>
  );
}
