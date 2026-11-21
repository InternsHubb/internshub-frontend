import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  Video,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { candidates } from '@/features/recruitment/data/employer/employerDirectoryData';
import { EMPLOYER_ROUTES } from '@/app/routes';

export default function Interviews() {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed' | 'cancelled'>('upcoming');

  // المرشح المعروض في المقابلة (Merna Adel)
  const candidate = candidates.find((c) => c.initials === 'MA') || {
    id: 1,
    name: 'Merna Adel',
    role: 'UI/UX Designer',
    initials: 'MA',
  };

  const interviewDetails = [
    {
      icon: Calendar,
      label: 'Date',
      value: 'Wednesday, Oct 30, 2024',
    },
    {
      icon: Clock,
      label: 'Time',
      value: '10:00 AM – 11:00 AM',
    },
    {
      icon: Video,
      label: 'Mode',
      value: 'Video call',
    },
    {
      icon: CheckCircle2,
      label: 'Interviewers',
      value: 'Sarah Mahmoud, Karim Saad',
    },
    {
      icon: ArrowRight,
      label: 'Notes',
      value: 'Technical round + portfolio review',
    },
  ];

  const preparationSteps = [
    "Review candidate's portfolio and project work",
    'Prepare technical questions relevant to the role',
    'Send calendar invite with meeting link',
    'Have the job description ready for reference',
    'Prepare questions about availability and expectations',
  ];

  return (
    <div className="w-full space-y-5 pb-20 text-slate-800">
      
      {/* رأس الصفحة والعنوان والتبويبات */}
      <div className="relative">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Interview Management
        </h1>
        <p className="mt-1 text-xs font-normal text-slate-400">
          1 interview scheduled
        </p>

        {/* شريط التبويبات (Tabs) */}
        <div className="mt-4 flex items-center justify-between border-b border-transparent">
          <div className="flex items-center gap-6">
            {(['upcoming', 'completed', 'cancelled'] as const).map((tab) => {
              const label =
                tab === 'upcoming'
                  ? 'Upcoming'
                  : tab === 'completed'
                  ? 'Completed'
                  : 'Cancelled';

              const isActive = activeTab === tab;

              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`pb-2 text-xs font-semibold transition-colors ${
                    isActive
                      ? 'border-b-2 border-[#2D0643] text-[#2D0643]'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* النجمة البرّاقة أعلى اليمين */}
          <svg
            className="pointer-events-none mr-2 size-3.5 text-purple-300"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
          </svg>
        </div>
      </div>

      {/* الكارت الرئيسي لتفاصيل المقابلة */}
      <div className="w-full min-h-[460px] rounded-[24px] border border-slate-100 bg-white p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        
        {/* صف المرشح والشارة */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3.5">
            {/* الأفاتار البنفسجي */}
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#2D0643] text-xs font-bold text-white shadow-sm">
              {candidate.initials}
            </div>

            <div>
              <h2 className="text-sm font-bold leading-tight text-slate-900">
                {candidate.name}
              </h2>
              <p className="mt-0.5 text-xs font-normal leading-tight text-slate-400">
                {candidate.role}
              </p>
            </div>
          </div>

          {/* شارة Upcoming البرتقالية الناعمة */}
          <span className="rounded-md bg-[#FCF5EB] px-2.5 py-1 text-[11px] font-semibold text-[#E19035]">
            Upcoming
          </span>
        </div>

        {/* سطور بيانات وتفاصيل المقابلة */}
        <div className="divide-y divide-slate-100">
          {interviewDetails.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center py-3.5 text-xs">
              <div className="flex w-36 items-center gap-2 text-slate-400">
                <Icon size={15} strokeWidth={1.8} className="shrink-0" />
                <span>{label}</span>
              </div>
              <span className="font-semibold text-slate-800">{value}</span>
            </div>
          ))}
        </div>

        {/* أزرار الإجراءات */}
        <div className="flex items-center gap-3 pt-6">
          <button
            type="button"
            className="flex h-11 flex-1 items-center justify-center rounded-2xl bg-[#2D0643] text-xs font-semibold text-white shadow-md transition hover:bg-[#3D0A5A]"
          >
            Mark as Completed
          </button>

          <Link
            to={EMPLOYER_ROUTES.candidate(candidate.id)}
            className="flex h-11 items-center justify-center rounded-2xl border border-slate-200/90 bg-white px-6 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-900"
          >
            View Profile
          </Link>
        </div>

      </div>

      {/* قسم تحضيرات المقابلة (INTERVIEW PREPARATION) */}
      <div className="space-y-2.5 pt-4">
        <span className="text-[11px] font-bold tracking-[0.16em] text-slate-400 uppercase">
          INTERVIEW PREPARATION
        </span>

        <div className="space-y-2 text-xs text-slate-600">
          {preparationSteps.map((step, index) => (
            <p key={step}>
              <span className="font-semibold text-slate-700">{index + 1}.</span>
              &nbsp;&nbsp;{step}
            </p>
          ))}
        </div>
      </div>

    </div>
  );
}
