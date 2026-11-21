import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Calendar, Clock, Wallet, AlertCircle, Check } from 'lucide-react';
import { ActionError, MentorAvatar, useTimeZoneLabel } from '@/features/mentorship/components/MentorshipParts';
import { ROUTES } from '@/app/routes';
import { useMentorship } from '@/features/mentorship/context/MentorshipContext';
import { BackendError, getBackendErrorKey } from '@/backend';

// Confirming books the selected slot. The booking API takes no discussion topic.

// A slot someone else just booked comes back as a conflict.
function bookingErrorKey(error: unknown): string {
  if (error instanceof BackendError && error.status === 409) return 'mentorship.live.slotTaken';
  return getBackendErrorKey(error);
}

export const ConfirmBookingPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { draft, balance, confirmBooking } = useMentorship();
  const timeZoneLabel = useTimeZoneLabel();
  const [isBooking, setIsBooking] = useState(false);
  const [errorKey, setErrorKey] = useState<string | null>(null);

  if (!draft) {
    return (
      <div className="text-center py-16 bg-white rounded-xl p-8 border border-[#f1ecf7] max-w-lg mx-auto shadow-sm">
        <h2 className="text-xl font-bold text-[#0f172a] mb-2">No session selected</h2>
        <p className="text-sm text-[#64748b] mb-6">
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

  const handleConfirm = async () => {
    setIsBooking(true);
    setErrorKey(null);
    try {
      const session = await confirmBooking();
      navigate(ROUTES.mentorshipBookingSuccess, { state: { sessionId: session.id } });
    } catch (error) {
      setErrorKey(bookingErrorKey(error));
      setIsBooking(false);
    }
  };

  const remainingAfter = balance ? Math.max(0, balance.remaining - 1) : 0;
  const hasNoSessionsLeft = balance !== null && balance.remaining === 0;

  return (
    <div className="mentorship-confirmation max-w-[1088px] mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Breadcrumb */}
      <div>
        <Link
          to={ROUTES.mentorshipBookSession.replace(':id', draft.mentor.id)}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#64748b] hover:text-[#5d198f] transition-colors"
        >
          <ArrowLeft className="size-3.5 rtl:rotate-180" />
          <span>Back to Book a Session</span>
        </Link>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-[32px] font-semibold text-[#211927] tracking-tight">
          Confirm Booking
        </h1>
        <p className="text-[#475569] text-sm mt-1">
          Review your session details before confirming.
        </p>
      </div>

      {/* Main Review Card (Figma 142:10098) */}
      <div className="bg-white rounded-xl p-6 sm:p-8 border border-[#f1ecf7] shadow-sm space-y-6">
        {/* Top Card Title & Status Badge */}
        <div className="flex items-center justify-between pb-4 border-b border-[rgba(243,232,255,0.6)] ">
          <div className="flex items-center gap-2 text-base font-bold text-[#0f172a] ">
            <span className="size-2 rounded-full bg-[#5d198f]" />
            <span>Session Details</span>
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ecfdf5] text-[#047857] text-xs font-semibold">
            <span className="size-1.5 rounded-full bg-[#10b981]" />
            Ready to Confirm
          </span>
        </div>

        {/* Mentor Info Row */}
        <div className="p-4 sm:p-5 rounded-lg bg-[#faf7fc] border border-[#f3e8ff]/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <MentorAvatar name={draft.mentor.name} className="size-14 rounded-full text-lg ring-2 ring-purple-100" />
            <div>
              <h3 className="font-bold text-[#0f172a] text-base">
                <bdi>{draft.mentor.name}</bdi>
              </h3>
              {draft.mentor.trackNames.length > 0 && (
                <p className="text-xs font-semibold text-[#672b97] mt-1">
                  {draft.mentor.trackNames.join(' · ')}
                </p>
              )}
            </div>
          </div>

          <span className="px-3.5 py-1.5 rounded-full bg-white text-[#475569] text-xs font-semibold border border-[#e9d5ff]/70 self-start sm:self-auto shadow-2xs">
            1-on-1 Mentorship
          </span>
        </div>

        {/* Date & Time Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-[#f7f2f9] border border-[#f1ecf7] flex items-start gap-3.5">
            <div className="size-10 rounded-xl bg-[#f3e8ff] text-[#5d198f] flex items-center justify-center shrink-0">
              <Calendar className="size-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-[#94a3b8] uppercase tracking-wider">
                Date
              </span>
              <div className="text-sm font-bold text-[#0f172a] mt-0.5">
                {draft.slot.date}
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-[#f8fafc] border border-[#f1ecf7] flex items-start gap-3.5">
            <div className="size-10 rounded-xl bg-[#f3e8ff] text-[#5d198f] flex items-center justify-center shrink-0">
              <Clock className="size-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-[#94a3b8] uppercase tracking-wider">
                Time & Timezone
              </span>
              <div className="text-sm font-bold text-[#0f172a] mt-0.5">
                {draft.slot.time} • {draft.slot.duration}
              </div>
              <div className="text-xs text-[#64748b] mt-0.5">
                {timeZoneLabel}
              </div>
            </div>
          </div>
        </div>

        {/* Mentorship Balance Module */}
        {balance && (
          <div className="p-5 rounded-lg bg-[#f8f5fa] border border-[#f3e8ff]/80 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 font-bold text-[#5d198f] ">
                <Wallet className="size-4" />
                <span>Mentorship Balance</span>
              </div>
              <span className="text-[#64748b] ">
                <strong className="text-[#0f172a] ">{balance.remaining} sessions</strong> remaining now
              </span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-[#475569] font-medium">
                {remainingAfter} sessions remaining after booking
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#f3e8ff] text-[#5d198f] font-bold text-[11px]">
                -1 session
              </span>
            </div>

            <div className="h-2 w-full bg-[#f1edf5] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#5d198f] rounded-full transition-all"
                style={{ width: `${balance.total ? ((balance.total - remainingAfter) / balance.total) * 100 : 0}%` }}
              />
            </div>
          </div>
        )}

        {/* Cancellation Policy Banner */}
        <div className="rounded-lg p-4 bg-[#fffbeb] border border-[#fef3c7] flex items-start gap-3 text-xs text-[#b45309] ">
          <AlertCircle className="size-4 text-[#b45309] shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="font-semibold">Cancellation Policy:</strong>{' '}
            Cancel 24+ hours before your session to return it to your balance. Late cancellations use the session credit.
          </p>
        </div>

        {hasNoSessionsLeft && <ActionError messageKey="mentorship.live.noSessionsLeft" />}
        <ActionError messageKey={errorKey} />

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <button
            type="button"
            disabled={isBooking}
            onClick={() => navigate(ROUTES.mentorshipBookSession.replace(':id', draft.mentor.id))}
            className="w-full sm:w-auto px-5 py-3 rounded-xl border border-[#e9d5ff] bg-white hover:bg-[#faf7fd] text-[#475569] font-semibold text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            <Calendar className="size-4 text-[#64748b]" />
            <span>Change Date / Time</span>
          </button>

          <button
            type="button"
            disabled={isBooking || hasNoSessionsLeft}
            onClick={() => void handleConfirm()}
            className="w-full sm:w-auto flex-1 max-w-none py-3 px-6 rounded-xl text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md hover:opacity-95 transition-all disabled:cursor-not-allowed disabled:opacity-60"
            style={{
              backgroundImage:
                'linear-gradient(162.62deg, rgba(106, 42, 138, 0.92) 0%, rgba(59, 4, 84, 0.96) 71.43%)',
            }}
          >
            <Check className="size-4" />
            <span>{isBooking ? t('mentorship.live.booking') : 'Confirm Booking'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmBookingPage;
