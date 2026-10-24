import React from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  X,
  CheckCircle2,
  AlertCircle,
  Wallet,
  ArrowLeft,
  Calendar,
} from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { useMentorship } from '@/context/MentorshipContext';

export const SessionCancelledPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getSessionById, balance } = useMentorship();

  const session = getSessionById(id || '') || {
    id: id || 'session-cancelled',
    mentorName: 'Dr. Aisha Patel',
    mentorRole: 'Senior Product Manager, Google • Ex-Frontend Architect',
    fullDate: 'Wednesday, Sep 23, 2026',
    time: '4:30 PM – 5:15 PM EST',
    topic: 'React state management in a large application',
    isLateCancellation: false,
  };

  const isLate = !!session.isLateCancellation;

  return (
    <div className="max-w-2xl mx-auto py-6 space-y-6 animate-in zoom-in-95 duration-300">
      {/* Cancellation Card Container (Figma 142:8818 / 142:9035) */}
      <div className="bg-white dark:bg-slate-900 rounded-[24px] p-6 sm:p-10 border border-[#f1ecf7] dark:border-purple-900/40 shadow-xl relative overflow-hidden space-y-6">
        {/* Top subtle status beacon */}
        <div className="absolute inset-x-0 top-0 h-1.5 bg-rose-500" />

        {/* Cancellation Icon Indicator */}
        <div className="text-center pt-2">
          <div className="size-20 rounded-full bg-rose-50 dark:bg-rose-950/40 border-4 border-rose-100 dark:border-rose-900/40 flex items-center justify-center text-rose-500 mx-auto shadow-sm">
            <X className="size-9 stroke-[2.5]" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0f172a] dark:text-white tracking-tight mt-5">
            {isLate ? 'Late Cancellation' : 'Session Cancelled'}
          </h1>
          <p className="text-[#475569] dark:text-slate-300 text-sm mt-2 max-w-md mx-auto leading-relaxed">
            Your session with <strong className="text-[#0f172a] dark:text-white">{session.mentorName}</strong> on {session.fullDate} has been cancelled.
          </p>
        </div>

        {/* Policy Banner */}
        <div
          className={`rounded-2xl p-4.5 flex items-start gap-3 text-xs leading-relaxed ${
            isLate
              ? 'bg-[#fffbeb] dark:bg-amber-950/30 border border-[#fef3c7] dark:border-amber-900/40 text-[#b45309] dark:text-amber-200'
              : 'bg-[#f8f5fa] dark:bg-purple-950/30 border border-[#f3e8ff]/80 dark:border-purple-900/40 text-[#5d198f] dark:text-purple-300'
          }`}
        >
          {isLate ? (
            <AlertCircle className="size-4 text-[#b45309] dark:text-amber-400 shrink-0 mt-0.5" />
          ) : (
            <CheckCircle2 className="size-4 text-[#5d198f] dark:text-purple-300 shrink-0 mt-0.5" />
          )}
          <p>
            {isLate
              ? 'This session was cancelled less than 24 hours in advance. According to the cancellation policy, the session credit has been retained.'
              : 'This session was cancelled more than 24 hours in advance and has been returned to your mentorship balance.'}
          </p>
        </div>

        {/* Session Metadata Card */}
        <div className="rounded-2xl bg-[#f8fafc] dark:bg-slate-800/80 border border-[#f1ecf7] dark:border-purple-900/30 p-5 space-y-3.5 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[rgba(243,232,255,0.6)] dark:border-purple-900/30">
            <span className="text-[#64748b] dark:text-slate-400 font-medium">Mentor</span>
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#0f172a] dark:text-white">{session.mentorName}</span>
              <span className="px-2 py-0.5 rounded-full bg-[#f4ecfa] dark:bg-purple-950/60 text-[#5d198f] dark:text-purple-300 text-[10px] font-bold">
                Frontend Lead
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between pb-3 border-b border-[rgba(243,232,255,0.6)] dark:border-purple-900/30">
            <span className="text-[#64748b] dark:text-slate-400 font-medium">Original Schedule</span>
            <span className="font-semibold text-[#0f172a] dark:text-white">
              {session.fullDate} • {session.time}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[#64748b] dark:text-slate-400 font-medium">Topic</span>
            <span className="font-semibold text-[#0f172a] dark:text-white text-right max-w-xs truncate">
              {session.topic}
            </span>
          </div>
        </div>

        {/* Mentorship Balance Module */}
        <div className="rounded-2xl bg-[#f8f5fa] dark:bg-purple-950/30 border border-[#f3e8ff]/80 dark:border-purple-900/40 p-5 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 font-bold text-[#5d198f] dark:text-purple-300">
              <Wallet className="size-4" />
              <span>Mentorship Balance</span>
            </div>
            <span className="text-xs font-semibold text-[#5d198f] dark:text-purple-300">
              {isLate ? 'Credit deducted' : 'Session returned to balance'}
            </span>
          </div>

          {/* Progress bar */}
          <div className="h-2 w-full bg-[#f1edf5] dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#5d198f] rounded-full"
              style={{
                width: `${(balance.remaining / balance.total) * 100}%`,
              }}
            />
          </div>

          <div className="text-xs text-[#64748b] dark:text-slate-400">
            <strong className="text-[#0f172a] dark:text-white">{balance.remaining} sessions</strong> remaining
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col items-center gap-3">
          <Link
            to={ROUTES.mentorship}
            className="w-full py-3.5 px-6 rounded-xl text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md hover:opacity-95 transition-all text-center"
            style={{
              backgroundImage:
                'linear-gradient(162.62deg, rgba(106, 42, 138, 0.92) 0%, rgba(59, 4, 84, 0.96) 71.43%)',
            }}
          >
            <ArrowLeft className="size-4" />
            <span>Back to Mentorship</span>
          </Link>

          <Link
            to={ROUTES.mentorshipMentors}
            className="text-xs font-semibold text-[#5d198f] dark:text-purple-300 hover:opacity-80 transition-colors py-1 flex items-center gap-1.5"
          >
            <Calendar className="size-3.5" />
            <span>Book Another Session</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SessionCancelledPage;
