
type Props = {
  role: string;
  onRole: (value: string) => void;
  score: string;
  onScore: (value: string) => void;
  availability: string;
  onAvailability: (value: string) => void;
};

const trackOptions = [
  { label: 'All', value: 'all' },
  { label: 'UI/UX Design', value: 'UI/UX Design' },
  { label: 'Frontend Development', value: 'Frontend Development' },
  { label: 'Data Science', value: 'Data Science' },
];

const scoreOptions = [
  { label: 'All scores', value: 'all' },
  { label: '90%+', value: '90' },
  { label: '85%+', value: '85' },
  { label: '80%+', value: '80' },
];

const availabilityOptions = [
  { label: 'Any availability', value: 'all' },
  { label: 'Immediately', value: 'Immediately' },
];

type PillOption = {
  label: string;
  value: string;
};

type PillGroupProps = {
  options: PillOption[];
  value: string;
  onChange: (value: string) => void;
};

function PillGroup({ options, value, onChange }: PillGroupProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {options.map((option) => {
        const active = value === option.value;

        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.value)}
            className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
              active
                ? 'bg-violet-100 text-[#561D86]'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export default function CandidateFilters({
  role,
  onRole,
  score,
  onScore,
  availability,
  onAvailability,
}: Props) {


return (
  <section
    aria-label="Candidate filters"
    className="space-y-4"
  >
    {/* First row: Tracks and scores */}
    <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-b border-slate-200/70 pb-3">
      <div
        role="group"
        aria-label="Filter by track"
        className="flex flex-wrap items-center gap-x-6 gap-y-2"
      >
        {trackOptions.map((option) => {
          const active = role === option.value;

          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={active}
              onClick={() => onRole(option.value)}
              className={`relative whitespace-nowrap pb-2 text-sm transition-colors ${
                active
                  ? 'font-semibold text-slate-900 after:absolute after:bottom-[-13px] after:left-0 after:right-0 after:h-0.5 after:bg-[#561D86]'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      <PillGroup
        options={scoreOptions}
        value={score}
        onChange={onScore}
      />
    </div>

    {/* Second row: Availability */}
    <div className="flex items-center gap-3">
      <PillGroup
        options={availabilityOptions}
        value={availability}
        onChange={onAvailability}
      />
    </div>
  </section>
);

}
