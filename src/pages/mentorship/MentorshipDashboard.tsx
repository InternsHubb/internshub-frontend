import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Calendar,
  Clock,
  Search,
  ArrowRight,
  Sparkles,
  Layers,
  XCircle,
  X,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/hooks/useAuth';
import { useMentorship } from '@/context/MentorshipContext';
import { CancelSessionModal } from '@/components/mentorship/CancelSessionModal';
import { ActionError, useTimeZoneLabel } from '@/components/mentorship/MentorshipParts';
import { apiErrorKey } from '@/lib/api/errors';
import { LATE_CANCELLATION_MS } from '@/lib/mentorship';

const REMINDER_WINDOW_MS = 60 * 60_000;

function greetingKey(hour: number): string {
  if (hour < 12) return 'morning';
  if (hour < 18) return 'afternoon';
  return 'evening';
}

export const MentorshipDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const { sessions, balance, trackName, reminderDismissed, dismissReminder, cancelSession } = useMentorship();
  const timeZoneLabel = useTimeZoneLabel();

  const [cancelModalSessionId, setCancelModalSessionId] = useState<string | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelErrorKey, setCancelErrorKey] = useState<string | null>(null);

  const now = Date.now();
  const upcomingSessions = sessions.filter((s) => s.status === 'Upcoming');
  const cancelTarget = upcomingSessions.find((s) => s.id === cancelModalSessionId);
  const isLateCancel = cancelTarget ? new Date(cancelTarget.startsAt).getTime() - now < LATE_CANCELLATION_MS : false;
  // The reminder appears only when a booked session starts within the hour.
  const soonSession = upcomingSessions.find((s) => {
    const startsIn = new Date(s.startsAt).getTime() - now;
    return startsIn > 0 && startsIn <= REMINDER_WINDOW_MS;
  });
  const firstName = user?.fullName?.trim().split(/\s+/)[0] ?? '';
  const today = new Intl.DateTimeFormat(i18n.language, { weekday: 'long', month: 'short', day: 'numeric' }).format(new Date());
  const greeting = t(`mentorship.live.greeting.${greetingKey(new Date().getHours())}`, {
    name: firstName,
    context: firstName ? undefined : 'anonymous',
  });

  const handleConfirmCancel = async () => {
    if (!cancelModalSessionId) return;
    const targetId = cancelModalSessionId;
    setIsCancelling(true);
    setCancelErrorKey(null);
    try {
      await cancelSession(targetId);
      setCancelModalSessionId(null);
      navigate(ROUTES.mentorshipSessionCancelled.replace(':id', targetId));
    } catch (error) {
      setCancelModalSessionId(null);
      setCancelErrorKey(apiErrorKey(error));
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300" data-node-id="142:9129">
      {/* Page Header Area (Figma 142:9130) */}
      <div className="border-b border-[rgba(243,232,255,0.8)] pb-[25px] flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          {/* Track Context Pill (Figma 142:9132) */}
          {trackName && (
            <div className="bg-[#f4f0f8] inline-flex items-center gap-[6px] px-[12px] py-[4px] rounded-full mb-1">
              <Layers className="size-[12px] text-[#3b0454] " />
              <span className="font-bold text-[#3b0454] text-[12px] leading-[16px]">
                {t('mentorship.live.track', { track: trackName })}
              </span>
            </div>
          )}

          {/* Date Stamp (Figma 142:9138) */}
          <div className="pt-[6px] text-[#94a3b8] font-bold text-[12px] tracking-[0.6px] uppercase leading-[16px]">
            {today}
          </div>

          {/* Heading 1 (Figma 142:9140) */}
          <h1 className="text-[#0f172a] text-[30px] font-bold tracking-[-0.75px] leading-[36px] mt-0.5">
            Mentorship
          </h1>

          {/* Greeting (Figma 142:9143) */}
          <div className="flex items-center gap-[6px] mt-0.5">
            <span className="text-[#475569] text-[16px] leading-[24px]">
              <bdi>{greeting}</bdi>
            </span>
            <span className="text-[20px] leading-[28px]">👋</span>
          </div>
        </div>

        {/* Top Right Header Action Buttons (Figma 142:9146) */}
        <div className="flex items-center gap-[12px] flex-wrap">
          {/* Session Calendar Button (Figma 142:9147) */}
          <button
            type="button"
            onClick={() => navigate(ROUTES.mentorshipMentors)}
            className="bg-white border border-[#e9d5ff] drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] flex items-center gap-[6px] px-[17px] py-[9px] rounded-[12px] text-[#475569] text-[14px] font-medium hover:bg-[#faf7fd] transition-all shadow-sm"
          >
            <Calendar className="size-[15px] text-[#64748b] " />
            <span>Session Calendar</span>
          </button>

          {/* Browse Mentors Button (Figma 142:9152) */}
          <Link
            to={ROUTES.mentorshipMentors}
            className="flex items-center gap-[8px] px-[20px] py-[10px] rounded-[12px] text-white font-bold text-[14px] shadow-[0px_4px_14px_0px_rgba(76,5,133,0.35)] hover:opacity-95 transition-all"
            style={{
              backgroundImage:
                'linear-gradient(162.62deg, rgba(106, 42, 138, 0.92) 0%, rgba(59, 4, 84, 0.96) 71.43%)',
            }}
          >
            <Search className="size-[13.5px] text-white" />
            <span>Browse Mentors</span>
          </Link>
        </div>
      </div>

      {/* Main Two-Column Layout (Figma 142:9157) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left / Main Column (7 cols - Figma 142:9158) */}
        <div className="lg:col-span-7 flex flex-col gap-[24px]">
          {/* Section: Upcoming Mentorship Sessions (Figma 142:9159) */}
          <div className="flex flex-col gap-[16px] w-full">
            {/* Section Heading & Counter (Figma 142:9160) */}
            <div>
              <div className="flex items-center gap-[10px]">
                <h2 className="text-[#0f172a] text-[18px] font-bold tracking-[-0.45px] leading-[28px]">
                  Upcoming Sessions
                </h2>
                <div className="bg-[#f4f0f8] size-[24px] rounded-full flex items-center justify-center">
                  <span
                    className="font-bold text-[12px] leading-[16px] text-transparent bg-clip-text"
                    style={{
                      backgroundImage:
                        'linear-gradient(107.41deg, rgba(106, 42, 138, 0.92) 0%, rgba(59, 4, 84, 0.96) 71.43%)',
                    }}
                  >
                    {upcomingSessions.length}
                  </span>
                </div>
              </div>
              <p className="text-[#94a3b8] text-[12px] leading-[16px] mt-1">
                {timeZoneLabel}
              </p>
            </div>

            <ActionError messageKey={cancelErrorKey} />

            {/* Session Cards List */}
            {upcomingSessions.length === 0 ? (
              <div className="bg-white border border-[#f1ecf7] rounded-[20px] p-8 text-center shadow-sm">
                <Calendar className="size-10 text-[#672b97] mx-auto mb-3 opacity-60" />
                <h3 className="font-bold text-[#0f172a] text-base mb-1">
                  No upcoming sessions
                </h3>
                <p className="text-xs text-[#64748b] max-w-sm mx-auto mb-5">
                  Book a 1:1 session with a mentor in your track to review your sprint work or get career advice.
                </p>
                <Link
                  to={ROUTES.mentorshipMentors}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[12px] text-white font-bold text-xs shadow-md"
                  style={{
                    backgroundImage:
                      'linear-gradient(162.62deg, rgba(106, 42, 138, 0.92) 0%, rgba(59, 4, 84, 0.96) 71.43%)',
                  }}
                >
                  <Search className="size-3.5" />
                  <span>Browse Available Mentors</span>
                </Link>
              </div>
            ) : (
              <div className="space-y-[16px]">
                {upcomingSessions.slice(0, 2).map((session, index) => (
                  <div
                    key={session.id}
                    className="bg-white border border-[#f1ecf7] rounded-[20px] p-[21px] shadow-[0px_2px_10px_-2px_rgba(93,25,143,0.04),0px_1px_3px_-1px_rgba(0,0,0,0.05)] hover:shadow-md transition-shadow relative"
                    data-node-id={index === 0 ? '142:9169' : '142:9211'}
                  >
                    {/* Header Row (Figma 142:9171) */}
                    <div className="border-b border-[rgba(243,232,255,0.6)] pb-[13px] flex items-center justify-between mb-4">
                      <span className="text-[#94a3b8] text-[11px] font-bold tracking-[0.55px] uppercase leading-[16.5px]">
                        SESSION {index + 1}
                      </span>
                      <div className="bg-[#ecfdf5] rounded-full px-[12px] py-[2px] flex gap-[6px] items-center">
                        <span className="bg-[#10b981] size-[6px] rounded-full" />
                        <span className="text-[#047857] text-[12px] font-bold leading-[16px]">
                          Upcoming
                        </span>
                      </div>
                    </div>

                    {/* Content Row: Date badge + Details (Figma 142:9177) */}
                    <div className="flex gap-[16px] items-start mb-4">
                      {/* Date Block (Figma 142:9178) */}
                      <div className="bg-[#f4f0f8] border border-[#f3e8ff] rounded-[12px] p-[9px] w-[64px] flex flex-col items-center justify-center shrink-0">
                        <span className="text-[#672b97] text-[11px] font-bold tracking-[0.55px] uppercase leading-[16.5px]">
                          {session.month}
                        </span>
                        <div className="pt-[2px]">
                          <span
                            className="text-[24px] font-bold leading-[24px] text-transparent bg-clip-text"
                            style={{
                              backgroundImage:
                                'linear-gradient(112.66deg, rgba(106, 42, 138, 0.92) 0%, rgba(59, 4, 84, 0.96) 71.43%)',
                            }}
                          >
                            {session.day}
                          </span>
                        </div>
                      </div>

                      {/* Mentor Info (Figma 142:9184) */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-[#0f172a] text-[16px] font-bold leading-[20px]">
                            <bdi>{session.mentorName}</bdi>
                          </h3>
                          <div className="flex items-center gap-[4px] text-[#64748b] text-[12px] shrink-0">
                            <Clock className="size-[11.67px]" />
                            <span>{session.duration}</span>
                          </div>
                        </div>

                        <div className="pt-[8px] flex items-center gap-[6px] text-[#64748b] text-[12px] leading-[16px]">
                          <Calendar className="size-[12.5px]" />
                          <span>{session.fullDate} • {session.time}</span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action Buttons (Figma 142:9203) */}
                    <div className="border-t border-[rgba(243,232,255,0.6)] pt-[9px] flex gap-[12px] items-center">
                      <button
                        type="button"
                        onClick={() =>
                          navigate(ROUTES.mentorshipSessionDetails.replace(':id', session.id))
                        }
                        className="flex-1 rounded-[12px] py-[8px] px-[16px] text-white font-bold text-[12px] text-center shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] hover:opacity-95 transition-opacity"
                        style={{
                          backgroundImage:
                            'linear-gradient(174.26deg, rgba(106, 42, 138, 0.92) 0%, rgba(59, 4, 84, 0.96) 71.43%)',
                        }}
                      >
                        View Session
                      </button>

                      <button
                        type="button"
                        onClick={() => setCancelModalSessionId(session.id)}
                        className="border border-[rgba(243,232,255,0.8)] rounded-[12px] px-[17px] py-[8px] flex items-center gap-[4px] text-[#64748b] hover:text-rose-600 hover:border-rose-300 text-[12px] transition-colors"
                      >
                        <XCircle className="size-[12.5px]" />
                        <span>Cancel</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cancellation Policy Banner (Figma 142:9253) */}
          <div className="bg-[#fffbeb] border border-[#fef3c7] rounded-[12px] px-[17px] py-[11px] flex gap-[10px] items-start">
            <Clock className="size-[15px] text-[#b45309] shrink-0 mt-0.5" />
            <div className="text-[#b45309] text-[12px] leading-[16.5px]">
              <span className="font-bold">Cancellation Policy:</span>{' '}
              <span>
                Cancel 24+ hours before your session to return it to your balance. Late cancellations use the session credit.
              </span>
            </div>
          </div>

          {/* Session Reminder Alert (Figma 142:9258), only for a session starting within the hour */}
          {soonSession && !reminderDismissed && (
            <div className="bg-[#eff6ff] border border-[rgba(191,219,254,0.8)] rounded-[12px] p-[17px] flex gap-[12px] items-start">
              <AlertCircle className="size-[20px] text-[#1d4ed8] shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <div className="font-bold text-[#172554] text-[12px] leading-[15px] mb-1">
                  {t('mentorship.live.reminderTitle')}
                </div>
                <div className="text-[#1d4ed8] text-[12px] leading-[16.5px]">
                  {t('mentorship.live.reminderBody', { mentor: soonSession.mentorName, time: soonSession.time })}
                </div>
              </div>
              <button
                type="button"
                onClick={dismissReminder}
                className="p-1 rounded text-[#1d4ed8] hover:bg-blue-100 transition-colors"
                aria-label="Dismiss alert"
              >
                <X className="size-[16px]" />
              </button>
            </div>
          )}
        </div>

        {/* Right / Supporting Column (5 cols - Figma 142:9270) */}
        <div className="lg:col-span-5 flex flex-col gap-[24px]">
          {/* Section: Session Allowance Status (Figma 142:9271) */}
          <div className="bg-white border border-[#f1ecf7] rounded-[20px] pb-[45px] pt-[25px] px-[25px] shadow-[0px_2px_10px_-2px_rgba(93,25,143,0.04),0px_1px_3px_-1px_rgba(0,0,0,0.05)] flex flex-col gap-[14px]">
            {/* Header: Title + Pill (Figma 142:9273) */}
            <div className="flex items-center justify-between">
              <span className="text-[#94a3b8] text-[11px] font-bold tracking-[0.55px] uppercase leading-[16.5px]">
                YOUR SESSIONS
              </span>
              {balance && (
                <div className="bg-[#f4f0f8] px-[12px] py-[4px] rounded-full">
                  <span className="text-[#672b97] font-bold text-[12px] leading-[16px]">
                    {balance.packageName}
                  </span>
                </div>
              )}
            </div>

            {balance ? (
              <>
                {/* Total Count (Figma 142:9278) */}
                <div className="flex items-baseline gap-[8px]">
                  <span className="text-[#0f172a] text-[30px] font-bold leading-[30px]">
                    {balance.total}
                  </span>
                  <span className="text-[#64748b] text-[14px] leading-[20px]">
                    sessions total
                  </span>
                </div>

                {/* Progress Bar Track (Figma 142:9284) */}
                <div className="bg-[#f1edf5] h-[10px] rounded-full overflow-hidden">
                  <div
                    className="bg-[#5d198f] h-full rounded-full transition-all duration-500"
                    style={{ width: `${balance.total ? Math.min(100, (balance.used / balance.total) * 100) : 0}%` }}
                  />
                </div>

                {/* Split Completed vs Remaining Boxes (Figma 142:9286) */}
                <div className="grid grid-cols-2 gap-[14px] pt-[4px]">
                  <div className="bg-[#f8f5fa] border border-[rgba(243,232,255,0.5)] rounded-[12px] px-[17px] py-[15px] flex flex-col items-center justify-center">
                    <span className="text-[#1e293b] text-[24px] font-bold leading-[30px]">
                      {balance.completed}
                    </span>
                    <span className="text-[#64748b] text-[12px] leading-[16px] pt-[2px]">
                      Completed
                    </span>
                  </div>

                  <div className="bg-[#f8f5fa] border border-[rgba(243,232,255,0.5)] rounded-[12px] px-[17px] py-[15px] flex flex-col items-center justify-center">
                    <span className="text-[#5d198f] text-[24px] font-bold leading-[30px]">
                      {balance.remaining}
                    </span>
                    <span className="text-[rgba(93,25,143,0.8)] font-bold text-[12px] leading-[16px] pt-[2px]">
                      Remaining
                    </span>
                  </div>
                </div>
                <p className="text-[11px] leading-[16px] text-[#94a3b8]">{t('mentorship.live.balanceNote')}</p>
              </>
            ) : (
              <p className="text-[13px] leading-[20px] text-[#64748b]">{t('mentorship.live.noBalance')}</p>
            )}
          </div>

          {/* Primary Action Card / CTA (Figma 142:9299) */}
          <div
            className="rounded-[20px] p-[24px] flex flex-col gap-[8px] text-white shadow-[0px_4px_14px_0px_rgba(76,5,133,0.3)] relative overflow-hidden"
            style={{
              backgroundImage:
                'linear-gradient(156.28deg, rgb(76, 5, 133) 0%, rgb(58, 3, 83) 100%)',
            }}
            data-node-id="142:9299"
          >
            <div className="flex items-center gap-[8px]">
              <Sparkles className="size-[16.67px] text-[#e9d5ff]" />
              <span className="text-[#e9d5ff] font-bold text-[12px] tracking-[0.6px] uppercase leading-[16px]">
                BOOK 1:1 MENTORSHIP
              </span>
            </div>

            <h3 className="font-bold text-[18px] text-white leading-[22.5px] pt-1">
              Ready for your next review?
            </h3>

            <p className="text-[12px] text-[rgba(243,232,255,0.8)] leading-[19.5px] pb-2">
              Find a mentor in your track and book an available 1:1 session.
            </p>

            <Link
              to={ROUTES.mentorshipMentors}
              className="bg-white rounded-[12px] py-[14px] px-[16px] flex items-center justify-center gap-[8px] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1)] hover:bg-slate-50 transition-colors w-full group"
            >
              <Search className="size-[13.5px] text-[#5d198f]" />
              <span
                className="font-bold text-[14px] leading-[20px] text-transparent bg-clip-text"
                style={{
                  backgroundImage:
                    'linear-gradient(166.24deg, rgba(106, 42, 138, 0.92) 0%, rgba(59, 4, 84, 0.96) 71.43%)',
                }}
              >
                Browse Mentors
              </span>
              <ArrowRight className="size-[13.5px] text-[#5d198f] group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Mentorship Guidelines Info Card (Figma 142:9318) */}
          <div
            className="bg-[#f8fafc] border border-[rgba(243,232,255,0.6)] drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] rounded-[20px] p-[17px] flex flex-col gap-[10px]"
            data-node-id="142:9318"
          >
            <div className="flex items-center gap-[6px]">
              <Sparkles className="size-[15px] text-[#334155] " />
              <h4 className="font-bold text-[#334155] text-[12px] tracking-[0.3px] uppercase leading-[16px]">
                MENTORSHIP GUIDELINES
              </h4>
            </div>

            <div className="flex flex-col gap-[8px]">
              <div className="flex gap-[6px] items-start text-[#64748b] text-[11px] leading-[16.5px]">
                <CheckCircle2 className="size-[13.5px] text-[#5d198f] shrink-0 mt-0.5" />
                <span>Prepare 2–3 specific questions or project blockers before your session.</span>
              </div>
              <div className="flex gap-[6px] items-start text-[#64748b] text-[11px] leading-[16.5px]">
                <CheckCircle2 className="size-[13.5px] text-[#5d198f] shrink-0 mt-0.5" />
                <span>Share links to your code, Pull Requests, or Figma designs in advance.</span>
              </div>
              <div className="flex gap-[6px] items-start text-[#64748b] text-[11px] leading-[16.5px]">
                <CheckCircle2 className="size-[13.5px] text-[#5d198f] shrink-0 mt-0.5" />
                <span>Take notes and follow up on actionable feedback within 48 hours.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Modal */}
      {cancelModalSessionId && (
        <CancelSessionModal
          isOpen={true}
          isLateCancellation={isLateCancel}
          isSubmitting={isCancelling}
          onClose={() => setCancelModalSessionId(null)}
          onConfirm={() => void handleConfirmCancel()}
        />
      )}
    </div>
  );
};

export default MentorshipDashboard;
