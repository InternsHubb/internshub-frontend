import { useId, useState } from 'react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Award, CalendarClock, Hourglass, Info, Minus, Shield, ShieldCheck, TrendingUp } from 'lucide-react';
import {
  BODY_TEXT,
  ForwardArrow,
  GRADIENT_BG,
  GRADIENT_TEXT,
  HeroIcon,
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
} from '@/features/onboarding/components/interview/parts';
import { APPEAL_REASON_MAX_LENGTH, APPEAL_WINDOW_DAYS, SAMPLE_RESULT } from '@/features/onboarding/components/interview/mockInterview';
import type { InterviewType } from '@/features/onboarding/components/interview/types';

// Appeal form → submitted → decision. Frontend preview only: no appeal is sent anywhere, and every
// screen says so. The decision is a labelled sample the viewer can toggle between both outcomes.

type AppealProps = { type: InterviewType; track: string };

function Card({ children }: { children: ReactNode }) {
  return <section className={`${ROUND_CARD} space-y-5 p-5 text-start sm:p-8`}>{children}</section>;
}

function LevelPanel({ type, track, pill }: AppealProps & { pill: ReactNode }) {
  const { t } = useTranslation();
  return (
    <div className="space-y-3 rounded-[12px] bg-[#f4f0f8] p-4">
      <InterviewHeader
        title={t(`onboarding.interview.types.${type}`)}
        track={track}
        aside={
          <div className="flex flex-wrap items-center gap-2">
            <SampleBadge />
            {pill}
          </div>
        }
      />
      <div className="flex items-center justify-between rounded-[10px] bg-white px-4 py-3">
        <div>
          <p className={`text-[11px] font-bold uppercase tracking-[0.06em] ${BODY_TEXT}`}>
            {t('onboarding.interview.appeal.currentLevel')}
          </p>
          <p className={`text-2xl font-bold ${GRADIENT_TEXT}`}>{t(`onboarding.interview.levels.${SAMPLE_RESULT.level}`)}</p>
        </div>
        <span aria-hidden="true" className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5eaf9] text-[#5a127a]">
          <Award size={18} />
        </span>
      </div>
    </div>
  );
}

function NotSentNote() {
  const { t } = useTranslation();
  return <p className={`text-center text-xs ${MUTED_TEXT}`}>{t('onboarding.interview.appeal.notSent')}</p>;
}

type AppealFormProps = AppealProps & {
  reason: string;
  onReasonChange: (reason: string) => void;
  onCancel: () => void;
  onSubmit: () => void;
};

export function AppealForm({ type, track, reason, onReasonChange, onCancel, onSubmit }: AppealFormProps) {
  const { t } = useTranslation();
  const k = (key: string, options?: Record<string, unknown>) => t(`onboarding.interview.appeal.${key}`, options);
  const fieldId = useId();
  const hintId = useId();
  const counterId = useId();
  const canSubmit = reason.trim().length > 0;
  const typeName = t(`onboarding.interview.types.${type}`);

  return (
    <div className="mx-auto w-full max-w-[860px] space-y-6">
      <PageHeading centered title={k('title')} subtitle={k('subtitle', { type: typeName })} />
      <Card>
        <LevelPanel type={type} track={track} pill={<StatusPill tone="success">{t('onboarding.interview.result.confirmed')}</StatusPill>} />
        <Notice tone="warning" icon={CalendarClock} title={k('windowTitle', { days: APPEAL_WINDOW_DAYS })}>
          {k('windowBody', { days: APPEAL_WINDOW_DAYS })}
        </Notice>
        <form
          className="space-y-5"
          onSubmit={(event) => {
            event.preventDefault();
            if (canSubmit) onSubmit();
          }}
        >
          <div>
            <label htmlFor={fieldId} className={`block text-base font-semibold ${TITLE_TEXT}`}>
              {k('reasonLabel')}
            </label>
            <p id={hintId} className={`mt-0.5 text-xs ${BODY_TEXT}`}>
              {k('reasonHint')}
            </p>
            <textarea
              id={fieldId}
              value={reason}
              maxLength={APPEAL_REASON_MAX_LENGTH}
              required
              rows={5}
              aria-describedby={`${hintId} ${counterId}`}
              placeholder={k('placeholder')}
              onChange={(event) => onReasonChange(event.target.value)}
              className="mt-3 w-full resize-y rounded-[12px] border border-[#cfc3d6] bg-white p-4 text-sm text-[#1f1a24] placeholder:text-[#9a939e] focus:border-[#7d42ad] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#e5d4f2]"
            />
            <p id={counterId} className={`mt-1 text-end text-xs ${MUTED_TEXT}`}>
              {k('counter', { count: reason.length, max: APPEAL_REASON_MAX_LENGTH })}
            </p>
          </div>
          <Notice tone="neutral" icon={ShieldCheck} title={k('reviewerTitle')}>
            {k('reviewerBody')}
          </Notice>
          <div className="space-y-2 text-center">
            <PrimaryButton type="submit" size="lg" block disabled={!canSubmit}>
              {k('submit')}
            </PrimaryButton>
            {!canSubmit && <p className={`text-xs ${MUTED_TEXT}`}>{k('reasonRequired')}</p>}
            <TextButton onClick={onCancel} className="text-[#4c4451]">
              {k('cancel')}
            </TextButton>
            <NotSentNote />
          </div>
        </form>
      </Card>
    </div>
  );
}

type AppealSubmittedProps = AppealProps & { onViewDecision: () => void; onHome: () => void };

