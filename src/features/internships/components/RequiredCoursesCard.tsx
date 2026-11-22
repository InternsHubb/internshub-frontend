import { useTranslation } from 'react-i18next';

import bookIcon from '@/assets/dashboard/ic-book-white.svg';
import dotGreen from '@/assets/dashboard/ic-dot-green.svg';
import dotRed from '@/assets/dashboard/ic-dot-red.svg';
import dotIcon from '@/assets/dashboard/ic-dot.svg';
import { SAMPLE_REQUIRED_COURSES, type RequiredCoursesProgress, type RequiredCoursesStatus } from '@/features/internships/data/internshipDashboard';

import { ProgressBar, PURPLE_GRADIENT } from '@/features/internships/components/primitives';

// Sidebar footer card "Required Courses Progress": on the project page (Figma "project",
// 31:35263) and in the "6 and 12 months" internship frames (35:9390 and siblings), where the
// status line follows the journey: red "Locked" while courses run, grey "Locked - …" once they
// are done, green "UNLOCKED" while waiting for the squad.

const STATUS_DOTS: Record<RequiredCoursesStatus, string> = {
  locked: dotRed,
  lockedInterview: dotIcon,
  lockedReview: dotIcon,
  unlocked: dotGreen,
};

const DEFAULT_PROGRESS: RequiredCoursesProgress = { percent: SAMPLE_REQUIRED_COURSES.percent, status: 'lockedInterview' };

export function RequiredCoursesCard({ progress = DEFAULT_PROGRESS }: { progress?: RequiredCoursesProgress }) {
  const { t } = useTranslation();
  const { percent, status } = progress;

  return (
    <div className={`flex flex-col gap-2 rounded-[20px] p-4 text-white ${PURPLE_GRADIENT}`}>
      <p className="text-sm font-bold">{t('dashboard.requiredCourses.title')}</p>
      <div className="flex items-end gap-2">
        <img src={bookIcon} alt="" aria-hidden="true" className="size-6" />
        <p className="text-2xl font-bold leading-none">{t('dashboard.common.percent', { value: percent })}</p>
      </div>
      <ProgressBar
        value={percent}
        max={100}
        label={t('dashboard.requiredCourses.title')}
        trackClassName="bg-white/22"
        fillClassName="bg-white"
      />
      <p className="mt-1 flex items-center gap-1.5 text-xs font-medium">
        <img src={STATUS_DOTS[status]} alt="" aria-hidden="true" className="size-1.5" />
        {t(`dashboard.requiredCourses.status.${status}`)}
      </p>
    </div>
  );
}

export default RequiredCoursesCard;
