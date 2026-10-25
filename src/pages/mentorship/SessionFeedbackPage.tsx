import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Check, Calendar, Clock, CheckCircle2, MessageSquare } from 'lucide-react';
import { MentorAvatar, MentorshipNotice } from '@/components/mentorship/MentorshipParts';
import { ROUTES } from '@/constants/routes';
import { useMentorship } from '@/context/MentorshipContext';

// The API has no session-feedback endpoint yet, so this page shows the completed session
// and says feedback isn't available instead of pretending to submit it.

export const SessionFeedbackPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const { getSessionById } = useMentorship();
  const session = getSessionById(id ?? '');

  if (!session || session.status !== 'Completed') {
    return (
      <MentorshipNotice title={t('mentorship.live.sessionNotFound')}>
        <Link to={ROUTES.mentorship} className="text-sm font-semibold text-[#5d198f]">Back to Mentorship</Link>
      </MentorshipNotice>
    );
  }

  return (
    <div className="max-w-[760px] mx-auto space-y-6 animate-in fade-in duration-300">
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

      {/* Top Completed Header */}
      <div className="text-center space-y-3">
        <div className="size-12 rounded-full bg-[#ecfdf5] text-[#10b981] flex items-center justify-center mx-auto border border-[#a7f3d0] ">
          <Check className="size-8 stroke-[3]" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[#0f172a] tracking-tight">
            Session Completed
          </h1>
          <p className="text-[#475569] text-sm mt-1">
            Your mentorship session has been completed.
          </p>
        </div>
      </div>

      {/* Compact Session Summary Card (Figma 142:8932) */}
      <div className="bg-white rounded-xl p-6 border border-[#f1ecf7] shadow-sm space-y-4">
        <div className="flex items-center justify-between gap-3 pb-4 border-b border-[rgba(243,232,255,0.6)] ">
          <div className="flex min-w-0 items-center gap-3.5">
            <MentorAvatar name={session.mentorName} className="size-10 rounded-full text-sm ring-2 ring-purple-100" />
            <h3 className="font-bold text-[#0f172a] text-sm truncate">
              <bdi>{session.mentorName}</bdi>
            </h3>
          </div>

          <span className="inline-flex shrink-0 items-center gap-1.5 px-3 py-1 rounded-full bg-[#ecfdf5] text-[#047857] text-xs font-semibold">
            <CheckCircle2 className="size-3.5 text-[#10b981]" />
            Completed
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#64748b] ">
          <div className="flex items-center gap-2">
            <Calendar className="size-4 text-[#5d198f] shrink-0" />
            <span>{session.fullDate}</span>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="size-4 text-[#5d198f] shrink-0" />
            <span>{session.time} • {session.duration}</span>
          </div>
        </div>
      </div>

      {/* Feedback Section (Figma 142:8964) */}
      <div className="bg-white rounded-xl p-6 sm:p-8 border border-[#f1ecf7] shadow-sm space-y-4">
        <h2 className="text-xl font-bold text-[#0f172a] ">
          How was your session?
        </h2>
        <p className="flex items-start gap-2 rounded-xl bg-[#f8f5fa] p-4 text-xs leading-relaxed text-[#5d198f]">
          <MessageSquare className="size-4 shrink-0 mt-0.5" />
          <span>{t('mentorship.live.feedbackUnavailable')}</span>
        </p>
        <div className="flex justify-end pt-2">
          <Link
            to={ROUTES.mentorship}
            className="w-full sm:w-auto px-6 py-3 rounded-xl text-white font-bold text-xs shadow-md hover:opacity-95 transition-all text-center"
            style={{
              backgroundImage:
                'linear-gradient(162.62deg, rgba(106, 42, 138, 0.92) 0%, rgba(59, 4, 84, 0.96) 71.43%)',
            }}
          >
            Back to Mentorship
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SessionFeedbackPage;
