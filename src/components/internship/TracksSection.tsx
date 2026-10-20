import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { TFunction } from 'i18next'
import arrowRightPurple from '../../assets/internship/arrow-right-purple.svg'
import { CategoryFilters, TrackSearchForm } from './FilterBar'
import TrackCard from './TrackCard'
import { TRACKS } from './mockData'
import type { Track, TrackFilter } from './mockData'

interface TracksSectionProps {
  onSelectTrack: (trackId: string) => void
  onSeeAllTracks: () => void
}

// Searches the text the user actually sees, so queries work in the current language.
function matchesQuery(track: Track, query: string, t: TFunction): boolean {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return true
  const base = `internshipPage.tracks.items.${track.contentKey}`
  return [t(`${base}.title`), t(`${base}.tag`), t(`${base}.instructor`)].some((value) =>
    value.toLowerCase().includes(normalized),
  )
}

function TracksSection({ onSelectTrack, onSeeAllTracks }: TracksSectionProps) {
  const { t } = useTranslation()
  const [query, setQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState<TrackFilter>('all')

  const visibleTracks = TRACKS.filter(
    (track) => (activeFilter === 'all' || track.category === activeFilter) && matchesQuery(track, query, t),
  )

  const resetFilters = () => {
    setQuery('')
    setActiveFilter('all')
  }

  return (
    <section aria-labelledby="choose-track-heading" className="flex flex-col gap-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-12 reveal-on-scroll">
        <div className="flex max-w-[823px] flex-col gap-3">
          <h2
            id="choose-track-heading"
            className="text-[28px] leading-9 font-extrabold text-[#111827] sm:text-4xl sm:leading-10"
          >
            {t('internshipPage.tracks.title')}
          </h2>
          <p className="pt-1 text-base leading-7 text-[#6b7280] sm:text-lg">{t('internshipPage.tracks.description')}</p>
        </div>
        <TrackSearchForm query={query} onQueryChange={setQuery} />
      </div>

      <div className="reveal-on-scroll reveal-delay-100">
        <CategoryFilters activeFilter={activeFilter} onFilterChange={setActiveFilter} />
      </div>

      <p className="sr-only" aria-live="polite">
        {t('internshipPage.tracks.shown', { value: visibleTracks.length })}
      </p>

      {visibleTracks.length > 0 ? (
        <ul className="grid grid-cols-1 justify-center gap-x-8 gap-y-[45px] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visibleTracks.map((track, idx) => {
            const delayClass =
              idx === 0
                ? 'reveal-delay-100'
                : idx === 1
                ? 'reveal-delay-150'
                : idx === 2
                ? 'reveal-delay-200'
                : idx === 3
                ? 'reveal-delay-250'
                : 'reveal-delay-300'
            return (
              <li key={track.id} className={`flex justify-center reveal-on-scroll ${delayClass}`}>
                <TrackCard track={track} onSelect={onSelectTrack} />
              </li>
            )
          })}
        </ul>
      ) : (
        <div className="flex flex-col items-center gap-4 rounded-[30px] bg-white px-6 py-12 text-center">
          <p className="text-lg font-bold text-[#111827]">{t('internshipPage.tracks.emptyTitle')}</p>
          <p className="text-base text-[#6b7280]">{t('internshipPage.tracks.emptyHint')}</p>
          <button
            type="button"
            onClick={resetFilters}
            className="rounded-full border-2 border-[#5a198f]/60 px-6 py-3 text-sm font-semibold text-[#5a198f] hover:bg-[#ebdef9]"
          >
            {t('internshipPage.tracks.clearFilters')}
          </button>
        </div>
      )}

      <button
        type="button"
        onClick={onSeeAllTracks}
        className="mx-auto mt-[13px] flex items-center gap-2 rounded-full border-2 border-[rgba(90,25,143,0.6)] px-7 py-4 text-base leading-6 font-semibold text-[#5a198f] shadow-[0_0_45px_0_rgba(0,0,0,0.54)] transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5a198f]"
      >
        {t('internshipPage.tracks.seeAll')}
        <img alt="" src={arrowRightPurple} className="rtl:-scale-x-100" />
      </button>
    </section>
  )
}

export default TracksSection
