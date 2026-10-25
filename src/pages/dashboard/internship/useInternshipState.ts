import { useSearchParams } from 'react-router-dom';

import {
  DEFAULT_INTERNSHIP_STATE,
  INTERNSHIP_STATES,
  type InternshipState,
  type InternshipStateId,
} from '@/data/internshipDashboard';
import { internshipPlan, PACKAGE_JOURNEYS, type InternshipPlan } from '@/data/internshipPackages';

// URL-driven previews until the internship API supplies each package's journey.
export function useInternshipState(): { stateId: InternshipStateId; state: InternshipState; plan: InternshipPlan } {
  const [searchParams] = useSearchParams();
  const requested = searchParams.get('state');
  const stateId = requested && Object.hasOwn(INTERNSHIP_STATES, requested)
    ? requested as InternshipStateId
    : DEFAULT_INTERNSHIP_STATE;
  const plan = internshipPlan(searchParams);
  const state: InternshipState = PACKAGE_JOURNEYS[plan][stateId];
  return { stateId, state, plan };
}
