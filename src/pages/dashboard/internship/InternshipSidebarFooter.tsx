import { RequiredCoursesCard } from '@/components/dashboard/RequiredCoursesCard';

import { useInternshipState } from './useInternshipState';

// Sidebar footer of the internship page: the "Required Courses Progress" card in the
// 6- and 12-month states ("6 and 12 months", 35:9387); the 3-month frames have none.
export function InternshipSidebarFooter() {
  const { state } = useInternshipState();
  return state.requiredCourses ? <RequiredCoursesCard progress={state.requiredCourses} /> : null;
}

export default InternshipSidebarFooter;
