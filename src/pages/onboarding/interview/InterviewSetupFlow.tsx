import { useEffect, useState } from 'react';
import type { RefObject } from 'react';
import { preloadInterviewerAvatar } from '@/features/ai-interviewer';
import { DeviceCheck } from './DeviceCheck';
import { InterviewOverview } from './InterviewOverview';
import { InterviewSession } from './InterviewSession';
import { InterviewSetup } from './InterviewSetup';
import { RecordingConsent } from './RecordingConsent';
import { mediaOutage, screenOutage } from './deviceStatus';
import { isFullscreenSupported } from './integrity/fullscreen';
import { FULLSCREEN_MODE } from './integrity/policy';
import { useIntegrityMonitor } from './integrity/useIntegrityMonitor';
import { useDeviceCheck } from './useDeviceCheck';
import { outcomeFor } from './useLiveInterview';
import { unlockInterviewAudio } from './useQuestionSpeech';
import type { LiveInterview } from './useLiveInterview';
import type { InterviewProgress, InterviewProgressPatch, InterviewType, OutcomeScreen, SetupScreen } from './types';

// Onboarding Step 07 (Setup): Get Ready → Overview → Recording Consent → Device Check → questions.
// This component owns the camera, microphone and screen streams, so they stay open across these
// screens (no repeated permission prompts) and stop as soon as the user leaves Step 07.
//
// Fullscreen: the Start Interview click on Get Ready puts the onboarding page area around this
// component (navbar, progress bar and content; `fullscreenTarget`) into fullscreen (element
// fullscreen — the closest a page can get to the browser's F11 mode), and it
// stays on through Overview, Consent, Device Check and the questions. If the candidate left it on
// the way, Device Check's Continue click re-enters it. Finishing or leaving Step 07 exits it.
// The integrity monitor runs only on the question screens.

type InterviewSetupFlowProps = {
  progress: InterviewProgress;
  onChange: (patch: InterviewProgressPatch) => void;
  type: InterviewType;
  track: string;
  cvUploaded: boolean;
  // The element that goes fullscreen; it stays mounted for the whole of Step 07.
  fullscreenTarget: RefObject<HTMLDivElement | null>;
  // The backend interview; owned by the onboarding flow so the Result step can read its outcome.
  live: LiveInterview;
  onExit: () => void;
  onFinish: (outcome: OutcomeScreen) => void;
};

