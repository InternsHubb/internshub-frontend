import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Calendar, Clock, Video, ExternalLink, Copy, CheckCheck, AlertCircle, Hourglass, XCircle } from 'lucide-react';
import { CancelSessionModal } from '@/components/mentorship/CancelSessionModal';
import { ActionError, MentorAvatar, MentorshipNotice, useTimeZoneLabel } from '@/components/mentorship/MentorshipParts';
import { ROUTES } from '@/constants/routes';
import { useMentorship } from '@/context/MentorshipContext';
import { apiErrorKey } from '@/lib/api/errors';
import { LATE_CANCELLATION_MS } from '@/lib/mentorship';
import type { SessionStatus } from '@/types/mentorship';

const STATUS_PILL: Record<SessionStatus, { box: string; dot: string }> = {
  Upcoming: { box: 'bg-[#ecfdf5] text-[#047857]', dot: 'bg-[#10b981]' },
  Completed: { box: 'bg-[#f4ecfa] text-[#5d198f]', dot: 'bg-[#5d198f]' },
  Cancelled: { box: 'bg-rose-50 text-rose-700', dot: 'bg-rose-500' },
};

export const SessionDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { getSessionById, cancelSession, balance, trackName } = useMentorship();
  const timeZoneLabel = useTimeZoneLabel();
  const session = getSessionById(id ?? '');

  const [copied, setCopied] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelErrorKey, setCancelErrorKey] = useState<string | null>(null);

  if (!session) {
    return (
      <MentorshipNotice title={t('mentorship.live.sessionNotFound')}>
        <Link to={ROUTES.mentorship} className="text-sm font-semibold text-[#5d198f]">Back to Mentorship</Link>
      </MentorshipNotice>
    );
  }

  const isUpcoming = session.status === 'Upcoming';
  const isLate = new Date(session.startsAt).getTime() - Date.now() < LATE_CANCELLATION_MS;
  const pill = STATUS_PILL[session.status];

  const handleCopy = async () => {
    if (!session.meetingUrl) return;
    try {
      await navigator.clipboard.writeText(session.meetingUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access can be refused; the link stays visible to copy by hand.
    }
  };

  const handleConfirmCancel = async () => {
    setIsCancelling(true);
    setCancelErrorKey(null);
    try {
      await cancelSession(session.id);
      setCancelModalOpen(false);
      navigate(ROUTES.mentorshipSessionCancelled.replace(':id', session.id));
    } catch (error) {
      setCancelModalOpen(false);
      setCancelErrorKey(apiErrorKey(error));
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className="mentorship-session space-y-6 animate-in fade-in duration-300">
      {/* Breadcrumb */}
      <div>
        <Link
          to={ROUTES.mentorship}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#64748b] hover:text-[#5d198f] transition-colors"
        >
          <ArrowLeft className="size-3.5 rtl:rotate-180" />
          <span>Back to Mentorship</span>
        </Link>
      </div>

      {/* Page Header */}
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-extrabold text-[#0f172a] tracking-tight">
            Session Details
          </h1>
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${pill.box}`}>
            <span className={`size-1.5 rounded-full ${pill.dot}`} />
            {session.status}
          </span>
        </div>
        {trackName && (
          <p className="text-[#64748b] text-xs font-semibold mt-1">
            {t('mentorship.live.track', { track: trackName })}
          </p>
        )}
      </div>

      {/* 2-Column Unified Layout (Figma 142:8493 / 142:10391) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Main Session Card */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-6 sm:p-8 border border-[#f1ecf7] shadow-sm space-y-6">
          {/* Section A: Mentor Header */}
          <div className="flex items-center gap-5">
            <MentorAvatar name={session.mentorName} className="size-20 rounded-full text-2xl ring-2 ring-purple-100 shadow-sm" />
            <h2 className="text-xl font-bold text-[#0f172a] ">
              <bdi>{session.mentorName}</bdi>
            </h2>
          </div>

          <div className="h-px bg-[rgba(243,232,255,0.6)] " />

          {/* Section B: Schedule & Logistics */}
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#94a3b8] ">
              SCHEDULE & LOGISTICS
            </span>

            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 text-xs text-[#0f172a] ">
                <div className="size-5 text-[#5d198f] flex items-center justify-center shrink-0">
                  <Calendar className="size-4" />
                </div>
                <span className="font-semibold">
                  {session.fullDate}
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs text-[#0f172a] ">
                <div className="size-9 rounded-xl bg-[#f4ecfa] text-[#5d198f] flex items-center justify-center shrink-0">
                  <Clock className="size-4" />
                </div>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span className="font-semibold">
                    {session.time}
                  </span>
                  <span className="text-[#94a3b8] font-normal">
                    ({timeZoneLabel})
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-[#f4f0f8] text-[#5d198f] font-bold text-[10px]">
                    {session.duration}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Compact Action Panel */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-6 sm:p-7 border border-[#f1ecf7] shadow-sm space-y-6">
          {/* Primary CTA: Join Meeting */}
          {isUpcoming && (
            <div className="space-y-3">
              {session.meetingUrl ? (
                <>
                  <a
                    href={session.meetingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
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

                  <div className="flex items-center justify-center gap-2 text-xs text-[#64748b] font-mono">
                    <span className="truncate">{session.meetingUrl}</span>
                    <button
                      type="button"
                      onClick={() => void handleCopy()}
                      className="hover:text-[#5d198f] transition-colors p-1 shrink-0"
                      aria-label="Copy meeting link"
                    >
                      {copied ? <CheckCheck className="size-3.5 text-emerald-600" /> : <Copy className="size-3.5" />}
                    </button>
                  </div>
                </>
              ) : (
                <p className="rounded-xl bg-[#f8f5fa] p-4 text-center text-xs text-[#5d198f]">
                  {t('mentorship.live.meetingPending')}
                </p>
              )}
            </div>
          )}

          {session.status === 'Cancelled' && (
            <p className="rounded-xl bg-rose-50 p-4 text-xs text-rose-700">
              {t(session.isLateCancellation ? 'mentorship.live.cancelledLate' : 'mentorship.live.cancelledOnTime')}
            </p>
          )}

          {/* Compact Cancellation Policy Box */}
          {isUpcoming && (
            <div className="rounded-2xl p-4 bg-[#fffbeb] border border-[#fef3c7] flex items-start gap-3 text-xs text-[#b45309] ">
              <AlertCircle className="size-4 text-[#b45309] shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                Cancel 24+ hours before the session to return it to your balance. Late cancellations use the session credit.
              </p>
            </div>
          )}

          {/* Mentorship Balance Module */}
          {balance && (
            <div className="space-y-2 pt-2 border-t border-[rgba(243,232,255,0.6)] ">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 font-bold text-[#0f172a] ">
                  <Hourglass className="size-3.5 text-[#5d198f] " />
                  <span>Mentorship Balance</span>
                </div>
                <span className="text-[#64748b] font-medium">
                  {balance.used} used • {balance.remaining} remaining
                </span>
              </div>

              <div className="h-2 w-full bg-[#f1edf5] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#5d198f] rounded-full"
                  style={{ width: `${balance.total ? Math.min(100, (balance.used / balance.total) * 100) : 0}%` }}
                />
              </div>
            </div>
          )}

          <ActionError messageKey={cancelErrorKey} />

          {/* Secondary Destructive Action: Cancel Session */}
          {isUpcoming && (
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setCancelModalOpen(true)}
                className="w-full py-2.5 px-4 rounded-xl text-rose-600 hover:bg-rose-50 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <XCircle className="size-4" />
                <span>Cancel Session</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Cancel Session Modal */}
      <CancelSessionModal
        isOpen={cancelModalOpen}
        isLateCancellation={isLate}
        isSubmitting={isCancelling}
        onClose={() => setCancelModalOpen(false)}
        onConfirm={() => void handleConfirmCancel()}
      />
    </div>
  );
};

export default SessionDetailsPage;
