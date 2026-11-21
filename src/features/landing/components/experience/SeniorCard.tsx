import React, { useRef, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ArrowLeft,
  Globe,
  Sparkles,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  FolderGit2,
  Lightbulb,
} from 'lucide-react';
import type { SeniorProfile } from '@/features/landing/types/senior';
import { LinkedInIcon } from '@/features/landing/components/experience/LinkedInIcon';
import { seniorProfilePath } from '@/app/routes';

const GitHubIcon = ({ className = 'size-4' }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

interface SeniorCardProps {
  senior: SeniorProfile;
  journeyHref?: string;
  className?: string;
  expandOnHover?: boolean;
}

export const SeniorCard: React.FC<SeniorCardProps> = ({
  senior,
  journeyHref,
  className = '',
  expandOnHover = false,
}) => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const cardRef = useRef<HTMLDivElement>(null);

  const [tilt, setTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isTappedOpen, setIsTappedOpen] = useState(false);
  const [imgSrc, setImgSrc] = useState(senior.avatar);

  const isExpanded = expandOnHover && (isHovered || isTappedOpen);

  const displayName = isRtl ? senior.nameAr : senior.name;
  const displayRole = isRtl ? senior.roleAr : senior.role;
  const displayCompany = isRtl ? senior.companyAr : senior.company;
  const displaySpecialization = isRtl ? senior.specializationAr : senior.specialization;
  const displayBio = isRtl ? senior.shortBioAr : senior.shortBio;

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      // Respect reduced motion preference and touch devices
      if (
        window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
        window.matchMedia('(pointer: coarse)').matches
      ) {
        return;
      }

      // If card is expanded, damp tilt down to keep text easily readable
      const tiltFactor = isExpanded ? 1.2 : 5;

      const card = cardRef.current;
      if (!card) return;

      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -tiltFactor;
      const rotateY = ((x - centerX) / centerX) * tiltFactor;

      setTilt({ x: rotateX, y: rotateY });
    },
    [isExpanded]
  );

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  const handleCardToggle = (e: React.MouseEvent) => {
    if (!expandOnHover) return;
    // Don't toggle expansion when user clicked an interactive anchor or button inside the card
    const target = e.target as HTMLElement;
    if (target.closest('a') || target.closest('button')) {
      return;
    }
    setIsTappedOpen((prev) => !prev);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!expandOnHover) return;
    if (e.key === 'Enter' || e.key === ' ') {
      const target = e.target as HTMLElement;
      if (target.closest('a') || target.closest('button')) {
        return;
      }
      e.preventDefault();
      setIsTappedOpen((prev) => !prev);
    }
  };

  return (
    <div
      ref={cardRef}
      tabIndex={expandOnHover ? 0 : undefined}
      role={expandOnHover ? 'region' : undefined}
      aria-expanded={expandOnHover ? isExpanded : undefined}
      aria-label={`${displayName} - ${displayRole}`}
      onClick={handleCardToggle}
      onKeyDown={handleKeyDown}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform:
          isHovered && !isExpanded
            ? `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(-6px)`
            : isExpanded
            ? `perspective(1000px) rotateX(${tilt.x * 0.4}deg) rotateY(${tilt.y * 0.4}deg) translateY(-4px)`
            : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)',
        transition: isHovered
          ? 'transform 0.12s ease-out, box-shadow 0.3s cubic-bezier(0.22, 1, 0.36, 1)'
          : 'transform 0.4s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
      }}
      className={`group relative flex flex-col justify-between rounded-[24px] bg-white border border-[#eeddfc] p-6 sm:p-7 shadow-[0_4px_20px_rgba(90,25,143,0.06)] hover:shadow-[0_20px_45px_-12px_rgba(90,25,143,0.18)] hover:border-[#cb8cfe] transition-all will-change-transform text-start ${
        expandOnHover ? 'cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5a198f]' : ''
      } ${className}`}
    >
      {/* Decorative gradient highlight on top edge */}
      <div
        aria-hidden="true"
        className="absolute inset-x-8 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#a855f7]/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />

      <div>
        {/* Top Header: Avatar + Demo Badge + Experience Badge */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="relative shrink-0">
            <div className="size-[68px] sm:size-[72px] rounded-2xl overflow-hidden ring-3 ring-purple-100/80 group-hover:ring-purple-300 transition-all duration-300 bg-[#fbf7fe]">
              <img
                src={imgSrc}
                alt={displayName}
                onError={() => {
                  if (imgSrc !== senior.avatarFallback) {
                    setImgSrc(senior.avatarFallback);
                  }
                }}
                className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
            </div>
            {/* Verified icon badge */}
            <div
              title={t('experience.verifiedJourney')}
              className="absolute -bottom-1 -right-1 bg-[#5a198f] text-white rounded-full p-1 shadow-xs ring-2 ring-white"
            >
              <CheckCircle2 className="size-3 text-white stroke-[2.5]" />
            </div>
          </div>

          <div className="flex flex-col items-end gap-1.5 text-end">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-50 text-[#5a198f] border border-purple-200/70">
              <Sparkles className="size-3 text-[#dc6e0d]" />
              {t('experience.yearsExperience', { years: senior.yearsOfExperience })}
            </span>
            <span className="text-[10.5px] font-medium text-slate-500 uppercase tracking-wider truncate max-w-[130px]">
              {displayCompany}
            </span>
          </div>
        </div>

        {/* Identity & Title */}
        <div className="mb-2.5">
          <h3 className="text-[19px] sm:text-[21px] font-bold text-[#111827] tracking-tight group-hover:text-[#5a198f] transition-colors leading-snug">
            {displayName}
          </h3>
          <p className="text-[13.5px] font-semibold text-[#5a198f] mt-0.5 leading-snug">
            {displayRole}
          </p>
          <p className="text-[11.5px] text-[#6b7280] font-medium mt-0.5 truncate">
            {displaySpecialization}
          </p>
        </div>

        {/* Short Biography (compact) */}
        <p
          className={`text-[13px] text-[#4b5563] leading-relaxed transition-all duration-300 ${
            isExpanded ? 'mb-4' : 'line-clamp-2 mb-3'
          }`}
        >
          {displayBio}
        </p>

        {/* Skills Pills (Top 3 in compact mode) */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {senior.skills.slice(0, isExpanded ? 6 : 3).map((skill) => (
            <span
              key={skill}
              className="px-2 py-0.5 text-[11px] font-medium rounded-lg bg-[#f8f3fc] text-[#4c0585] border border-purple-100/60 transition-colors group-hover:bg-[#f3e8ff]"
            >
              {skill}
            </span>
          ))}
          {!isExpanded && senior.skills.length > 3 && (
            <span className="px-1.5 py-0.5 text-[10.5px] font-medium rounded-lg bg-slate-50 text-slate-500 border border-slate-200">
              +{senior.skills.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* EXPANDABLE SECTION (Only rendered when expandOnHover is true)
          Uses CSS Grid rows transition (grid-template-rows 0fr -> 1fr) for smooth, non-jarring layout animation */}
      {expandOnHover && (
        <div
          className={`grid transition-[grid-template-rows,opacity] duration-400 ease-out ${
            isExpanded ? 'grid-rows-[1fr] opacity-100 mb-4' : 'grid-rows-[0fr] opacity-0 pointer-events-none'
          }`}
        >
          <div className="overflow-hidden flex flex-col gap-3.5 pt-3 border-t border-purple-100">
            {/* Experience Stats Row */}
            <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-[#faf6fe] border border-purple-100/80 text-center">
              <div>
                <div className="text-[13px] font-black text-[#5a198f]">{senior.stats.yearsExp}+</div>
                <div className="text-[9.5px] font-medium text-slate-500 leading-tight">
                  {isRtl ? 'سنوات خبرة' : 'Years Exp'}
                </div>
              </div>
              <div className="border-x border-purple-200/60">
                <div className="text-[13px] font-black text-[#5a198f]">{senior.stats.projectsCompleted}</div>
                <div className="text-[9.5px] font-medium text-slate-500 leading-tight">
                  {isRtl ? 'مشروع مكتمل' : 'Shipped'}
                </div>
              </div>
              <div>
                <div className="text-[13px] font-black text-[#5a198f]">{senior.stats.menteesGuided}</div>
                <div className="text-[9.5px] font-medium text-slate-500 leading-tight">
                  {isRtl ? 'مستفيد' : 'Mentees'}
                </div>
              </div>
            </div>

            {/* Featured Project Snippet */}
            {senior.featuredProjects && senior.featuredProjects.length > 0 && (
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-start">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600 uppercase tracking-wide mb-1">
                  <FolderGit2 className="size-3.5 text-[#5a198f]" />
                  <span>{isRtl ? 'أبرز المشاريع والتأثير:' : 'Featured Project:'}</span>
                </div>
                <div className="text-[12.5px] font-bold text-slate-900 leading-snug">
                  {isRtl && senior.featuredProjects[0].titleAr
                    ? senior.featuredProjects[0].titleAr
                    : senior.featuredProjects[0].title}
                </div>
                <div className="text-[11.5px] text-slate-600 mt-0.5 line-clamp-2">
                  {isRtl && senior.featuredProjects[0].impactAr
                    ? senior.featuredProjects[0].impactAr
                    : senior.featuredProjects[0].impact}
                </div>
              </div>
            )}

            {/* Career Advice Snippet */}
            {senior.topAdvice && senior.topAdvice.length > 0 && (
              <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/60 text-start">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-800 uppercase tracking-wide mb-1">
                  <Lightbulb className="size-3.5 text-[#dc6e0d]" />
                  <span>{isRtl ? 'نصيحة للمبتدئين:' : 'Advice for Juniors:'}</span>
                </div>
                <p className="text-[11.5px] text-amber-950 leading-relaxed italic line-clamp-2">
                  &ldquo;
                  {isRtl && senior.topAdvice[0].descriptionAr
                    ? senior.topAdvice[0].descriptionAr
                    : senior.topAdvice[0].description}
                  &rdquo;
                </p>
              </div>
            )}

            {/* Social Icons row (always accessible) */}
            <div className="flex items-center gap-2 pt-1">
              <span className="text-[11px] font-medium text-slate-400">
                {isRtl ? 'الروابط المهنية:' : 'Links:'}
              </span>
              <a
                href={senior.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                title="LinkedIn"
                aria-label={`${displayName} LinkedIn`}
                className="size-7 rounded-lg bg-[#0a66c2]/10 hover:bg-[#0a66c2] text-[#0a66c2] hover:text-white flex items-center justify-center transition-colors"
              >
                <LinkedInIcon className="size-3.5 fill-current" />
              </a>

              {senior.githubUrl && (
                <a
                  href={senior.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  title="GitHub"
                  aria-label={`${displayName} GitHub`}
                  className="size-7 rounded-lg bg-slate-100 hover:bg-slate-900 text-slate-700 hover:text-white flex items-center justify-center transition-colors"
                >
                  <GitHubIcon className="size-3.5" />
                </a>
              )}

              {senior.portfolioUrl && (
                <a
                  href={senior.portfolioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  title="Portfolio"
                  aria-label={`${displayName} Portfolio`}
                  className="size-7 rounded-lg bg-purple-50 hover:bg-[#5a198f] text-[#5a198f] hover:text-white flex items-center justify-center transition-colors"
                >
                  <Globe className="size-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons Section */}
      <div className="pt-3 border-t border-purple-50/80 flex items-center gap-2">
        {/* Primary "Explore Their Journey" Navigation Button */}
        <Link
          to={journeyHref || seniorProfilePath(senior.id)}
          onClick={(e) => e.stopPropagation()}
          aria-label={`Explore career journey of ${displayName}`}
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-purple-50/90 hover:bg-[#5a198f] text-[#5a198f] hover:text-white border border-[#cb8cfe]/60 hover:border-[#5a198f] text-[12.5px] sm:text-[13px] font-semibold transition-all duration-200 group/btn focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5a198f] active:scale-[0.98]"
        >
          <span>{t('experience.exploreJourney')}</span>
          {isRtl ? (
            <ArrowLeft className="size-3.5 shrink-0 transition-transform duration-200 group-hover/btn:-translate-x-1" />
          ) : (
            <ArrowRight className="size-3.5 shrink-0 transition-transform duration-200 group-hover/btn:translate-x-1" />
          )}
        </Link>

        {/* LinkedIn Icon-only Button */}
        <a
          href={senior.linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          title={t('experience.connectLinkedIn')}
          aria-label={`Connect with ${displayName} on LinkedIn (opens in new tab)`}
          className="size-[38px] rounded-xl bg-[#0a66c2] hover:bg-[#004182] text-white flex items-center justify-center shadow-xs hover:shadow-md transition-all duration-200 shrink-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a66c2]"
        >
          <LinkedInIcon className="w-4 h-4 fill-current" />
        </a>

        {/* If on mobile and expandable, provide explicit tap-to-expand button */}
        {expandOnHover && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsTappedOpen((prev) => !prev);
            }}
            aria-label={isExpanded ? 'Collapse profile' : 'Expand profile'}
            className="size-[38px] rounded-xl bg-slate-100 hover:bg-purple-100 text-slate-700 hover:text-[#5a198f] flex items-center justify-center transition-colors md:hidden shrink-0"
          >
            {isExpanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
          </button>
        )}
      </div>
    </div>
  );
};

export default SeniorCard;
