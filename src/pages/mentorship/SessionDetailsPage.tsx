import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Video,
  ExternalLink,
  Copy,
  CheckCheck,
  AlertCircle,
  Hourglass,
  XCircle,
  MessageSquare,
} from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { useMentorship } from '@/context/MentorshipContext';
import { CancelSessionModal } from '@/components/mentorship/CancelSessionModal';

export const SessionDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getSessionById, cancelSession, balance } = useMentorship();

  const session = getSessionById(id || 'session-active') || {
    id: id || 'session-active',
    mentorName: 'Dr. Aisha Patel',
    mentorRole: 'Senior Product Manager, Google • Ex-Frontend Architect',
    mentorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
    fullDate: 'Wednesday, Sep 23, 2026',
    time: '4:30 PM – 5:15 PM',
    duration: '45 min',
    topic: 'React state management in a large application',
    meetingLink: 'https://meet.google.com/abc-defg-hij',
    status: 'Upcoming' as const,
  };

  const [copied, setCopied] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);

  // If session is active/imminent, simulate late cancellation modal (<24h)
  const isLate = session.id === 'session-active';

  const handleCopy = () => {
    navigator.clipboard.writeText('meet.google.com/abc-defg-hij');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfirmCancel = () => {
    cancelSession(session.id, isLate);
    setCancelModalOpen(false);
    navigate(ROUTES.mentorshipSessionCancelled.replace(':id', session.id));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Breadcrumb */}
      <div>
        <Link
          to={ROUTES.mentorship}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#64748b] hover:text-[#5d198f] transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to Mentorship</span>
        </Link>
      </div>

      {/* Page Header */}
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-extrabold text-[#0f172a] dark:text-white tracking-tight">
            Session Details
          </h1>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ecfdf5] text-[#047857] text-xs font-semibold">
            <span className="size-1.5 rounded-full bg-[#10b981]" />
            {session.status}
          </span>
        </div>
        <p className="text-[#64748b] dark:text-slate-400 text-xs font-semibold mt-1">
          Track: Frontend Development
        </p>
      </div>

      {/* 2-Column Unified Layout (Figma 142:8493 / 142:10391) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Main Session Card (~67% width / 8 cols) */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-[24px] p-6 sm:p-8 border border-[#f1ecf7] dark:border-purple-900/40 shadow-sm space-y-6">
          {/* Section A: Mentor Header */}
          <div className="flex items-start gap-5">
            <div className="relative shrink-0">
              <img
                src={session.mentorAvatar}
                alt={session.mentorName}
                className="size-20 rounded-2xl object-cover ring-2 ring-purple-100 dark:ring-purple-950 shadow-sm"
              />
              <span className="absolute -bottom-1 -right-1 size-6 rounded-full bg-[#5d198f] text-white flex items-center justify-center text-xs shadow-sm">
                ✓
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-3 mb-1">
                <h2 className="text-xl font-bold text-[#0f172a] dark:text-white">
                  {session.mentorName}
                </h2>
                <span className="px-3 py-0.5 rounded-full bg-[#f4ecfa] dark:bg-purple-950/60 text-[#5d198f] dark:text-purple-300 text-xs font-semibold">
                  Frontend Development
                </span>
              </div>
              <p className="text-xs text-[#64748b] dark:text-slate-400 leading-relaxed font-medium">
                {session.mentorRole}
              </p>
            </div>
          </div>

          <div className="h-px bg-[rgba(243,232,255,0.6)] dark:border-purple-900/30" />

          {/* Section B: Schedule & Logistics */}
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#94a3b8] dark:text-slate-400">
              SCHEDULE & LOGISTICS
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 text-xs text-[#0f172a] dark:text-white">
                <div className="size-9 rounded-xl bg-[#f4ecfa] dark:bg-purple-950/60 text-[#5d198f] dark:text-purple-300 flex items-center justify-center shrink-0">
                  <Calendar className="size-4" />
                </div>
                <span className="font-semibold">
                  {session.fullDate}
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs text-[#0f172a] dark:text-white">
                <div className="size-9 rounded-xl bg-[#f4ecfa] dark:bg-purple-950/60 text-[#5d198f] dark:text-purple-300 flex items-center justify-center shrink-0">
                  <Clock className="size-4" />
                </div>
                <div>
                  <span className="font-semibold">
                    {session.time}
                  </span>
                  <span className="text-[#94a3b8] dark:text-slate-400 ml-1.5 font-normal">
                    (Eastern Time / EST)
                  </span>
                  <span className="ml-2 px-2 py-0.5 rounded-full bg-[#f4f0f8] dark:bg-purple-950/50 text-[#5d198f] dark:text-purple-300 font-bold text-[10px]">
                    {session.duration}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="h-px bg-[rgba(243,232,255,0.6)] dark:border-purple-900/30" />

          {/* Section C: Discussion Topic */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#94a3b8] dark:text-slate-400 flex items-center gap-1.5">
              <MessageSquare className="size-3.5 text-[#5d198f] dark:text-purple-300" />
              <span>DISCUSSION TOPIC</span>
            </span>
            <p className="text-base font-bold text-[#0f172a] dark:text-white leading-snug">
              {session.topic}
            </p>
          </div>
        </div>

        {/* Right Column: Compact Action Panel (~33% width / 4 cols) */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-[24px] p-6 sm:p-7 border border-[#f1ecf7] dark:border-purple-900/40 shadow-sm space-y-6">
          {/* Primary CTA: Join Meeting */}
          <div className="space-y-3">
            <a
              href={session.meetingLink}
              target="_blank"
              rel="noreferrer"
              className="w-full py-3.5 px-4 rounded-xl text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md hover:opacity-95 transition-opacity group"
              style={{
                backgroundImage:
                  'linear-gradient(162.62deg, rgba(106, 42, 138, 0.92) 0%, rgba(59, 4, 84, 0.96) 71.43%)',
              }}
            >
              <Video className="size-4" />
              <span>Join Meeting</span>
              <ExternalLink className="size-3.5 text-[#e9d5ff] group-hover:translate-x-0.5 transition-transform" />
            </a>

            <div className="text-center space-y-1.5">
              <div className="flex items-center justify-center gap-1.5 text-xs text-[#047857] font-semibold">
                <span className="size-1.5 rounded-full bg-[#10b981]" />
                <span>Opens in Google Meet</span>
              </div>

              <div className="flex items-center justify-center gap-2 text-xs text-[#64748b] dark:text-slate-400 font-mono">
                <span>meet.google.com/abc-defg-hij</span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="hover:text-[#5d198f] transition-colors p-1"
                  title="Copy meeting link"
                >
                  {copied ? (
                    <CheckCheck className="size-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="size-3.5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Compact Cancellation Policy Box */}
          <div className="rounded-2xl p-4 bg-[#fffbeb] dark:bg-amber-950/30 border border-[#fef3c7] dark:border-amber-900/40 flex items-start gap-3 text-xs text-[#b45309] dark:text-amber-200">
            <AlertCircle className="size-4 text-[#b45309] dark:text-amber-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Cancel 24+ hours before the session to return it to your balance. Late cancellations use the session credit.
            </p>
          </div>

          {/* Mentorship Balance Module */}
          <div className="space-y-2 pt-2 border-t border-[rgba(243,232,255,0.6)] dark:border-purple-900/30">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 font-bold text-[#0f172a] dark:text-white">
                <Hourglass className="size-3.5 text-[#5d198f] dark:text-purple-300" />
                <span>Mentorship Balance</span>
              </div>
              <span className="text-[#64748b] dark:text-slate-400 font-medium">
                4 used • {balance.remaining} remaining
              </span>
            </div>

            <div className="h-2 w-full bg-[#f1edf5] dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#5d198f] rounded-full"
                style={{
                  width: `${((balance.total - balance.remaining) / balance.total) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Secondary Destructive Action: Cancel Session */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setCancelModalOpen(true)}
              className="w-full py-2.5 px-4 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <XCircle className="size-4" />
              <span>Cancel Session</span>
            </button>
          </div>
        </div>
      </div>

      {/* Cancel Session Modal */}
      <CancelSessionModal
        isOpen={cancelModalOpen}
        isLateCancellation={isLate}
        onClose={() => setCancelModalOpen(false)}
        onConfirm={handleConfirmCancel}
      />
    </div>
  );
};

export default SessionDetailsPage;
