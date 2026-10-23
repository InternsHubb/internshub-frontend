import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { ROUTES } from '@/constants/routes';

import { CoursesEmptyState } from './CoursesEmptyState';

// Courses page for a 3-month package ("courses 3m plan", 30:446). The package includes no
// courses, so the page is the locked empty state. There is no courses API yet.
export default function CoursesPage() {
  const { t } = useTranslation();

  return (
    <CoursesEmptyState variant="locked">
      {/* Figma has no link from this frame to the plans frame (30:179); this one makes it reachable. */}
      <Link
        to={ROUTES.dashboardPlans}
        className="mt-8 inline-flex min-h-[45px] items-center justify-center rounded-full bg-[#5a1a8f] px-8 text-base font-medium text-white shadow-[0_10px_22px_rgba(90,26,143,0.25)] outline-none transition hover:bg-[#4e0f7c] focus-visible:ring-2 focus-visible:ring-[#5a198f] focus-visible:ring-offset-2"
      >
        {t('dashboard.courses.empty.viewPlans')}
      </Link>
    </CoursesEmptyState>
  );
}
