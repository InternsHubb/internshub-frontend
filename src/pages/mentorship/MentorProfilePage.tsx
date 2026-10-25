import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import backIcon from '@/assets/mentorship/profile-back.svg';
import calendarIcon from '@/assets/mentorship/profile-calendar.svg';
import bookIcon from '@/assets/mentorship/profile-book.svg';
import globeIcon from '@/assets/mentorship/profile-globe.svg';
import linkedinIcon from '@/assets/mentorship/profile-linkedin.svg';
import githubIcon from '@/assets/mentorship/profile-github.svg';
import { ROUTES } from '@/constants/routes';
import { useMentorship } from '@/context/MentorshipContext';
import type { MentorSlot } from '@/types/mentorship';

export const MentorProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getMentorById, setBookingDraft } = useMentorship();

  const mentor = getMentorById(id || 'aisha-patel') || getMentorById('aisha-patel')!;

  const [selectedSlot, setSelectedSlot] = useState<MentorSlot>(
    mentor.slots[0] || {
      id: 'slot-default',
      date: 'Wednesday, Oct 1, 2026',
      time: '4:30 PM – 5:15 PM',
      duration: '45 min',
      isoDateTime: '2026-10-01T16:30:00',
    }
  );

  const handleBookSession = () => {
    setBookingDraft({
      mentor,
      slot: selectedSlot,
      topic: 'React state management in a large application',
      subtopic: 'Architecture & modularization focus',
    });
    navigate(ROUTES.mentorshipBookSession.replace(':id', mentor.id));
  };

  return (
    <div className="mentor-profile space-y-6 animate-in fade-in duration-300">
      {/* Breadcrumb Navigation */}
      <div>
        <Link
          to={ROUTES.mentorshipMentors}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#64748b] hover:text-[#5d198f] transition-colors"
        >
          <img src={backIcon} alt="" />
          <span>Back to Mentors</span>
        </Link>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#0f172a] tracking-tight">
          Mentor Profile
        </h1>
        <p className="text-[#475569] text-sm mt-1">
          Available mentor for your Frontend Development track
        </p>
      </div>

      {/* 2-Column Profile Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (8 cols): Bio, About, Expertise, Profiles */}
        <div className="lg:col-span-8 space-y-6">
          {/* Main Hero Card (Figma 142:9569) */}
          <div className="bg-white border border-[#f1ecf7] rounded-2xl p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start gap-6">
              <div className="relative shrink-0">
                <img
                  src={mentor.profileAvatarUrl ?? mentor.avatarUrl}
                  alt={mentor.name}
                  className="size-24 rounded-2xl object-cover ring-2 ring-purple-100 shadow-sm"
                />
                <span className="absolute -bottom-1 -right-1 size-5 rounded-full bg-[#10b981] border-2 border-white " />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-1">
                  <h2 className="text-2xl font-bold text-[#0f172a] ">
                    {mentor.name}
                  </h2>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ecfdf5] text-[#047857] text-xs font-semibold">
                    <span className="size-1.5 rounded-full bg-[#10b981]" />
                    Available
                  </span>
                </div>

                <p className="text-sm text-[#475569] font-medium">
                  {mentor.companySubtitle}
                </p>

                {/* Tracks list */}
                <div className="flex flex-wrap items-center gap-2 mt-4">
                  <span className="text-xs text-[#94a3b8] font-medium mr-1">
                    Tracks:
                  </span>
                  <span className="px-3 py-1 rounded-full bg-[#f4ecfa] text-[#5d198f] text-xs font-semibold">
                    Frontend Development
                  </span>
                  <span className="px-3 py-1 rounded-full border border-slate-200 text-[#64748b] text-xs font-medium">
                    Full Stack
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* About Section */}
          <div className="bg-white border border-[#f1ecf7] rounded-2xl p-6 shadow-sm space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#94a3b8] ">
              ABOUT
            </h3>
            <p className="text-sm text-[#475569] leading-relaxed">
              {mentor.about}
            </p>
          </div>

          {/* Expertise Section */}
          <div className="bg-white border border-[#f1ecf7] rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#94a3b8] ">
              EXPERTISE
            </h3>
            <div className="flex flex-wrap gap-2.5">
              {mentor.expertise.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1.5 rounded-lg bg-[#f8f5fa] border border-[#f3e8ff] text-[#5d198f] text-xs font-semibold"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Professional Profiles Section */}
          <div className="bg-white border border-[#f1ecf7] rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#94a3b8] ">
              PROFESSIONAL PROFILES
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <a
                href={mentor.profiles.linkedin || 'https://linkedin.com'}
                target="_blank"
                rel="noreferrer"
                className="p-3.5 rounded-xl border border-[#f1ecf7] bg-[#fbf9fc] hover:bg-[#f4ecfa] hover:border-purple-200 transition-all group flex items-center gap-3.5"
              >
                <div className="size-10 rounded-xl bg-white flex items-center justify-center text-[#0a66c2] shadow-sm group-hover:scale-105 transition-transform">
                  <img src={linkedinIcon} alt="" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#0f172a] ">LinkedIn</div>
                  <div className="text-[11px] text-[#64748b] ">View Profile</div>
                </div>
              </a>

              <a
                href={mentor.profiles.github || 'https://github.com'}
                target="_blank"
                rel="noreferrer"
                className="p-3.5 rounded-xl border border-[#f1ecf7] bg-[#fbf9fc] hover:bg-[#f4ecfa] hover:border-purple-200 transition-all group flex items-center gap-3.5"
              >
                <div className="size-10 rounded-xl bg-white flex items-center justify-center text-[#0f172a] shadow-sm group-hover:scale-105 transition-transform">
                  <img src={githubIcon} alt="" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#0f172a] ">GitHub</div>
                  <div className="text-[11px] text-[#64748b] ">Code Repos</div>
                </div>
              </a>

              <a
                href={mentor.profiles.portfolio || 'https://portfolio.dev'}
                target="_blank"
                rel="noreferrer"
                className="p-3.5 rounded-xl border border-[#f1ecf7] bg-[#fbf9fc] hover:bg-[#f4ecfa] hover:border-purple-200 transition-all group flex items-center gap-3.5"
              >
                <div className="size-10 rounded-xl bg-white flex items-center justify-center text-[#5d198f] shadow-sm group-hover:scale-105 transition-transform">
                  <img src={globeIcon} alt="" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#0f172a] ">Portfolio</div>
                  <div className="text-[11px] text-[#64748b] ">Personal Site</div>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Availability Card & Book CTA */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-[#f1ecf7] rounded-2xl p-6 shadow-sm space-y-6 sticky top-24">
            {/* Availability Header */}
            <div className="flex items-center gap-3 pb-5 border-b border-[rgba(243,232,255,0.6)] ">
              <div className="size-10 rounded-xl bg-[#f4ecfa] flex items-center justify-center text-[#5d198f] ">
                <img src={calendarIcon} alt="" />
              </div>
              <div>
                <h3 className="font-bold text-[#0f172a] text-sm">
                  Availability
                </h3>
                <p className="text-xs text-[#64748b] ">
                  45-minute mentorship sessions
                </p>
              </div>
            </div>

            {/* Next Available Slot */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-[#0f172a] ">
                Next Available Slot
              </span>
              {mentor.slots[0] && (
                <button
                  type="button"
                  onClick={() => setSelectedSlot(mentor.slots[0])}
                  className={`w-full px-3 py-2 rounded-lg border text-start transition-all flex items-center justify-between ${
                    selectedSlot.id === mentor.slots[0].id
                      ? 'border-[#5d198f] bg-[#fbf5fe] shadow-sm ring-1 ring-[#5d198f]'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="size-2 rounded-full bg-[#10b981] shrink-0" />
                    <span className="text-xs font-bold text-[#0f172a] ">
                      {mentor.slots[0].date.split(',')[0]}, {mentor.slots[0].time}
                    </span>
                  </div>
                </button>
              )}
            </div>

            {/* Upcoming Openings */}
            {mentor.slots.length > 1 && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-[#0f172a] ">
                  Upcoming Openings
                </span>
                <div className="space-y-2">
                  {mentor.slots.slice(1).map((slot) => {
                    const isSelected = selectedSlot.id === slot.id;

                    return (
                      <button
                        key={slot.id}
                        type="button"
                        onClick={() => setSelectedSlot(slot)}
                        className={`w-full px-3 py-2 rounded-lg border text-left transition-all flex items-center justify-between text-xs ${
                          isSelected
                            ? 'border-[#5d198f] bg-[#fbf5fe] shadow-sm ring-1 ring-[#5d198f]'
                            : 'border-slate-200 bg-white hover:bg-slate-50'
                        }`}
                      >
                        <span className="font-medium text-[#475569] ">
                          {slot.date.replace(', 2026', '')}
                        </span>
                        <span className="font-semibold text-[#0f172a] ">
                          {slot.time}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Book CTA Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleBookSession}
                className="w-full py-3.5 px-4 rounded-xl text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md hover:opacity-95 transition-opacity"
                style={{
                  backgroundImage:
                    'linear-gradient(162.62deg, rgba(106, 42, 138, 0.92) 0%, rgba(59, 4, 84, 0.96) 71.43%)',
                }}
              >
                <img src={bookIcon} alt="" />
                <span>Book a Session</span>
              </button>

              <p className="text-[11px] text-[#94a3b8] text-center leading-relaxed mt-3">
                45-min 1:1 session • Cancel 24+ hours in advance to retain session credit
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorProfilePage;
