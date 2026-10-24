import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import { cn } from '@/lib/cn';

import { LockedCoursesIllustration } from './LockedCoursesIllustration';

// "Courses Not Included in Your Plan" block. The courses page shows the short grey copy
// (30:446); the plans page shows the dark title and the longer upgrade copy (30:179).
export function CoursesEmptyState({ variant, children }: { variant: 'locked' | 'upgrade'; children?: ReactNode }) {
  const { t } = useTranslation();
  const isUpgrade = variant === 'upgrade';

  return (
    <section aria-labelledby="courses-empty-title" className="flex flex-col items-center text-center">
      <LockedCoursesIllustration className={cn('max-w-[669px]', isUpgrade ? 'mt-2 sm:mt-10' : 'mt-6 sm:mt-[136px]')} />
      <h1
        id="courses-empty-title"
        className={cn(
          'mt-8 text-2xl font-semibold leading-tight sm:text-[32px]',
          isUpgrade ? 'text-[#111]' : 'text-[#4d4d4d]',
        )}
      >
        {t('dashboard.courses.empty.title')}
      </h1>
      <p className="mt-4 max-w-[880px] text-lg leading-snug text-[#8c8c8c] sm:text-2xl">
        {t(isUpgrade ? 'dashboard.courses.empty.upgradeDescription' : 'dashboard.courses.empty.description')}
      </p>
      {children}
    </section>
  );
}

export default CoursesEmptyState;
