import { Check, Loader2 } from 'lucide-react';
import { Select } from 'radix-ui';
import { useTranslation } from 'react-i18next';

import sprintChevronIcon from '@/assets/dashboard/ic-sprint-chevron.svg';
import sprintNoteIcon from '@/assets/dashboard/ic-sprint-note.svg';
import type { SprintStatus, SprintSummaryDto } from '@/features/internships/types/internships.types';
import { cn } from '@/shared/utils/cn';

// Sprint picker on the project page: the bordered field from the design, opening a list of the
// squad's sprints with their dates and status. `isLoading` while the picked sprint's board loads.

const STATUS_PILL: Record<SprintStatus, string> = {
  Active: 'bg-[#f6ebff] text-[#42046b]',
  Completed: 'bg-[#d4fadc] text-[#068f2f]',
  Planning: 'bg-[#e7e7e7] text-[#545454]',
};

type SprintSelectProps = {
  sprints: SprintSummaryDto[];
  value: string;
  onChange: (sprintId: string) => void;
  isLoading: boolean;
};

export function SprintSelect({ sprints, value, onChange, isLoading }: SprintSelectProps) {
  const { t, i18n } = useTranslation();
  const ordered = [...sprints].sort((a, b) => a.number - b.number);
  const selected = ordered.find((sprint) => sprint.id === value);
  const formatDay = (iso: string, withYear: boolean) =>
    new Intl.DateTimeFormat(i18n.language, { month: 'short', day: 'numeric', ...(withYear && { year: 'numeric' }) }).format(new Date(iso));
  const label = (sprint: SprintSummaryDto) =>
    t(sprint.status === 'Active' ? 'dashboard.sprint.current' : 'dashboard.sprint.option', { number: sprint.number });

  return (
    <Select.Root value={value} onValueChange={onChange} dir={i18n.dir()}>
      <Select.Trigger
        aria-label={t('dashboard.sprint.select')}
        aria-busy={isLoading}
        className="group flex min-h-[52px] w-full cursor-pointer items-center gap-2 rounded-[20px] border border-[#909090] bg-white px-4 text-start outline-none transition hover:border-[#42046b] focus-visible:border-[#42046b] focus-visible:ring-2 focus-visible:ring-[#5a198f]/40 data-[state=open]:border-[#42046b]"
      >
        <img src={sprintNoteIcon} alt="" aria-hidden="true" className="size-6 shrink-0" />
        <span className="min-w-0 flex-1 truncate text-base font-bold text-[#1f2937]">
          <Select.Value>{selected ? label(selected) : null}</Select.Value>
        </span>
        {isLoading && <Loader2 aria-hidden="true" className="size-5 shrink-0 animate-spin text-[#42046b]" />}
        <Select.Icon asChild>
          <img src={sprintChevronIcon} alt="" aria-hidden="true" className="h-[21.5px] w-[25px] shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content
          position="popper"
          sideOffset={8}
          className="z-50 max-h-[min(360px,var(--radix-select-content-available-height))] w-[var(--radix-select-trigger-width)] overflow-hidden rounded-[20px] border border-[#e9dcf8] bg-white p-1.5 shadow-[0_12px_32px_rgba(34,2,60,0.16)]"
        >
          <Select.Viewport className="flex flex-col gap-1">
            {ordered.map((sprint) => (
              <Select.Item
                key={sprint.id}
                value={sprint.id}
                className="flex cursor-pointer select-none items-center gap-3 rounded-[14px] px-3 py-2.5 outline-none transition-colors data-[highlighted]:bg-[#f6ebff] data-[state=checked]:bg-[#f4f0f8]"
              >
                <span className="flex min-w-0 flex-1 flex-col">
                  <Select.ItemText>
                    <span className="text-sm font-bold text-[#22023c]">{t('dashboard.sprint.option', { number: sprint.number })}</span>
                  </Select.ItemText>
                  <span className="text-[11px] font-medium text-[#828282]">
                    {t('dashboard.sprint.dates', { start: formatDay(sprint.startsAt, false), end: formatDay(sprint.endsAt, true) })}
                  </span>
                </span>
                <span className={cn('shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold', STATUS_PILL[sprint.status])}>
                  {t(sprint.status === 'Active' ? 'dashboard.sprint.currentBadge' : `dashboard.sprint.statuses.${sprint.status}`)}
                </span>
                <span className="flex size-4 shrink-0 items-center justify-center">
                  <Select.ItemIndicator>
                    <Check aria-hidden="true" className="size-4 text-[#42046b]" />
                  </Select.ItemIndicator>
                </span>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}

export default SprintSelect;
