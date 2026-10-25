import { RequiredCoursesCard } from '@/components/dashboard/RequiredCoursesCard';
import { useInternship } from '@/hooks/useInternship';

// Sidebar footer of the internship and project pages: the "Required Courses Progress" card for
// the 6- and 12-month packages ("6 and 12 months", 35:9387); 3-month packages have none.
export function InternshipSidebarFooter() {
  const { data } = useInternship();
  const progress = data?.state.requiredCourses;
  return progress ? <RequiredCoursesCard progress={progress} /> : null;
}

export const ProjectSidebarFooter = InternshipSidebarFooter;

export default InternshipSidebarFooter;
