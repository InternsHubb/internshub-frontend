import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { AppealDecision, AppealForm, AppealSubmitted } from '@/features/onboarding/components/interview/AppealScreens';
import { CannotResumeScreen, OrientationScreen, ResultScreen, ResumeScreen, UnderReviewScreen } from '@/features/onboarding/components/interview/InterviewOutcome';
import { MUTED_TEXT, SampleBadge } from '@/features/onboarding/components/interview/parts';
import type { InterviewLevel } from '@/features/onboarding/types/onboarding.types';
import type { InterviewType, OutcomeScreen } from '@/features/onboarding/components/interview/types';

// Step 08 (Result) once an interview has ended. After a backend interview the outcome and level
// are its own. Without one, the outcome is a sample: the switcher lets reviewers preview each Figma
// state and is labelled as such. Appeals have no backend endpoint yet and stay samples.

type PreviewTab = { screen: OutcomeScreen; labelKey: string };

const TECHNICAL_TABS: PreviewTab[] = [
  { screen: 'result', labelKey: 'result' },
  { screen: 'under-review', labelKey: 'underReview' },
  { screen: 'resume', labelKey: 'resume' },
  { screen: 'cannot-resume', labelKey: 'cannotResume' },
];

const ORIENTATION_TABS: PreviewTab[] = [
  { screen: 'orientation', labelKey: 'orientation' },
  { screen: 'resume', labelKey: 'resume' },
  { screen: 'cannot-resume', labelKey: 'cannotResume' },
];

function PreviewSwitcher({ tabs, active, onSelect }: { tabs: PreviewTab[]; active: OutcomeScreen; onSelect: (screen: OutcomeScreen) => void }) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-3 rounded-[14px] border border-dashed border-[#d6b98a] bg-[#fffbeb]/60 p-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2">
        <SampleBadge label={t('onboarding.interview.result.previewLabel')} />
        <p className={`text-xs ${MUTED_TEXT}`}>{t('onboarding.interview.result.previewHint')}</p>
      </div>
      <div role="tablist" aria-label={t('onboarding.interview.result.previewLabel')} className="flex flex-wrap gap-1 rounded-[10px] bg-white p-1">
        {tabs.map((tab) => {
          const selected = tab.screen === active;
          return (
            <button
              key={tab.screen}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => onSelect(tab.screen)}
              className={`min-h-[32px] rounded-[8px] px-3 text-xs font-semibold transition ${selected ? 'bg-[#f5eaf9] text-[#3b0454]' : 'text-[#7d7483] hover:text-[#3b0454]'}`}
            >
              {t(`onboarding.interview.result.tabs.${tab.labelKey}`)}
            </button>
          );
        })}
      </div>
    </div>
  );
}

type InterviewResultFlowProps = {
  outcome: OutcomeScreen;
  onOutcomeChange: (outcome: OutcomeScreen) => void;
  appealReason: string;
  onAppealReasonChange: (reason: string) => void;
  type: InterviewType;
  track: string;
  // The backend result level, when the interview produced one.
  level: InterviewLevel | null;
  // No backend interview behind the outcome: the sample switcher is shown.
  isPreview: boolean;
  onContinue: () => void;
  onHome: () => void;
  onResume: () => void;
};

export function InterviewResultFlow({
  outcome,
  onOutcomeChange,
  appealReason,
  onAppealReasonChange,
  type,
  track,
  level,
  isPreview,
  onContinue,
  onHome,
  onResume,
}: InterviewResultFlowProps) {
  const tabs = type === 'orientation' ? ORIENTATION_TABS : TECHNICAL_TABS;
  const showSwitcher = isPreview && tabs.some((tab) => tab.screen === outcome);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [outcome]);

  const screen = (() => {
    switch (outcome) {
      case 'result':
        return (
          <ResultScreen type={type} track={track} level={level} onContinue={onContinue} onAppeal={() => onOutcomeChange('appeal-form')} />
        );
      case 'under-review':
        return <UnderReviewScreen type={type} track={track} isSample={isPreview} onHome={onHome} />;
      case 'resume':
        return <ResumeScreen type={type} track={track} onResume={onResume} onHome={onHome} />;
      case 'cannot-resume':
        return <CannotResumeScreen type={type} track={track} onHome={onHome} />;
      case 'orientation':
        return <OrientationScreen track={track} onContinue={onContinue} />;
      case 'appeal-form':
        return (
          <AppealForm
            type={type}
            track={track}
            reason={appealReason}
            onReasonChange={onAppealReasonChange}
            onCancel={() => onOutcomeChange('result')}
            onSubmit={() => onOutcomeChange('appeal-submitted')}
          />
        );
      case 'appeal-submitted':
        return (
          <AppealSubmitted type={type} track={track} onViewDecision={() => onOutcomeChange('appeal-decision')} onHome={onHome} />
        );
      case 'appeal-decision':
        return <AppealDecision type={type} track={track} onContinue={onContinue} />;
    }
  })();

  return (
    <div className="space-y-8">
      {showSwitcher && <PreviewSwitcher tabs={tabs} active={outcome} onSelect={onOutcomeChange} />}
      {screen}
    </div>
  );
}
