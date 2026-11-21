import { Suspense } from 'react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Bot } from 'lucide-react';
import { InterviewerAvatar3D } from '@/features/onboarding/ai-interviewer';
import type { AvatarState } from '@/features/onboarding/ai-interviewer';
import { CameraPreview } from '@/features/onboarding/components/interview/devicePreview';

// The call-style stage of the question screen: the 3D interviewer on a deep purple background,
// with the status pill above him, the question under him, the recording panel, and the candidate's
// camera as a picture-in-picture in the bottom-start corner. Purely presentational: the session
// screen decides what is said and shown. Without WebGL a static interviewer card takes his place.

export type StageStatus = 'idle' | 'speaking' | 'listening' | 'thinking' | 'paused' | 'finished';

const STATUS_DOT: Record<StageStatus, string> = {
  idle: 'bg-[#c9bfd0]',
  speaking: 'bg-[#22c55e]',
  listening: 'bg-[#f43f5e]',
  thinking: 'bg-[#f59e0b]',
  paused: 'bg-[#9a939e]',
  finished: 'bg-[#22c55e]',
};

type InterviewerCallStageProps = {
  avatarState: AvatarState;
  audioElement: HTMLAudioElement | null;
  speakingWithoutAudio: boolean;
  status: StageStatus;
  // Question number and topic; omitted on the closing screen.
  chip?: ReactNode;
  text: string;
  isQuote: boolean;
  panel: ReactNode;
  cameraStream: MediaStream | null;
};

function StaticInterviewer() {
  const { t } = useTranslation();
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 text-white">
      <span
        aria-hidden="true"
        className="flex h-24 w-24 items-center justify-center rounded-full border border-white/20 bg-white/10 text-2xl font-bold tracking-[0.04em] sm:h-28 sm:w-28"
      >
        {t('onboarding.interview.session.call.initials')}
      </span>
      <span className="text-sm font-semibold text-white/80">{t('onboarding.interview.session.call.interviewer')}</span>
    </div>
  );
}

export function InterviewerCallStage({
  avatarState,
  audioElement,
  speakingWithoutAudio,
  status,
  chip,
  text,
  isQuote,
  panel,
  cameraStream,
}: InterviewerCallStageProps) {
  const { t } = useTranslation();
  const k = (key: string) => t(`onboarding.interview.session.call.${key}`);
  const cameraState = t(`onboarding.interview.session.${cameraStream ? 'cameraOn' : 'cameraOff'}`);

  return (
    <section
      aria-label={k('interviewer')}
      className="relative isolate flex min-h-[620px] flex-col items-center overflow-hidden rounded-[20px] bg-[radial-gradient(ellipse_at_50%_32%,#5a127a_0%,#4a0d68_38%,#2a0a3d_70%,#14061f_100%)] px-4 pb-[118px] pt-14 shadow-[0_18px_40px_-14px_rgba(20,6,31,0.6)] sm:min-h-[580px] sm:px-8 sm:pb-[150px] lg:aspect-video lg:min-h-auto lg:pb-8"
    >
      {/* Depth: soft blurred circles and a dark fade at the bottom edge. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <span className="absolute -top-28 start-[-12%] h-72 w-72 rounded-full bg-[#8b3fc4]/30 blur-3xl" />
        <span className="absolute end-[-10%] top-1/4 h-80 w-80 rounded-full bg-[#a855f7]/20 blur-3xl" />
        <span className="absolute bottom-[-25%] start-1/3 h-80 w-80 rounded-full bg-[#5a127a]/45 blur-3xl" />
        <span className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#14061f] to-transparent" />
      </div>

      <div className="absolute start-1/2 top-4 z-10 -translate-x-1/2 rtl:translate-x-1/2">
        <span className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-white/10 bg-[#14061f]/60 px-3.5 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
          <Bot aria-hidden="true" size={14} className="text-[#d8b4fe]" />
          {k('interviewer')}
          <span aria-hidden="true" className="text-white/40">•</span>
          <span aria-hidden="true" className={`h-2 w-2 rounded-full ${STATUS_DOT[status]}`} />
          <span className="uppercase tracking-[0.06em]">{k(`state.${status}`)}</span>
        </span>
      </div>

      {/* The interviewer stands on the stage, framed from the chest up; his lower edge fades out. */}
      <div className="relative h-[210px] w-full max-w-[440px] shrink-0 [mask-image:linear-gradient(to_bottom,black_70%,transparent)] sm:h-[270px] lg:h-[52%] lg:max-h-[330px]">
        <Suspense fallback={null}>
          <InterviewerAvatar3D
            state={avatarState}
            audioElement={audioElement}
            speakingWithoutAudio={speakingWithoutAudio}
            fallback={<StaticInterviewer />}
          />
        </Suspense>
      </div>

      <div className="relative z-10 flex w-full flex-col items-center text-center">
        {chip}
        {/* The text's language comes from the backend, not the UI: dir="auto" keeps an English
            question's punctuation in place on the Arabic (RTL) page. */}
        <p
          dir="auto"
          className="mt-3 max-w-[720px] whitespace-pre-line text-xl font-bold leading-[1.35] text-white sm:text-[26px] lg:text-[28px]"
        >
          {isQuote ? `“${text}”` : text}
        </p>
        <div className="mt-5 w-full max-w-[460px]">{panel}</div>
      </div>

      <div className="absolute bottom-4 start-4 z-10 w-[110px] overflow-hidden rounded-[12px] border border-white/25 shadow-[0_8px_20px_rgba(0,0,0,0.35)] sm:w-[160px] lg:w-[180px]">
        <CameraPreview stream={cameraStream} />
        <span className="absolute inset-x-0 bottom-0 flex items-center gap-1.5 bg-[#14061f]/75 px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.05em] text-white sm:text-[10px]">
          <span aria-hidden="true" className={`h-1.5 w-1.5 shrink-0 rounded-full ${cameraStream ? 'bg-[#22c55e]' : 'bg-[#9a939e]'}`} />
          {/* The phone-sized picture shows only "You"; the dot still tells whether the camera is on. */}
          <span className="truncate">
            {k('you')}
            <span className="hidden sm:inline"> • {cameraState}</span>
          </span>
          <span className="sr-only sm:hidden">{cameraState}</span>
        </span>
      </div>
    </section>
  );
}
