import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ChevronDown, ChevronLeft } from 'lucide-react';
import { candidates } from '@/components/employer/employerData';
import { EMPLOYER_ROUTES } from '@/constants/routes';

export default function SendOpportunity() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const candidateId = searchParams.get('candidate');

  // جلب المرشح المختار أو Merna Adel كافتراضي
  const selectedCandidate =
    candidates.find((c) => String(c.id) === candidateId) || {
      id: 1,
      name: 'Merna Adel',
      role: 'UI/UX Designer',
      score: 87,
      initials: 'MA',
      color: 'bg-[#2D0643]',
    };

  const [formData, setFormData] = useState({
    positionTitle: 'Frontend Developer',
    type: 'Full-time',
    mode: 'Remote',
    startDate: 'Nov 1, 2024',
    duration: '3 months',
    description: '',
    requirements: '',
  });

  return (
    <div className="min-h-screen w-full bg-[#F8F6FB] p-6 text-slate-800 sm:p-8">
      <div className="w-full space-y-5 pb-20">
        {/* زر الرجوع والهيدر */}
        <div className="relative">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 transition hover:text-slate-800"
          >
            <ChevronLeft size={16} strokeWidth={2.2} />
            <span>Back</span>
          </button>

          {/* النجمة البرّاقة أعلى اليمين */}
          <svg
            className="pointer-events-none absolute right-2 top-0 size-3.5 text-purple-300"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
          </svg>

          <div className="mt-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Send Opportunity
            </h1>
            <p className="mt-0.5 text-xs font-normal text-slate-400">
              Fill in the role details and send directly to the candidate.
            </p>
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            
            // حفظ بيانات الفرصة في الـ sessionStorage لكي تعرضها صفحة التأكيد بدقة
            sessionStorage.setItem(
              'employer-opportunity',
              JSON.stringify({
                candidateName: selectedCandidate.name,
                title: formData.positionTitle,
                type: formData.type,
                mode: formData.mode,
                startDate: formData.startDate,
                duration: formData.duration,
              })
            );

            // الانتقال إلى صفحة التأكيد الصحيحة المعرفة في الـ Router
            navigate(EMPLOYER_ROUTES.opportunitySent || '/employer/opportunity-sent');
          }}
          className="space-y-4"
        >
          {/* كارت CANDIDATE */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold tracking-[0.16em] text-slate-400 uppercase">
              CANDIDATE
            </span>

            <div className="flex w-full items-center justify-between rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
              <div className="flex items-center gap-3.5">
                <div
                  className={`flex size-10 shrink-0 items-center justify-center rounded-xl text-xs font-bold text-white shadow-sm ${
                    selectedCandidate.color || 'bg-[#2D0643]'
                  }`}
                >
                  {selectedCandidate.initials || 'MA'}
                </div>

                <div>
                  <h2 className="text-sm font-bold leading-tight text-slate-900">
                    {selectedCandidate.name}
                  </h2>
                  <p className="mt-0.5 text-xs font-normal leading-tight text-slate-400">
                    {selectedCandidate.role} · {selectedCandidate.score}%
                  </p>
                </div>
              </div>

<button
  type="button"
  onClick={() => navigate(EMPLOYER_ROUTES.talent)}
  className="text-xs font-semibold text-slate-400 transition hover:text-purple-700"
>
  Change
</button>
            </div>
          </div>

          {/* قسم ROLE DETAILS */}
          <div className="space-y-3 pt-1">
            <span className="text-[11px] font-bold tracking-[0.16em] text-slate-400 uppercase">
              ROLE DETAILS
            </span>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                Position Title
              </label>
              <input
                type="text"
                value={formData.positionTitle}
                onChange={(e) =>
                  setFormData({ ...formData, positionTitle: e.target.value })
                }
                className="h-11 w-full rounded-2xl border border-slate-100 bg-white px-4 text-sm font-medium text-slate-800 shadow-[0_2px_8px_rgba(0,0,0,0.02)] outline-none transition focus:ring-2 focus:ring-purple-200"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  Type
                </label>
                <div className="relative">
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                    className="h-11 w-full appearance-none rounded-2xl border border-slate-100 bg-white px-4 pr-10 text-sm font-medium text-slate-800 shadow-[0_2px_8px_rgba(0,0,0,0.02)] outline-none transition focus:ring-2 focus:ring-purple-200"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Internship">Internship</option>
                  </select>
                  <ChevronDown
                    size={16}
                    className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  Mode
                </label>
                <div className="relative">
                  <select
                    value={formData.mode}
                    onChange={(e) =>
                      setFormData({ ...formData, mode: e.target.value })
                    }
                    className="h-11 w-full appearance-none rounded-2xl border border-slate-100 bg-white px-4 pr-10 text-sm font-medium text-slate-800 shadow-[0_2px_8px_rgba(0,0,0,0.02)] outline-none transition focus:ring-2 focus:ring-purple-200"
                  >
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="On-site">On-site</option>
                  </select>
                  <ChevronDown
                    size={16}
                    className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                </div>
              </div>
            </div>

            <div className="relative grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  Start Date
                </label>
                <input
                  type="text"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                  className="h-11 w-full rounded-2xl border border-slate-100 bg-white px-4 text-sm font-medium text-slate-800 shadow-[0_2px_8px_rgba(0,0,0,0.02)] outline-none transition focus:ring-2 focus:ring-purple-200"
                />
              </div>

              <div className="relative">
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  Duration
                </label>
                <input
                  type="text"
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData({ ...formData, duration: e.target.value })
                  }
                  className="h-11 w-full rounded-2xl border border-slate-100 bg-white px-4 text-sm font-medium text-slate-800 shadow-[0_2px_8px_rgba(0,0,0,0.02)] outline-none transition focus:ring-2 focus:ring-purple-200"
                />
              </div>
            </div>
          </div>

          {/* قسم DESCRIPTION */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[11px] font-bold tracking-[0.16em] text-slate-400 uppercase">
              DESCRIPTION
            </span>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Describe the role..."
              className="w-full resize-none rounded-2xl border border-slate-100 bg-white p-4 text-sm font-normal text-slate-700 shadow-[0_2px_8px_rgba(0,0,0,0.02)] outline-none transition placeholder:text-slate-400 focus:ring-2 focus:ring-purple-200"
            />
          </div>

          {/* قسم REQUIREMENTS */}
          <div className="relative space-y-1.5 pt-1">
            <span className="text-[11px] font-bold tracking-[0.16em] text-slate-400 uppercase">
              REQUIREMENTS
            </span>
            <textarea
              rows={3}
              value={formData.requirements}
              onChange={(e) =>
                setFormData({ ...formData, requirements: e.target.value })
              }
              placeholder="List the skills..."
              className="w-full resize-none rounded-2xl border border-slate-100 bg-white p-4 text-sm font-normal text-slate-700 shadow-[0_2px_8px_rgba(0,0,0,0.02)] outline-none transition placeholder:text-slate-400 focus:ring-2 focus:ring-purple-200"
            />
          </div>

          {/* أزرار الإرسال والإلغاء */}
          <div className="flex items-center gap-4 pt-3">
            <button
              type="submit"
              className="flex h-12 flex-1 items-center justify-center rounded-2xl bg-[#2D0643] text-sm font-semibold text-white shadow-md transition hover:bg-[#3E0A5B]"
            >
              Send Opportunity
            </button>

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex h-12 items-center justify-center rounded-2xl bg-[#F1EEF5] px-8 text-sm font-semibold text-slate-700 transition hover:bg-[#E7E2EE]"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}