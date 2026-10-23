import { Link } from 'react-router-dom';
import {
  Calendar,
  CheckCircle2,
  Star,
  Users,
} from 'lucide-react';
import { EMPLOYER_ROUTES } from '@/constants/routes';

export default function Completion() {
  const summaryMetrics = [
    { count: 5, label: 'Total Processed' },
    { count: 0, label: 'Successfully Placed' },
    { count: 0, label: 'Selected / Pending' },
  ];

  const recommendedSteps = [
    {
      icon: CheckCircle2,
      text: 'Submit onboarding paperwork for placed candidates',
      hasSparkle: true,
    },
    {
      icon: Calendar,
      text: 'Schedule first-week orientation and team introductions',
    },
    {
      icon: Users,
      text: 'Review remaining candidates in the talent pool for future roles',
      action: { label: 'Go →', to: EMPLOYER_ROUTES.talent },
    },
    {
      icon: Star,
      text: 'Provide feedback on the recruitment process',
    },
  ];

  return (
    <div className="w-full space-y-6 pb-20 text-slate-800">
      
      {/* رأس الصفحة والعنوان */}
      <div className="relative">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Recruitment Completion
        </h1>
        <p className="mt-1 text-xs font-normal text-slate-400">
          Placements and final status for this hiring cycle
        </p>

        {/* النجمة البرّاقة أعلى اليمين */}
        <svg
          className="pointer-events-none absolute right-2 top-0 size-3.5 text-purple-300"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
        </svg>
      </div>

      {/* كارت ملخص الإحصائيات (3 أعمدة) */}
      <div className="w-full overflow-hidden rounded-[20px] border border-slate-100 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <div className="grid grid-cols-1 divide-y divide-slate-100 sm:grid-cols-3 sm:divide-y-0 sm:divide-x">
          {summaryMetrics.map((metric) => (
            <div key={metric.label} className="px-6 py-4.5">
              <p className="text-xl font-bold leading-none text-slate-900">
                {metric.count}
              </p>
              <p className="mt-1.5 text-xs font-normal text-slate-400">
                {metric.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* قسم PLACEMENT SUMMARY */}
      <div className="space-y-2 pt-1">
        <span className="text-[11px] font-bold tracking-[0.16em] text-slate-400 uppercase">
          PLACEMENT SUMMARY
        </span>

        <div className="flex h-44 w-full items-center justify-center rounded-[24px] border border-slate-100 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <p className="text-xs font-normal text-slate-400">
            No placements completed yet.
          </p>
        </div>
      </div>

      {/* قسم RECOMMENDED NEXT STEPS */}
      <div className="space-y-2 pt-1">
        <span className="text-[11px] font-bold tracking-[0.16em] text-slate-400 uppercase">
          RECOMMENDED NEXT STEPS
        </span>

        <div className="w-full divide-y divide-slate-100 overflow-hidden rounded-[20px] border border-slate-100 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
          {recommendedSteps.map(({ icon: Icon, text, hasSparkle, action }) => (
            <div
              key={text}
              className="flex items-center justify-between px-6 py-4 text-xs transition-colors hover:bg-slate-50/50"
            >
              <div className="flex items-center gap-3">
                <Icon size={16} strokeWidth={1.8} className="shrink-0 text-slate-400" />
                <span className="font-medium text-slate-700">{text}</span>
              </div>

              {/* النجمة التزيينية على اليمين */}
              {hasSparkle && (
                <svg
                  className="size-3.5 text-purple-300"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
                </svg>
              )}

              {/* زر Go */}
              {action && (
                <Link
                  to={action.to}
                  className="flex items-center gap-1 font-semibold text-[#2D0643] transition-colors hover:text-purple-700"
                >
                  <span>{action.label}</span>
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* النجمة البرّاقة الكهرمانية الصغيرة بالأسفل */}
        <div className="flex justify-end pr-3 pt-1">
          <svg
            className="size-3 text-amber-400/80"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
          </svg>
        </div>
      </div>

      {/* الأزرار السفلية */}
      <div className="flex items-center gap-4 pt-2">
        <Link
          to={EMPLOYER_ROUTES.pipeline}
          className="flex h-12 flex-1 items-center justify-center rounded-2xl bg-[#2D0643] text-xs font-semibold text-white shadow-md transition hover:bg-[#3E0A5B]"
        >
          View Full Pipeline
        </Link>

        <Link
          to={EMPLOYER_ROUTES.dashboard}
          className="flex h-12 items-center justify-center rounded-2xl bg-[#F1EEF5] px-8 text-xs font-semibold text-slate-700 transition hover:bg-[#E7E2EE]"
        >
          Dashboard
        </Link>
      </div>

    </div>
  );
}
