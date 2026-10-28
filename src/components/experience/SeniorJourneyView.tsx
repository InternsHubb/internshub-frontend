import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Globe,
  CheckCircle2,
  Sparkles,
  Briefcase,
  Compass,
  AlertTriangle,
  Lightbulb,
  TrendingUp,
  Award,
  GraduationCap,
  Quote,
  Layers,
  MapPin,
  Target,
  ExternalLink,
} from 'lucide-react';
import type { SeniorProfile, TimelineMilestone } from '@/types/senior';
import { LinkedInIcon } from './LinkedInIcon';
import { ROUTES } from '@/constants/routes';

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

interface SeniorJourneyViewProps {
  senior: SeniorProfile;
  showBackNavigation?: boolean;
  onBack?: () => void;
  isModal?: boolean;
}

export const SeniorJourneyView: React.FC<SeniorJourneyViewProps> = ({
  senior,
  showBackNavigation = true,
  onBack,
  isModal = false,
}) => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const [imgSrc, setImgSrc] = useState(senior.avatar);

  const displayName = isRtl ? senior.nameAr : senior.name;
  const displayRole = isRtl ? senior.roleAr : senior.role;
  const displayCompany = isRtl ? senior.companyAr : senior.company;
  const displaySpecialization = isRtl ? senior.specializationAr : senior.specialization;
  const displayLocation = isRtl ? senior.locationAr : senior.location;
  const displayBio = isRtl ? senior.shortBioAr : senior.shortBio;
  const displayQuote = isRtl ? (senior.highlightQuoteAr || senior.highlightQuote) : senior.highlightQuote;

  const storySections = [
    {
      key: 'beginning',
      icon: Compass,
      iconBg: 'bg-blue-50 text-blue-600 border-blue-200',
      badge: isRtl ? 'المحطة 1: البداية' : 'Chapter 1: The Beginning',
      title: isRtl ? senior.story.beginning.titleAr : senior.story.beginning.title,
      content: isRtl ? senior.story.beginning.contentAr : senior.story.beginning.content,
      highlight: isRtl ? senior.story.beginning.keyHighlightAr : senior.story.beginning.keyHighlight,
    },
    {
      key: 'challenges',
      icon: AlertTriangle,
      iconBg: 'bg-amber-50 text-amber-600 border-amber-200',
      badge: isRtl ? 'المحطة 2: التحديات' : 'Chapter 2: The Obstacles & Doubts',
      title: isRtl ? senior.story.challenges.titleAr : senior.story.challenges.title,
      content: isRtl ? senior.story.challenges.contentAr : senior.story.challenges.content,
      highlight: isRtl ? senior.story.challenges.keyHighlightAr : senior.story.challenges.keyHighlight,
    },
    {
      key: 'turningPoint',
      icon: Lightbulb,
      iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-200',
      badge: isRtl ? 'المحطة 3: نقطة التحول' : 'Chapter 3: The Turning Point',
      title: isRtl ? senior.story.turningPoint.titleAr : senior.story.turningPoint.title,
      content: isRtl ? senior.story.turningPoint.contentAr : senior.story.turningPoint.content,
      highlight: isRtl ? senior.story.turningPoint.keyHighlightAr : senior.story.turningPoint.keyHighlight,
    },
    {
      key: 'growth',
      icon: TrendingUp,
      iconBg: 'bg-purple-50 text-purple-600 border-purple-200',
      badge: isRtl ? 'المحطة 4: التطور المهني' : 'Chapter 4: The Growth & Systems',
      title: isRtl ? senior.story.growth.titleAr : senior.story.growth.title,
      content: isRtl ? senior.story.growth.contentAr : senior.story.growth.content,
      highlight: isRtl ? senior.story.growth.keyHighlightAr : senior.story.growth.keyHighlight,
    },
    {
      key: 'whereNow',
      icon: Award,
      iconBg: 'bg-indigo-50 text-indigo-600 border-indigo-200',
      badge: isRtl ? 'المحطة 5: أين يقف الآن' : 'Chapter 5: Where They Are Today',
      title: isRtl ? senior.story.whereNow.titleAr : senior.story.whereNow.title,
      content: isRtl ? senior.story.whereNow.contentAr : senior.story.whereNow.content,
      highlight: isRtl ? senior.story.whereNow.keyHighlightAr : senior.story.whereNow.keyHighlight,
    },
    {
      key: 'adviceForBeginners',
      icon: Target,
      iconBg: 'bg-rose-50 text-rose-600 border-rose-200',
      badge: isRtl ? 'المحطة 6: نصائح للمبتدئين' : 'Chapter 6: Advice for Beginners',
      title: isRtl ? senior.story.adviceForBeginners.titleAr : senior.story.adviceForBeginners.title,
      content: isRtl ? senior.story.adviceForBeginners.contentAr : senior.story.adviceForBeginners.content,
      highlight: isRtl ? senior.story.adviceForBeginners.keyHighlightAr : senior.story.adviceForBeginners.keyHighlight,
    },
  ];

  return (
    <div className="w-full text-start">
      {/* Back Navigation Bar */}
      {showBackNavigation && (
        <div className="mb-6 flex items-center justify-between">
          {onBack ? (
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 text-[14px] font-semibold text-[#5a198f] hover:text-[#3a0353] px-3.5 py-1.5 rounded-lg hover:bg-purple-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-600"
            >
              {isRtl ? <ArrowRight className="size-4" /> : <ArrowLeft className="size-4" />}
              <span>{t('experience.backToSeniors')}</span>
            </button>
          ) : (
            <Link
              to={`${ROUTES.home}#experience`}
              className="inline-flex items-center gap-2 text-[14px] font-semibold text-[#5a198f] hover:text-[#3a0353] px-3.5 py-1.5 rounded-lg hover:bg-purple-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-600"
            >
              {isRtl ? <ArrowRight className="size-4" /> : <ArrowLeft className="size-4" />}
              <span>{t('experience.backToSeniors')}</span>
            </Link>
          )}

          {isModal && (
            <Link
              to={`/seniors/${senior.id}`}
              className="inline-flex items-center gap-1.5 text-[13px] font-medium text-slate-600 hover:text-[#5a198f] hover:underline"
            >
              <span>{t('experience.viewSeniorProfile')}</span>
              <ExternalLink className="size-3.5" />
            </Link>
          )}
        </div>
      )}

      {/* Hero Profile Header */}
      <div className="relative rounded-3xl bg-gradient-to-br from-[#fcf9ff] via-[#ffffff] to-[#f6ecfc] border border-[#e8d5f5] p-6 sm:p-8 md:p-10 mb-10 shadow-sm overflow-hidden">
        {/* Subtle decorative background circle */}
        <div
          aria-hidden="true"
          className="absolute -right-20 -top-20 size-72 rounded-full bg-purple-200/30 blur-3xl pointer-events-none"
        />

        <div className="relative z-10 flex flex-col md:flex-row gap-6 md:gap-8 items-start md:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
            {/* Avatar with glow and badge */}
            <div className="relative shrink-0">
              <div className="size-24 sm:size-28 md:size-32 rounded-3xl overflow-hidden ring-4 ring-white shadow-lg bg-purple-50">
                <img
                  src={imgSrc}
                  alt={displayName}
                  onError={() => {
                    if (imgSrc !== senior.avatarFallback) {
                      setImgSrc(senior.avatarFallback);
                    }
                  }}
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div
                title={t('experience.verifiedJourney')}
                className="absolute -bottom-1.5 -right-1.5 bg-[#5a198f] text-white rounded-full p-1.5 shadow-md ring-2 ring-white"
              >
                <CheckCircle2 className="size-4 text-white stroke-[2.5]" />
              </div>
            </div>

            {/* Name, Title, Specialization */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
                  {displayName}
                </h1>
                <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-[12px] font-semibold bg-[#5a198f] text-white">
                  <Sparkles className="size-3 text-amber-300" />
                  {t('experience.yearsExperience', { years: senior.yearsOfExperience })}
                </span>
              </div>

              <p className="text-[16px] sm:text-[18px] font-bold text-[#5a198f]">
                {displayRole} <span className="font-normal text-slate-500">@ {displayCompany}</span>
              </p>

              <p className="text-[13.5px] font-medium text-slate-600 mt-1 flex items-center gap-2">
                <span>{displaySpecialization}</span>
                <span>•</span>
                <span className="inline-flex items-center gap-1 text-slate-500">
                  <MapPin className="size-3.5" />
                  {displayLocation}
                </span>
              </p>

              <p className="text-[14px] text-slate-600 mt-3 max-w-2xl leading-relaxed">
                {displayBio}
              </p>
            </div>
          </div>

          {/* Social and Contact Action Buttons */}
          <div className="w-full md:w-auto shrink-0 flex flex-col sm:flex-row md:flex-col gap-3 pt-4 md:pt-0 border-t md:border-t-0 border-purple-100">
            <a
              href={senior.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Connect with ${displayName} on LinkedIn`}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#0a66c2] hover:bg-[#004182] text-white text-[14px] font-semibold shadow-md hover:shadow-lg transition-all duration-200 active:scale-98"
            >
              <LinkedInIcon className="size-4 fill-current shrink-0" />
              <span>{t('experience.connectLinkedIn')}</span>
            </a>

            <div className="flex items-center gap-2">
              {senior.portfolioUrl && (
                <a
                  href={senior.portfolioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-purple-50 text-[#5a198f] border border-purple-200 text-[13px] font-semibold transition-colors shadow-sm"
                >
                  <Globe className="size-4" />
                  <span>{t('experience.viewPortfolio')}</span>
                </a>
              )}
              {senior.githubUrl && (
                <a
                  href={senior.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub Profile"
                  className="size-[42px] inline-flex items-center justify-center rounded-xl bg-white hover:bg-purple-50 text-slate-700 hover:text-[#5a198f] border border-slate-200 transition-colors shadow-sm"
                >
                  <GitHubIcon className="size-4" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="mt-8 pt-6 border-t border-purple-100/80 grid grid-cols-3 gap-4 text-center">
          <div className="p-3 rounded-2xl bg-white/80 border border-purple-50">
            <p className="text-2xl sm:text-3xl font-extrabold text-[#5a198f]">
              {senior.stats.yearsExp}+
            </p>
            <p className="text-[12px] sm:text-[13px] font-medium text-slate-600 mt-0.5">
              {t('experience.industryExperience')}
            </p>
          </div>
          <div className="p-3 rounded-2xl bg-white/80 border border-purple-50">
            <p className="text-2xl sm:text-3xl font-extrabold text-[#3a0353]">
              {senior.stats.projectsCompleted}+
            </p>
            <p className="text-[12px] sm:text-[13px] font-medium text-slate-600 mt-0.5">
              {t('experience.projectsShipped')}
            </p>
          </div>
          <div className="p-3 rounded-2xl bg-white/80 border border-purple-50">
            <p className="text-2xl sm:text-3xl font-extrabold text-[#dc6e0d]">
              {senior.stats.menteesGuided}+
            </p>
            <p className="text-[12px] sm:text-[13px] font-medium text-slate-600 mt-0.5">
              {t('experience.menteesGuided')}
            </p>
          </div>
        </div>

        {/* Featured Senior Quote */}
        {displayQuote && (
          <div className="mt-6 p-4 sm:p-5 rounded-2xl bg-purple-50/70 border border-purple-200/60 flex items-start gap-3">
            <Quote className="size-5 text-[#5a198f] shrink-0 mt-0.5 opacity-80" />
            <p className="text-[14px] sm:text-[15px] font-medium text-[#3a0353] italic leading-relaxed">
              &ldquo;{displayQuote}&rdquo;
            </p>
          </div>
        )}
      </div>

      {/* Main Content Grid: Timeline & Narrative Chapters */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
        {/* Left Column: Visual Career Timeline */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="sticky top-28 bg-white rounded-3xl border border-purple-100 p-6 sm:p-7 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 rounded-xl bg-purple-50 text-[#5a198f]">
                <Layers className="size-5" />
              </div>
              <div>
                <h2 className="text-[18px] sm:text-[20px] font-bold text-[#111827]">
                  {t('experience.careerTimeline')}
                </h2>
                <p className="text-[12px] text-slate-500 font-medium">
                  {displayName}
                </p>
              </div>
            </div>

            {/* Vertical Milestones */}
            <div className="relative pl-6 rtl:pl-0 rtl:pr-6 border-l-2 rtl:border-l-0 rtl:border-r-2 border-purple-100 space-y-8">
              {senior.timeline.map((milestone: TimelineMilestone, idx: number) => {
                const milestoneTitle = isRtl ? (milestone.titleAr || milestone.title) : milestone.title;
                const milestonePeriod = isRtl ? (milestone.periodAr || milestone.period) : milestone.period;
                const milestoneOrg = isRtl ? (milestone.companyOrOrgAr || milestone.companyOrOrg) : milestone.companyOrOrg;
                const milestoneDesc = isRtl ? (milestone.descriptionAr || milestone.description) : milestone.description;
                const milestoneStage = isRtl ? (milestone.stageAr || milestone.stage) : milestone.stage;

                return (
                  <div key={idx} className="relative group">
                    {/* Node Dot */}
                    <div
                      aria-hidden="true"
                      className={`absolute -left-[31px] rtl:-left-auto rtl:-right-[31px] top-1 size-4 rounded-full border-2 border-white transition-transform group-hover:scale-125 shadow-sm ${
                        milestone.type === 'current'
                          ? 'bg-[#5a198f] ring-4 ring-purple-100'
                          : milestone.type === 'breakthrough'
                          ? 'bg-[#dc6e0d]'
                          : 'bg-purple-300'
                      }`}
                    />

                    {/* Stage & Period Badge */}
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#5a198f]">
                        {milestoneStage}
                      </span>
                      <span className="text-[12px] font-semibold text-slate-500 px-2 py-0.5 rounded-full bg-slate-100">
                        {milestonePeriod}
                      </span>
                    </div>

                    <h3 className="text-[15px] font-bold text-[#111827] group-hover:text-[#5a198f] transition-colors leading-snug">
                      {milestoneTitle}
                    </h3>

                    {milestoneOrg && (
                      <p className="text-[12.5px] font-semibold text-slate-600 mt-0.5">
                        {milestoneOrg}
                      </p>
                    )}

                    <p className="text-[13px] text-slate-600 mt-1.5 leading-relaxed">
                      {milestoneDesc}
                    </p>

                    {/* Acquired Skills */}
                    {milestone.skillsAcquired && milestone.skillsAcquired.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2.5">
                        {milestone.skillsAcquired.map((skill) => (
                          <span
                            key={skill}
                            className="px-2 py-0.5 text-[10.5px] font-medium rounded-md bg-purple-50 text-[#5a198f]"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Acquired Technologies Summary */}
            <div className="mt-8 pt-6 border-t border-purple-100">
              <h4 className="text-[13.5px] font-bold text-[#111827] mb-3">
                {t('experience.keySkills')}
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {senior.toolsAndTech.map((tech) => (
                  <span
                    key={tech}
                    className="px-2.5 py-1 text-[11.5px] font-medium rounded-lg bg-slate-100 hover:bg-purple-100 hover:text-[#5a198f] text-slate-700 transition-colors"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: 6 Career Story Chapters + Featured Projects + Advice */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="mb-2">
            <span className="text-[12px] font-bold tracking-widest text-[#5a198f] uppercase">
              {t('experience.headingBadge')}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827] mt-1">
              {t('experience.theStory')}
            </h2>
          </div>

          {/* Narrative Chapters */}
          <div className="space-y-6">
            {storySections.map((sec) => {
              const Icon = sec.icon;
              return (
                <div
                  key={sec.key}
                  className="rounded-3xl bg-white border border-purple-100/80 p-6 sm:p-7 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-2.5 rounded-2xl border ${sec.iconBg} shrink-0`}>
                      <Icon className="size-5" />
                    </div>
                    <div>
                      <span className="text-[11.5px] font-bold uppercase tracking-wider text-[#5a198f]">
                        {sec.badge}
                      </span>
                      <h3 className="text-[17px] sm:text-[19px] font-bold text-[#111827] leading-snug">
                        {sec.title}
                      </h3>
                    </div>
                  </div>

                  <div className="text-[14px] sm:text-[14.5px] text-slate-700 leading-relaxed whitespace-pre-line mt-3">
                    {sec.content}
                  </div>

                  {sec.highlight && (
                    <div className="mt-4 p-3.5 rounded-xl bg-[#faf5ff] border-l-4 rtl:border-l-0 rtl:border-r-4 border-[#5a198f] text-[13px] font-medium text-[#3a0353] flex items-center gap-2">
                      <Sparkles className="size-4 text-[#dc6e0d] shrink-0" />
                      <span>{sec.highlight}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Featured Projects Section */}
          {senior.featuredProjects && senior.featuredProjects.length > 0 && (
            <div className="mt-6">
              <div className="flex items-center gap-2 mb-4">
                <Briefcase className="size-5 text-[#5a198f]" />
                <h3 className="text-xl font-bold text-[#111827]">
                  {t('experience.featuredWork')}
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {senior.featuredProjects.map((proj, idx) => {
                  const projTitle = isRtl ? (proj.titleAr || proj.title) : proj.title;
                  const projDesc = isRtl ? (proj.descriptionAr || proj.description) : proj.description;
                  const projImpact = isRtl ? (proj.impactAr || proj.impact) : proj.impact;
                  const projRole = isRtl ? (proj.roleAr || proj.role) : proj.role;

                  return (
                    <div
                      key={idx}
                      className="rounded-2xl bg-white border border-purple-100 p-5 sm:p-6 shadow-sm hover:border-purple-300 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h4 className="text-[16px] sm:text-[17px] font-bold text-[#111827]">
                          {projTitle}
                        </h4>
                        <span className="text-[12px] font-semibold text-[#5a198f] px-2.5 py-1 rounded-full bg-purple-50 shrink-0">
                          {projRole}
                        </span>
                      </div>

                      <p className="text-[13.5px] text-slate-600 leading-relaxed mb-3">
                        {projDesc}
                      </p>

                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {proj.techStack.map((tech) => (
                          <span
                            key={tech}
                            className="px-2 py-0.5 text-[11px] font-medium rounded-md bg-slate-100 text-slate-700"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      <div className="p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-200/60 text-[12.5px] font-medium text-emerald-900 flex items-center gap-2">
                        <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                        <span><strong>Impact:</strong> {projImpact}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Practical Advice Section */}
          {senior.topAdvice && senior.topAdvice.length > 0 && (
            <div className="mt-6 rounded-3xl bg-gradient-to-br from-[#3a0353] to-[#5a198f] text-white p-6 sm:p-8 shadow-md">
              <div className="flex items-center gap-2.5 mb-2">
                <GraduationCap className="size-6 text-amber-300" />
                <h3 className="text-xl font-bold">
                  {t('experience.adviceSectionTitle')}
                </h3>
              </div>
              <p className="text-[13px] text-purple-200 mb-6 max-w-xl">
                {t('experience.adviceSectionSubtitle')}
              </p>

              <div className="space-y-4">
                {senior.topAdvice.map((adv, idx) => {
                  const advTitle = isRtl ? (adv.titleAr || adv.title) : adv.title;
                  const advDesc = isRtl ? (adv.descriptionAr || adv.description) : adv.description;

                  return (
                    <div
                      key={idx}
                      className="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 p-4 sm:p-5"
                    >
                      <h4 className="text-[15px] font-bold text-amber-200 mb-1.5">
                        #{idx + 1}. {advTitle}
                      </h4>
                      <p className="text-[13.5px] text-purple-100 leading-relaxed">
                        {advDesc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Fictional Demo Content Disclaimer */}
          <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-500 text-[12px] leading-relaxed">
            <p className="font-semibold text-slate-700 mb-0.5">
              💡 {t('experience.fictionalNoticeBadge')}
            </p>
            <p>{t('experience.fictionalNoticeText')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
