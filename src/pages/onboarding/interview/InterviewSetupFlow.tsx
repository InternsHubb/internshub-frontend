import { useEffect } from 'react';
import { DeviceCheck } from './DeviceCheck';
import { InterviewOverview } from './InterviewOverview';
import { InterviewSession } from './InterviewSession';
import { InterviewSetup } from './InterviewSetup';
import { RecordingConsent } from './RecordingConsent';
import { SAMPLE_QUESTION_KEYS } from './mockInterview';
import { useDeviceCheck } from './useDeviceCheck';
import type { InterviewProgress, InterviewProgressPatch, InterviewType } from './types';

// Onboarding Step 07 (Setup): Get Ready → Overview → Recording Consent → Device Check → questions.
// This component owns the camera, microphone and screen streams, so they stay open across these
// screens (no repeated permission prompts) and stop as soon as the user leaves Step 07.

type InterviewSetupFlowProps = {
  progress: InterviewProgress;
  onChange: (patch: InterviewProgressPatch) => void;
  type: InterviewType;
  track: string;
  cvUploaded: boolean;
  onExit: () => void;
  onFinish: () => void;
};

export function InterviewSetupFlow({ progress, onChange, type, track, cvUploaded, onExit, onFinish }: InterviewSetupFlowProps) {
  const devices = useDeviceCheck();
  const { screen, questionIndex, phase } = progress;

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [screen]);

  const setConsent = (consented: boolean) => onChange({ consented });

  switch (screen) {
    case 'setup':
      return (
        <InterviewSetup
          devices={devices}
          consented={progress.consented}
          onConsentChange={setConsent}
          onBack={onExit}
          onStart={() => onChange({ screen: 'overview' })}
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
          onBack={() => onChange({ screen: 'overview' })}
          onContinue={() => onChange({ screen: 'session' })}
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
}
