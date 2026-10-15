import { useId } from 'react'
import type { FormEvent } from 'react'
import iconGrid from '../../assets/internship/icon-grid.svg'
import iconSearch from '../../assets/internship/icon-search.svg'
import { cn } from './cn'
import { TRACK_FILTERS } from './mockData'
import type { TrackFilter } from './mockData'

interface TrackSearchFormProps {
  query: string
  onQueryChange: (query: string) => void
}

export function TrackSearchForm({ query, onQueryChange }: TrackSearchFormProps) {
  const inputId = useId()

  // Results already update while typing; submitting only keeps the page from reloading.
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
  }

  return (
    <form role="search" onSubmit={handleSubmit} className="relative h-11 w-full lg:w-[430px]">
      <label htmlFor={inputId} className="sr-only">
        Search tracks
      </label>
      <img alt="" src={iconSearch} className="pointer-events-none absolute start-4 top-1/2 -translate-y-1/2" />
      <input
        id={inputId}
        type="search"
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        placeholder="Search tracks...."
        className="size-full rounded-3xl border border-[#e4e7ec] bg-white ps-12 pe-[112px] text-sm font-medium text-[#111827] shadow-[0_1px_2px_0_rgba(16,24,40,0.05)] outline-none placeholder:text-[#98a2b3] focus-visible:border-[#5a198f] focus-visible:ring-2 focus-visible:ring-[#5a198f]/20"
      />
      <button
        type="submit"
        className="absolute end-0 top-0 flex h-11 w-[102px] items-center justify-center rounded-3xl border border-[#e4e7ec] bg-[#3a0353] text-xs leading-4 font-bold text-white transition-colors hover:bg-[#5a198f]"
      >
        Search
      </button>
    </form>
  )
}

interface CategoryFiltersProps {
  activeFilter: TrackFilter
  onFilterChange: (filter: TrackFilter) => void
}

export function CategoryFilters({ activeFilter, onFilterChange }: CategoryFiltersProps) {
  return (
    <div role="group" aria-label="Filter tracks by category" className="flex flex-wrap items-center gap-2">
      {TRACK_FILTERS.map((filter) => {
        const isActive = filter.value === activeFilter
        return (
          <button
            key={filter.value}
            type="button"
            aria-pressed={isActive}
            onClick={() => onFilterChange(filter.value)}
            className={cn(
              'flex h-[51px] items-center justify-center gap-[10px] rounded-3xl px-[11px] text-base leading-7 font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5a198f]',
              isActive ? 'bg-[#3a0353] text-white' : 'bg-white text-[#2f2a24] hover:bg-[#ebdef9]',
            )}
          >
            {filter.value === 'all' && (
              <img alt="" src={iconGrid} className={cn(!isActive && 'brightness-0 opacity-80')} />
            )}
            {filter.label}
          </button>
        )
      })}
    </div>
  )
}
