import type { InternshipData } from '@/hooks/useInternship';

// The Dashboard home's journey, derived from the internship journey state (useInternship):
// the six steps of the "Learner dashboard" reference, without the course steps for
// packages that include no courses (3 months).

export type JourneyStepStatus = 'done' | 'current' | 'upcoming';
export type JourneyStepId = 'payment' | 'aiInterview' | 'courses' | 'technicalInterview' | 'internship' | 'recruitment';
export type LearnerJourneyStep = { id: JourneyStepId; status: JourneyStepStatus };

const WITH_COURSES: ReadonlyArray<JourneyStepId> = ['payment', 'aiInterview', 'courses', 'technicalInterview', 'internship', 'recruitment'];
const WITHOUT_COURSES: ReadonlyArray<JourneyStepId> = ['payment', 'aiInterview', 'internship', 'recruitment'];

// Where the learner is now: dashboard.home.next.<key> and dashboard.home.hub.internship.details.<key>.
export type NextKey = 'courses' | 'technicalInterview' | 'review' | 'findingSquad' | 'squadForming' | 'squadActive';

export function nextKeyFor(data: InternshipData): NextKey {
  switch (data.stateId) {
    case 'courses-in-progress':
      return 'courses';
    case 'courses-completed':
      return 'technicalInterview';
    case 'interview-review':
    case 'courses-interview-review':
      return 'review';
    case 'finding-squad':
    case 'courses-finding-squad':
      return 'findingSquad';
    case 'squad-ready-check':
      return 'squadForming';
    default:
      return 'squadActive';
  }
}

function currentStep(data: InternshipData): JourneyStepId {
  const next = nextKeyFor(data);
  if (next === 'courses') return 'courses';
  if (next === 'technicalInterview') return 'technicalInterview';
  // A 3-month package goes from the AI interview straight to the internship.
  if (next === 'review') return data.plan === '3m' ? 'aiInterview' : 'technicalInterview';
  return 'internship';
}

export function journeyFor(data: InternshipData): LearnerJourneyStep[] {
  const ids = data.plan === '3m' ? WITHOUT_COURSES : WITH_COURSES;
  const currentIndex = ids.indexOf(currentStep(data));
  return ids.map((id, index) => ({
    id,
    status: index < currentIndex ? 'done' : index === currentIndex ? 'current' : 'upcoming',
  }));
}
