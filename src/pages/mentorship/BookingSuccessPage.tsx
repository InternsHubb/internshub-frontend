import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Check,
  Calendar,
  Clock,
  Video,
  ExternalLink,
  Copy,
  CheckCheck,
  Bell,
  Wallet,
  ArrowRight,
  MessageSquare,
  Layers,
} from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { useMentorship } from '@/context/MentorshipContext';

export const BookingSuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const { sessions, balance } = useMentorship();
  const latestSession = sessions[0] || {
    id: 'session-1',
    mentorName: 'Dr. Aisha Patel',
    mentorRole: 'Senior Product Manager, Google • Ex-Frontend Architect',
    mentorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
    fullDate: 'Wednesday, Oct 1, 2026',
    time: '4:30 PM – 5:15 PM',
    duration: '45 min',
    topic: 'React state management in a large application',
    meetingLink: 'https://meet.google.com/abc-defg-hij',
  };

  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(latestSession.meetingLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto py-4 space-y-6 animate-in zoom-in-95 duration-300">
      {/* Top Success Icon & Heading */}
      <div className="text-center space-y-3">
        <div className="size-16 rounded-full bg-[#ecfdf5] text-[#10b981] flex items-center justify-center mx-auto shadow-md ring-8 ring-emerald-50 dark:ring-emerald-950/40">
          <Check className="size-8 stroke-[3]" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-[#0f172a] dark:text-white tracking-tight">
            Session Booked!
          </h1>
          <p className="text-[#475569] dark:text-slate-300 text-sm mt-1">
            Your mentorship session has been successfully scheduled.
          </p>
        </div>
      </div>

      {/* Main Confirmation Card (Figma 142:10243) */}
      <div className="bg-[#fcfaff] dark:bg-slate-900 border border-[#f1ecf7] dark:border-purple-900/40 rounded-[24px] p-6 sm:p-7 shadow-sm space-y-5">
        {/* Track Row & Confirmed Badge */}
        <div className="flex items-center justify-between pb-3 border-b border-[rgba(243,232,255,0.6)] dark:border-purple-900/30">
          <div className="flex items-center gap-2 text-xs font-bold text-[#5d198f] dark:text-purple-300">
            <div className="size-7 rounded-lg bg-[#f4f0f8] dark:bg-purple-950/60 flex items-center justify-center text-[#5d198f] dark:text-purple-300">
              <Layers className="size-4" />
            </div>
            <div>
              <span className="text-[10px] text-[#94a3b8] dark:text-slate-400 font-semibold block uppercase">
                TRACK
              </span>
              <span>Frontend Development</span>
            </div>
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ecfdf5] text-[#047857] text-xs font-semibold">
            <span className="size-1.5 rounded-full bg-[#10b981]" />
            Confirmed
          </span>
        </div>

        {/* Mentor Row */}
        <div className="flex items-center gap-4">
          <img
            src={latestSession.mentorAvatar}
            alt={latestSession.mentorName}
            className="size-14 rounded-2xl object-cover ring-2 ring-purple-100 dark:ring-purple-950 shadow-sm"
          />
          <div>
            <h3 className="font-bold text-[#0f172a] dark:text-white text-base">
              {latestSession.mentorName}
            </h3>
            <p className="text-xs text-[#64748b] dark:text-slate-400 mt-0.5">
              {latestSession.mentorRole}
            </p>
          </div>
        </div>

        {/* Date & Time Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/80 border border-[#f1ecf7] dark:border-purple-900/30 flex items-start gap-3">
            <div className="size-9 rounded-xl bg-[#f4f0f8] dark:bg-purple-950/60 text-[#5d198f] dark:text-purple-300 flex items-center justify-center shrink-0">
              <Calendar className="size-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-[#94a3b8] dark:text-slate-400 uppercase tracking-wider">
                Session Date
              </span>
              <div className="text-xs font-bold text-[#0f172a] dark:text-white mt-0.5">
                {latestSession.fullDate}
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/80 border border-[#f1ecf7] dark:border-purple-900/30 flex items-start gap-3">
            <div className="size-9 rounded-xl bg-[#f4f0f8] dark:bg-purple-950/60 text-[#5d198f] dark:text-purple-300 flex items-center justify-center shrink-0">
              <Clock className="size-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-[#94a3b8] dark:text-slate-400 uppercase tracking-wider">
                Time & Duration
              </span>
              <div className="text-xs font-bold text-[#0f172a] dark:text-white mt-0.5">
                {latestSession.time} • {latestSession.duration}
              </div>
              <div className="text-[11px] text-[#94a3b8] dark:text-slate-400 mt-0.5">
                Eastern Time (EST)
              </div>
            </div>
          </div>
        </div>

        {/* Discussion Topic Box */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-[#f1ecf7] dark:border-purple-900/30 space-y-1">
          <span className="text-[10px] font-bold text-[#94a3b8] dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <MessageSquare className="size-3 text-[#5d198f] dark:text-purple-300" />
            <span>DISCUSSION TOPIC</span>
          </span>
          <p className="text-xs font-bold text-[#0f172a] dark:text-white">
            {latestSession.topic}
          </p>
        </div>
      </div>

      {/* Meeting Room Link Card (Figma 142:10270) */}
      <div className="p-4 sm:p-5 rounded-[24px] bg-white dark:bg-slate-900 border border-[#f1ecf7] dark:border-purple-900/40 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="size-11 rounded-2xl bg-[#3b0454] text-white flex items-center justify-center shrink-0 shadow-sm">
            <Video className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-bold text-[#0f172a] dark:text-white">
                Meeting Room Link
              </h4>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#f4f0f8] dark:bg-purple-950/60 text-[#5d198f] dark:text-purple-300">
                Google Meet
              </span>
            </div>
            <p className="text-xs text-[#5d198f] dark:text-purple-300 font-mono mt-0.5">
              meet.google.com/abc-defg-hij
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopyLink}
            className="p-2.5 rounded-xl border border-[#e9d5ff] dark:border-purple-900/50 hover:bg-[#faf7fd] text-[#475569] dark:text-slate-200 transition-colors"
            title="Copy meeting URL"
          >
            {copied ? (
              <CheckCheck className="size-4 text-emerald-600" />
            ) : (
              <Copy className="size-4" />
            )}
          </button>
          <a
            href={latestSession.meetingLink}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2.5 rounded-xl border border-[#e9d5ff] dark:border-purple-900/50 hover:bg-[#faf7fd] text-[#475569] dark:text-slate-200 font-semibold text-xs flex items-center gap-1.5 transition-colors"
          >
            <span>Open Meeting</span>
            <ExternalLink className="size-3.5 text-[#64748b]" />
          </a>
        </div>
      </div>

      {/* Mentorship Allowance Card */}
      <div className="p-4 sm:p-5 rounded-[24px] bg-white dark:bg-slate-900 border border-[#f1ecf7] dark:border-purple-900/40 shadow-sm space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 font-bold text-[#0f172a] dark:text-white">
            <Wallet className="size-4 text-[#5d198f] dark:text-purple-300" />
            <span>Mentorship Allowance</span>
          </div>
          <span className="text-[#64748b] dark:text-slate-400 font-medium">
            {balance.completed + 1} used • {balance.remaining} remaining
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex-1 h-2 bg-[#f1edf5] dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#5d198f] rounded-full transition-all"
              style={{
                width: `${((balance.total - balance.remaining) / balance.total) * 100}%`,
              }}
            />
          </div>
          <span className="text-xs font-bold text-[#5d198f] dark:text-purple-300">
            {balance.remaining} left
          </span>
        </div>
      </div>

      {/* Automated Reminder Alert Banner */}
      <div className="rounded-2xl p-4 bg-[#eff6ff] dark:bg-blue-950/30 border border-[#bfdbfe] dark:border-blue-900/40 flex items-center gap-3 text-xs text-[#1e40af] dark:text-blue-200">
        <Bell className="size-4 text-[#2563eb] dark:text-blue-400 shrink-0" />
        <p>
          <strong className="font-semibold text-[#1e3a8a] dark:text-blue-100">Automated Reminder:</strong>{' '}
          You'll receive an email reminder 1 hour before the session.
        </p>
      </div>

      {/* Bottom Actions */}
      <div className="flex items-center justify-between gap-4 pt-2">
        <Link
          to={ROUTES.mentorship}
          className="text-xs font-semibold text-[#64748b] hover:text-[#5d198f] transition-colors"
        >
          Back to Mentorship
        </Link>

        <button
          type="button"
          onClick={() =>
            navigate(ROUTES.mentorshipSessionDetails.replace(':id', latestSession.id))
          }
          className="py-3 px-6 rounded-xl text-white font-bold text-xs flex items-center gap-2 shadow-md hover:opacity-95 transition-opacity"
          style={{
            backgroundImage:
              'linear-gradient(162.62deg, rgba(106, 42, 138, 0.92) 0%, rgba(59, 4, 84, 0.96) 71.43%)',
          }}
        >
          <span>View Session</span>
          <ArrowRight className="size-4" />
        </button>
      </div>
    </div>
  );
};

export default BookingSuccessPage;
