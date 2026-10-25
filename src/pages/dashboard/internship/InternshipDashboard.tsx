import { JourneyStepper } from '@/components/dashboard/JourneyStepper';

import { CoursesStageView } from './CoursesStageView';
import { FindingSquadView } from './FindingSquadView';
import { InterviewReviewView } from './InterviewReviewView';
import { SquadReadyView } from './SquadReadyView';
import { useInternshipState } from './useInternshipState';

export default function InternshipDashboard() {
  const { stateId, state, plan } = useInternshipState();

  return (
    <div className="flex min-w-0 flex-col gap-6">
      {state.stepper && <JourneyStepper stepper={state.stepper} />}
      {/* Keyed on the state so switching journey states fades the new view in. Same flex
          gap as the parent: some views return fragments that rely on it. */}
      <div key={`${plan}-${stateId}`} className="db-page-enter flex min-w-0 flex-col gap-6">
        {state.kind === 'courses' && <CoursesStageView state={state} />}
        {state.kind === 'interviewReview' && <InterviewReviewView />}
        {state.kind === 'waiting' && <FindingSquadView state={state} />}
        {state.kind === 'squad' && <SquadReadyView state={state} />}
      </div>
    </div>
  );
}
