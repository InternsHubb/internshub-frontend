
import { useMemo, useState } from 'react';

import CandidateFilters from '@/components/employer/CandidateFilters';
import CandidateTable from '@/components/employer/CandidateTable';
import {
  candidates,
  getShortlist,
  saveShortlist,
} from '@/components/employer/employerData';

function GeminiIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="22"
      height="22"
      fill="none"
      aria-label="Gemini"
      role="img"
    >
      <path
        d="M12 1.5C10.8 7.2 7.2 10.8 1.5 12C7.2 13.2 10.8 16.8 12 22.5C13.2 16.8 16.8 13.2 22.5 12C16.8 10.8 13.2 7.2 12 1.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function TalentDirectory() {
  const [role, setRole] = useState('all');
  const [score, setScore] = useState('all');
  const [availability, setAvailability] = useState('all');

  const [savedIds, setSavedIds] = useState<number[]>(() =>
    getShortlist()
  );

  const eligibleCount = candidates.filter(
    (candidate) => candidate.score >= 80
  ).length;

  function toggleSave(id: number) {
    setSavedIds((currentIds) => {
      const updatedIds = currentIds.includes(id)
        ? currentIds.filter((savedId) => savedId !== id)
        : [...currentIds, id];

      saveShortlist(updatedIds);
      return updatedIds;
    });
  }

  const filteredCandidates = useMemo(() => {
    return candidates.filter((candidate) => {
      const matchesTrack =
        role === 'all' || candidate.track === role;

      const minimumScore = score === 'all' ? 0 : Number(score);
      const matchesScore = candidate.score >= minimumScore;

      const matchesAvailability =
        availability === 'all' ||
        candidate.availability === availability;

      return matchesTrack && matchesScore && matchesAvailability;
    });
  }, [role, score, availability]);

  return (
    <div className="space-y-6">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Talent Directory
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            {eligibleCount} eligible candidates — score ≥ 80%
          </p>
        </div>

        <div className="mt-1 flex size-11 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-[#561D86]">
          <GeminiIcon />
        </div>
      </header>

      <CandidateFilters
        role={role}
        onRole={setRole}
        score={score}
        onScore={setScore}
        availability={availability}
        onAvailability={setAvailability}
      />

      <CandidateTable
        candidates={filteredCandidates}
        savedIds={savedIds}
        onToggleSave={toggleSave}
      />
    </div>
  );
}
