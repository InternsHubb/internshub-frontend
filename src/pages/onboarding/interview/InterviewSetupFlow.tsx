import { useEffect, useState } from 'react';
import type { RefObject } from 'react';
import { DeviceCheck } from './DeviceCheck';
import { InterviewOverview } from './InterviewOverview';
import { InterviewSession } from './InterviewSession';
import { InterviewSetup } from './InterviewSetup';
import { RecordingConsent } from './RecordingConsent';
import { mediaOutage, screenOutage } from './deviceStatus';
import { isFullscreenSupported } from './integrity/fullscreen';
import { FULLSCREEN_MODE } from './integrity/policy';
import { useIntegrityMonitor } from './integrity/useIntegrityMonitor';
import { SAMPLE_QUESTION_KEYS } from './mockInterview';
import { useDeviceCheck } from './useDeviceCheck';
import type { InterviewProgress, InterviewProgressPatch, InterviewType, SetupScreen } from './types';

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
  onExit: () => void;
  onFinish: () => void;
};

export function InterviewSetupFlow({
  progress,
  onChange,
  type,
  track,
  cvUploaded,
  fullscreenTarget,
  onExit,
  onFinish,
}: InterviewSetupFlowProps) {
  const devices = useDeviceCheck();
  const { screen, questionIndex, phase } = progress;
  const { monitor, snapshot } = useIntegrityMonitor(screen === 'session');
  const [fullscreenFailedOn, setFullscreenFailedOn] = useState<SetupScreen | null>(null);
  const { camera, microphone, screen: screenShare } = devices;

  useEffect(() => {
    window.scrollTo({ top: 0 });
    fullscreenTarget.current?.scrollTo({ top: 0 });
  }, [screen, fullscreenTarget]);

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
  // (or the browser has no Fullscreen API, which falls back to a normal window).
  const continueInFullscreen = async (from: SetupScreen, next: InterviewProgressPatch) => {
    const result = await monitor.enterFullscreen(fullscreenTarget.current);
    if (result === 'failed' && FULLSCREEN_MODE === 'required') {
      setFullscreenFailedOn(from);
      return;
    }
    setFullscreenFailedOn(null);
    onChange(next);
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
            onStart={() => void continueInFullscreen('setup', { screen: 'overview' })}
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
            onContinue={() => void continueInFullscreen('device-check', { screen: 'session' })}
          />
        );
      case 'session': {
        const handleBack = () => {
          if (phase === 'answered') onChange({ phase: 'answering' });
          else if (questionIndex > 0) onChange({ questionIndex: questionIndex - 1, phase: 'answered' });
          else onChange({ screen: 'device-check' });
        };
        const handleNext = () => {
          if (questionIndex < SAMPLE_QUESTION_KEYS.length - 1) {
            onChange({ questionIndex: questionIndex + 1, phase: 'answering' });
            return;
          }
          devices.stopAll();
          onFinish();
        };
        return (
          <InterviewSession
            devices={devices}
            integrity={snapshot}
            onReturnToFullscreen={async () => (await monitor.enterFullscreen(fullscreenTarget.current)) === 'entered'}
            withAppPrompt={(prompt) => monitor.withAppPrompt(prompt)}
            type={type}
            track={track}
            questionIndex={questionIndex}
            phase={phase}
            onAnswered={() => onChange({ phase: 'answered' })}
            onBack={handleBack}
            onNext={handleNext}
          />
        );
      }
    }
  };

  return <div className="mx-auto w-full max-w-[1200px]">{renderScreen()}</div>;
}
