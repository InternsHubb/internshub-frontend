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
import { useTranslation } from 'react-i18next';
import { MentorshipNotice } from '@/features/mentorship/components/MentorshipParts';
import { ROUTES } from '@/app/routes';
import { useMentorship } from '@/features/mentorship/context/MentorshipContext';

export const SessionCancelledPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const { getSessionById, balance } = useMentorship();
  const session = getSessionById(id ?? '');

  if (!session || session.status !== 'Cancelled') {
    return (
      <MentorshipNotice title={t('mentorship.live.sessionNotFound')}>
        <Link to={ROUTES.mentorship} className="text-sm font-semibold text-[#5d198f]">Back to Mentorship</Link>
      </MentorshipNotice>
    );
  }

  const isLate = session.isLateCancellation;

  return (
    <div className="max-w-[680px] mx-auto py-6 space-y-6 animate-in zoom-in-95 duration-300">
      {/* Cancellation Card Container (Figma 142:8818 / 142:9035) */}
      <div className="bg-white rounded-xl p-6 sm:p-8 border border-[#f1ecf7] shadow-xl relative overflow-hidden space-y-6">
        {/* Top subtle status beacon */}
        <div className="absolute inset-x-0 top-0 h-1 bg-[#ed1c24]" />

        {/* Cancellation Icon Indicator */}
        <div className="text-center pt-2">
          <div className="size-20 rounded-full bg-rose-50  flex items-center justify-center text-rose-500 mx-auto shadow-sm">
            <X className="size-9 stroke-[2.5]" />
          </div>

          <h1 className="text-2xl sm:text-[32px] font-semibold text-[#0f172a] tracking-tight mt-5">
            Session Cancelled
          </h1>
          <p className="text-[#475569] text-sm mt-2 max-w-md mx-auto leading-relaxed">
            Your session with <strong className="text-[#0f172a] ">{session.mentorName}</strong> on {session.fullDate} has been cancelled.
          </p>
        </div>

        {/* Policy Banner */}
        <div
          className={`rounded-xl p-4.5 flex items-start gap-3 text-xs leading-relaxed ${
            isLate
              ? 'bg-[#fffbeb] border border-[#fef3c7] text-[#b45309] '
              : 'bg-[#f8f5fa] border border-[#f3e8ff]/80 text-[#5d198f] '
          }`}
        >
          {isLate ? (
            <AlertCircle className="size-4 text-[#b45309] shrink-0 mt-0.5" />
          ) : (
            <CheckCircle2 className="size-4 text-[#5d198f] shrink-0 mt-0.5" />
          )}
          <p>
            {isLate
              ? 'This session was cancelled less than 24 hours in advance. According to the cancellation policy, the session credit has been retained.'
              : 'This session was cancelled more than 24 hours in advance and has been returned to your mentorship balance.'}
          </p>
        </div>

        {/* Session Metadata Card */}
        <div className="rounded-xl bg-[#f7f1f9] border border-[#f1ecf7] p-5 space-y-3.5 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[rgba(243,232,255,0.6)] ">
            <span className="text-[#64748b] font-medium">Mentor</span>
            <span className="font-bold text-[#0f172a] "><bdi>{session.mentorName}</bdi></span>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-[#64748b] font-medium">Original Schedule</span>
            <span className="font-semibold text-[#0f172a] ">
              {session.fullDate} • {session.time}
            </span>
          </div>
        </div>

        {/* Mentorship Balance Module */}
        {balance && (
        <div className="rounded-xl bg-[#f8f5fa] border border-[#f3e8ff]/80 p-5 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 font-bold text-[#5d198f] ">
              <Wallet className="size-4" />
              <span>Mentorship Balance</span>
            </div>
            <span className="text-xs font-semibold text-[#5d198f] ">
              {isLate ? 'This session was not returned to your balance.' : 'Session returned to balance'}
            </span>
          </div>

          {/* Progress bar */}
          <div className="h-2 w-full bg-[#f1edf5] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#5d198f] rounded-full"
              style={{
                width: `${balance.total ? (balance.remaining / balance.total) * 100 : 0}%`,
              }}
            />
          </div>

          <div className="text-xs text-[#64748b] ">
            <strong className="text-[#0f172a] ">{balance.remaining} sessions</strong> remaining
          </div>
        </div>
        )}

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col items-center gap-3">
          <Link
            to={ROUTES.mentorship}
            className="w-full sm:w-[240px] py-3.5 px-6 rounded-xl text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md hover:opacity-95 transition-all text-center"
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
            className="text-xs font-semibold text-[#5d198f] hover:opacity-80 transition-colors py-1 flex items-center gap-1.5"
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
