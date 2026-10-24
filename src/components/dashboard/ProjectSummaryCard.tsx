import { useTranslation } from 'react-i18next';

import scrollIcon from '@/assets/dashboard/ic-scroll.svg';
import projectIllustration from '@/assets/dashboard/illus-project.png';
import { SAMPLE_PROJECT } from '@/data/internshipDashboard';
import { cn } from '@/lib/cn';

import { ACTION_BUTTON, CARD } from './primitives';

// "Your project" pill (shared by the squad project card and the project page header).
export function YourProjectPill() {
  const { t } = useTranslation();
  return (
    <span className="inline-flex w-fit items-center gap-2 rounded-2xl bg-[#f3e9fa] p-2">
      <img src={scrollIcon} alt="" aria-hidden="true" className="size-6" />
      <span className="text-sm font-medium leading-[15px] text-[#8037be]">{t('dashboard.project.yourProject')}</span>
    </span>
  );
}

// Project card at the bottom of the squad screens ("squad completed", 31:33056).
export function ProjectSummaryCard() {
  const { t } = useTranslation();

  return (
    <section aria-labelledby="squad-project-title" className={cn(CARD, 'flex flex-col gap-4 p-4 sm:flex-row sm:px-[25px]')}>
      <img
        src={projectIllustration}
        alt=""
        aria-hidden="true"
        className="h-[252px] w-full shrink-0 rounded-sm object-cover sm:w-[249px]"
      />
      <div className="flex min-w-0 flex-1 flex-col justify-between gap-[29px]">
        <div className="flex flex-col gap-4">
          <YourProjectPill />
          <div className="flex flex-col gap-4">
            <h2 id="squad-project-title" className="text-2xl font-semibold leading-tight text-black sm:text-[32px]">
              <bdi>{SAMPLE_PROJECT.name}</bdi>
            </h2>
            <p className="text-sm font-medium leading-[15px] text-[#737373]"><bdi>{SAMPLE_PROJECT.description}</bdi></p>
            <p className="text-sm font-medium leading-[15px] text-black">
              <span className="text-base font-semibold">{t('dashboard.project.durationLabel')}</span>{' '}
              {t('dashboard.project.durationValue', { count: SAMPLE_PROJECT.sprintCount })}
            </p>
          </div>
        </div>
        {/* Status, not an action: the Senior starts the project. */}
        <p
          role="status"
          className={cn(ACTION_BUTTON, 'bg-[#e7e7e7] text-[#676767] drop-shadow-[0_10px_11px_rgba(58,3,83,0.2)]')}
        >
          {t('dashboard.project.startsSoon')}
        </p>
      </div>
    </section>
  );
}

export default ProjectSummaryCard;
