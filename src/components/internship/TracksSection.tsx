import { useState } from 'react'
import arrowRightPurple from '../../assets/internship/arrow-right-purple.svg'
import { CategoryFilters, TrackSearchForm } from './FilterBar'
import TrackCard from './TrackCard'
import { TRACKS } from './mockData'
import type { Track, TrackFilter } from './mockData'

interface TracksSectionProps {
  onSelectTrack: (trackId: string) => void
  onSeeAllTracks: () => void
}

function matchesQuery(track: Track, query: string): boolean {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return true
  return [track.title, track.tag, track.instructor].some((value) => value.toLowerCase().includes(normalized))
}

function TracksSection({ onSelectTrack, onSeeAllTracks }: TracksSectionProps) {
  const [query, setQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState<TrackFilter>('all')

  const visibleTracks = TRACKS.filter(
    (track) => (activeFilter === 'all' || track.category === activeFilter) && matchesQuery(track, query),
  )

  const resetFilters = () => {
    setQuery('')
    setActiveFilter('all')
  }

  return (
    <section aria-labelledby="choose-track-heading" className="flex flex-col gap-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
        <div className="flex max-w-[823px] flex-col gap-3">
          <h2
            id="choose-track-heading"
            className="text-[28px] leading-9 font-extrabold text-[#111827] sm:text-4xl sm:leading-10"
          >
            Choose Your Track
          </h2>
          <p className="pt-1 text-base leading-7 text-[#6b7280] sm:text-lg">
            Pick your package and track. We place you in a squad automatically after your interview is confirmed.
          </p>
        </div>
        <TrackSearchForm query={query} onQueryChange={setQuery} />
      </div>

      <CategoryFilters activeFilter={activeFilter} onFilterChange={setActiveFilter} />

      <p className="sr-only" aria-live="polite">
        {visibleTracks.length} tracks shown
      </p>

      {visibleTracks.length > 0 ? (
        <ul className="grid grid-cols-1 justify-center gap-x-8 gap-y-[45px] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-[repeat(4,298px)]">
          {visibleTracks.map((track) => (
            <li key={track.id} className="flex justify-center">
              <TrackCard track={track} onSelect={onSelectTrack} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex flex-col items-center gap-4 rounded-[30px] bg-white px-6 py-12 text-center">
          <p className="text-lg font-bold text-[#111827]">No tracks match your search</p>
          <p className="text-base text-[#6b7280]">Try another keyword or category.</p>
          <button
            type="button"
            onClick={resetFilters}
            className="rounded-full border-2 border-[#5a198f]/60 px-6 py-3 text-sm font-semibold text-[#5a198f] hover:bg-[#ebdef9]"
          >
            Clear filters
          </button>
        </div>
      )}

      <button
        type="button"
        onClick={onSeeAllTracks}
        className="mx-auto mt-[13px] flex items-center gap-2 rounded-full border-2 border-[rgba(90,25,143,0.6)] px-7 py-4 text-base leading-6 font-semibold text-[#5a198f] shadow-[0_0_45px_0_rgba(0,0,0,0.54)] transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5a198f]"
      >
        See all tracks
        <img alt="" src={arrowRightPurple} className="rtl:-scale-x-100" />
      </button>
    </section>
  )
}

export default TracksSection
