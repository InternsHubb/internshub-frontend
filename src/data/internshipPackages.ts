import { INTERNSHIP_STATES, type InternshipState } from './internshipDashboard';

export type InternshipPlan = '3m' | '6m' | '12m';

// Each package owns its journey settings; visual components remain shared.
export const INTERNSHIP_PACKAGES = {
  '3m': { months: 3, withCourses: false, packageCard: 'timeline' },
  '6m': { months: 6, withCourses: true, packageCard: 'timeline' },
  '12m': { months: 12, withCourses: true, packageCard: 'active' },
} as const;

export function internshipPlan(params: URLSearchParams): InternshipPlan {
  const plan = params.get('plan');
  if (plan === '3m' || plan === '6m' || plan === '12m') return plan;
  return params.get('state')?.startsWith('courses-') ? '6m' : '3m';
}

export function packageJourney(plan: InternshipPlan): Record<string, InternshipState> {
  const config = INTERNSHIP_PACKAGES[plan];
  return Object.fromEntries(Object.entries(INTERNSHIP_STATES).map(([id, original]) => {
    const state: InternshipState = { ...original };
    if (state.stepper) {
      const originallyWithCourses = Boolean(state.stepper.withCourses);
      const currentIndex = state.stepper.currentIndex + Number(config.withCourses) - Number(originallyWithCourses);
      state.stepper = { firstNumber: 1, currentIndex: Math.max(0, currentIndex), withCourses: config.withCourses };
    }
    if (state.kind === 'waiting') {
      state.packageMonths = config.months;
      state.packageCard = config.packageCard;
    }
    if (config.withCourses && state.kind !== 'courses' && state.kind !== 'interviewReview') {
      state.requiredCourses = { percent: 100, status: 'unlocked' };
    }
    if (!config.withCourses) delete state.requiredCourses;
    return [id, state];
  }));
}

export const PACKAGE_JOURNEYS = {
  '3m': packageJourney('3m'),
  '6m': packageJourney('6m'),
  '12m': packageJourney('12m'),
};
