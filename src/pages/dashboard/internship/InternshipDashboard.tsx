import { JourneyStepper } from '@/components/dashboard/JourneyStepper';

import { CoursesStageView } from './CoursesStageView';
import { FindingSquadView } from './FindingSquadView';
import { InterviewReviewView } from './InterviewReviewView';
import { SquadReadyView } from './SquadReadyView';
import { useInternshipState } from './useInternshipState';

export default function InternshipDashboard() {
  const { stateId, state } = useInternshipState();

  return (
    <div className="flex min-w-0 flex-col gap-6">
      {state.stepper && <JourneyStepper stepper={state.stepper} />}
      {state.kind === 'courses' && <CoursesStageView state={state} />}
      {state.kind === 'interviewReview' && <InterviewReviewView />}
      {state.kind === 'waiting' && <FindingSquadView key={stateId} state={state} />}
      {state.kind === 'squad' && <SquadReadyView key={stateId} state={state} />}
    </div>
  );
}
