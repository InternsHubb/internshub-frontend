import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Clock,
  FolderKanban,
  Wallet,
  AlertCircle,
  Check,
  Edit2,
} from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { useMentorship } from '@/context/MentorshipContext';

export const ConfirmBookingPage: React.FC = () => {
  const navigate = useNavigate();
  const { draft, balance, confirmBooking } = useMentorship();

  const [topic, setTopic] = useState(
    draft?.topic || 'React state management in a large application'
  );
  const [subtopic, setSubtopic] = useState(
    draft?.subtopic || 'Architecture & modularization focus'
  );
  const [isEditingTopic, setIsEditingTopic] = useState(false);

  if (!draft) {
    return (
      <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-[24px] p-8 border border-[#f1ecf7] dark:border-purple-900/40 max-w-lg mx-auto shadow-sm">
        <h2 className="text-xl font-bold text-[#0f172a] dark:text-white mb-2">No session selected</h2>
        <p className="text-sm text-[#64748b] dark:text-slate-400 mb-6">
          Please select a mentor and slot before proceeding to confirmation.
        </p>
        <Link
          to={ROUTES.mentorshipMentors}
          className="px-5 py-2.5 rounded-xl text-white font-semibold text-xs shadow-md"
          style={{
            backgroundImage:
              'linear-gradient(162.62deg, rgba(106, 42, 138, 0.92) 0%, rgba(59, 4, 84, 0.96) 71.43%)',
          }}
        >
          Browse Mentors
        </Link>
      </div>
    );
  }

  const handleConfirm = () => {
    confirmBooking();
    navigate(ROUTES.mentorshipBookingSuccess);
  };

  const remainingAfter = Math.max(0, balance.remaining - 1);

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Breadcrumb */}
      <div>
        <Link
          to={ROUTES.mentorshipMentorProfile.replace(':id', draft.mentor.id)}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#64748b] hover:text-[#5d198f] transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to Book a Session</span>
        </Link>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-[#0f172a] dark:text-white tracking-tight">
          Confirm Booking
        </h1>
        <p className="text-[#475569] dark:text-slate-300 text-sm mt-1">
          Review your session details before confirming.
        </p>
      </div>

      {/* Main Review Card (Figma 142:10098) */}
      <div className="bg-white dark:bg-slate-900 rounded-[24px] p-6 sm:p-8 border border-[#f1ecf7] dark:border-purple-900/40 shadow-sm space-y-6">
        {/* Top Card Title & Status Badge */}
        <div className="flex items-center justify-between pb-4 border-b border-[rgba(243,232,255,0.6)] dark:border-purple-900/30">
          <div className="flex items-center gap-2 text-base font-bold text-[#0f172a] dark:text-white">
            <span className="size-2 rounded-full bg-[#5d198f]" />
            <span>Session Details</span>
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ecfdf5] text-[#047857] text-xs font-semibold">
            <span className="size-1.5 rounded-full bg-[#10b981]" />
            Ready to Confirm
          </span>
        </div>

        {/* Mentor Info Row */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#faf7fc] dark:bg-purple-950/20 border border-[#f3e8ff]/80 dark:border-purple-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={draft.mentor.avatarUrl}
                alt={draft.mentor.name}
                className="size-14 rounded-2xl object-cover ring-2 ring-purple-100 dark:ring-purple-950"
              />
              <span className="absolute -bottom-1 -right-1 size-4 rounded-full bg-[#5d198f] text-white flex items-center justify-center text-[10px]">
                ✓
              </span>
            </div>

            <div>
              <h3 className="font-bold text-[#0f172a] dark:text-white text-base">
                {draft.mentor.name}
              </h3>
              <p className="text-xs text-[#64748b] dark:text-slate-400 mt-0.5">
                {draft.mentor.role}
              </p>
              <p className="text-xs font-semibold text-[#672b97] dark:text-purple-300 mt-1">
                Frontend Development Fellow Lead
              </p>
            </div>
          </div>

          <span className="px-3.5 py-1.5 rounded-full bg-white dark:bg-slate-800 text-[#475569] dark:text-slate-200 text-xs font-semibold border border-[#e9d5ff]/70 dark:border-slate-700 self-start sm:self-auto shadow-2xs">
            1-on-1 Mentorship
          </span>
        </div>

        {/* Date & Time Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Date Card */}
          <div className="p-4 rounded-2xl bg-[#f8fafc] dark:bg-purple-950/20 border border-[#f1ecf7] dark:border-purple-900/30 flex items-start gap-3.5">
            <div className="size-10 rounded-xl bg-[#f3e8ff] dark:bg-purple-900/50 text-[#5d198f] dark:text-purple-300 flex items-center justify-center shrink-0">
              <Calendar className="size-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-[#94a3b8] dark:text-slate-400 uppercase tracking-wider">
                Date
              </span>
              <div className="text-sm font-bold text-[#0f172a] dark:text-white mt-0.5">
                {draft.slot.date}
              </div>
            </div>
          </div>

          {/* Time & Timezone Card */}
          <div className="p-4 rounded-2xl bg-[#f8fafc] dark:bg-purple-950/20 border border-[#f1ecf7] dark:border-purple-900/30 flex items-start gap-3.5">
            <div className="size-10 rounded-xl bg-[#f3e8ff] dark:bg-purple-900/50 text-[#5d198f] dark:text-purple-300 flex items-center justify-center shrink-0">
              <Clock className="size-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-[#94a3b8] dark:text-slate-400 uppercase tracking-wider">
                Time & Timezone
              </span>
              <div className="text-sm font-bold text-[#0f172a] dark:text-white mt-0.5">
                {draft.slot.time} • {draft.slot.duration}
              </div>
              <div className="text-xs text-[#64748b] dark:text-slate-400 mt-0.5">
                Eastern Time (EST / UTC-5)
              </div>
            </div>
          </div>
        </div>

        {/* Selected Discussion Topic */}
        <div className="p-5 rounded-2xl bg-[#f8fafc] dark:bg-purple-950/20 border border-[#f1ecf7] dark:border-purple-900/30 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-[#94a3b8] dark:text-slate-400 uppercase tracking-wider">
              <FolderKanban className="size-4 text-[#5d198f] dark:text-purple-300" />
              <span>Selected Discussion Topic</span>
            </div>
            <button
              type="button"
              onClick={() => setIsEditingTopic(!isEditingTopic)}
              className="text-xs font-semibold text-[#5d198f] dark:text-purple-300 hover:opacity-80 flex items-center gap-1"
            >
              <Edit2 className="size-3" />
              <span>{isEditingTopic ? 'Done' : 'Edit'}</span>
            </button>
          </div>

          {isEditingTopic ? (
            <div className="space-y-2 pt-1">
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full text-sm font-bold text-[#0f172a] dark:text-white bg-white dark:bg-slate-800 border border-purple-200 dark:border-purple-900 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5d198f]/30"
              />
              <input
                type="text"
                value={subtopic}
                onChange={(e) => setSubtopic(e.target.value)}
                className="w-full text-xs text-[#64748b] dark:text-slate-300 bg-white dark:bg-slate-800 border border-purple-200 dark:border-purple-900 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5d198f]/30"
              />
            </div>
          ) : (
            <div>
              <h4 className="text-sm font-bold text-[#0f172a] dark:text-white">
                {topic}
              </h4>
              <p className="text-xs text-[#64748b] dark:text-slate-400 mt-0.5">
                {subtopic}
              </p>
            </div>
          )}
        </div>

        {/* Mentorship Balance Module */}
        <div className="p-5 rounded-2xl bg-[#f8f5fa] dark:bg-purple-950/30 border border-[#f3e8ff]/80 dark:border-purple-900/40 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 font-bold text-[#5d198f] dark:text-purple-300">
              <Wallet className="size-4" />
              <span>Mentorship Balance</span>
            </div>
            <span className="text-[#64748b] dark:text-slate-400">
              <strong className="text-[#0f172a] dark:text-white">{balance.remaining} sessions</strong> remaining now
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-[#475569] dark:text-slate-300 font-medium">
              {remainingAfter} sessions remaining after booking
            </span>
            <span className="px-2 py-0.5 rounded-full bg-[#f3e8ff] dark:bg-purple-900/50 text-[#5d198f] dark:text-purple-300 font-bold text-[11px]">
              -1 session
            </span>
          </div>

          {/* Progress bar */}
          <div className="h-2 w-full bg-[#f1edf5] dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#5d198f] rounded-full transition-all"
              style={{
                width: `${((balance.total - remainingAfter) / balance.total) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Cancellation Policy Banner */}
        <div className="rounded-2xl p-4 bg-[#fffbeb] dark:bg-amber-950/30 border border-[#fef3c7] dark:border-amber-900/40 flex items-start gap-3 text-xs text-[#b45309] dark:text-amber-200">
          <AlertCircle className="size-4 text-[#b45309] dark:text-amber-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="font-semibold">Cancellation Policy:</strong>{' '}
            Cancel 24+ hours before your session to return it to your balance. Late cancellations use the session credit.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={() =>
              navigate(ROUTES.mentorshipMentorProfile.replace(':id', draft.mentor.id))
            }
            className="w-full sm:w-auto px-5 py-3 rounded-xl border border-[#e9d5ff] dark:border-purple-900/60 bg-white dark:bg-slate-900 hover:bg-[#faf7fd] text-[#475569] dark:text-slate-200 font-semibold text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            <Calendar className="size-4 text-[#64748b]" />
            <span>Change Date / Time</span>
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            className="w-full sm:w-auto flex-1 max-w-sm py-3 px-6 rounded-xl text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md hover:opacity-95 transition-all"
            style={{
              backgroundImage:
                'linear-gradient(162.62deg, rgba(106, 42, 138, 0.92) 0%, rgba(59, 4, 84, 0.96) 71.43%)',
            }}
          >
            <Check className="size-4" />
            <span>Confirm Booking</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmBookingPage;
