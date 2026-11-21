import { useTranslation } from 'react-i18next';
import { AlertCircle, CircleSlash, Loader2, Mic } from 'lucide-react';
import { MUTED_TEXT } from '@/features/onboarding/components/interview/parts';
import { useSpeaking } from '@/features/onboarding/components/interview/useSpeaking';

// The microphone on the question screen. While recording, the halo and the bars follow the real
// microphone level, and the "speaking" look appears only while the level shows voice (useSpeaking);
// a silent take stays on the calm "listening" look. Nothing moves when not recording. With reduced
// motion the halo is hidden and the bars change without easing.

export type VoiceState = 'idle' | 'paused' | 'listening' | 'speaking' | 'processing' | 'error';

// Bar heights relative to the level, so the bars read as a voice shape rather than one block.
const BAR_WEIGHTS = [0.55, 0.85, 1, 0.85, 0.55];
const BAR_MIN_SCALE = 0.18;

type VoiceIndicatorProps = {
  isRecording: boolean;
  isProcessing: boolean;
  isPaused: boolean;
  hasError: boolean;
  // Microphone level, 0–1.
  level: number;
};

export function voiceState({ isRecording, isProcessing, isPaused, hasError }: Omit<VoiceIndicatorProps, 'level'>, speaking: boolean): VoiceState {
  if (isProcessing) return 'processing';
  if (hasError) return 'error';
  if (isPaused) return 'paused';
  if (!isRecording) return 'idle';
  return speaking ? 'speaking' : 'listening';
}

const ICONS = { idle: Mic, paused: CircleSlash, listening: Mic, speaking: Mic, processing: Loader2, error: AlertCircle };

const CIRCLE_TONE: Record<VoiceState, string> = {
  idle: 'border-[#e7dbe9] text-[#8a7f91]',
  paused: 'border-[#e7dbe9] text-[#8a7f91]',
  listening: 'border-[#d9c2e6] text-[#5a127a]',
  speaking: 'border-[#8b5db0] text-[#5a127a]',
  processing: 'border-[#d9c2e6] text-[#5a127a]',
  error: 'border-[#fecdd3] text-[#be123c]',
};

export function VoiceIndicator(props: VoiceIndicatorProps) {
  const { t } = useTranslation();
  const live = props.isRecording && !props.isProcessing && !props.isPaused && !props.hasError;
  const speaking = useSpeaking(props.level, live);
  const state = voiceState(props, speaking);
  const level = live ? props.level : 0;
  const Icon = ICONS[state];
  // Screen readers hear the state changes that matter, not every start and stop of speech.
  const announced = state === 'speaking' ? 'listening' : state;

  return (
    <div className="flex flex-col items-center" data-voice-state={state}>
      <div className="relative flex h-24 w-24 items-center justify-center">
        <span
          aria-hidden="true"
          className={`absolute inset-2 rounded-full transition-[transform,opacity] duration-100 ease-out motion-reduce:hidden ${
            state === 'speaking' ? 'bg-[#8b5db0]/30' : 'bg-[#d9c2e6]/40'
          }`}
          style={{ transform: `scale(${1 + level * 0.5})`, opacity: live ? 1 : 0 }}
        />
        <span
          aria-hidden="true"
          className={`relative flex h-16 w-16 items-center justify-center rounded-full border-2 bg-white shadow-[0_4px_14px_rgba(59,4,84,0.12)] transition-colors ${CIRCLE_TONE[state]}`}
        >
          <Icon size={26} className={state === 'processing' ? 'animate-spin motion-reduce:animate-none' : undefined} />
        </span>
      </div>

      <div aria-hidden="true" className="mt-2 flex h-6 items-center gap-1">
        {BAR_WEIGHTS.map((weight, index) => (
          <span
            key={index}
            className={`h-6 w-1.5 origin-center rounded-full transition-[transform,background-color] duration-100 ease-out motion-reduce:transition-none ${
              state === 'speaking' ? 'bg-[#8b5db0]' : 'bg-[#d9c2e6]'
            }`}
            style={{ transform: `scaleY(${Math.max(BAR_MIN_SCALE, Math.min(1, level * weight * 1.6))})` }}
          />
        ))}
      </div>

      <p className={`mt-2 text-xs font-semibold ${state === 'error' ? 'text-[#be123c]' : MUTED_TEXT}`}>
        {t(`onboarding.interview.session.voice.${state}`)}
      </p>
      <span className="sr-only" role="status" aria-live="polite">
        {t(`onboarding.interview.session.voice.${announced}`)}
      </span>
    </div>
  );
}