export function AppealSubmitted({ type, track, onViewDecision, onHome }: AppealSubmittedProps) {
  const { t } = useTranslation();
  const k = (key: string, options?: Record<string, unknown>) => t(`onboarding.interview.appeal.submitted.${key}`, options);
  return (
    <div className="mx-auto w-full max-w-[860px] space-y-6 text-center">
      <HeroIcon icon={Hourglass} />
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.06em] text-[#7d42ad]">{k('eyebrow')}</p>
        <PageHeading centered title={k('title')} subtitle={k('subtitle', { type: t(`onboarding.interview.types.${type}`) })} />
      </div>
      <Card>
        <LevelPanel type={type} track={track} pill={<StatusPill tone="warning">{k('badge')}</StatusPill>} />
        <Notice icon={ShieldCheck} title={k('reviewTitle')}>
          <p>{k('reviewBody')}</p>
          <p className={MUTED_TEXT}>{k('final')}</p>
        </Notice>
        <div className="space-y-2 text-center">
          <PrimaryButton size="lg" block onClick={onViewDecision}>
            {k('viewDecision')}
            <ForwardArrow />
          </PrimaryButton>
          <TextButton onClick={onHome}>{t('onboarding.interview.common.backToHome')}</TextButton>
          <NotSentNote />
        </div>
      </Card>
    </div>
  );
}

type DecisionOutcome = 'changed' | 'unchanged';

export function AppealDecision({ type, track, onContinue }: AppealProps & { onContinue: () => void }) {
  const { t } = useTranslation();
  const k = (key: string) => t(`onboarding.interview.appeal.decision.${key}`);
  const [outcome, setOutcome] = useState<DecisionOutcome>('changed');
  const changed = outcome === 'changed';
  const level = (key: string) => t(`onboarding.interview.levels.${key}`);
  const finalLevel = changed ? SAMPLE_RESULT.appealedLevel : SAMPLE_RESULT.level;

  return (
    <div className="mx-auto w-full max-w-[640px] space-y-6 text-center">
      <HeroIcon icon={ShieldCheck} tone="success" />
      <PageHeading centered tone="brand" title={k('title')} subtitle={k('subtitle')} />
      <Card>
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#e7dbe9] pb-4">
          <div>
            <p className={`flex flex-wrap items-center gap-2 text-lg font-semibold ${TITLE_TEXT}`}>
              {t(`onboarding.interview.types.${type}`)}
              <StatusPill tone="success">{k('final')}</StatusPill>
            </p>
            <p className={`text-sm ${BODY_TEXT}`}>{track}</p>
          </div>
          <div role="radiogroup" aria-label={k('outcomeLabel')} className="flex flex-wrap items-center gap-1 rounded-[10px] bg-[#f4f0f8] p-1">
            <SampleBadge label={k('outcomeLabel')} />
            {(['changed', 'unchanged'] as const).map((option) => {
              const active = outcome === option;
              const Icon = option === 'changed' ? TrendingUp : Minus;
              return (
                <button
                  key={option}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setOutcome(option)}
                  className={`inline-flex min-h-[32px] items-center gap-1 rounded-[8px] px-2.5 text-xs font-semibold transition ${active ? `${GRADIENT_BG} text-white` : 'text-[#4c4451] hover:bg-white'}`}
                >
                  <Icon aria-hidden="true" size={13} />
                  {k(option)}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-4 rounded-[12px] bg-[#fbf0fe] p-4 sm:p-5">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-[10px] bg-white/70 p-4">
              <p className={`text-[11px] font-bold uppercase tracking-[0.06em] ${BODY_TEXT}`}>{k('previousLevel')}</p>
              <p className="mt-1 flex items-center gap-2">
                <span className={`text-xl font-semibold text-[#7d7483] ${changed ? 'line-through' : ''}`}>{level(SAMPLE_RESULT.level)}</span>
                <span className="rounded-full bg-[#e9dfee] px-2 py-0.5 text-[11px] font-semibold text-[#4c4451]">{k('initial')}</span>
              </p>
            </div>
            <div className="rounded-[10px] border border-[#e7dbe9] bg-white p-4 shadow-[0_2px_8px_rgba(59,4,84,0.06)]">
              <p className={`flex items-center justify-between gap-2 text-[11px] font-bold uppercase tracking-[0.06em] ${BODY_TEXT}`}>
                {k('finalLevel')}
                {changed && (
                  <StatusPill tone="success" dot={false}>
                    <TrendingUp aria-hidden="true" size={12} />
                    {k('updated')}
                  </StatusPill>
                )}
              </p>
              <p className={`mt-1 text-4xl font-bold ${GRADIENT_TEXT}`}>{level(finalLevel)}</p>
            </div>
          </div>
          <p className={`flex items-start gap-2 border-t border-[#e7dbe9] pt-3 text-xs ${BODY_TEXT}`}>
            <Info aria-hidden="true" size={15} className="mt-px shrink-0 text-[#7d42ad]" />
            {k(changed ? 'changedNote' : 'unchangedNote')}
          </p>
        </div>

        <p className={`flex items-center gap-2 rounded-[10px] bg-[#f4f0f8] px-4 py-2.5 text-xs ${TITLE_TEXT}`}>
          <Shield aria-hidden="true" size={14} />
          {k('isFinal')}
        </p>
        <PrimaryButton size="lg" block onClick={onContinue}>
          {t('onboarding.interview.common.continueToSquad')}
          <ForwardArrow />
        </PrimaryButton>
        <NotSentNote />
      </Card>
    </div>
  );
}
