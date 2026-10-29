import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Award,
  CheckCircle2,
  Code2,
  Download,
  Layers,
  Sparkles,
  Star,
  Trophy,
  Users,
  X,
} from 'lucide-react';

import { CARD, ProgressBar, PURPLE_GRADIENT } from '@/components/dashboard/primitives';
import { ROUTES } from '@/constants/routes';
import { cn } from '@/lib/cn';

export default function ProjectResultsPage() {
  const { t } = useTranslation();
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);

  return (
    <div className="mx-auto w-full max-w-[1084px] space-y-6 pb-12 pt-2">
      {/* Top Back Navigation Bar */}
      <header className="flex flex-wrap items-center justify-between gap-3">
        <Link
          to={ROUTES.dashboardProjectFinalReview}
          className="group inline-flex items-center gap-3 text-gray-900 transition-colors hover:text-[#430A5D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#430A5D] rounded-lg p-1 -ml-1"
          aria-label={t('dashboard.results.backToReview', 'Back to Final Review')}
        >
          <ArrowLeft className="size-7 shrink-0 text-gray-900 transition-transform group-hover:-translate-x-1 rtl:rotate-180 rtl:group-hover:translate-x-1" />
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold tracking-tight text-gray-950 sm:text-[32px]">
              {t('dashboard.results.title', 'My Results')}
            </h1>
            <span className="text-xs font-medium text-[#737373]">
              {t('dashboard.results.subtitle', 'Internship Completion & Performance Overview')}
            </span>
          </div>
        </Link>
      </header>

      {/* Main Results Card (Matching Figma Node 925:26313) */}
      <section
        aria-labelledby="results-title"
        className={cn(CARD, 'p-6 sm:p-10 space-y-10')}
      >
        {/* Header: Award Icon + Title */}
        <div className="flex items-center gap-3.5 border-b border-gray-100 pb-5">
          <div className="flex size-[55px] shrink-0 items-center justify-center rounded-2xl bg-[#f6ebff]">
            <Award className="size-7 text-[#430A5D]" />
          </div>
          <h2 id="results-title" className="text-2xl sm:text-[32px] font-bold text-gray-950">
            {t('dashboard.results.title', 'My Results')}
          </h2>
        </div>

        {/* Hero: Podium + Composite Score */}
        <div className="flex flex-col items-center justify-center text-center space-y-3 py-4">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-[#f6ebff] shadow-2xs">
            <Trophy className="size-7 text-[#430A5D]" />
          </div>

          <p className="text-sm sm:text-base font-bold tracking-wider text-gray-900 uppercase">
            {t('dashboard.results.yourPrefix', 'YOUR')}{' '}
            <span className="text-[#430A5D] font-extrabold">
              {t('dashboard.results.composite', 'COMPOSITE')}
            </span>{' '}
            {t('dashboard.results.scoreSuffix', 'SCORE')}
          </p>

          <span className="text-5xl sm:text-7xl font-black tracking-tight text-gray-950">
            86%
          </span>

          <p className="max-w-md text-xs sm:text-sm text-[#737373] leading-relaxed">
            {t(
              'dashboard.results.scoreDesc',
              'Your final score is based on your points, first-pass rate, and Senior rating.'
            )}
          </p>
        </div>

        {/* Score Breakdown Section */}
        <div className="space-y-6 pt-2">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-950">
            <span className="text-[#430A5D]">{t('dashboard.results.score', 'Score')}</span>{' '}
            {t('dashboard.results.breakdown', 'breakdown')}
          </h3>

          <div className="space-y-6">
            {/* Metric 1: Points */}
            <div className="space-y-2">
              <div className="flex items-baseline justify-between">
                <span className="text-sm sm:text-base font-bold text-gray-950">
                  {t('dashboard.results.points', 'Points')}
                </span>
                <div className="text-end">
                  <span className="text-xl sm:text-2xl font-bold text-gray-950">90 %</span>
                  <span className="block text-[11px] text-[#737373]">
                    {t('dashboard.results.weight40', 'Weight: 40%')}
                  </span>
                </div>
              </div>
              <ProgressBar
                value={90}
                max={100}
                label="Points Score"
                className="h-2.5 rounded-full"
              />
            </div>

            {/* Metric 2: First-pass rate */}
            <div className="space-y-2">
              <div className="flex items-baseline justify-between">
                <span className="text-sm sm:text-base font-bold text-gray-950">
                  {t('dashboard.results.firstPassRate', 'First-pass rate')}
                </span>
                <div className="text-end">
                  <span className="text-xl sm:text-2xl font-bold text-gray-950">80 %</span>
                  <span className="block text-[11px] text-[#737373]">
                    {t('dashboard.results.weight40', 'Weight: 40%')}
                  </span>
                </div>
              </div>
              <ProgressBar
                value={80}
                max={100}
                label="First-pass Rate"
                className="h-2.5 rounded-full"
              />
            </div>

            {/* Metric 3: Senior rating */}
            <div className="space-y-2">
              <div className="flex items-baseline justify-between">
                <span className="text-sm sm:text-base font-bold text-gray-950">
                  {t('dashboard.results.seniorRating', 'Senior rating')}
                </span>
                <div className="text-end">
                  <span className="text-xl sm:text-2xl font-bold text-gray-950">4/5</span>
                  <span className="block text-[11px] text-[#737373]">
                    {t('dashboard.results.weight20', 'Weight: 20%')}
                  </span>
                </div>
              </div>
              <ProgressBar
                value={80}
                max={100}
                label="Senior Rating"
                className="h-2.5 rounded-full"
              />
            </div>
          </div>
        </div>

        {/* Project Summary Section */}
        <div className="space-y-5 pt-2">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-950">
            {t('dashboard.results.project', 'Project')}{' '}
            <span className="text-[#430A5D]">{t('dashboard.results.summary', 'summary')}</span>
          </h3>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
            {/* Approved PRs */}
            <div className="flex flex-col items-center justify-center rounded-2xl bg-gray-50/70 p-6 border border-gray-100 text-center gap-2">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-[#d4fadc] text-[#068f2f]">
                <Code2 className="size-6" />
              </div>
              <span className="text-3xl sm:text-4xl font-extrabold text-gray-950">12</span>
              <span className="text-xs font-semibold text-[#737373]">
                {t('dashboard.results.approvedPrs', 'Approved PRs')}
              </span>
            </div>

            {/* Story Points */}
            <div className="flex flex-col items-center justify-center rounded-2xl bg-gray-50/70 p-6 border border-gray-100 text-center gap-2">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-[#fff4de] text-[#d06f15]">
                <Star className="size-6 fill-current" />
              </div>
              <span className="text-3xl sm:text-4xl font-extrabold text-gray-950">40</span>
              <span className="text-xs font-semibold text-[#737373]">
                {t('dashboard.results.storyPoints', 'story points')}
              </span>
            </div>

            {/* Sprints */}
            <div className="flex flex-col items-center justify-center rounded-2xl bg-gray-50/70 p-6 border border-gray-100 text-center gap-2">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-[#f6ebff] text-[#430A5D]">
                <Layers className="size-6" />
              </div>
              <span className="text-3xl sm:text-4xl font-extrabold text-gray-950">4</span>
              <span className="text-xs font-semibold text-[#737373]">
                {t('dashboard.results.sprints', 'Sprints')}
              </span>
            </div>
          </div>
        </div>

        {/* Certificate Ready Card */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-7 space-y-4 shadow-xs">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="size-5 text-[#00BA88] shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <h4 className="text-sm sm:text-base font-bold text-gray-950">
                {t('dashboard.results.certReady', 'Your certificate is ready')}
              </h4>
              <p className="text-xs text-[#737373]">
                {t('dashboard.results.certDesc', 'View your internship certificate.')}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsCertModalOpen(true)}
            className={cn(
              PURPLE_GRADIENT,
              'w-full rounded-[13px] py-3.5 px-6 text-center text-xs sm:text-sm font-bold text-white shadow-[0_10px_22px_rgba(67,10,93,0.2)] transition-all hover:brightness-110 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#430A5D] focus-visible:ring-offset-2'
            )}
          >
            {t('dashboard.results.viewCert', 'View certificate')}
          </button>
        </div>

        {/* Talent Directory Invitation Card */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-7 space-y-4 shadow-xs">
          <div className="flex items-start gap-3">
            <Users className="size-5 text-[#8037BE] shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <h4 className="text-sm sm:text-base font-bold text-gray-950">
                {t('dashboard.results.talentInvite', "You're invited to the Talent Directory!")}
              </h4>
              <p className="text-xs text-[#737373]">
                {t('dashboard.results.talentDesc', 'Your score qualifies you for the Talent Directory.')}
              </p>
            </div>
          </div>

          <Link
            to={ROUTES.recruitmentTalentDirectory}
            className="w-full inline-flex items-center justify-center rounded-[13px] border border-[#430A5D] bg-white py-3.5 px-6 text-center text-xs sm:text-sm font-bold text-[#430A5D] shadow-xs transition-all hover:bg-purple-50/60 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#430A5D] focus-visible:ring-offset-2"
          >
            {t('dashboard.results.viewInvite', 'View invitation')}
          </Link>
        </div>
      </section>

      {/* Certificate Modal */}
      {isCertModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-xl rounded-3xl bg-white p-6 sm:p-8 shadow-2xl space-y-6 animate-in zoom-in-95 duration-200 border border-purple-100">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-xl bg-[#f6ebff] text-[#430A5D]">
                  <Award className="size-6" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-950">
                    {t('dashboard.results.certModalTitle', 'Internship Certificate')}
                  </h3>
                  <p className="text-xs text-[#737373]">
                    {t('dashboard.results.certModalSubtitle', 'Certified Completion · TaskFlow App')}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsCertModalOpen(false)}
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Certificate Preview Frame */}
            <div className="rounded-2xl border-2 border-dashed border-purple-200 bg-gradient-to-b from-[#fbf8fe] to-[#f4edfc] p-6 text-center space-y-3">
              <Sparkles className="size-8 mx-auto text-[#8037BE]" />
              <h4 className="text-base sm:text-lg font-bold text-gray-950">
                {t('dashboard.results.certAwardedTo', 'Certificate of Excellence Awarded to Merna Adel')}
              </h4>
              <p className="text-xs text-gray-600 max-w-md mx-auto leading-relaxed">
                {t(
                  'dashboard.results.certStatement',
                  'For outstanding completion of the Frontend & UI/UX Internship Program with an overall score of 86%.'
                )}
              </p>
              <div className="pt-2 text-[11px] font-semibold text-[#8037BE]">
                ID: HUB-2026-TASKFLOW-042
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsCertModalOpen(false)}
                className="rounded-xl border border-gray-300 px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                {t('dashboard.taskDetails.cancel', 'Close')}
              </button>
              <button
                type="button"
                onClick={() => {
                  alert('Certificate download started.');
                  setIsCertModalOpen(false);
                }}
                className={cn(
                  PURPLE_GRADIENT,
                  'inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:brightness-110 active:scale-95 transition-all'
                )}
              >
                <Download className="size-4" />
                <span>{t('dashboard.results.downloadCert', 'Download PDF')}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
