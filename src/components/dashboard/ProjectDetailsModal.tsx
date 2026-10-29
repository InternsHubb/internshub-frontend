import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  X,
  Code2,
  CheckCircle2,
  Calendar,
  User,
  GitBranch,
  ExternalLink,
  Layers,
  Sparkles,
} from 'lucide-react';
import type { SquadDetailsDto } from '@/lib/api/types';
import { safeHttpUrl } from '@/lib/url';
import { YourProjectPill } from './ProjectSummaryCard';
import { PURPLE_GRADIENT } from './primitives';
import { cn } from '@/lib/cn';

interface ProjectDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  squad: SquadDetailsDto;
}

export const ProjectDetailsModal: React.FC<ProjectDetailsModalProps> = ({
  isOpen,
  onClose,
  squad,
}) => {
  const { t } = useTranslation();
  const modalRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  const isCompleted = squad.status === 'Completed';
  const repoHref = safeHttpUrl(squad.repositoryUrl);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    setTimeout(() => {
      closeBtnRef.current?.focus();
    }, 50);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-details-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-8"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className="fixed inset-0 bg-[#160628]/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
      />

      {/* Modal Dialog Content */}
      <div
        ref={modalRef}
        className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-[24px] sm:rounded-[30px] shadow-[0_20px_50px_rgba(0,0,0,0.25)] border border-purple-100 p-5 sm:p-7 md:p-8 animate-in zoom-in-95 duration-200 scrollbar-thin scrollbar-thumb-purple-200 text-start"
      >
        {/* Floating Close Button */}
        <button
          ref={closeBtnRef}
          type="button"
          onClick={onClose}
          aria-label={t('dashboard.project.close', 'Close')}
          className="sticky top-0 float-right rtl:float-left -mt-1 -mr-1 rtl:-mr-0 rtl:-ml-1 z-20 size-9 rounded-full bg-slate-100 hover:bg-purple-100 text-slate-700 hover:text-[#5a198f] flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5a198f]"
        >
          <X className="size-4" />
        </button>

        {/* Header Pill & Title */}
        <div className="mb-6">
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <YourProjectPill />
            <span
              className={cn(
                'rounded-full px-3 py-1 text-[11px] font-bold',
                isCompleted ? 'bg-[#f6ebff] text-[#3b0454]' : 'bg-[#e3fbe5] text-[#068f2f]'
              )}
            >
              {t(isCompleted ? 'dashboard.project.completed' : 'dashboard.project.active')}
            </span>
          </div>

          <h2
            id="project-details-title"
            className="text-2xl sm:text-3xl font-bold text-black tracking-tight leading-tight"
          >
            <bdi>{t('dashboard.project.squadProject', { track: squad.trackName })}</bdi>
          </h2>
          <p className="text-xs sm:text-sm text-[#737373] font-medium mt-1">
            {t('dashboard.project.detailsModalDesc')}
          </p>
        </div>

        {/* Quick Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {/* Track */}
          <div className="p-3.5 rounded-2xl bg-[#faf5ff] border border-purple-100/80 flex items-center gap-3">
            <div className="size-10 rounded-xl bg-purple-100 text-[#5a198f] flex items-center justify-center shrink-0">
              <Layers className="size-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                {t('dashboard.project.projectTrack')}
              </p>
              <p className="text-[14px] font-bold text-[#111827]">
                {squad.trackName}
              </p>
            </div>
          </div>

          {/* Team Leader */}
          <div className="p-3.5 rounded-2xl bg-[#faf5ff] border border-purple-100/80 flex items-center gap-3">
            <div className="size-10 rounded-xl bg-purple-100 text-[#5a198f] flex items-center justify-center shrink-0">
              <User className="size-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                {t('dashboard.project.projectLeader')}
              </p>
              <p className="text-[14px] font-bold text-[#111827]">
                {squad.seniorName || t('dashboard.squad.seniorPending')}
              </p>
            </div>
          </div>

          {/* Sprint Cadence */}
          <div className="p-3.5 rounded-2xl bg-[#faf5ff] border border-purple-100/80 flex items-center gap-3">
            <div className="size-10 rounded-xl bg-purple-100 text-[#5a198f] flex items-center justify-center shrink-0">
              <Calendar className="size-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                {t('dashboard.project.sprintCycle')}
              </p>
              <p className="text-[13px] font-bold text-[#111827]">
                {t('dashboard.project.sprintCycleValue')}
              </p>
            </div>
          </div>

          {/* Code Repository */}
          <div className="p-3.5 rounded-2xl bg-[#faf5ff] border border-purple-100/80 flex items-center gap-3">
            <div className="size-10 rounded-xl bg-purple-100 text-[#5a198f] flex items-center justify-center shrink-0">
              <GitBranch className="size-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                {t('dashboard.project.repositoryLabel')}
              </p>
              {repoHref ? (
                <a
                  href={repoHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[13px] font-bold text-[#5a198f] hover:underline truncate max-w-full"
                >
                  <span className="truncate">{new URL(repoHref).pathname.replace(/^\//, '') || 'github.com'}</span>
                  <ExternalLink className="size-3.5 shrink-0" />
                </a>
              ) : (
                <p className="text-[13px] text-slate-500">{t('dashboard.links.none')}</p>
              )}
            </div>
          </div>
        </div>

        {/* Project Scope & Objectives */}
        <div className="mb-6 p-4 rounded-2xl bg-[#fcfaff] border border-purple-100">
          <div className="flex items-center gap-2 mb-2 text-[#5a198f]">
            <Code2 className="size-4" />
            <h3 className="text-sm font-bold text-[#111827]">
              {t('dashboard.project.projectScope')}
            </h3>
          </div>
          <p className="text-[13px] text-slate-600 leading-relaxed">
            {t('dashboard.project.projectScopeText')}
          </p>
        </div>

        {/* Deliverables Checklist */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3 text-[#5a198f]">
            <Sparkles className="size-4 text-[#dc6e0d]" />
            <h3 className="text-sm font-bold text-[#111827]">
              {t('dashboard.project.keyDeliverables')}
            </h3>
          </div>
          <ul className="space-y-2">
            {[1, 2, 3, 4].map((num) => (
              <li
                key={num}
                className="flex items-start gap-2.5 text-[12.5px] sm:text-[13px] text-slate-700"
              >
                <CheckCircle2 className="size-4 text-[#068f2f] shrink-0 mt-0.5" />
                <span>{t(`dashboard.project.deliverable${num}`)}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-purple-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className={cn(
              PURPLE_GRADIENT,
              'inline-flex items-center justify-center rounded-[12px] px-6 py-2.5 text-[13px] font-bold text-white shadow-sm hover:brightness-110 active:scale-98 transition'
            )}
          >
            {t('dashboard.project.close')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailsModal;
