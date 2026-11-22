import { useTranslation } from 'react-i18next';
import { Award } from 'lucide-react';

interface CompositeScoreCardProps {
  score?: number;
  label?: string;
}

/**
 * Shared sidebar footer widget showing a learner's composite score preview.
 * Decoupled from feature data so it can be reused across student layouts.
 */
export function CompositeScoreCard({ score = 87, label }: CompositeScoreCardProps) {
  const { t } = useTranslation();
  const formattedScore = `${new Intl.NumberFormat().format(score)}%`;

  return (
    <div className="rounded-2xl border border-white/15 bg-white/10 p-3.5 text-white backdrop-blur-sm">
      <div className="flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-onbrand-bright">
          <Award className="size-3.5 text-accent-soft" aria-hidden="true" />
          {label ?? t('recruitment.sidebar.compositeScore', 'Composite Score')}
        </span>
        <span className="text-sm font-bold text-white">{formattedScore}</span>
      </div>
      <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-white/15">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#c592fb] to-[#e7aa6f]"
          style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
        />
      </div>
    </div>
  );
}

export default CompositeScoreCard;
