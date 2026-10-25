import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Award, CalendarClock, CalendarDays, Check, Clock, Code2, Hourglass, Info, PauseCircle, PlayCircle, SquareTerminal } from 'lucide-react';
import {
  BackArrow,
  BODY_TEXT,
  ForwardArrow,
  GRADIENT_TEXT,
  HeroIcon,
  IconTile,
  InterviewHeader,
  MUTED_TEXT,
  Notice,
  PageHeading,
  PrimaryButton,
  ROUND_CARD,
  SampleBadge,
  StatusPill,
  TextButton,
  TITLE_TEXT,
} from './parts';
import { APPEAL_WINDOW_DAYS, RESUME_WINDOW_HOURS, RESUMES_ALLOWED, RETAKE_AFTER_HOURS, SAMPLE_RESULT, SAMPLE_RESUME, SAMPLE_RETAKE } from './mockInterview';
import { levelKey } from './useLiveInterview';
import type { InterviewLevel } from '@/lib/api/types';
import type { InterviewType } from './types';

// Outcome screens shown under Step 08 (Result). The Result level comes from the backend interview
// when there is one; every other level, countdown and attempt count here is sample data from
// mockInterview.ts and is marked with a Sample badge.

const GRAY_PANEL = 'rounded-[12px] bg-[#f4f0f8] p-4';

type OutcomeProps = { type: InterviewType; track: string };

