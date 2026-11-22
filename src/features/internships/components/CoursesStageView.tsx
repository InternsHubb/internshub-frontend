import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import arrowRight from '@/assets/dashboard/ic-arrow-right-white.svg';
import lockIcon from '@/assets/dashboard/ic-stage-lock.svg';
import completedIllustration from '@/assets/dashboard/illus-courses-completed.png';
import { ROUTES } from '@/app/routes';
import type { CoursesState } from '@/features/internships/data/internshipDashboard';
import { LockedCoursesIllustration } from '@/shared/components/common/LockedCoursesIllustration';

// Course stage of the 6- and 12-month internship journey ("6 and 12 months", 35:9387):
//   inProgress — "internship plan 6 or 12 incase uncompleted courses" (35:9388): the three
//     journey stages with the required-courses progress; "Continue Your Courses" opens Courses.
//   completed — "completed courses" (35:9544). The technical interview has no dashboard
//     screen yet, so "Start Technical Interview" is shown but not available.
// The lock artwork is the same five-layer group as the Courses empty state.

const CTA =
  'flex min-h-[50px] w-full items-center justify-center gap-[9px] rounded-[13px] bg-[linear-gradient(177deg,#4c0585_0%,#3a0353_100%)] px-6 text-[13px] font-bold tracking-[0.13px] text-white shadow-[0_10px_11px_rgba(58,3,83,0.2)] outline-none transition focus-visible:ring-2 focus-visible:ring-[#5a198f] focus-visible:ring-offset-2';

function StageDot({ size }: { size: 'lg' | 'sm' }) {
  return (
    <span
      aria-hidden="true"
      className={`flex shrink-0 items-center justify-center rounded-full border border-[rgba(124,92,255,0.4)] bg-[rgba(124,92,255,0.15)] ${size === 'lg' ? 'size-7' : 'size-5'}`}
    >
      <span className={`rounded-full bg-[#22023c] ${size === 'lg' ? 'size-2' : 'size-1.5'}`} />
    </span>
  );
}

function LockedStage({ title, lockTitle, lockHint }: { title: string; lockTitle: string; lockHint: string }) {
  return (
    <li className="flex flex-col gap-2">
      <h3 className="flex items-center gap-2 text-sm font-semibold leading-5 text-[#22023c]">
        <StageDot size="sm" />
        {title}
      </h3>
      <div className="flex items-start gap-2 py-2.5 pe-2.5">
        <span aria-hidden="true" className="flex size-8 shrink-0 items-center justify-center rounded-[6px] border border-[#8b5db0] bg-[#f4f0f8]">
          <img src={lockIcon} alt="" width={10.5} height={12} />
        </span>
        <div className="flex min-w-0 flex-col gap-2">
          <p className="text-sm leading-5 text-[#22023c]">{lockTitle}</p>
          <p className="text-xs leading-4 text-[#4b5563]">{lockHint}</p>
        </div>
      </div>
    </li>
  );
}

// `percent`: share of the track's lessons completed ("Required track courses", 35:9504).
function CoursesInProgress({ percent }: { percent: number }) {
  const { t } = useTranslation();
  const k = (key: string) => t(`dashboard.coursesStage.inProgress.${key}`);

  return (
    <section aria-labelledby="courses-stage-title" className="mx-auto flex w-full max-w-[901px] flex-col items-center gap-4 text-center">
      <LockedCoursesIllustration className="max-w-[672px]" />
      <h1 id="courses-stage-title" className="text-2xl font-semibold text-black sm:text-[32px]">{k('title')}</h1>
      <p className="text-lg font-medium text-[#8b8b8b] sm:text-2xl">{k('description')}</p>

      <ol className="flex w-full flex-col gap-4 rounded-[36px] bg-white p-4 text-start drop-shadow-[0_4px_2px_rgba(0,0,0,0.25)]">
        <li className="flex flex-col gap-2">
          <div className="flex flex-col gap-6">
            <h2 className="flex items-start gap-2 text-lg font-bold leading-7 tracking-[-0.07px] text-[#22023c]">
              <StageDot size="lg" />
              {k('stage1')}
            </h2>
            <p className="text-xs font-semibold leading-5 text-[#22023c]">{k('requiredTrack')}</p>
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <div
                role="progressbar"
                aria-label={k('requiredTrack')}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={percent}
                className="h-2 flex-1 overflow-hidden rounded-full border border-[#ae8fc8] bg-[#f4f0f8]"
              >
                <div
                  className="h-full rounded-full bg-[linear-gradient(90deg,#3b0454_0%,#7a3d9c_100%)] rtl:bg-[linear-gradient(270deg,#3b0454_0%,#7a3d9c_100%)]"
                  style={{ width: `${percent}%` }}
                />
              </div>
              <span className="w-[34px] shrink-0 text-xs leading-4 text-[#22023c]">{t('dashboard.common.percent', { value: percent })}</span>
            </div>
            <p className="text-xs leading-4 text-[#6b7280]">{k('continueLearning')}</p>
          </div>
        </li>
        <LockedStage title={k('stage2')} lockTitle={k('stage2Locked')} lockHint={k('stage2Hint')} />
        <LockedStage title={k('stage3')} lockTitle={k('stage3Locked')} lockHint={k('stage3Hint')} />
      </ol>

      <Link to={ROUTES.dashboardCourses} className={`${CTA} hover:brightness-110`}>
        {k('cta')}
        <img src={arrowRight} alt="" aria-hidden="true" className="size-5 rtl:-scale-x-100" />
      </Link>
    </section>
  );
}

function CoursesCompleted() {
  const { t } = useTranslation();
  const k = (key: string) => t(`dashboard.coursesStage.completed.${key}`);

  return (
    <section aria-labelledby="courses-stage-title" className="mx-auto flex w-full max-w-[901px] flex-col items-center gap-4 pt-4 text-center">
      <img src={completedIllustration} alt="" width={454} height={429} className="h-auto w-full max-w-[454px]" />
      <h1 id="courses-stage-title" className="text-2xl font-semibold text-black sm:text-[32px]">{k('title')}</h1>
      <p className="text-lg font-medium text-[#8b8b8b] sm:text-2xl">{k('description')}</p>
      <button type="button" disabled title={k('unavailable')} className={`${CTA} cursor-not-allowed opacity-60`}>
        {k('cta')}
        <img src={arrowRight} alt="" aria-hidden="true" className="size-5 rtl:-scale-x-100" />
      </button>
      <p className="text-xs text-[#6b7280]">{k('unavailable')}</p>
    </section>
  );
}

export function CoursesStageView({ state, percent }: { state: CoursesState; percent: number }) {
  return state.status === 'inProgress' ? <CoursesInProgress percent={percent} /> : <CoursesCompleted />;
}

export default CoursesStageView;
