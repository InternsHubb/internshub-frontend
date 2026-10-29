import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Building2,
  Code2,
  GraduationCap,
  Sparkles,
  Users,
  Workflow,
} from 'lucide-react';
import { EMPLOYER_ROUTES, ROUTES } from '@/constants/routes';

/** Hexagonal user-star badge icon matching the Recruitment pill in the visual specification */
function RecruitmentBadgeIcon({ className = 'size-4' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M12 2.25L20 6.75V17.25L12 21.75L4 17.25V6.75L12 2.25Z"
        stroke="currentColor"
        strokeWidth="1.85"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M7.9 16.4C8.8 14.7 10.28 13.85 12 13.85C13.72 13.85 15.2 14.7 16.1 16.4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

export const RecruitmentSection: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  // Verified existing application routes:
  // - Student jobs listing: /recruitment/opportunities (protected by RequireAuth)
  // - Featured Frontend Developer role: /recruitment/opportunities/novatech-frontend (matches opportunities.ts)
  // - Employer talent discovery: /employer/talent
  const exploreJobsHref = `${ROUTES.recruitment}/opportunities`;
  const featuredOpportunityHref = `${ROUTES.recruitment}/opportunities/novatech-frontend`;
  const forEmployersHref = EMPLOYER_ROUTES.talent;

  const features = useMemo(
    () => [
      {
        id: 'students',
        icon: GraduationCap,
        title: t('landingRecruitment.features.studentsTitle', 'For Students & Graduates'),
        description: t(
          'landingRecruitment.features.studentsDesc',
          'Discover real job opportunities, build your career, and get hired.'
        ),
        delayClass: 'reveal-delay-100',
      },
      {
        id: 'companies',
        icon: Building2,
        title: t('landingRecruitment.features.companiesTitle', 'For Companies & Recruiters'),
        description: t(
          'landingRecruitment.features.companiesDesc',
          'Find qualified talent and build strong teams.'
        ),
        delayClass: 'reveal-delay-200',
      },
      {
        id: 'matching',
        icon: Sparkles,
        title: t('landingRecruitment.features.matchingTitle', 'Smart Matching'),
        description: t(
          'landingRecruitment.features.matchingDesc',
          'AI-powered recommendations for the best fit.'
        ),
        delayClass: 'reveal-delay-300',
      },
      {
        id: 'support',
        icon: Workflow,
        title: t('landingRecruitment.features.supportTitle', 'End-to-End Support'),
        description: t(
          'landingRecruitment.features.supportDesc',
          'From application to onboarding, we’re with you.'
        ),
        delayClass: 'reveal-delay-400',
      },
    ],
    [t]
  );

  return (
    <section
      id="recruitment"
      aria-labelledby="recruitment-section-heading"
      className="relative w-full overflow-clip py-14 sm:py-18 lg:py-22 scroll-mt-28"
    >
      {/* Subtle pale-lavender section backdrop with right-side soft organic contour */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,#FFFFFF_0%,#FCF9FF_42%,#F8F3FE_82%,#FFFFFF_100%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-10 end-0 h-[78%] w-[58%] rounded-s-[180px] bg-[radial-gradient(ellipse_at_58%_46%,rgba(222,199,252,0.34)_0%,rgba(241,230,255,0.16)_52%,transparent_78%)]"
      />

      <div className="relative z-10 mx-auto w-full max-w-[1240px] xl:max-w-[1280px] px-4 sm:px-6">
        {/* ── Upper Two-Column Hero Area ────────────────────────────────────── */}
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,5.4fr)_minmax(0,6.6fr)] lg:gap-6 xl:gap-8">
          {/* Left Content Column (~45% width on desktop) */}
          <div className="text-start reveal-on-scroll">
            {/* Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[#E9D8FA] bg-[#F4ECFC] px-4 py-1.5 text-[13.5px] font-semibold text-[#4B0A82] shadow-[0_2px_10px_rgba(75,10,130,0.05)]">
              <RecruitmentBadgeIcon className="size-4 text-[#4B0A82]" />
              <span>{t('landingRecruitment.badge', 'Recruitment')}</span>
            </div>

            {/* Main Heading */}
            <h2
              id="recruitment-section-heading"
              className="mt-5 text-[30px] sm:text-[38px] lg:text-[36px] xl:text-[42px] font-extrabold leading-[1.18] tracking-[-0.025em] text-[#141B34]"
            >
              <span className="block sm:whitespace-nowrap">
                {t('landingRecruitment.headingPrefix', 'Find the ')}
                <span className="text-[#4C0585]">
                  {t('landingRecruitment.headingHighlight1', 'Right Talent')}
                </span>
              </span>
              <span className="mt-1 block sm:whitespace-nowrap">
                <span className="text-[#23144F]">
                  {t('landingRecruitment.headingMiddle', 'or Your ')}
                </span>
                <span className="text-[#4C0585]">
                  {t('landingRecruitment.headingHighlight2', 'Next Opportunity')}
                </span>
              </span>
            </h2>

            {/* Description */}
            <p className="mt-5 max-w-[500px] text-[15.5px] sm:text-[16.5px] leading-[1.68] text-[#5E667A]">
              {t(
                'landingRecruitment.descriptionPrefix',
                'Whether you’re a student looking for your next career step or a company searching for top talent, '
              )}
              <span className="font-semibold text-[#464E62]">
                {t('landingRecruitment.descriptionBrand', 'InternsHub')}
              </span>
              {t(
                'landingRecruitment.descriptionSuffix',
                ' connects you with the right opportunities.'
              )}
            </p>

            {/* Primary & Secondary Pill CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-3.5 sm:gap-4">
              <Link
                to={exploreJobsHref}
                className="group inline-flex min-h-[50px] items-center justify-center gap-2.5 rounded-full bg-[linear-gradient(135deg,#3E057A_0%,#550BA4_100%)] px-7 py-3 text-[15px] font-semibold text-white shadow-[0_12px_26px_-6px_rgba(76,5,133,0.42)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[linear-gradient(135deg,#4A078F_0%,#6310BA_100%)] hover:shadow-[0_16px_32px_-6px_rgba(76,5,133,0.52)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#550BA4] focus-visible:ring-offset-2"
              >
                <span>{t('landingRecruitment.exploreJobs', 'Explore Jobs')}</span>
                <ArrowIcon
                  className="size-4 transition-transform duration-200 group-hover:translate-x-1 rtl:group-hover:-translate-x-1"
                  aria-hidden="true"
                />
              </Link>

              <Link
                to={forEmployersHref}
                className="group inline-flex min-h-[50px] items-center justify-center gap-2.5 rounded-full border-[1.5px] border-[#6D28D9]/60 bg-white/85 px-7 py-3 text-[15px] font-semibold text-[#430682] shadow-[0_4px_14px_rgba(76,5,133,0.05)] backdrop-blur-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-[#4C0585] hover:bg-[#F7F1FF] hover:shadow-[0_10px_22px_-6px_rgba(76,5,133,0.16)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#550BA4] focus-visible:ring-offset-2"
              >
                <span>{t('landingRecruitment.forEmployers', 'For Employers')}</span>
                <ArrowIcon
                  className="size-4 transition-transform duration-200 group-hover:translate-x-1 rtl:group-hover:-translate-x-1"
                  aria-hidden="true"
                />
              </Link>
            </div>
          </div>

          {/* Right Illustration Column (~55% width on desktop) */}
          <div className="flex items-center justify-center reveal-on-scroll reveal-scale reveal-delay-150">
            {/* Fixed-coordinate illustration stage (dir="ltr" keeps orbital geometry & card layout identical across languages) */}
            <div
              dir="ltr"
              className="relative mx-auto w-full max-w-[630px] aspect-[350/315] sm:aspect-[630/480] select-none"
            >
              {/* LAYER 1: Soft Lavender Radial Glow & Concentric Backdrop Disc */}
              <div
                aria-hidden="true"
                className="ih-recruit-glow pointer-events-none absolute left-[22%] top-[7%] h-[84%] w-[64%] rounded-full bg-[radial-gradient(circle,rgba(196,152,255,0.52)_0%,rgba(214,182,255,0.32)_46%,rgba(241,228,255,0)_74%)]"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute left-[27.5%] top-[13%] h-[72%] w-[53%] rounded-full bg-[linear-gradient(155deg,rgba(235,217,255,0.72)_0%,rgba(199,152,253,0.42)_100%)] shadow-[inset_0_1px_24px_rgba(255,255,255,0.65)]"
              />

              {/* LAYER 2: Independently Rotating Outer Orbital Ring (Clockwise, 32s) */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute left-[18.5%] top-[2%] h-[92%] aspect-square flex items-center justify-center"
              >
                <svg
                  viewBox="0 0 500 500"
                  className="ih-recruit-orbit-outer size-full overflow-visible"
                >
                  <defs>
                    <linearGradient id="ihRecruitOuterRingGrad" x1="0%" y1="15%" x2="100%" y2="85%">
                      <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.62" />
                      <stop offset="28%" stopColor="#A855F7" stopOpacity="0.16" />
                      <stop offset="56%" stopColor="#7C3AED" stopOpacity="0.58" />
                      <stop offset="84%" stopColor="#C084FC" stopOpacity="0.12" />
                      <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.62" />
                    </linearGradient>
                  </defs>
                  {/* Partial-depth outer orbital circle */}
                  <circle
                    cx="250"
                    cy="250"
                    r="224"
                    fill="none"
                    stroke="url(#ihRecruitOuterRingGrad)"
                    strokeWidth="1.4"
                  />
                  {/* Subtle accent arc on left & right sides */}
                  <circle
                    cx="250"
                    cy="250"
                    r="224"
                    fill="none"
                    stroke="#6D28D9"
                    strokeOpacity="0.45"
                    strokeWidth="1.65"
                    strokeDasharray="165 210 140 895"
                    strokeLinecap="round"
                  />
                  {/* Orbiting glowing dot on outer ring (upper-left arc) */}
                  <circle cx="44" cy="162" r="9" fill="#8B5CF6" fillOpacity="0.22" />
                  <circle cx="44" cy="162" r="4.5" fill="#6D28D9" />
                  {/* Orbiting glowing dot on outer ring (lower-right arc) */}
                  <circle cx="458" cy="332" r="10" fill="#7C3AED" fillOpacity="0.22" />
                  <circle cx="458" cy="332" r="5" fill="#5B0E9B" />
                </svg>
              </div>

              {/* LAYER 3: Independently Counter-Rotating Inner Orbital Ring (Counter-Clockwise, 24s) */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute left-[24%] top-[9%] h-[78%] aspect-square flex items-center justify-center"
              >
                <svg
                  viewBox="0 0 420 420"
                  className="ih-recruit-orbit-inner size-full overflow-visible"
                >
                  <defs>
                    <linearGradient id="ihRecruitInnerRingGrad" x1="100%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.52" />
                      <stop offset="40%" stopColor="#C084FC" stopOpacity="0.1" />
                      <stop offset="75%" stopColor="#7C3AED" stopOpacity="0.45" />
                      <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.52" />
                    </linearGradient>
                  </defs>
                  <circle
                    cx="210"
                    cy="210"
                    r="186"
                    fill="none"
                    stroke="url(#ihRecruitInnerRingGrad)"
                    strokeWidth="1.25"
                  />
                  <circle
                    cx="210"
                    cy="210"
                    r="186"
                    fill="none"
                    stroke="#9333EA"
                    strokeOpacity="0.32"
                    strokeWidth="1.35"
                    strokeDasharray="6 10"
                  />
                  {/* Counter-orbiting glowing nodes */}
                  <circle cx="210" cy="24" r="8" fill="#A855F7" fillOpacity="0.24" />
                  <circle cx="210" cy="24" r="4" fill="#7C3AED" />
                  <circle cx="44" cy="294" r="7" fill="#8B5CF6" fillOpacity="0.2" />
                  <circle cx="44" cy="294" r="3.5" fill="#6D28D9" />
                </svg>
              </div>

              {/* LAYER 4: Dedicated Faster Orbital Dot Track (15s CW) & Ambient Particles */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute left-[21%] top-[5.5%] h-[85%] aspect-square flex items-center justify-center"
              >
                <svg
                  viewBox="0 0 460 460"
                  className="ih-recruit-orbit-dots size-full overflow-visible"
                >
                  <circle cx="385" cy="92" r="8.5" fill="#9333EA" fillOpacity="0.2" />
                  <circle cx="385" cy="92" r="4" fill="#7C3AED" />
                </svg>
              </div>

              {/* Restrained ambient pulsing purple dots matching reference accents */}
              <span
                aria-hidden="true"
                style={{ '--ih-particle-dur': '4.8s', '--ih-particle-delay': '0.2s' } as React.CSSProperties}
                className="ih-recruit-particle pointer-events-none absolute left-[59%] top-[2.5%] size-2.5 rounded-full bg-[#8B5CF6] shadow-[0_0_10px_rgba(139,92,246,0.55)]"
              />
              <span
                aria-hidden="true"
                style={{ '--ih-particle-dur': '5.6s', '--ih-particle-delay': '1.1s' } as React.CSSProperties}
                className="ih-recruit-particle pointer-events-none absolute left-[17.5%] top-[50%] size-2 rounded-full bg-[#5B0E9B] shadow-[0_0_8px_rgba(91,14,155,0.5)]"
              />
              <span
                aria-hidden="true"
                style={{ '--ih-particle-dur': '5.2s', '--ih-particle-delay': '2.0s' } as React.CSSProperties}
                className="ih-recruit-particle pointer-events-none absolute right-[6.5%] top-[69%] size-2.5 rounded-full bg-[#6D28D9] shadow-[0_0_10px_rgba(109,40,217,0.55)]"
              />

              {/* LAYER 5: Static Upright Person Image (Never Rotates) */}
              <div className="pointer-events-none absolute left-[26%] top-[4%] z-20 flex h-[92%] w-[56%] items-end justify-center overflow-hidden rounded-b-[130px] sm:rounded-b-[165px]">
                <img
                  src="/images/recruitment-student.png"
                  alt={t(
                    'landingRecruitment.personAlt',
                    'Smiling young professional student holding a laptop'
                  )}
                  width={553}
                  height={900}
                  loading="lazy"
                  decoding="async"
                  className="h-[95%] w-auto max-w-none object-contain object-bottom drop-shadow-[0_18px_28px_rgba(38,6,72,0.16)]"
                />
              </div>

              {/* LAYER 6: Four Independently Floating Cards (Never Rotate) */}

              {/* Floating Card 1 — Upper-Left: Great Opportunities */}
              <div
                dir={isRtl ? 'rtl' : 'ltr'}
                style={{ '--ih-card-delay': '140ms' } as React.CSSProperties}
                className="ih-recruit-card-reveal absolute left-[0%] sm:left-[3%] top-[2%] sm:top-[11%] z-30 origin-top-left scale-[0.83] sm:scale-100"
              >
                <div className="ih-recruit-float-1 flex items-center gap-2.5 sm:gap-3.5 rounded-[18px] sm:rounded-[20px] border border-[#F0E7FA] bg-white/95 px-3 py-2.5 sm:px-4 sm:py-3.5 shadow-[0_14px_34px_-10px_rgba(58,3,83,0.13)] backdrop-blur-xs">
                  <span className="flex size-8 sm:size-10 shrink-0 items-center justify-center rounded-xl bg-[#F3E9FC] text-[#4C0585]">
                    <Briefcase className="size-4 sm:size-5 fill-[#4C0585]/15" strokeWidth={2.1} aria-hidden="true" />
                  </span>
                  <div className="text-start leading-tight">
                    <p className="text-[11.5px] sm:text-[13.5px] font-bold text-[#18162F] whitespace-nowrap">
                      {t('landingRecruitment.cards.opportunitiesTitle', 'Great Opportunities')}
                    </p>
                    <p className="mt-0.5 text-[10.5px] sm:text-[12px] font-medium text-[#6B7280] whitespace-nowrap">
                      {t('landingRecruitment.cards.opportunitiesSubtitle', 'for Your Future')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating Card 2 — Upper-Right: Top Companies Hiring */}
              <div
                dir={isRtl ? 'rtl' : 'ltr'}
                style={{ '--ih-card-delay': '240ms' } as React.CSSProperties}
                className="ih-recruit-card-reveal absolute right-[0%] sm:right-[1.5%] top-[13%] sm:top-[15%] z-30 origin-top-right scale-[0.83] sm:scale-100"
              >
                <div className="ih-recruit-float-2 flex items-center gap-2.5 sm:gap-3 rounded-[18px] border border-[#F0E7FA] bg-white/95 px-3 py-2 sm:px-4 sm:py-3 shadow-[0_14px_34px_-10px_rgba(58,3,83,0.12)] backdrop-blur-xs">
                  <span className="flex size-8 sm:size-9 shrink-0 items-center justify-center rounded-xl bg-[#F3E8FF] text-[#6D28D9]">
                    <Building2 className="size-4 sm:size-[18px]" strokeWidth={2} aria-hidden="true" />
                  </span>
                  <div className="text-start leading-tight">
                    <p className="text-[11px] sm:text-[13px] font-bold text-[#18162F] whitespace-nowrap">
                      {t('landingRecruitment.cards.companiesTitle', 'Top Companies')}
                    </p>
                    <p className="mt-0.5 text-[10px] sm:text-[11.5px] font-medium text-[#6B7280] whitespace-nowrap">
                      {t('landingRecruitment.cards.companiesSubtitle', 'Hiring')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating Card 3 — Middle-Right: Talented Candidates */}
              <div
                dir={isRtl ? 'rtl' : 'ltr'}
                style={{ '--ih-card-delay': '340ms' } as React.CSSProperties}
                className="ih-recruit-card-reveal absolute right-[0%] sm:right-[0.5%] top-[51%] sm:top-[48%] z-30 origin-right scale-[0.84] sm:scale-100"
              >
                <div className="ih-recruit-float-3 flex items-center gap-2.5 sm:gap-3 rounded-[18px] border border-[#F0E7FA] bg-white/95 px-3 py-2 sm:px-4 sm:py-3 shadow-[0_14px_34px_-10px_rgba(58,3,83,0.12)] backdrop-blur-xs">
                  <span className="flex size-8 sm:size-9 shrink-0 items-center justify-center rounded-xl bg-[#F3E8FF] text-[#6D28D9]">
                    <Users className="size-4 sm:size-[18px]" strokeWidth={2} aria-hidden="true" />
                  </span>
                  <div className="text-start leading-tight">
                    <p className="text-[11px] sm:text-[13px] font-bold text-[#18162F] whitespace-nowrap">
                      {t('landingRecruitment.cards.candidatesTitle', 'Talented')}
                    </p>
                    <p className="mt-0.5 text-[10px] sm:text-[11.5px] font-medium text-[#6B7280] whitespace-nowrap">
                      {t('landingRecruitment.cards.candidatesSubtitle', 'Candidates')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating Card 4 — Lower-Left Featured Opportunity: Frontend Developer + Apply Now */}
              <div
                dir={isRtl ? 'rtl' : 'ltr'}
                style={{ '--ih-card-delay': '440ms' } as React.CSSProperties}
                className="ih-recruit-card-reveal absolute bottom-[2%] sm:bottom-[6%] left-[0%] sm:left-[1.5%] z-30 origin-bottom-left scale-[0.83] sm:scale-100"
              >
                <div className="ih-recruit-float-4 w-[196px] sm:w-[238px] rounded-[20px] sm:rounded-[22px] border border-[#EDE3FA] bg-white/98 p-3 sm:p-4 shadow-[0_18px_42px_-12px_rgba(58,3,83,0.18)] backdrop-blur-xs">
                  <div className="flex items-center gap-2.5 sm:gap-3">
                    <span className="flex size-8 sm:size-9 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#4C0585_0%,#6D28D9_100%)] text-white shadow-xs">
                      <Code2 className="size-4" strokeWidth={2.2} aria-hidden="true" />
                    </span>
                    <div className="min-w-0 text-start">
                      <p className="truncate text-[12px] sm:text-[14px] font-bold text-[#141B34]">
                        {t('landingRecruitment.cards.featuredRole', 'Frontend Developer')}
                      </p>
                      <p className="mt-0.5 truncate text-[10px] sm:text-[11.5px] font-medium text-[#6B7280]">
                        {t(
                          'landingRecruitment.cards.featuredMeta',
                          'Cairo, Egypt • Internship'
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="mt-2.5 sm:mt-3.5">
                    <Link
                      to={featuredOpportunityHref}
                      aria-label={`${t('landingRecruitment.cards.applyNow', 'Apply Now')} — ${t('landingRecruitment.cards.featuredRole', 'Frontend Developer')}`}
                      className="group relative inline-flex h-8 sm:h-9 w-full max-w-[148px] items-center justify-center gap-2 rounded-full bg-[linear-gradient(90deg,#7E3AF2_0%,#550BA4_100%)] px-4 text-[11.5px] sm:text-[12.5px] font-semibold text-white shadow-[0_8px_18px_-4px_rgba(85,11,164,0.45)] transition-all duration-200 hover:-translate-y-0.5 hover:brightness-105 hover:shadow-[0_12px_22px_-4px_rgba(85,11,164,0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D28D9] focus-visible:ring-offset-2"
                    >
                      <span
                        aria-hidden="true"
                        className="size-1.5 rounded-full bg-white/85 shadow-[0_0_6px_#ffffff]"
                      />
                      <span>{t('landingRecruitment.cards.applyNow', 'Apply Now')}</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Bottom Wide 4-Column Feature Container ────────────────────────── */}
        <div className="mt-8 sm:mt-10 lg:mt-8 rounded-[26px] sm:rounded-[30px] border border-[#F0E8FA] bg-white/95 px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-9 shadow-[0_18px_50px_-20px_rgba(58,3,83,0.08)] backdrop-blur-xs">
          <div className="grid grid-cols-1 divide-y divide-[#F0E9F8] sm:grid-cols-2 sm:divide-y-0 sm:gap-y-6 lg:grid-cols-4 lg:gap-y-0 lg:divide-x rtl:lg:divide-x-reverse lg:divide-[#EEE6F7]">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.id}
                  className={`reveal-on-scroll ${feature.delayClass} group rounded-2xl lg:rounded-none py-5 first:pt-1 last:pb-1 sm:px-5 sm:py-3 lg:px-6 lg:py-1 first:lg:ps-2 last:lg:pe-2 transition-colors duration-200 hover:bg-[#FAF6FF]/75 ${
                    index % 2 === 1 ? 'sm:border-s sm:border-[#EEE6F7] lg:border-s-0' : ''
                  }`}
                >
                  <div className="flex flex-col items-start text-start">
                    <span className="flex size-12 items-center justify-center rounded-full bg-[#F3EAFA] text-[#551191] transition-all duration-200 group-hover:-translate-y-0.5 group-hover:bg-[#E7D4FC] group-hover:text-[#430682]">
                      <Icon className="size-5" strokeWidth={1.9} aria-hidden="true" />
                    </span>

                    <h3 className="mt-4 text-[16px] sm:text-[17px] font-bold leading-snug text-[#141B34]">
                      {feature.title}
                    </h3>

                    <p className="mt-2 text-[13.5px] sm:text-[14px] leading-[1.6] text-[#64748B]">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RecruitmentSection;

