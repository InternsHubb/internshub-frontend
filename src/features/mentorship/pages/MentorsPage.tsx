import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import backIcon from '@/assets/mentorship/directory-back.svg';
import trackIcon from '@/assets/mentorship/directory-track.svg';
import calendarIcon from '@/assets/mentorship/directory-calendar.svg';
import arrowIcon from '@/assets/mentorship/directory-arrow.svg';
import mutedArrowIcon from '@/assets/mentorship/directory-arrow-muted.svg';
import infoIcon from '@/assets/mentorship/directory-info.svg';
import { useTranslation } from 'react-i18next';
import { MentorAvatar } from '@/features/mentorship/components/MentorshipParts';
import { ROUTES } from '@/app/routes';
import { useMentorship } from '@/features/mentorship/context/MentorshipContext';

export const MentorsPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { mentors, trackName } = useMentorship();

  return (
    <div className="mentor-directory space-y-6 animate-in fade-in duration-300">
      {/* Breadcrumb Navigation */}
      <div>
        <Link
          to={ROUTES.mentorship}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#3a0353] hover:text-[#5d198f] transition-colors"
        >
          <img src={backIcon} alt="" />
          <span>Back to Mentorship</span>
        </Link>
      </div>

      {/* Header Row */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-[#e7dbe9] pb-[25px]">
        <div className="max-w-2xl">
          <h1 className="text-3xl md:text-[40px] font-bold text-[#3b0454] tracking-tight">
            Mentors
          </h1>
          <p className="text-[#4d444f] text-base mt-1 leading-[26px]">
            Available vetted engineering mentors allocated to your current learning curriculum and sprint milestones.
          </p>
        </div>

        {/* Track Context Badge & Pill (Figma 142:9393) */}
        {trackName && (
          <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#fbf0fe] self-start lg:self-auto shrink-0 shadow-sm">
            <div className="size-8 rounded-lg bg-[#f3e8ff] flex items-center justify-center text-[#5d198f] shrink-0">
              <img src={trackIcon} alt="" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-[#7e44a3] ">
                YOUR TRACK <span className="text-slate-400">•</span> <bdi>{trackName}</bdi>
              </div>
              <div className="text-[11px] text-[#64748b] ">
                You're viewing mentors for your current track.
              </div>
            </div>
          </div>
        )}
      </div>

      {mentors.length === 0 && (
        <div className="rounded-xl bg-white border border-[#f1ecf7] p-8 text-center shadow-sm">
          <h2 className="text-base font-bold text-[#0f172a]">{t('mentorship.live.noMentorsTitle')}</h2>
          <p className="mt-1 text-xs text-[#64748b]">{t('mentorship.live.noMentorsBody')}</p>
        </div>
      )}

      {/* Mentors Grid (Figma 142:9401) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 py-2">
        {mentors.map((mentor) => {
          const isAvailable = mentor.slots.length > 0;
          const firstSlot = mentor.slots[0];
          const schedule = firstSlot
            ? `${firstSlot.weekday}, ${firstSlot.time}`
            : t(mentor.slotsError ? 'mentorship.live.slotsError' : 'mentorship.live.noOpenSlots');

          return (
            <div
              key={mentor.id}
              className="mentor-directory-card bg-[#f7f1f9] rounded-xl p-6 shadow-[0_1px_1px_rgba(0,0,0,0.05)] flex flex-col justify-between"
            >
              <div>
                {/* Top Avatar & Badges */}
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="relative">
                    <MentorAvatar name={mentor.name} className="size-20 rounded-xl text-2xl shadow-sm" />
                    <span
                      className={`absolute -bottom-1 -right-1 size-4 rounded-full border-2 border-white ${
                        isAvailable ? 'bg-[#16a34a]' : 'bg-[#817184]'
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
                      {isAvailable ? 'Available Slots' : 'No available slots'}
                    </span>

                    {mentor.trackNames.map((name) => (
                      <span key={name} className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-[#f4ecfa] text-[#5d198f] ">
                        <bdi>{name}</bdi>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Name */}
                <h2 className="text-[22px] font-semibold tracking-[-0.55px] text-[#1f1a23] leading-snug">
                  <bdi>{mentor.name}</bdi>
                </h2>

                {/* Bio / Description */}
                {mentor.bio && (
                  <p className="text-sm text-[#4d444f] mt-2 leading-[22px] line-clamp-4">
                    <bdi>{mentor.bio}</bdi>
                  </p>
                )}
              </div>

              {/* Bottom Schedule & CTA */}
              <div className="pt-3 mt-6 border-t border-[#e7dbe9]/50 space-y-4">
                <div className="bg-[#f2eaf5]/60 rounded-lg px-2.5 py-2.5 flex items-center justify-between text-xs text-[#64748b] font-medium">
                  <div className="flex items-center gap-2">
                    <img src={calendarIcon} alt="" />
                    <span>{isAvailable ? 'Next Available:' : 'Schedule:'}</span>
                  </div>
                  <strong className="text-[#0f172a] font-semibold">
                    {schedule}
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
                    className="w-full py-3 px-4 rounded-lg text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-md hover:opacity-95 transition-opacity group"
                    style={{
                      backgroundImage:
                        'linear-gradient(162.62deg, rgba(106, 42, 138, 0.92) 0%, rgba(59, 4, 84, 0.96) 71.43%)',
                    }}
                  >
                    <span>View Profile</span>
                    <img src={arrowIcon} alt="" />
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="w-full py-3 px-4 rounded-lg bg-[#f2eaf5] text-[#804a8a] font-semibold text-xs flex items-center justify-center gap-2 cursor-not-allowed"
                  >
                    <span>View Profile</span>
                    <img src={mutedArrowIcon} alt="" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Info Notice Banner */}
      {trackName && (
        <div className="rounded-xl px-6 py-4 bg-[#fbf0fe] border border-[#e7dbe9] flex items-center gap-3 text-xs text-[#4c0585] ">
          <div className="size-6 rounded-full bg-[#f3e8ff] flex items-center justify-center text-[#5d198f] shrink-0">
            <img src={infoIcon} alt="" />
          </div>
          <p>
            <strong className="font-semibold text-[#3b0454] ">
              You're viewing mentors for <bdi>{trackName}</bdi> only.
            </strong>{' '}
            • Mentors are shown based on your current track.
          </p>
        </div>
      )}

      {/* Page Footer */}
      <footer className="pt-6 border-t border-slate-200/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
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
