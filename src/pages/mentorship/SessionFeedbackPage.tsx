import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Check,
  Star,
  Calendar,
  Clock,
  MessageSquare,
  CheckCircle2,
} from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { useMentorship } from '@/context/MentorshipContext';

export const SessionFeedbackPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getSessionById, submitFeedback } = useMentorship();

  const session = getSessionById(id || 'session-active') || {
    id: id || 'session-active',
    mentorName: 'Dr. Aisha Patel',
    mentorRole: 'Staff Engineer & Tech Lead • Frontend Track',
    mentorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
    fullDate: 'Wednesday, Sep 23, 2026',
    time: '4:30 PM – 5:15 PM EST (45 min)',
    topic: 'React state management in a large application',
  };

  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [thoughts, setThoughts] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitFeedback(session.id, rating, thoughts);
    setSubmitted(true);
    setTimeout(() => {
      navigate(ROUTES.mentorship);
    }, 1800);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-300">
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

      {/* Top Completed Header */}
      <div className="text-center space-y-3">
        <div className="size-16 rounded-full bg-[#ecfdf5] text-[#10b981] flex items-center justify-center mx-auto shadow-md ring-8 ring-emerald-50 dark:ring-emerald-950/40">
          <Check className="size-8 stroke-[3]" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-[#0f172a] dark:text-white tracking-tight">
            Session Completed
          </h1>
          <p className="text-[#475569] dark:text-slate-300 text-sm mt-1">
            Your mentorship session has been completed.
          </p>
        </div>
      </div>

      {/* Compact Session Summary Card (Figma 142:8932) */}
      <div className="bg-white dark:bg-slate-900 rounded-[24px] p-6 border border-[#f1ecf7] dark:border-purple-900/40 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-[rgba(243,232,255,0.6)] dark:border-purple-900/30">
          <div className="flex items-center gap-3.5">
            <img
              src={session.mentorAvatar}
              alt={session.mentorName}
              className="size-12 rounded-2xl object-cover ring-2 ring-purple-100 dark:ring-purple-950"
            />
            <div>
              <h3 className="font-bold text-[#0f172a] dark:text-white text-sm">
                {session.mentorName}
              </h3>
              <p className="text-xs text-[#64748b] dark:text-slate-400 mt-0.5">
                {session.mentorRole}
              </p>
            </div>
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ecfdf5] text-[#047857] text-xs font-semibold">
            <CheckCircle2 className="size-3.5 text-[#10b981]" />
            Completed
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#64748b] dark:text-slate-400">
          <div className="flex items-center gap-2">
            <Calendar className="size-4 text-[#5d198f] dark:text-purple-300 shrink-0" />
            <span>{session.fullDate}</span>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="size-4 text-[#5d198f] dark:text-purple-300 shrink-0" />
            <span>{session.time}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-[#475569] dark:text-slate-300 pt-2 border-t border-[rgba(243,232,255,0.6)] dark:border-purple-900/30">
          <MessageSquare className="size-3.5 text-[#5d198f] dark:text-purple-300 shrink-0" />
          <span className="font-medium text-[#0f172a] dark:text-white truncate">
            {session.topic}
          </span>
        </div>
      </div>

      {/* Feedback Section (Primary Card) (Figma 142:8964) */}
      <div className="bg-white dark:bg-slate-900 rounded-[24px] p-6 sm:p-8 border border-[#f1ecf7] dark:border-purple-900/40 shadow-sm space-y-6">
        <div>
          <h2 className="text-xl font-bold text-[#0f172a] dark:text-white">
            How was your session?
          </h2>
          <p className="text-xs text-[#94a3b8] dark:text-slate-400 mt-1">
            Your feedback is optional.
          </p>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-2 bg-[#ecfdf5] dark:bg-emerald-950/40 rounded-2xl border border-emerald-100 dark:border-emerald-900/50">
            <CheckCircle2 className="size-10 text-[#10b981] mx-auto" />
            <h3 className="text-base font-bold text-[#047857] dark:text-emerald-200">
              Thank you for your feedback!
            </h3>
            <p className="text-xs text-[#059669] dark:text-emerald-300">
              Returning to Mentorship dashboard...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Star Rating */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#0f172a] dark:text-white block">
                Rating
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 rounded-lg hover:scale-110 transition-transform focus:outline-none"
                    aria-label={`Rate ${star} stars`}
                  >
                    <Star
                      className={`size-7 ${
                        star <= (hoverRating || rating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-300 dark:text-slate-700'
                      } transition-colors`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Share Thoughts Textarea */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#0f172a] dark:text-white block">
                Share your thoughts
              </label>
              <textarea
                rows={4}
                value={thoughts}
                onChange={(e) => setThoughts(e.target.value)}
                placeholder="What went well? Any areas of improvement or takeaways?"
                className="w-full text-xs text-[#0f172a] dark:text-white bg-[#f8fafc] dark:bg-slate-800/80 border border-[#e9d5ff] dark:border-purple-900/60 rounded-xl p-3.5 focus:outline-none focus:ring-2 focus:ring-[#5d198f]/30"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate(ROUTES.mentorship)}
                className="w-full sm:w-auto px-5 py-3 rounded-xl border border-[#e9d5ff] dark:border-purple-900/60 bg-white dark:bg-slate-900 hover:bg-[#faf7fd] text-[#475569] dark:text-slate-200 font-semibold text-xs transition-colors shadow-sm"
              >
                Skip for Now
              </button>

              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 rounded-xl text-white font-bold text-xs shadow-md hover:opacity-95 transition-all"
                style={{
                  backgroundImage:
                    'linear-gradient(162.62deg, rgba(106, 42, 138, 0.92) 0%, rgba(59, 4, 84, 0.96) 71.43%)',
                }}
              >
                Submit Feedback
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default SessionFeedbackPage;
