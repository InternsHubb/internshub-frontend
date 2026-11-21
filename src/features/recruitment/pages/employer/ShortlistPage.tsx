import { useState } from 'react';
import { Link } from 'react-router-dom';
import { UserRound } from 'lucide-react';
import {
  candidates,
  getShortlist,
} from '@/features/recruitment/data/employer/employerDirectoryData';
import { EMPLOYER_ROUTES } from '@/app/routes';

// تعريف الحالات والألوان الثلاثة بالضبط كما في الديزاين
const STATUS_BADGES = [
  {
    label: 'Interview',
    className: 'bg-[#FCF5EB] text-[#E19035]', // برتقالي
  },
  {
    label: 'Accepted',
    className: 'bg-[#EBF7F3] text-[#1FA87D]', // أخضر
  },
  {
    label: 'Sent',
    className: 'bg-[#F0EBF2] text-[#683D7B]', // موف
  },
];

export default function Shortlist() {
  const [savedIds] = useState<number[]>(() =>
    getShortlist()
  );

  const shortlisted = candidates.filter((candidate) =>
    savedIds.includes(Number(candidate.id))
  );

  return (
    <div className="w-full space-y-4 pb-20 text-slate-800">
      
      {/* العنوان وعدد المرشحين */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Shortlist
        </h1>
        <p className="mt-0.5 text-xs font-normal text-slate-400">
          {shortlisted.length} candidate{shortlisted.length !== 1 ? 's' : ''} saved
        </p>
      </div>

      {/* كارت القائمة الأبيض الكبير */}
      <div className="w-full min-h-[520px] overflow-hidden rounded-[24px] border border-slate-100 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        {shortlisted.length === 0 ? (
          /* في حالة عدم وجود مرشحين */
          <div className="flex flex-col items-center justify-center px-6 py-24 text-center">
            <UserRound size={36} className="text-slate-300" />
            <h2 className="mt-3 text-base font-bold text-slate-900">
              No candidates saved yet
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Save candidates from the talent directory to review them here.
            </p>
            <Link
              to={EMPLOYER_ROUTES.talent}
              className="mt-4 rounded-xl bg-[#3B0454] px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[#521369]"
            >
              Explore Talent
            </Link>
          </div>
        ) : (
          /* قائمة المرشحين */
          <div>
            {shortlisted.map((candidate, index) => {
              // تحديد الشارة: الأول Interview، الثاني Accepted، الثالث Sent
              const badge =
                STATUS_BADGES[index % STATUS_BADGES.length];

              // موعد التوفر الافتراضي المطابق للتصميم
              const availability =
                (candidate as any).availabilityDate ||
                candidate.availability ||
                (index === 0 ? 'Immediately' : index === 1 ? 'Nov 2024' : 'Dec 2024');

              return (
                <Link
                  key={candidate.id}
                  to={EMPLOYER_ROUTES.candidate(candidate.id)}
                  className="flex items-center gap-4 border-b border-slate-100 px-6 py-4.5 transition-colors hover:bg-slate-50/70 last:border-b-0"
                >
                  {/* الأفاتار الملون */}
                  <div
                    className={`flex size-10 shrink-0 items-center justify-center rounded-xl text-xs font-bold text-white shadow-sm ${
                      candidate.color ||
                      (index === 0
                        ? 'bg-[#2D0643]'
                        : index === 1
                        ? 'bg-[#009FB7]'
                        : 'bg-[#D97706]')
                    }`}
                  >
                    {candidate.initials || 'CD'}
                  </div>

                  {/* بيانات المرشح */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h2 className="text-[13.5px] font-bold text-slate-900 leading-tight">
                        {candidate.name}
                      </h2>

                      {/* الشارة: Interview (برتقالي) / Accepted (أخضر) / Sent (موف) */}
                      <span
                        className={`rounded-md px-2 py-0.5 text-[11px] font-semibold leading-tight ${badge.className}`}
                      >
                        {badge.label}
                      </span>
                    </div>

                    {/* سطر التفاصيل الصغير */}
                    <p className="mt-0.5 text-[11.5px] font-normal text-slate-400 leading-tight">
                      {candidate.role} · {candidate.score}% · {availability}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* رابط إضافة المزيد بالأسفل */}
      <div className="pt-1">
        <Link
          to={EMPLOYER_ROUTES.talent}
          className="inline-flex items-center text-[13px] font-semibold text-[#521369] transition-colors hover:text-[#751b94]"
        >
          + Add more candidates from Talent Directory
        </Link>
      </div>

    </div>
  );
}