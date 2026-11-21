
import { Check, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

import { EMPLOYER_ROUTES } from '@/app/routes';
import type { Candidate } from '@/features/recruitment/data/employer/employerDirectoryData';

type Props = {
  candidates: Candidate[];
  savedIds: number[];
  onToggleSave: (id: number) => void;
};

function getCandidateTrack(role: string) {
  if (role === 'UI/UX Designer' || role === 'Product Designer') {
    return 'UI/UX Design';
  }

  if (role === 'Frontend Developer' || role === 'React Developer') {
    return 'Frontend Development';
  }

  if (role === 'Data Scientist' || role === 'Data Analyst') {
    return 'Data Science';
  }

  return role;
}

export default function CandidateTable({
  candidates,
  savedIds,
  onToggleSave,
}: Props) {
  if (candidates.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
        <p className="font-semibold text-slate-700">
          No candidates found
        </p>
        <p className="mt-1 text-sm text-slate-500">
          Try changing your filters.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-40/60 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              <th className="py-4 pl-6 pr-4">Candidate</th>
              <th className="px-4 py-4">Track</th>
              <th className="px-4 py-4">Score</th>
              <th className="py-4 pl-4 pr-6">Availability</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {candidates.map((candidate) => {
              const isSaved = savedIds.includes(candidate.id);
              const isImmediatelyAvailable =
                candidate.availability === 'Immediately' ||
                candidate.availability === 'Available now';

              return (
                <tr
                  key={candidate.id}
                  className="transition-colors hover:bg-slate-50/60"
                >
                  {/* Candidate */}
                  <td className="py-4 pl-6 pr-4">
                    <Link
                      to={EMPLOYER_ROUTES.candidate(candidate.id)}
                      className="group flex items-center gap-3"
                    >
                      <span
                        className={`flex size-10 shrink-0 items-center justify-center rounded-full text-xs font-bold ${candidate.color}`}
                      >
                        {candidate.initials}
                      </span>

                      <span className="min-w-0">
                        <span className="block font-semibold text-slate-900 group-hover:text-[#561D86]">
                          {candidate.name}
                        </span>

                        <span className="mt-1 block text-xs text-slate-500">
                          {candidate.role}
                        </span>

                      </span>
                    </Link>
                  </td>

                  {/* Track */}
                  <td className="px-4 py-4 text-sm text-slate-600">
                    {getCandidateTrack(candidate.role)}
                  </td>

                  {/* Score */}
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2.5">
                      <div className="h-1.5 w-16 shrink-0 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-[#2C0A43]"
                          style={{
                            width: `${Math.min(
                              Math.max(candidate.score, 0),
                              100
                            )}%`,
                          }}
                        />
                      </div>

                      <span className="font-semibold text-slate-800">
                        {candidate.score}%
                      </span>
                    </div>
                  </td>

                  {/* Availability and Save action */}
                  <td className="py-4 pl-4 pr-6">
                    <div className="flex items-center justify-between gap-3">
                      <span className="inline-flex items-center gap-2 whitespace-nowrap text-xs text-slate-600">
                        <span
                          className={`size-2 shrink-0 rounded-full ${
                            isImmediatelyAvailable
                              ? 'bg-emerald-500'
                              : 'bg-orange-400'
                          }`}
                        />
                        {candidate.availability}
                      </span>

                      <button
                        type="button"
                        onClick={() => onToggleSave(candidate.id)}
                        aria-pressed={isSaved}
                        aria-label={
                          isSaved
                            ? `Remove ${candidate.name} from shortlist`
                            : `Save ${candidate.name} to shortlist`
                        }
                        className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${
                          isSaved
                            ? 'border-violet-200 bg-violet-100 text-[#561D86] hover:bg-violet-200'
                            : 'border-slate-200 bg-white text-slate-600 hover:border-violet-200 hover:bg-violet-50'
                        }`}
                      >
                        {isSaved ? (
                          <Check size={13} strokeWidth={2.5} />
                        ) : (
                          <Star size={13} />
                        )}

                        {isSaved ? 'Saved' : 'Save'}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
