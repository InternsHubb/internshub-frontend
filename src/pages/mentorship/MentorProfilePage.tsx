import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Globe,
} from 'lucide-react';
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
    navigate(ROUTES.mentorshipConfirmBooking);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Breadcrumb Navigation */}
      <div>
        <Link
          to={ROUTES.mentorshipMentors}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#64748b] hover:text-[#5d198f] transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to Mentors</span>
        </Link>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#0f172a] dark:text-white tracking-tight">
          Mentor Profile
        </h1>
        <p className="text-[#475569] dark:text-slate-300 text-sm mt-1">
          Available mentor for your Frontend Development track
        </p>
      </div>

      {/* 2-Column Profile Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (8 cols): Bio, About, Expertise, Profiles */}
        <div className="lg:col-span-8 space-y-6">
          {/* Main Hero Card (Figma 142:9569) */}
          <div className="bg-white dark:bg-slate-900 border border-[#f1ecf7] dark:border-purple-900/40 rounded-[24px] p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start gap-6">
              <div className="relative shrink-0">
                <img
                  src={mentor.avatarUrl}
                  alt={mentor.name}
                  className="size-24 rounded-2xl object-cover ring-2 ring-purple-100 dark:ring-purple-950 shadow-sm"
                />
                <span className="absolute -bottom-1 -right-1 size-5 rounded-full bg-[#10b981] border-2 border-white dark:border-slate-900" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-1">
                  <h2 className="text-2xl font-bold text-[#0f172a] dark:text-white">
                    {mentor.name}
                  </h2>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ecfdf5] text-[#047857] text-xs font-semibold">
                    <span className="size-1.5 rounded-full bg-[#10b981]" />
                    Available
                  </span>
                </div>

                <p className="text-sm text-[#475569] dark:text-slate-300 font-medium">
                  {mentor.companySubtitle}
                </p>

                {/* Tracks list */}
                <div className="flex flex-wrap items-center gap-2 mt-4">
                  <span className="text-xs text-[#94a3b8] dark:text-slate-400 font-medium mr-1">
                    Tracks:
                  </span>
                  <span className="px-3 py-1 rounded-full bg-[#f4ecfa] dark:bg-purple-950/60 text-[#5d198f] dark:text-purple-300 text-xs font-semibold">
                    Frontend Development
                  </span>
                  <span className="px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700 text-[#64748b] dark:text-slate-400 text-xs font-medium">
                    Full Stack
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* About Section */}
          <div className="bg-white dark:bg-slate-900 border border-[#f1ecf7] dark:border-purple-900/40 rounded-[24px] p-6 sm:p-8 shadow-sm space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#94a3b8] dark:text-slate-400">
              ABOUT
            </h3>
            <p className="text-sm text-[#475569] dark:text-slate-300 leading-relaxed">
              {mentor.about}
            </p>
          </div>

          {/* Expertise Section */}
          <div className="bg-white dark:bg-slate-900 border border-[#f1ecf7] dark:border-purple-900/40 rounded-[24px] p-6 sm:p-8 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#94a3b8] dark:text-slate-400">
              EXPERTISE
            </h3>
            <div className="flex flex-wrap gap-2.5">
              {mentor.expertise.map((tag) => (
                <span
                  key={tag}
                  className="px-3.5 py-1.5 rounded-xl bg-[#f8f5fa] dark:bg-purple-950/40 border border-[#f3e8ff] dark:border-purple-900/60 text-[#5d198f] dark:text-purple-300 text-xs font-semibold"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Professional Profiles Section */}
          <div className="bg-white dark:bg-slate-900 border border-[#f1ecf7] dark:border-purple-900/40 rounded-[24px] p-6 sm:p-8 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#94a3b8] dark:text-slate-400">
              PROFESSIONAL PROFILES
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <a
                href={mentor.profiles.linkedin || 'https://linkedin.com'}
                target="_blank"
                rel="noreferrer"
                className="p-4 rounded-2xl border border-[#f1ecf7] dark:border-purple-900/30 bg-[#fbf9fc] dark:bg-purple-950/20 hover:bg-[#f4ecfa] hover:border-purple-200 transition-all group flex items-center gap-3.5"
              >
                <div className="size-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-[#0a66c2] shadow-sm group-hover:scale-105 transition-transform">
                  <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.65 1.65 0 1 0 0-3.3 1.65 1.65 0 0 0 0 3.3m1.39 9.74v-8.37H5.07v8.37h2.78z" />
                  </svg>
                </div>
                <div>
                  <div className="text-xs font-bold text-[#0f172a] dark:text-white">LinkedIn</div>
                  <div className="text-[11px] text-[#64748b] dark:text-slate-400">View Profile</div>
                </div>
              </a>

              <a
                href={mentor.profiles.github || 'https://github.com'}
                target="_blank"
                rel="noreferrer"
                className="p-4 rounded-2xl border border-[#f1ecf7] dark:border-purple-900/30 bg-[#fbf9fc] dark:bg-purple-950/20 hover:bg-[#f4ecfa] hover:border-purple-200 transition-all group flex items-center gap-3.5"
              >
                <div className="size-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-[#0f172a] dark:text-white shadow-sm group-hover:scale-105 transition-transform">
                  <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                </div>
                <div>
                  <div className="text-xs font-bold text-[#0f172a] dark:text-white">GitHub</div>
                  <div className="text-[11px] text-[#64748b] dark:text-slate-400">Code Repos</div>
                </div>
              </a>

              <a
                href={mentor.profiles.portfolio || 'https://portfolio.dev'}
                target="_blank"
                rel="noreferrer"
                className="p-4 rounded-2xl border border-[#f1ecf7] dark:border-purple-900/30 bg-[#fbf9fc] dark:bg-purple-950/20 hover:bg-[#f4ecfa] hover:border-purple-200 transition-all group flex items-center gap-3.5"
              >
                <div className="size-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-[#5d198f] dark:text-purple-300 shadow-sm group-hover:scale-105 transition-transform">
                  <Globe className="size-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#0f172a] dark:text-white">Portfolio</div>
                  <div className="text-[11px] text-[#64748b] dark:text-slate-400">Personal Site</div>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Availability Card & Book CTA */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-[#f1ecf7] dark:border-purple-900/40 rounded-[24px] p-6 sm:p-7 shadow-sm space-y-6 sticky top-24">
            {/* Availability Header */}
            <div className="flex items-center gap-3 pb-5 border-b border-[rgba(243,232,255,0.6)] dark:border-purple-900/30">
              <div className="size-10 rounded-xl bg-[#f4ecfa] dark:bg-purple-950/50 flex items-center justify-center text-[#5d198f] dark:text-purple-300">
                <Calendar className="size-5" />
              </div>
              <div>
                <h3 className="font-bold text-[#0f172a] dark:text-white text-sm">
                  Availability
                </h3>
                <p className="text-xs text-[#64748b] dark:text-slate-400">
                  45-minute mentorship sessions
                </p>
              </div>
            </div>

            {/* Next Available Slot */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-[#0f172a] dark:text-slate-200">
                Next Available Slot
              </span>
              {mentor.slots[0] && (
                <button
                  type="button"
                  onClick={() => setSelectedSlot(mentor.slots[0])}
                  className={`w-full p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between ${
                    selectedSlot.id === mentor.slots[0].id
                      ? 'border-[#5d198f] bg-[#fbf5fe] dark:bg-purple-950/40 shadow-sm ring-1 ring-[#5d198f]'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="size-2 rounded-full bg-[#10b981] shrink-0" />
                    <span className="text-xs font-bold text-[#0f172a] dark:text-white">
                      {mentor.slots[0].date.split(',')[0]}, {mentor.slots[0].time}
                    </span>
                  </div>
                </button>
              )}
            </div>

            {/* Upcoming Openings */}
            {mentor.slots.length > 1 && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-[#0f172a] dark:text-slate-200">
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
                        className={`w-full p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between text-xs ${
                          isSelected
                            ? 'border-[#5d198f] bg-[#fbf5fe] dark:bg-purple-950/40 shadow-sm ring-1 ring-[#5d198f]'
                            : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50'
                        }`}
                      >
                        <span className="font-medium text-[#475569] dark:text-slate-300">
                          {slot.date.replace(', 2026', '')}
                        </span>
                        <span className="font-semibold text-[#0f172a] dark:text-white">
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
                <Calendar className="size-4" />
                <span>Book a Session</span>
              </button>

              <p className="text-[11px] text-[#94a3b8] dark:text-slate-400 text-center leading-relaxed mt-3">
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
