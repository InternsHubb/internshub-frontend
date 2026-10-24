import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Layers,
  Info,
} from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { useMentorship } from '@/context/MentorshipContext';

export const MentorsPage: React.FC = () => {
  const navigate = useNavigate();
  const { mentors } = useMentorship();

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Breadcrumb Navigation */}
      <div>
        <Link
          to={ROUTES.mentorship}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#64748b] hover:text-[#5d198f] transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to Mentorship</span>
        </Link>
      </div>

      {/* Header Row */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-2">
        <div className="max-w-2xl">
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#0f172a] dark:text-white tracking-tight">
            Mentors
          </h1>
          <p className="text-[#475569] dark:text-slate-300 text-sm mt-2 leading-relaxed">
            Available vetted engineering mentors allocated to your current learning curriculum and sprint milestones.
          </p>
        </div>

        {/* Track Context Badge & Pill (Figma 142:9393) */}
        <div className="inline-flex items-center gap-3.5 p-3 px-4 rounded-2xl bg-[#f8f4fb] dark:bg-purple-950/40 border border-[#f1e5f8] dark:border-purple-900/50 self-start lg:self-auto shrink-0 shadow-sm">
          <div className="size-9 rounded-xl bg-[#f3e8ff] dark:bg-purple-900/50 flex items-center justify-center text-[#5d198f] dark:text-purple-300 shrink-0">
            <Layers className="size-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-[#5d198f] dark:text-purple-300">
              YOUR TRACK <span className="text-slate-400">•</span> Frontend Development
            </div>
            <div className="text-[11px] text-[#64748b] dark:text-slate-400">
              You're viewing mentors for your current track.
            </div>
          </div>
        </div>
      </div>

      {/* Mentors Grid (Figma 142:9401) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mentors.map((mentor) => {
          const isAvailable = mentor.status === 'Available Slots';

          return (
            <div
              key={mentor.id}
              className="bg-white dark:bg-slate-900 border border-[#f1ecf7] dark:border-purple-900/40 rounded-[24px] p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Top Avatar & Badges */}
                <div className="flex items-start justify-between gap-3 mb-5">
                  <div className="relative">
                    <img
                      src={mentor.avatarUrl}
                      alt={mentor.name}
                      className="size-16 rounded-2xl object-cover ring-2 ring-purple-100 dark:ring-purple-950 shadow-sm"
                    />
                    <span
                      className={`absolute -bottom-1 -right-1 size-4 rounded-full border-2 border-white dark:border-slate-900 ${
                        isAvailable ? 'bg-emerald-500' : 'bg-slate-400'
                      }`}
                      title={isAvailable ? 'Online / Available' : 'Offline'}
                    />
                  </div>

                  <div className="flex flex-col items-end gap-1.5">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                        isAvailable
                          ? 'bg-[#ecfdf5] text-[#047857]'
                          : 'bg-[#f1f5f9] text-[#64748b]'
                      }`}
                    >
                      <span
                        className={`size-1.5 rounded-full ${
                          isAvailable ? 'bg-[#10b981]' : 'bg-[#94a3b8]'
                        }`}
                      />
                      {mentor.status}
                    </span>

                    <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-[#f4ecfa] dark:bg-purple-950/60 text-[#5d198f] dark:text-purple-300">
                      Frontend Development
                    </span>
                  </div>
                </div>

                {/* Name & Subtitle */}
                <h2 className="text-lg font-bold text-[#0f172a] dark:text-white leading-snug">
                  {mentor.name}
                </h2>
                <p className="text-xs font-semibold text-[#672b97] dark:text-purple-400 mt-1 leading-relaxed">
                  {mentor.companySubtitle}
                </p>

                {/* Bio / Description */}
                <p className="text-xs text-[#475569] dark:text-slate-300 mt-3 leading-relaxed line-clamp-3">
                  {mentor.description}
                </p>
              </div>

              {/* Bottom Schedule & CTA */}
              <div className="pt-6 mt-6 border-t border-[rgba(243,232,255,0.6)] dark:border-purple-900/30 space-y-3">
                <div className="bg-[#f8f5fa] dark:bg-purple-950/30 border border-[#f3e8ff]/60 dark:border-purple-900/40 rounded-xl px-3.5 py-2 flex items-center justify-between text-xs text-[#64748b] dark:text-slate-400 font-medium">
                  <div className="flex items-center gap-2">
                    <Calendar className="size-3.5 text-[#5d198f] dark:text-purple-400 shrink-0" />
                    <span>{isAvailable ? 'Next Available:' : 'Schedule:'}</span>
                  </div>
                  <strong className="text-[#0f172a] dark:text-white font-semibold">
                    {mentor.nextAvailable}
                  </strong>
                </div>

                {isAvailable ? (
                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        ROUTES.mentorshipMentorProfile.replace(':id', mentor.id)
                      )
                    }
                    className="w-full py-3 px-4 rounded-xl text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md hover:opacity-95 transition-opacity group"
                    style={{
                      backgroundImage:
                        'linear-gradient(162.62deg, rgba(106, 42, 138, 0.92) 0%, rgba(59, 4, 84, 0.96) 71.43%)',
                    }}
                  >
                    <span>View Profile</span>
                    <ArrowRight className="size-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="w-full py-3 px-4 rounded-xl bg-[#f5eff9] dark:bg-purple-950/20 text-[#804a8a] dark:text-purple-400 font-semibold text-xs flex items-center justify-center gap-2 cursor-not-allowed"
                  >
                    <span>View Profile</span>
                    <ArrowRight className="size-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Info Notice Banner */}
      <div className="rounded-2xl p-4 bg-[#fbf7fe] dark:bg-purple-950/30 border border-[#f3e9fc] dark:border-purple-900/40 flex items-center gap-3 text-xs text-[#4c0585] dark:text-purple-300">
        <div className="size-6 rounded-full bg-[#f3e8ff] dark:bg-purple-900/50 flex items-center justify-center text-[#5d198f] dark:text-purple-300 shrink-0">
          <Info className="size-3.5" />
        </div>
        <p>
          <strong className="font-semibold text-[#3b0454] dark:text-purple-200">
            You're viewing mentors for Frontend Development only.
          </strong>{' '}
          • Mentors are shown based on your current track.
        </p>
      </div>

      {/* Page Footer */}
      <footer className="pt-6 border-t border-slate-200/60 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
        <div>
          © 2024 EdTech. All rights reserved.
        </div>
        <div className="flex items-center gap-6">
          <button type="button" className="hover:text-[#5d198f] transition-colors">
            Help Center
          </button>
          <button type="button" className="hover:text-[#5d198f] transition-colors">
            Mentor Directory
          </button>
          <button type="button" className="hover:text-[#5d198f] transition-colors">
            Privacy Policy
          </button>
          <button type="button" className="hover:text-[#5d198f] transition-colors">
            Terms of Service
          </button>
        </div>
      </footer>
    </div>
  );
};

export default MentorsPage;
