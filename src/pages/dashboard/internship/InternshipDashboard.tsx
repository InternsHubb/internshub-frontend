import { useTranslation } from 'react-i18next';

import { JourneyStepper } from '@/components/dashboard/JourneyStepper';
import { ROUTES } from '@/constants/routes';
import { useInternship } from '@/hooks/useInternship';

import { CoursesStageView } from './CoursesStageView';
import { FindingSquadView } from './FindingSquadView';
import { InternshipError, InternshipLoading, InternshipNotice } from './InternshipStates';
import { InterviewReviewView } from './InterviewReviewView';
import { SquadReadyView } from './SquadReadyView';

// The learner's internship journey step, from their enrollment, interview, courses and squad
// (useInternship).
export default function InternshipDashboard() {
  const { t } = useTranslation();
  const { status, data, errorKey, reload } = useInternship();

  if (status === 'loading') return <InternshipLoading />;
  if (status === 'error') return <InternshipError errorKey={errorKey} onRetry={reload} />;
  if (!data) {
    return (
      <InternshipNotice
        title={t('dashboard.internship.noneTitle')}
        body={t('dashboard.internship.noneBody')}
        to={ROUTES.onboarding}
        cta={t('dashboard.internship.noneCta')}
      />
    );
  }

  const { state, stateId } = data;
  return (
    <div className="flex min-w-0 flex-col gap-6">
      {state.stepper && <JourneyStepper stepper={state.stepper} />}
      {/* Keyed on the step so a new step fades in. Same flex gap as the parent: some views
          return fragments that rely on it. */}
      <div key={stateId} className="db-page-enter flex min-w-0 flex-col gap-6">
        {state.kind === 'courses' && <CoursesStageView state={state} percent={data.coursesPercent ?? 0} />}
        {state.kind === 'interviewReview' && <InterviewReviewView />}
        {state.kind === 'waiting' && <FindingSquadView state={state} internship={data} />}
        {state.kind === 'squad' && data.squad && <SquadReadyView squad={data.squad} />}
      </div>
    </div>
  );
}
