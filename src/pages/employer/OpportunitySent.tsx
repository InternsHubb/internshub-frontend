import { useMemo } from 'react';
import { Check, ArrowRight, UserRound } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { EMPLOYER_ROUTES } from '@/constants/routes';

type Opportunity = {
  candidateId?: string | number;
  candidateName?: string;
  title?: string;
  type?: string;
  mode?: string;
  duration?: string;
  startDate?: string;
};

export default function OpportunitySent() {
  const [searchParams] = useSearchParams();
  const queryCandidateId = searchParams.get('candidate');

  const opportunity = useMemo<Opportunity>(() => {
    try {
      return JSON.parse(
        sessionStorage.getItem('employer-opportunity') || '{}'
      );
    } catch {
      return {};
    }
  }, []);

  const candidateId = opportunity.candidateId || queryCandidateId || '1';

  return (
    <div className="w-full space-y-6 pb-20 text-slate-800">
      {/* الهيدر العلوي مع علامة الصح وأيقونة النجمة */}
      <div className="relative pt-4 text-center">
        <svg
          className="pointer-events-none absolute right-1/4 top-0 size-4 text-purple-300"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
        </svg>

        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-purple-100 text-purple-700 shadow-sm">
          <Check size={22} strokeWidth={2.5} />
        </div>

        <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
          Opportunity Sent
        </h1>
        <p className="mt-1 text-xs text-slate-500">
          Your opportunity has been delivered. The candidate will be notified immediately.
        </p>
      </div>

      {/* كارت المرشح */}
      <div className="flex w-full items-center justify-between rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-3.5">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#2D0643] text-xs font-bold text-white shadow-sm">
            MA
          </div>
          <div>
            <h2 className="text-sm font-bold leading-tight text-slate-900">
              {opportunity.candidateName || 'Merna Adel'}
            </h2>
            <p className="mt-0.5 text-xs text-slate-400">
              {opportunity.title || 'UI/UX Designer'} · 87%
            </p>
          </div>
        </div>
        <span className="rounded-lg bg-purple-50 px-3 py-1.5 text-xs font-semibold text-purple-700">
          Opportunity Sent
        </span>
      </div>

      {/* جدول تفاصيل الفرصة */}
      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
        <div className="divide-y divide-slate-100 text-sm">
          {[
            ['Position', opportunity.title || 'Frontend Developer'],
            ['Type', opportunity.type || 'Full-time'],
            ['Mode', opportunity.mode || 'Remote'],
            ['Start Date', opportunity.startDate || 'Nov 1, 2024'],
            ['Current Status', 'Awaiting response'],
            ['Next Step', 'Candidate review → Acceptance or negotiation'],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between px-5 py-3.5">
              <span className="text-xs font-medium text-slate-400">{label}</span>
              <span className="text-xs font-semibold text-slate-800">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* قسم WHAT HAPPENS NEXT */}
      <div className="relative space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold tracking-[0.16em] text-slate-400 uppercase">
            WHAT HAPPENS NEXT
          </span>
          {/* النجمة البرّاقة الصغيرة */}
          <svg
            className="mr-2 size-3 text-amber-400/80"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
          </svg>
        </div>

        {/* قائمة عمودية ناعمة بدون مربعات */}
        <div className="space-y-3.5 pt-1">
          {[
            ['01', 'Candidate reviews the opportunity details'],
            ['02', 'They accept, decline, or request changes'],
            ['03', 'If accepted, an interview will be scheduled'],
            ['04', "You'll be notified at each stage"],
          ].map(([num, text]) => (
            <div key={num} className="flex items-center gap-3.5">
              <span className="w-5 text-xs font-bold text-slate-500">
                {num}
              </span>
              <span className="text-xs font-medium text-slate-700">
                {text}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* أزرار الإجراءات السفلية */}
      <div className="space-y-3 pt-2">
        {/* زر View Recruitment Pipeline بكامل العرض */}
        <Link
          to={EMPLOYER_ROUTES.pipeline}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#2D0643] text-sm font-semibold text-white shadow-md transition hover:bg-[#3E0A5B]"
        >
          <span>View Recruitment Pipeline</span>
          <ArrowRight size={16} strokeWidth={2.2} />
        </Link>

        {/* الصف السفلي: زر View Profile بجانب زر Browse More */}
        <div className="flex items-center gap-3">
          <Link
            to={EMPLOYER_ROUTES.candidate(candidateId)}
            className="flex h-11 flex-1 items-center justify-center rounded-2xl border border-slate-200/90 bg-white text-xs font-semibold text-slate-700 shadow-[0_1px_4px_rgba(0,0,0,0.02)] transition hover:bg-slate-50 hover:text-slate-900"
          >
            View Profile
          </Link>

          <Link
            to={EMPLOYER_ROUTES.talent}
            className="flex h-11 items-center justify-center gap-2 rounded-2xl border border-slate-200/90 bg-white px-5 text-xs font-semibold text-slate-700 shadow-[0_1px_4px_rgba(0,0,0,0.02)] transition hover:bg-slate-50 hover:text-slate-900"
          >
            <UserRound size={15} />
            <span>Browse More</span>
          </Link>
        </div>
      </div>
    </div>
  );
}