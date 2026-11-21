import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { JourneyStepper } from '@/features/internships/components/JourneyStepper';
import {
  COURSES_JOURNEY_STEPS,
  INTERNSHIP_STATES,
  JOURNEY_STEPS,
  type InternshipState,
  type WaitingState,
} from '@/features/internships/data/internshipDashboard';
import { useInternship, type InternshipData } from '@/features/internships/hooks/useInternship';
import type { SquadDetailsDto } from '@/features/internships/types/internships.types';

import { CoursesStageView } from '@/features/internships/components/CoursesStageView';
import { FindingSquadView } from '@/features/internships/components/FindingSquadView';
import { InternshipError, InternshipLoading } from '@/features/internships/components/InternshipStates';
import { InterviewReviewView } from '@/features/internships/components/InterviewReviewView';
import { ProjectWorkspace, sampleActiveSquad } from '@/features/internships/pages/ProjectPage';
import { SquadReadyView } from '@/features/internships/components/SquadReadyView';

const sampleSquad: SquadDetailsDto = {
  id: 'sample-squad-1',
  trackId: 'track-fe',
  trackName: 'Frontend Development',
  trackCode: 'FE',
  level: 'Mid',
  status: 'Forming',
  seniorUserId: 'senior-1',
  seniorName: 'Ahmed Hassan',
  seniorEmail: 'ahmed@example.com',
  repositoryUrl: null,
  startedAt: null,
  createdAt: new Date().toISOString(),
  members: [
    { userId: '1', fullName: 'Sara Mohamed', email: 'sara@example.com', joinedAt: new Date().toISOString() },
    { userId: '2', fullName: 'Omar Ali', email: 'omar@example.com', joinedAt: new Date().toISOString() },
    { userId: '3', fullName: 'Nour Kassem', email: 'nour@example.com', joinedAt: new Date().toISOString() },
  ],
};

const fallbackInternshipData: InternshipData = {
  enrollment: {
    id: 'sample-enrollment',
    userId: 'user-1',
    packageId: 'pkg-3m',
    packageCode: '3M',
    trackId: 'track-fe',
    trackCode: 'FE',
    source: 'Purchase',
    status: 'Active',
    paidAt: new Date().toISOString(),
    startedAt: new Date().toISOString(),
    endsAt: null,
    chosenAt: new Date().toISOString(),
  },
  plan: '3m',
  months: 3,
  trackName: 'Frontend Development',
  level: 'Mid',
  waitingSince: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  squad: sampleSquad,
  coursesPercent: 100,
  stateId: 'interview-review',
  state: INTERNSHIP_STATES['interview-review'],
};

// The learner's internship journey step, from their enrollment, interview, courses and squad
// (useInternship), with query parameter support (?step=) so stages can be clicked and tested.
export default function InternshipDashboard() {
  const { t: _t } = useTranslation();
  const [searchParams] = useSearchParams();
  const stepParam = searchParams.get('step');
  const { status, data: apiData, errorKey, reload } = useInternship();

  if (status === 'loading' && !stepParam && !apiData) return <InternshipLoading />;
  if (status === 'error' && !stepParam && !apiData) return <InternshipError errorKey={errorKey} onRetry={reload} />;

  const data = apiData || fallbackInternshipData;
  const withCourses = data.plan !== '3m';
  const steps: ReadonlyArray<string> = withCourses ? COURSES_JOURNEY_STEPS : JOURNEY_STEPS;
  const stepIndex = (step: string) => Math.max(0, steps.indexOf(step));

  let effectiveState: InternshipState = data.state;
  let effectiveStateId: string = data.stateId;

  if (stepParam === 'courses') {
    effectiveStateId = 'courses-in-progress';
    effectiveState = {
      ...INTERNSHIP_STATES['courses-in-progress'],
      stepper: { firstNumber: 1, currentIndex: stepIndex('courses'), withCourses: true },
    };
  } else if (stepParam === 'technicalInterview' || stepParam === 'interviewReview') {
    effectiveStateId = 'interview-review';
    effectiveState = {
      ...INTERNSHIP_STATES['interview-review'],
      stepper: { firstNumber: 1, currentIndex: stepIndex('technicalInterview'), withCourses },
    };
  } else if (stepParam === 'waitingForSquad' || stepParam === 'waiting') {
    effectiveStateId = 'finding-squad';
    effectiveState = {
      ...INTERNSHIP_STATES['finding-squad'],
      stepper: { firstNumber: 1, currentIndex: stepIndex('waitingForSquad'), withCourses },
    };
  } else if (stepParam === 'squadReady' || stepParam === 'squad') {
    effectiveStateId = 'squad-all-ready';
    effectiveState = {
      ...INTERNSHIP_STATES['squad-all-ready'],
      stepper: { firstNumber: 1, currentIndex: stepIndex('squadReady'), withCourses },
    };
  } else if (stepParam === 'project') {
    effectiveStateId = 'project';
    effectiveState = {
      kind: 'project',
      stepper: { firstNumber: 1, currentIndex: stepIndex('project'), withCourses },
    };
  }

  const effectiveSquad = data.squad || sampleSquad;
  const activeSquad = {
    ...(data.squad || sampleActiveSquad),
    status: 'Active' as const,
    repositoryUrl: data.squad?.repositoryUrl || 'https://github.com/internshub/frontend-squad-project',
  };

  return (
    <div className="flex min-w-0 flex-col gap-6">
      {effectiveState.stepper && <JourneyStepper stepper={effectiveState.stepper} />}
      {/* Keyed on the step so a new step fades in. */}
      <div key={effectiveStateId} className="db-page-enter flex min-w-0 flex-col gap-6">
        {effectiveState.kind === 'courses' && <CoursesStageView state={effectiveState} percent={data.coursesPercent ?? 0} />}
        {effectiveState.kind === 'interviewReview' && <InterviewReviewView />}
        {effectiveState.kind === 'waiting' && <FindingSquadView state={effectiveState as WaitingState} internship={data} />}
        {effectiveState.kind === 'squad' && <SquadReadyView squad={effectiveSquad} />}
        {effectiveState.kind === 'project' && <ProjectWorkspace squad={activeSquad} />}
      </div>
    </div>
  );
}
