import React, { useRef, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Globe, Sparkles, CheckCircle2 } from 'lucide-react';
import type { SeniorProfile } from '@/types/senior';
import { LinkedInIcon } from './LinkedInIcon';
import { seniorProfilePath } from '@/constants/routes';

interface SeniorCardProps {
  senior: SeniorProfile;
  journeyHref?: string;
  className?: string;
}

export const SeniorCard: React.FC<SeniorCardProps> = ({
  senior,
  journeyHref,
  className = '',
}) => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const cardRef = useRef<HTMLDivElement>(null);

  const [tilt, setTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [imgSrc, setImgSrc] = useState(senior.avatar);

  const displayName = isRtl ? senior.nameAr : senior.name;
  const displayRole = isRtl ? senior.roleAr : senior.role;
  const displayCompany = isRtl ? senior.companyAr : senior.company;
  const displaySpecialization = isRtl ? senior.specializationAr : senior.specialization;
  const displayBio = isRtl ? senior.shortBioAr : senior.shortBio;

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    // Respect reduced motion preference and touch devices
    if (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      window.matchMedia('(pointer: coarse)').matches
    ) {
      return;
    }

    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Subtle 3D tilt angles (max +/- 6 deg)
    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;

    setTilt({ x: rotateX, y: rotateY });
  }, []);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: isHovered
          ? `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(-6px)`
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)',
        transition: isHovered
          ? 'transform 0.1s ease-out, box-shadow 0.3s cubic-bezier(0.22, 1, 0.36, 1)'
          : 'transform 0.4s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
      }}
      className={`group relative flex flex-col justify-between rounded-[24px] bg-white border border-[#eeddfc] p-6 sm:p-7 shadow-[0_4px_20px_rgba(90,25,143,0.06)] hover:shadow-[0_20px_40px_-15px_rgba(90,25,143,0.18)] hover:border-[#cb8cfe] transition-colors will-change-transform ${className}`}
    >
      {/* Decorative gradient highlight on top edge */}
      <div
        aria-hidden="true"
        className="absolute inset-x-8 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#a855f7]/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />

      <div>
        {/* Top Header: Avatar + Status + Experience Badge */}
        <div className="flex items-start justify-between gap-4 mb-5">
          <div className="relative">
            <div className="size-[72px] sm:size-[76px] rounded-2xl overflow-hidden ring-3 ring-purple-100/80 group-hover:ring-purple-300 transition-all duration-300 bg-[#fbf7fe] shrink-0">
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
              className="absolute -bottom-1 -right-1 bg-[#5a198f] text-white rounded-full p-1 shadow-sm ring-2 ring-white"
            >
              <CheckCircle2 className="size-3.5 text-white stroke-[2.5]" />
            </div>
          </div>

          <div className="flex flex-col items-end gap-1.5">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[12px] font-semibold bg-purple-50 text-[#5a198f] border border-purple-200/70">
              <Sparkles className="size-3 text-[#dc6e0d]" />
              {t('experience.yearsExperience', { years: senior.yearsOfExperience })}
            </span>
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
              {displayCompany}
            </span>
          </div>
        </div>

        {/* Identity & Title */}
        <div className="text-start mb-3">
          <h3 className="text-[20px] sm:text-[22px] font-bold text-[#111827] tracking-tight group-hover:text-[#5a198f] transition-colors leading-snug">
            {displayName}
          </h3>
          <p className="text-[14px] font-semibold text-[#5a198f] mt-0.5 leading-snug">
            {displayRole}
          </p>
          <p className="text-[12px] text-[#6b7280] font-medium mt-1">
            {displaySpecialization}
          </p>
        </div>

        {/* Short Biography */}
        <p className="text-[13.5px] sm:text-[14px] text-[#4b5563] leading-relaxed mb-4 text-start line-clamp-3">
          {displayBio}
        </p>

        {/* Skills Pills */}
        <div className="flex flex-wrap gap-1.5 mb-6">
          {senior.skills.slice(0, 4).map((skill) => (
            <span
              key={skill}
              className="px-2.5 py-1 text-[11.5px] font-medium rounded-lg bg-[#f8f3fc] text-[#4c0585] border border-purple-100/60 transition-colors group-hover:bg-[#f3e8ff]"
            >
              {skill}
            </span>
          ))}
          {senior.skills.length > 4 && (
            <span className="px-2 py-1 text-[11px] font-medium rounded-lg bg-slate-50 text-slate-500 border border-slate-200">
              +{senior.skills.length - 4}
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons Section */}
      <div className="pt-4 border-t border-purple-50/80 flex flex-col gap-2.5">
        {/* Prominent "Connect on LinkedIn" Button */}
        <a
          href={senior.linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Connect with ${displayName} on LinkedIn (opens in new tab)`}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#0a66c2] hover:bg-[#004182] text-white text-[13.5px] sm:text-[14px] font-semibold shadow-sm hover:shadow-md transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a66c2] focus-visible:ring-offset-2"
        >
          <LinkedInIcon className="w-4 h-4 fill-current shrink-0" />
          <span>{t('experience.connectLinkedIn')}</span>
        </a>

        {/* Secondary "Explore Their Journey" Direct Navigation Button (no popup) */}
        <div className="flex items-center gap-2">
          <Link
            to={journeyHref || seniorProfilePath(senior.id)}
            aria-label={`Explore career journey of ${displayName}`}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-purple-50/90 hover:bg-[#5a198f] text-[#5a198f] hover:text-white border border-[#cb8cfe]/60 hover:border-[#5a198f] text-[13.5px] sm:text-[14px] font-semibold transition-all duration-200 group/btn focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5a198f] active:scale-[0.98]"
          >
            <span>{t('experience.exploreJourney')}</span>
            {isRtl ? (
              <ArrowLeft className="w-4 h-4 shrink-0 transition-transform duration-200 group-hover/btn:-translate-x-1" />
            ) : (
              <ArrowRight className="w-4 h-4 shrink-0 transition-transform duration-200 group-hover/btn:translate-x-1" />
            )}
          </Link>

          {/* Optional Portfolio Link */}
          {senior.portfolioUrl && (
            <a
              href={senior.portfolioUrl}
              target="_blank"
              rel="noopener noreferrer"
              title={t('experience.viewPortfolio')}
              aria-label={`Visit portfolio of ${displayName}`}
              className="size-[42px] inline-flex items-center justify-center rounded-xl bg-white hover:bg-purple-50 text-slate-600 hover:text-[#5a198f] border border-slate-200 hover:border-purple-300 transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-600"
            >
              <Globe className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
