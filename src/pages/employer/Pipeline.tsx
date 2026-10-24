import { Link } from 'react-router-dom';
import { candidates } from '@/components/employer/employerData';
import { EMPLOYER_ROUTES } from '@/constants/routes';

// الـ 6 مراحل العلوية بالأرقام المطابقة للتصميم
const stageMetrics = [
  { label: 'Sent', count: 1 },
  { label: 'Viewed', count: 1 },
  { label: 'Accepted', count: 1 },
  { label: 'Interview', count: 1 },
  { label: 'Selected', count: 0 },
  { label: 'Completed', count: 0 },
];

// ألوان الأفاتار الدقيقة لكل مرشح من التصميم
const avatarColors: Record<string, string> = {
  MA: 'bg-[#2D0643]', // Merna Adel (بنفسجي داكن)
  AH: 'bg-[#009FB7]', // Ahmed Hassan (تركواز)
  SK: 'bg-[#00A86B]', // Sara Khalil (أخضر)
  OY: 'bg-[#D97706]', // Omar Youssef (برتقالي)
  NI: 'bg-[#7C3AED]', // Nour Ibrahim (موف)
};

export default function Pipeline() {
  // المرشح المرفوض المعروض بالأسفل
  const declinedCandidate = candidates.find((c) => c.initials === 'NI') || {
    id: 5,
    name: 'Nour Ibrahim',
    role: 'Product Designer',
    initials: 'NI',
  };

  return (
    <div className="w-full space-y-6 pb-20 text-slate-800">
      
      {/* رأس الصفحة والعنوان */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Recruitment Pipeline
        </h1>
        <p className="mt-1 text-xs font-normal text-slate-400">
          5 candidates across 6 stages
        </p>
      </div>

      {/* شريط المراحل الستة العلوي (Metrics Bar) */}
      <div className="w-full overflow-hidden rounded-[20px] border border-slate-100 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <div className="grid grid-cols-2 divide-y divide-slate-100 sm:grid-cols-3 sm:divide-y-0 lg:grid-cols-6 lg:divide-x">
          {stageMetrics.map((stage) => (
            <div key={stage.label} className="px-6 py-4.5">
              <p className="text-xl font-bold leading-none text-slate-900">
                {stage.count}
              </p>
              <p className="mt-1.5 text-xs font-normal text-slate-400">
                {stage.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* قسم جميع المرشحين (ALL CANDIDATES) */}
      <div className="space-y-2 pt-1">
        <span className="text-[11px] font-bold tracking-[0.16em] text-slate-400 uppercase">
          ALL CANDIDATES
        </span>

        <div className="w-full min-h-[360px] overflow-hidden rounded-[24px] border border-slate-100 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          {candidates.map((candidate) => (
            <Link
              key={candidate.id}
              to={EMPLOYER_ROUTES.candidate(candidate.id)}
              className="flex items-center gap-4 border-b border-slate-100 px-6 py-4.5 transition-colors hover:bg-slate-50/70 last:border-b-0"
            >
              {/* الأفاتار الملون */}
              <div
                className={`flex size-10 shrink-0 items-center justify-center rounded-xl text-xs font-bold text-white shadow-sm ${
                  avatarColors[candidate.initials] || candidate.color
                }`}
              >
                {candidate.initials}
              </div>

              {/* بيانات المرشح */}
              <div className="min-w-0 flex-1">
                <h2 className="text-[13.5px] font-bold leading-tight text-slate-900">
                  {candidate.name}
                </h2>
                <p className="mt-0.5 text-[11.5px] font-normal leading-tight text-slate-400">
                  {candidate.role} · {candidate.role}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* قسم المرفوضين (DECLINED) */}
      <div className="space-y-2 pt-1">
        <span className="text-[11px] font-bold tracking-[0.16em] text-slate-400 uppercase">
          DECLINED
        </span>

        <div className="flex w-full items-center justify-between rounded-[20px] border border-slate-100 bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
          <Link
            to={EMPLOYER_ROUTES.candidate(declinedCandidate.id)}
            className="flex items-center gap-3.5 transition-opacity hover:opacity-85"
          >
            {/* الأفاتار */}
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#7C3AED] text-xs font-bold text-white shadow-sm">
              {declinedCandidate.initials}
            </div>

            {/* الاسم والمسمى الوظيفي */}
            <div>
              <h3 className="text-[13.5px] font-bold leading-tight text-slate-900">
                {declinedCandidate.name}
              </h3>
              <p className="mt-0.5 text-[11.5px] font-normal leading-tight text-slate-400">
                {declinedCandidate.role}
              </p>
            </div>
          </Link>

          {/* شارة Declined الحمراء الهادئة */}
          <span className="rounded-md border border-red-100/60 bg-[#FEF2F2] px-2.5 py-1 text-[11px] font-semibold text-[#EF4444]">
            Declined
          </span>
        </div>
      </div>

    </div>
  );
}