export function InterviewSetupFlow({
  progress,
  onChange,
  type,
  track,
  cvUploaded,
  fullscreenTarget,
  live,
  onExit,
  onFinish,
}: InterviewSetupFlowProps) {
  const devices = useDeviceCheck();
  const { screen, phase } = progress;
  const { start: startLive } = live;
  const hasLiveQuestion = live.interview?.status === 'InProgress' && live.interview.currentQuestion !== null;
  const { monitor, snapshot } = useIntegrityMonitor(screen === 'session');
  const [fullscreenFailedOn, setFullscreenFailedOn] = useState<SetupScreen | null>(null);
  const { camera, microphone, screen: screenShare } = devices;

  useEffect(() => {
    window.scrollTo({ top: 0 });
    fullscreenTarget.current?.scrollTo({ top: 0 });
  }, [screen, fullscreenTarget]);

  // Warm up the 3D interviewer while the candidate checks their devices.
  useEffect(() => {
    if (screen === 'device-check') preloadInterviewerAvatar();
  }, [screen]);

  // Device outages during the questions become integrity intervals.
  useEffect(() => {
    const cause = mediaOutage(camera);
    if (snapshot.running && cause !== undefined) monitor.reportDevice('CAMERA_UNAVAILABLE', cause);
  }, [monitor, snapshot.running, camera]);

  useEffect(() => {
    const cause = mediaOutage(microphone);
    if (snapshot.running && cause !== undefined) monitor.reportDevice('MICROPHONE_UNAVAILABLE', cause);
  }, [monitor, snapshot.running, microphone]);

  useEffect(() => {
    if (!snapshot.running) return;
    const cause = screenOutage(screenShare);
    if (cause !== undefined) monitor.reportDevice('SCREEN_CAPTURE_UNAVAILABLE', cause);
    if (screenShare.status === 'shared') monitor.recordScreenSurface(screenShare.surface);
  }, [monitor, snapshot.running, screenShare]);

  const setConsent = (consented: boolean) => onChange({ consented });

  // Called directly from a click handler: the fullscreen request is the first thing it does, so the
  // browser still sees the user gesture. Moves on only once the container really is fullscreen
  // (or the browser has no Fullscreen API, which falls back to a normal window). Resolves to
  // whether it moved on.
  const continueInFullscreen = async (from: SetupScreen, next: InterviewProgressPatch): Promise<boolean> => {
    const result = await monitor.enterFullscreen(fullscreenTarget.current);
    if (result === 'failed' && FULLSCREEN_MODE === 'required') {
      setFullscreenFailedOn(from);
      return false;
    }
    setFullscreenFailedOn(null);
    onChange(next);
    return true;
  };

  // Device Check's Continue opens the questions and starts (or resumes) the backend attempt: one
  // click, one start. Coming back from the questions to an attempt that is still open doesn't
  // start another. A failed start is retried only by the Try again button.
  const continueToQuestions = async () => {
    const movedOn = await continueInFullscreen('device-check', { screen: 'session' });
    if (movedOn && !hasLiveQuestion) void startLive();
  };

  const fullscreenInfo = (on: SetupScreen) => ({
    enabled: FULLSCREEN_MODE !== 'off',
    supported: isFullscreenSupported(),
    failed: fullscreenFailedOn === on,
  });

  const renderScreen = () => {
    switch (screen) {
      case 'setup':
        return (
          <InterviewSetup
            devices={devices}
            consented={progress.consented}
            fullscreen={fullscreenInfo('setup')}
            onConsentChange={setConsent}
            onBack={onExit}
            onStart={() => {
              void continueInFullscreen('setup', { screen: 'overview' });
              // Same click: lets the questions be read aloud later without a play button.
              unlockInterviewAudio();
            }}
          />
        );
      case 'overview':
        return (
          <InterviewOverview
            type={type}
            track={track}
            cvUploaded={cvUploaded}
            onBack={() => onChange({ screen: 'setup' })}
            onStart={() => onChange({ screen: 'consent' })}
          />
        );
      case 'consent':
        return (
          <RecordingConsent
            consented={progress.consented}
            onConsentChange={setConsent}
            onBack={() => onChange({ screen: 'overview' })}
            onContinue={() => onChange({ screen: 'device-check' })}
          />
        );
      case 'device-check':
        return (
          <DeviceCheck
            devices={devices}
            fullscreen={fullscreenInfo('device-check')}
            onBack={() => onChange({ screen: 'overview' })}
            onContinue={() => void continueToQuestions()}
          />
        );
      case 'session': {
        const interview = live.interview;
        const handleNext = () => {
          if (interview?.currentQuestion) {
            onChange({ phase: 'answering' });
            return;
          }
          devices.stopAll();
          onFinish(interview ? outcomeFor(interview) : 'under-review');
        };
        return (
          <InterviewSession
            devices={devices}
            integrity={snapshot}
            onReturnToFullscreen={async () => (await monitor.enterFullscreen(fullscreenTarget.current)) === 'entered'}
            withAppPrompt={(prompt) => monitor.withAppPrompt(prompt)}
            type={type}
            track={track}
            live={live}
            canGoBack={phase === 'answering' && (interview?.answeredCount ?? 0) === 0}
            onBack={() => onChange({ screen: 'device-check' })}
            onNext={handleNext}
          />
        );
      }
    }
  };

  return <div className="mx-auto w-full max-w-[1200px]">{renderScreen()}</div>;
}
