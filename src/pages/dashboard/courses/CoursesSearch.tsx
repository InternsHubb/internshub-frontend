import { useState, type FormEvent } from 'react';
import { X } from 'lucide-react';
import { Dialog } from 'radix-ui';
import { useTranslation } from 'react-i18next';

import filterIcon from '@/assets/dashboard/filter-search.svg';
import lockedSearch from '@/assets/dashboard/search-locked.svg';
import searchIcon from '@/assets/dashboard/topnav-search.svg';
import { TOP_NAV_SEARCH_BOX } from '@/components/layout/TopNav';

// Courses top-bar search with the filter button ("courses 3m plan"). Courses are not part of
// the 3-month package, so searching or filtering opens the "You can't search right now!"
// popup (30:608) instead of running a search. There is no courses API yet.
export function CoursesSearch() {
  const { t } = useTranslation();
  const [isLockedOpen, setLockedOpen] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLockedOpen(true);
  }

  return (
    <Dialog.Root open={isLockedOpen} onOpenChange={setLockedOpen}>
      <form role="search" onSubmit={handleSubmit} className={`${TOP_NAV_SEARCH_BOX} pe-3 focus-within:ring-2 focus-within:ring-[#5a198f]`}>
        <img src={searchIcon} alt="" aria-hidden="true" className="size-[22px] shrink-0" />
        <label htmlFor="courses-search" className="sr-only">{t('dashboard.courses.search.label')}</label>
        <input
          id="courses-search"
          type="search"
          placeholder={t('dashboard.courses.search.placeholder')}
          className="min-w-0 flex-1 bg-transparent text-sm leading-4 text-[#1f2937] outline-none placeholder:text-[#6b7280]"
        />
        <Dialog.Trigger
          type="button"
          aria-label={t('dashboard.courses.search.filter')}
          title={t('dashboard.courses.search.filter')}
          className="flex size-9 shrink-0 items-center justify-center rounded-full outline-none transition hover:bg-black/5 focus-visible:ring-2 focus-visible:ring-[#5a198f]"
        >
          <img src={filterIcon} alt="" aria-hidden="true" className="size-6" />
        </Dialog.Trigger>
      </form>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-[#1e1e1e]/60 backdrop-blur-[2px]" />
        <Dialog.Content className="fixed inset-0 z-50 m-auto flex h-fit max-h-[calc(100dvh-32px)] w-[min(665px,calc(100vw-32px))] flex-col items-center overflow-y-auto rounded-[36px] bg-[#f4f4f4] px-6 pb-12 pt-14 text-center shadow-[0_8px_32px_rgba(0,0,0,0.25)] outline-none sm:px-10 sm:pb-[134px] sm:pt-[134px]">
          <Dialog.Close
            aria-label={t('dashboard.courses.search.close')}
            className="absolute end-5 top-5 flex size-10 items-center justify-center rounded-full text-[#5c5c5c] outline-none transition hover:bg-black/5 focus-visible:ring-2 focus-visible:ring-[#5a198f]"
          >
            <X aria-hidden="true" className="size-5" />
          </Dialog.Close>
          <img src={lockedSearch} alt="" aria-hidden="true" className="h-auto w-full max-w-[410px]" />
          <Dialog.Title className="mt-4 text-2xl font-medium leading-tight text-[#5c5c5c] sm:text-[32px]">
            {t('dashboard.courses.search.lockedTitle')}
          </Dialog.Title>
          <Dialog.Description className="mt-3 text-base text-[#989898]">
            {t('dashboard.courses.search.lockedDescription')}
          </Dialog.Description>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default CoursesSearch;