function OutcomeLayout({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return <div className="mx-auto w-full max-w-[640px] space-y-6 text-center">{icon}{children}</div>;
}

function Card({ children }: { children: ReactNode }) {
  return <section className={`${ROUND_CARD} space-y-5 p-5 text-start sm:p-8`}>{children}</section>;
}

type CardHeaderProps = OutcomeProps & { pill: ReactNode; eyebrow?: boolean; isSample?: boolean };

function CardHeader({ type, track, pill, eyebrow, isSample = true }: CardHeaderProps) {
  const { t } = useTranslation();
  return (
    <InterviewHeader
      eyebrow={eyebrow ? t('onboarding.interview.common.assessmentTrack') : undefined}
      title={t(`onboarding.interview.types.${type}`)}
      track={track}
      aside={
        <div className="flex flex-wrap items-center gap-2">
          {isSample && <SampleBadge />}
          {pill}
        </div>
      }
    />
  );
}

function HomeButton({ onHome }: { onHome: () => void }) {
  const { t } = useTranslation();
  return (
    <PrimaryButton size="lg" block onClick={onHome}>
      {t('onboarding.interview.common.backToHome')}
    </PrimaryButton>
  );
}

// `level` is the backend result; without one (preview) the sample level is shown.
type ResultScreenProps = OutcomeProps & { level?: InterviewLevel | null; onContinue: () => void; onAppeal: () => void };

export function ResultScreen({ type, track, level, onContinue, onAppeal }: ResultScreenProps) {
  const { t } = useTranslation();
  const k = (key: string, options?: Record<string, unknown>) => t(`onboarding.interview.result.${key}`, options);
  const shownLevel = level ? levelKey(level) : SAMPLE_RESULT.level;
  return (
    <OutcomeLayout icon={<HeroIcon icon={Award} />}>
      <PageHeading centered title={k('title')} subtitle={k('subtitle', { type: t(`onboarding.interview.types.${type}`) })} />
      <Card>
        <CardHeader type={type} track={track} isSample={!level} pill={<StatusPill tone="success">{k('confirmed')}</StatusPill>} />
        <div className="border-t border-[#e7dbe9] pt-5">
          <p className={`text-[11px] font-bold uppercase tracking-[0.06em] ${BODY_TEXT}`}>{k('finalLevel')}</p>
          <p className="mt-2 rounded-[12px] border border-[#e7dbe9] bg-[#fbf0fe] px-6 py-5">
            <span className={`text-4xl font-bold tracking-[-0.02em] ${GRADIENT_TEXT}`}>
              {t(`onboarding.interview.levels.${shownLevel}`)}
            </span>
          </p>
          <p className={`mt-3 text-sm ${BODY_TEXT}`}>{k('levelNote')}</p>
        </div>
        <div className="space-y-3 border-t border-[#e7dbe9] pt-5 text-center">
          <PrimaryButton size="lg" block onClick={onContinue}>
            {t('onboarding.interview.common.continueToSquad')}
            <ForwardArrow />
          </PrimaryButton>
          <TextButton onClick={onAppeal} className="underline">
            {k('appeal')}
          </TextButton>
          <p className={`text-xs ${MUTED_TEXT}`}>{k('appealNote', { days: APPEAL_WINDOW_DAYS })}</p>
        </div>
      </Card>
    </OutcomeLayout>
  );
}

type UnderReviewProps = OutcomeProps & { isSample?: boolean; onHome: () => void };

export function UnderReviewScreen({ type, track, isSample, onHome }: UnderReviewProps) {
  const { t } = useTranslation();
  const k = (key: string) => t(`onboarding.interview.result.underReview.${key}`);
  return (
    <OutcomeLayout icon={<HeroIcon icon={Hourglass} />}>
      <PageHeading centered tone="brand" title={k('title')} subtitle={k('subtitle')} />
      <Card>
        <CardHeader eyebrow type={type} track={track} isSample={isSample} pill={<StatusPill tone="warning">{k('badge')}</StatusPill>} />
        <div className={`${GRAY_PANEL} flex items-start gap-3`}>
          <span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] border border-[#e7dbe9] bg-white text-[#5a127a]">
            <CalendarDays size={18} />
          </span>
          <div>
            <p className={`text-[15px] font-semibold ${TITLE_TEXT}`}>{k('progressTitle')}</p>
            <p className={`text-sm ${BODY_TEXT}`}>{k('progressBody')}</p>
          </div>
        </div>
        <HomeButton onHome={onHome} />
        <p className={`text-center text-xs ${MUTED_TEXT}`}>{k('note')}</p>
      </Card>
    </OutcomeLayout>
  );
}

type ResumeScreenProps = OutcomeProps & { onResume: () => void; onHome: () => void };

export function ResumeScreen({ type, track, onResume, onHome }: ResumeScreenProps) {
  const { t } = useTranslation();
  const k = (key: string, options?: Record<string, unknown>) => t(`onboarding.interview.result.resume.${key}`, options);
  const remaining = RESUMES_ALLOWED - SAMPLE_RESUME.resumesUsed;
  return (
    <OutcomeLayout icon={<HeroIcon icon={PauseCircle} tone="warning" />}>
      <PageHeading centered tone="brand" title={k('title')} subtitle={k('subtitle')} />
      <Card>
        <div className="flex flex-wrap items-center gap-3 rounded-[12px] bg-[#f4f0f8] p-4">
          <IconTile icon={SquareTerminal} />
          <div className="me-auto min-w-0">
            <InterviewHeader
              eyebrow={t('onboarding.interview.common.assessmentTrack')}
              title={t(`onboarding.interview.types.${type}`)}
              track={track}
            />
          </div>
          <SampleBadge />
          <StatusPill tone="warning">{k('badge')}</StatusPill>
        </div>
        <div className={`${GRAY_PANEL} space-y-3`}>
          <p className="flex items-center gap-2 text-[15px] font-semibold text-[#3b0454]">
            <PlayCircle aria-hidden="true" size={18} />
            {k('availableTitle')}
          </p>
          <p className={`text-sm ${BODY_TEXT}`}>{k('availableBody', { hours: RESUME_WINDOW_HOURS })}</p>
          <p className="flex items-center gap-2 rounded-[10px] bg-white px-4 py-3 text-sm">
            <Clock aria-hidden="true" size={16} className="text-[#b45309]" />
            <span className={`me-auto font-medium ${TITLE_TEXT}`}>{k('timeRemaining')}</span>
            <span className="font-semibold text-[#b45309]">{k('minutes', { count: SAMPLE_RESUME.minutesLeft })}</span>
          </p>
        </div>
        <p className={`flex flex-wrap justify-between gap-2 text-xs ${BODY_TEXT}`}>
          <span>
            <span className={`font-semibold ${TITLE_TEXT}`}>{k('attempts')}</span>{' '}
            <span className="text-[#5a127a]">{k('attemptsValue', { used: SAMPLE_RESUME.resumesUsed, total: RESUMES_ALLOWED })}</span>
          </span>
          <span>{k('attemptsLeft', { count: remaining })}</span>
        </p>
        <div className="space-y-2 text-center">
          <PrimaryButton size="lg" block onClick={onResume}>
            <PlayCircle aria-hidden="true" size={16} />
            {k('action')}
          </PrimaryButton>
          <p className={`text-xs ${MUTED_TEXT}`}>{k('note', { number: SAMPLE_RESUME.questionIndex + 1 })}</p>
          <TextButton onClick={onHome}>
            <BackArrow />
            {t('onboarding.interview.common.backToHome')}
          </TextButton>
        </div>
      </Card>
    </OutcomeLayout>
  );
}

export function CannotResumeScreen({ type, track, onHome }: OutcomeProps & { onHome: () => void }) {
  const { t } = useTranslation();
  const k = (key: string, options?: Record<string, unknown>) => t(`onboarding.interview.result.cannotResume.${key}`, options);
  return (
    <OutcomeLayout icon={<HeroIcon icon={Clock} tone="warning" />}>
      <PageHeading centered title={k('title')} subtitle={k('subtitle')} />
      <Card>
        <CardHeader eyebrow type={type} track={track} pill={<StatusPill tone="warning">{k('badge')}</StatusPill>} />
        <Notice tone="warning" icon={Info} title={k('expired', { hours: RESUME_WINDOW_HOURS })} />
        <div className={`${GRAY_PANEL} space-y-2`}>
          <p className={`flex items-center gap-2 text-base font-semibold ${TITLE_TEXT}`}>
            <CalendarClock aria-hidden="true" size={18} className="text-[#5a127a]" />
            {k('retakeTitle', { hours: RETAKE_AFTER_HOURS })}
          </p>
          <p className={`text-xs ${BODY_TEXT}`}>{k('retakeBody')}</p>
          <p className="flex flex-wrap justify-between gap-2 pt-2 text-xs">
            <span className={`flex items-center gap-1.5 font-semibold ${BODY_TEXT}`}>
              <Hourglass aria-hidden="true" size={13} />
              {k('nextSession')}
            </span>
            <span className="font-semibold text-[#5a127a]">
              {k('countdown', { hours: SAMPLE_RETAKE.hours, minutes: SAMPLE_RETAKE.minutes })}
            </span>
          </p>
        </div>
        <HomeButton onHome={onHome} />
        <p className={`text-center text-xs ${MUTED_TEXT}`}>{k('note')}</p>
      </Card>
    </OutcomeLayout>
  );
}

export function OrientationScreen({ track, onContinue }: { track: string; onContinue: () => void }) {
  const { t } = useTranslation();
  const k = (key: string) => t(`onboarding.interview.result.orientation.${key}`);
  return (
    <div className="mx-auto w-full max-w-[860px] space-y-6">
      <PageHeading centered tone="brand" title={k('title')} subtitle={k('subtitle')} />
      <Card>
        <div className="flex flex-wrap items-center gap-3 border-b border-[#e7dbe9] pb-5">
          <IconTile icon={Code2} size="lg" />
          <div className="me-auto min-w-0">
            <p className={`text-[11px] font-bold uppercase tracking-[0.06em] ${BODY_TEXT}`}>{t('onboarding.interview.types.orientation')}</p>
            <p className={`text-lg font-semibold ${TITLE_TEXT}`}>{track}</p>
          </div>
          <SampleBadge />
          <StatusPill tone="success">{k('badge')}</StatusPill>
        </div>
        <div className="rounded-[12px] border border-[#e7dbe9] bg-[#fbf0fe] p-5">
          <p className={`flex items-center gap-2 text-base font-semibold ${TITLE_TEXT}`}>
            <span aria-hidden="true" className="flex h-6 w-6 items-center justify-center rounded-full bg-[#dcfce7] text-[#15803d]">
              <Check size={14} />
            </span>
            {k('resultTitle')}
          </p>
          <p className={`mt-2 ps-8 text-sm ${BODY_TEXT}`}>{k('resultBody')}</p>
        </div>
        <Notice icon={Info} title={k('advisoryTitle')}>
          {k('advisoryBody')}
        </Notice>
        <div className="space-y-3 border-t border-[#e7dbe9] pt-5">
          <div>
            <p className={`text-base font-semibold ${TITLE_TEXT}`}>{k('nextTitle')}</p>
            <p className={`text-sm ${BODY_TEXT}`}>{k('nextBody')}</p>
          </div>
          <PrimaryButton size="lg" block onClick={onContinue}>
            {t('onboarding.interview.common.continueToSquad')}
            <ForwardArrow />
          </PrimaryButton>
        </div>
      </Card>
    </div>
  );
}
