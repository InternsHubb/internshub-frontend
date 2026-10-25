import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import backIcon from '@/assets/mentorship/profile-back.svg';
import calendarIcon from '@/assets/mentorship/profile-calendar.svg';
import bookIcon from '@/assets/mentorship/profile-book.svg';
import { MentorAvatar, MentorshipNotice } from '@/components/mentorship/MentorshipParts';
import { ROUTES } from '@/constants/routes';
import { useMentorship } from '@/context/MentorshipContext';

// The mentors API returns a name, a bio and tracks; the Figma expertise tags and professional
// profile links have no data behind them, so they are not shown.

export const MentorProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { getMentorById, setBookingDraft, trackName } = useMentorship();
  const mentor = getMentorById(id ?? '');
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);

  if (!mentor) {
    return (
      <MentorshipNotice title={t('mentorship.live.mentorNotFound')}>
        <Link to={ROUTES.mentorshipMentors} className="text-sm font-semibold text-[#5d198f]">
          {t('mentorship.booking.otherMentors')}
        </Link>
      </MentorshipNotice>
    );
  }

  const isAvailable = mentor.slots.length > 0;
  const selectedSlot = mentor.slots.find((slot) => slot.id === selectedSlotId) ?? mentor.slots[0];

  const handleBookSession = () => {
    if (selectedSlot) setBookingDraft({ mentor, slot: selectedSlot });
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
          <img src={backIcon} alt="" className="rtl:rotate-180" />
          <span>Back to Mentors</span>
        </Link>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#0f172a] tracking-tight">
          Mentor Profile
        </h1>
        {trackName && (
          <p className="text-[#475569] text-sm mt-1">
            {t('mentorship.live.profileSubtitle', { track: trackName })}
          </p>
        )}
      </div>

      {/* 2-Column Profile Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (8 cols): Bio and About */}
        <div className="lg:col-span-8 space-y-6">
          {/* Main Hero Card (Figma 142:9569) */}
          <div className="bg-white border border-[#f1ecf7] rounded-2xl p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start gap-6">
              <div className="relative shrink-0">
                <MentorAvatar name={mentor.name} className="size-24 rounded-2xl text-3xl ring-2 ring-purple-100 shadow-sm" />
                <span className={`absolute -bottom-1 -end-1 size-5 rounded-full border-2 border-white ${isAvailable ? 'bg-[#10b981]' : 'bg-[#94a3b8]'}`} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-1">
                  <h2 className="text-2xl font-bold text-[#0f172a] ">
                    <bdi>{mentor.name}</bdi>
                  </h2>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${isAvailable ? 'bg-[#ecfdf5] text-[#047857]' : 'bg-[#f1f5f9] text-[#64748b]'}`}>
                    <span className={`size-1.5 rounded-full ${isAvailable ? 'bg-[#10b981]' : 'bg-[#94a3b8]'}`} />
                    {isAvailable ? 'Available' : 'No available slots'}
                  </span>
                </div>

                {/* Tracks list */}
                {mentor.trackNames.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 mt-4">
                    <span className="text-xs text-[#94a3b8] font-medium me-1">
                      Tracks:
                    </span>
                    {mentor.trackNames.map((name) => (
                      <span key={name} className="px-3 py-1 rounded-full bg-[#f4ecfa] text-[#5d198f] text-xs font-semibold">
                        <bdi>{name}</bdi>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* About Section */}
          {mentor.bio && (
            <div className="bg-white border border-[#f1ecf7] rounded-2xl p-6 shadow-sm space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#94a3b8] ">
                ABOUT
              </h3>
              <p className="text-sm text-[#475569] leading-relaxed whitespace-pre-line">
                <bdi>{mentor.bio}</bdi>
              </p>
            </div>
          )}
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
                  1:1 mentorship sessions
                </p>
              </div>
            </div>

            {!isAvailable && (
              <p className="text-xs text-[#64748b]">
                {t(mentor.slotsError ? 'mentorship.live.slotsError' : 'mentorship.live.noOpenSlots')}
              </p>
            )}

            {/* Next Available Slot */}
            {selectedSlot && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-[#0f172a] ">
                  Next Available Slot
                </span>
                <button
                  type="button"
                  aria-pressed={selectedSlot.id === mentor.slots[0].id}
                  onClick={() => setSelectedSlotId(mentor.slots[0].id)}
                  className={`w-full px-3 py-2 rounded-lg border text-start transition-all flex items-center justify-between ${
                    selectedSlot.id === mentor.slots[0].id
                      ? 'border-[#5d198f] bg-[#fbf5fe] shadow-sm ring-1 ring-[#5d198f]'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="size-2 rounded-full bg-[#10b981] shrink-0" />
                    <span className="text-xs font-bold text-[#0f172a] ">
                      {mentor.slots[0].weekday}, {mentor.slots[0].time}
                    </span>
                  </div>
                </button>
              </div>
            )}

            {/* Upcoming Openings */}
            {mentor.slots.length > 1 && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-[#0f172a] ">
                  Upcoming Openings
                </span>
                <div className="space-y-2 max-h-[280px] overflow-y-auto">
                  {mentor.slots.slice(1).map((slot) => {
                    const isSelected = selectedSlot?.id === slot.id;
                    return (
                      <button
                        key={slot.id}
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() => setSelectedSlotId(slot.id)}
                        className={`w-full px-3 py-2 rounded-lg border text-start transition-all flex items-center justify-between gap-2 text-xs ${
                          isSelected
                            ? 'border-[#5d198f] bg-[#fbf5fe] shadow-sm ring-1 ring-[#5d198f]'
                            : 'border-slate-200 bg-white hover:bg-slate-50'
                        }`}
                      >
                        <span className="font-medium text-[#475569] ">
                          {slot.date}
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
                disabled={!isAvailable}
                onClick={handleBookSession}
                className="w-full py-3.5 px-4 rounded-xl text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md hover:opacity-95 transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
                style={{
                  backgroundImage:
                    'linear-gradient(162.62deg, rgba(106, 42, 138, 0.92) 0%, rgba(59, 4, 84, 0.96) 71.43%)',
                }}
              >
                <img src={bookIcon} alt="" />
                <span>Book a Session</span>
              </button>

              <p className="text-[11px] text-[#94a3b8] text-center leading-relaxed mt-3">
                1:1 session • Cancel 24+ hours in advance to retain session credit
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorProfilePage;
