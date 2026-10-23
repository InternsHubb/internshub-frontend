import { useSearchParams } from 'react-router-dom';

import {
  DEFAULT_INTERNSHIP_STATE,
  INTERNSHIP_STATES,
  type InternshipState,
  type InternshipStateId,
} from '@/data/internshipDashboard';

// The internship page state, picked with `?state=<id>` until the API decides it. The 6- and
// 12-month frames all read "6 Months"; `&plan=12m` shows the same journey as 12 Months.
export function useInternshipState(): { stateId: InternshipStateId; state: InternshipState } {
  const [searchParams] = useSearchParams();
  const requested = searchParams.get('state');
  const stateId = requested && Object.hasOwn(INTERNSHIP_STATES, requested)
    ? requested as InternshipStateId
    : DEFAULT_INTERNSHIP_STATE;
  const state: InternshipState = INTERNSHIP_STATES[stateId];

  if (state.kind === 'waiting' && state.stepper.withCourses && searchParams.get('plan') === '12m') {
    return { stateId, state: { ...state, packageMonths: 12 } };
  }
  return { stateId, state };
}
