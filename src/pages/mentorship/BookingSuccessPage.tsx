import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Check, Calendar, Clock, Video, ExternalLink, Copy, CheckCheck, Wallet, ArrowRight, Layers } from 'lucide-react';
import { MentorAvatar, MentorshipNotice, useTimeZoneLabel } from '@/components/mentorship/MentorshipParts';
import { ROUTES } from '@/constants/routes';
import { useMentorship } from '@/context/MentorshipContext';

// Shown after a booking; the confirm page passes the new booking's id in the navigation state.

export const BookingSuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const location = useLocation();
  const { getSessionById, balance, trackName } = useMentorship();
  const timeZoneLabel = useTimeZoneLabel();
  const sessionId = (location.state as { sessionId?: string } | null)?.sessionId ?? '';
  const session = getSessionById(sessionId);
  const [copied, setCopied] = useState(false);

  if (!session) {
    return (
      <MentorshipNotice title={t('mentorship.live.sessionNotFound')}>
        <Link to={ROUTES.mentorship} className="text-sm font-semibold text-[#5d198f]">Back to Mentorship</Link>
      </MentorshipNotice>
    );
  }

  const handleCopyLink = async () => {
    if (!session.meetingUrl) return;
    try {
      await navigator.clipboard.writeText(session.meetingUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access can be refused; the link stays visible to copy by hand.
    }
  };

  return (
    <div className="mentorship-success max-w-[740px] mx-auto rounded-2xl border-t-4 border-[#3b0454] bg-white p-6 sm:p-10 space-y-5 animate-in zoom-in-95 duration-300">
      {/* Top Success Icon & Heading */}
      <div className="text-center space-y-3">
        <div className="size-14 rounded-full bg-[#ecfdf5] text-[#10b981] flex items-center justify-center mx-auto  ">
          <Check className="size-8 stroke-[3]" />
        </div>
        <div>
          <h1 className="text-[32px] font-semibold text-[#211927] tracking-tight">
            Session Booked!
          </h1>
          <p className="text-[#475569] text-sm mt-1">
            Your mentorship session has been successfully scheduled.
          </p>
        </div>
      </div>

      {/* Main Confirmation Card (Figma 142:10243) */}
      <div className="bg-[#fbf0fe] rounded-xl p-6 sm:p-7 shadow-sm space-y-5">
        {/* Track Row & Confirmed Badge */}
        <div className="flex items-center justify-between pb-3 border-b border-[rgba(243,232,255,0.6)] ">
          {trackName ? (
            <div className="flex items-center gap-2 text-xs font-bold text-[#5d198f] ">
              <div className="size-7 rounded-lg bg-[#f4f0f8] flex items-center justify-center text-[#5d198f] ">
                <Layers className="size-4" />
              </div>
              <div>
                <span className="text-[10px] text-[#94a3b8] font-semibold block uppercase">
                  TRACK
                </span>
                <bdi>{trackName}</bdi>
              </div>
            </div>
          ) : <span />}

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ecfdf5] text-[#047857] text-xs font-semibold">
            <span className="size-1.5 rounded-full bg-[#10b981]" />
            Confirmed
          </span>
        </div>

        {/* Mentor Row */}
        <div className="flex items-center gap-4">
          <MentorAvatar name={session.mentorName} className="size-14 rounded-full text-lg ring-2 ring-purple-100 shadow-sm" />
          <h3 className="font-bold text-[#0f172a] text-base">
            <bdi>{session.mentorName}</bdi>
          </h3>
        </div>

        {/* Date & Time Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="p-3.5 rounded-2xl bg-white border border-[#f1ecf7] flex items-start gap-3">
            <div className="size-9 rounded-xl bg-[#f4f0f8] text-[#5d198f] flex items-center justify-center shrink-0">
              <Calendar className="size-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-wider">
                Session Date
              </span>
              <div className="text-xs font-bold text-[#0f172a] mt-0.5">
                {session.fullDate}
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-[#f1ecf7] flex items-start gap-3">
            <div className="size-9 rounded-xl bg-[#f4f0f8] text-[#5d198f] flex items-center justify-center shrink-0">
              <Clock className="size-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-wider">
                Time & Duration
              </span>
              <div className="text-xs font-bold text-[#0f172a] mt-0.5">
                {session.time} • {session.duration}
              </div>
              <div className="text-[11px] text-[#94a3b8] mt-0.5">
                {timeZoneLabel}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Meeting Room Link Card (Figma 142:10270) */}
      <div className="p-3 rounded-lg bg-[#f3eaf7] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3.5">
          <div className="size-11 rounded-2xl bg-[#3b0454] text-white flex items-center justify-center shrink-0 shadow-sm">
            <Video className="size-5" />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-[#0f172a] ">
              Meeting Room Link
            </h4>
            <p className="text-xs text-[#5d198f] font-mono mt-0.5 truncate">
              {session.meetingUrl ?? t('mentorship.live.meetingPending')}
            </p>
          </div>
        </div>

        {session.meetingUrl && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => void handleCopyLink()}
              className="p-2.5 rounded-xl border border-[#e9d5ff] hover:bg-[#faf7fd] text-[#475569] transition-colors"
              aria-label="Copy meeting URL"
            >
              {copied ? <CheckCheck className="size-4 text-emerald-600" /> : <Copy className="size-4" />}
            </button>
            <a
              href={session.meetingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl border border-[#e9d5ff] hover:bg-[#faf7fd] text-[#475569] font-semibold text-xs flex items-center gap-1.5 transition-colors"
            >
              <span>Open Meeting</span>
              <ExternalLink className="size-3.5 text-[#64748b]" />
            </a>
          </div>
        )}
      </div>

      {/* Mentorship Allowance Card */}
      {balance && (
        <div className="p-3 rounded-lg bg-[#f3eaf7] space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 font-bold text-[#0f172a] ">
              <Wallet className="size-4 text-[#5d198f] " />
              <span>Mentorship Allowance</span>
            </div>
            <span className="text-[#64748b] font-medium">
              {balance.used} used • {balance.remaining} remaining
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1 h-2 bg-[#f1edf5] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#5d198f] rounded-full transition-all"
                style={{ width: `${balance.total ? Math.min(100, (balance.used / balance.total) * 100) : 0}%` }}
              />
            </div>
            <span className="text-xs font-bold text-[#5d198f] ">
              {balance.remaining} left
            </span>
          </div>
        </div>
      )}

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
          onClick={() => navigate(ROUTES.mentorshipSessionDetails.replace(':id', session.id))}
          className="py-3 px-6 rounded-xl text-white font-bold text-xs flex items-center gap-2 shadow-md hover:opacity-95 transition-opacity"
          style={{
            backgroundImage:
              'linear-gradient(162.62deg, rgba(106, 42, 138, 0.92) 0%, rgba(59, 4, 84, 0.96) 71.43%)',
          }}
        >
          <span>View Session</span>
          <ArrowRight className="size-4 rtl:rotate-180" />
        </button>
      </div>
    </div>
  );
};

export default BookingSuccessPage;
