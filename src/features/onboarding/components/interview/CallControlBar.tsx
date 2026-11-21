import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Mic, MicOff } from 'lucide-react';
import { CARD } from '@/features/onboarding/components/interview/parts';

// The bar under the call stage: microphone state, the take's recording time, and the action
// (Done while answering, Finish on the closing screen).

const LEVEL_BARS = [0.6, 1, 0.6];

type CallControlBarProps = {
  isMicActive: boolean;
  // Microphone level, 0–1.
  micLevel: number;
  isRecording: boolean;
  actions: ReactNode;
};

// Seconds since recording last started; back to 0 whenever it stops (a new take or question).
function useRecordingSeconds(isRecording: boolean) {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    setSeconds(0);
    if (!isRecording) return;
    const startedAt = Date.now();
    const timer = setInterval(() => setSeconds(Math.floor((Date.now() - startedAt) / 1000)), 500);
    return () => clearInterval(timer);
  }, [isRecording]);
  return seconds;
}

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  return `${String(minutes).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
}

export function CallControlBar({ isMicActive, micLevel, isRecording, actions }: CallControlBarProps) {
  const { t } = useTranslation();
  const k = (key: string, options?: Record<string, unknown>) => t(`onboarding.interview.session.call.${key}`, options);
  const seconds = useRecordingSeconds(isRecording);
  const level = isMicActive ? micLevel : 0;

  return (
    <div className={`${CARD} flex flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-5`}>
      <span
        className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${
          isMicActive ? 'bg-[#dcfce7] text-[#15803d]' : 'bg-[#fef3c7] text-[#b45309]'
        }`}
      >
        {isMicActive ? <Mic aria-hidden="true" size={14} /> : <MicOff aria-hidden="true" size={14} />}
        {k(isMicActive ? 'micActive' : 'micProblem')}
        {isMicActive && (
          <span aria-hidden="true" className="flex h-3 items-center gap-0.5">
            {LEVEL_BARS.map((weight, index) => (
              <span
                key={index}
                className="h-3 w-0.5 origin-center rounded-full bg-[#16a34a] transition-transform duration-100 motion-reduce:transition-none"
                style={{ transform: `scaleY(${Math.max(0.25, Math.min(1, level * weight * 1.8))})` }}
              />
            ))}
          </span>
        )}
      </span>

      {isRecording ? (
        <span className="inline-flex items-center gap-2 rounded-full bg-[#fff1f2] px-3 py-1.5 text-xs font-semibold tabular-nums text-[#be123c]">
          <span aria-hidden="true" className="h-2 w-2 rounded-full bg-[#f43f5e]" />
          {k('recordingTimer', { time: formatTime(seconds) })}
        </span>
      ) : (
        <span aria-hidden="true" className="hidden sm:block" />
      )}

      <div className="flex flex-wrap items-center justify-end gap-2">{actions}</div>
    </div>
  );
}
