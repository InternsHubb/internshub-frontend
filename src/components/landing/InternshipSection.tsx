import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Sparkles, Compass, ArrowRight, ArrowLeft } from 'lucide-react';
import type { SeniorCategory } from '@/types/senior';
import { getAllSeniors } from '@/data/seniorsData';
import { SeniorCard } from '@/components/experience/SeniorCard';
import { ROUTES, seniorProfilePath } from '@/constants/routes';

export const SeniorProfilesSection: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  const [activeCategory, setActiveCategory] = useState<SeniorCategory>('all');

  const allSeniors = useMemo(() => getAllSeniors(), []);

  const filteredSeniors = useMemo(() => {
    if (activeCategory === 'all') return allSeniors;
    return allSeniors.filter((s) => s.category === activeCategory);
  }, [allSeniors, activeCategory]);

  const categories = useMemo<{ id: SeniorCategory; label: string }[]>(
    () => [
      { id: 'all', label: t('experience.allFilter', 'All Specializations') },
      { id: 'frontend', label: t('experience.frontendFilter', 'Frontend') },
      { id: 'fullstack', label: t('experience.fullstackFilter', 'Full-Stack & Systems') },
      { id: 'design', label: t('experience.designFilter', 'UI/UX & Product Design') },
      { id: 'devops', label: t('experience.devopsFilter', 'Platform & Cloud') },
    ],
    [t]
  );

  return (
    <section
      id="seniors"
      className="w-full max-w-[1240px] xl:max-w-[1280px] mx-auto px-4 sm:px-6 py-14 lg:py-20 select-none scroll-mt-28"
    >
      {/* Anchor for legacy #experience references */}
      <span id="experience-seniors" className="sr-only" />

      {/* Section Header with CTA on right */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-12 reveal-on-scroll">
        <div className="text-start max-w-3xl">
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[12px] sm:text-[13px] font-semibold bg-[#faf2ff] text-[#5a198f] border border-[#e8d5f5] mb-4">
            <Sparkles className="size-3.5 text-[#dc6e0d]" />
            <span>{t('experience.headingBadge', 'REAL CAREER EXPERIENCES & MENTORSHIP')}</span>
          </div>

          {/* Section Heading */}
          <h2 className="text-[32px] sm:text-[40px] lg:text-[44px] font-extrabold text-[#111827] leading-[1.18] tracking-tight mb-4">
            {isRtl ? (
              <>
                {t('experience.mainHeadingPart1', 'تعلّم ممن')}{' '}
                <span className="text-[#3a0453]">{t('experience.mainHeadingHighlight', 'سبقوك')}</span>{' '}
                <span className="text-[#5a198f]">{t('experience.mainHeadingPart2', 'في هذا الطريق')}</span>
              </>
            ) : (
              <>
                {t('experience.mainHeadingPart1', 'Learn From')}{' '}
                <span className="text-[#3a0453]">{t('experience.mainHeadingHighlight', "Those Who've")}</span>{' '}
                <span className="text-[#5a198f]">{t('experience.mainHeadingPart2', 'Been There')}</span>
              </>
            )}
          </h2>

          {/* Section Subtitle */}
          <p className="text-[17px] sm:text-[20px] lg:text-[22px] text-[#4b5563] font-medium leading-[1.5]">
            {t(
              'experience.mainSubtitle',
              'Discover the journeys behind successful careers, connect with experienced professionals, and learn from the lessons that helped them grow.'
            )}
          </p>
        </div>

        {/* Top-Right CTA to Explore Internship Program */}
        <div className="shrink-0 text-start md:text-end">
          <Link
            to={ROUTES.internship}
            className="group relative inline-flex items-center gap-[12px] px-[36px] py-[15px] rounded-[9999px] bg-[#3a0353] hover:bg-[#4d076d] text-white text-[15px] sm:text-[16px] font-semibold tracking-[0.0156px] shadow-[0px_10px_15px_-3px_rgba(224,191,254,0.75),0px_4px_6px_-4px_#ddbffe] transition-all duration-200 active:scale-98"
          >
            <span>{t('internship.cta', 'Explore Internship')}</span>
            {isRtl ? (
              <ArrowLeft className="size-4 shrink-0 transition-transform duration-200 group-hover:-translate-x-1" />
            ) : (
              <ArrowRight className="size-4 shrink-0 transition-transform duration-200 group-hover:translate-x-1" />
            )}
          </Link>
        </div>
      </div>

      {/* Filter Tabs by Specialization */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 mb-10 pb-2 overflow-x-auto scrollbar-none reveal-on-scroll reveal-delay-100">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-[13px] sm:text-[14px] font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5a198f] ${
                isActive
                  ? 'bg-[#5a198f] text-white shadow-md shadow-[#5a198f]/20 scale-102'
                  : 'bg-white hover:bg-purple-50 text-slate-700 hover:text-[#5a198f] border border-purple-100'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* 4 Senior Profile Cards Grid with In-Card Hover Expansion */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7 items-start">
        {filteredSeniors.map((senior, idx) => {
          const delayClass =
            idx === 0
              ? 'reveal-delay-100'
              : idx === 1
              ? 'reveal-delay-200'
              : idx === 2
              ? 'reveal-delay-300'
              : 'reveal-delay-400';

          return (
            <div key={senior.id} className={`reveal-on-scroll ${delayClass} flex`}>
              <SeniorCard
                senior={senior}
                journeyHref={seniorProfilePath(senior.id)}
                className="w-full"
                expandOnHover={true}
              />
            </div>
          );
        })}
      </div>

      {/* Informative Guidance Card */}
      <div className="mt-12 sm:mt-14 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#fbf8fe] via-[#f7eeff] to-[#f4e8ff] border border-[#e8d5f5] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 reveal-on-scroll reveal-delay-200">
        <div className="flex items-start gap-4 max-w-2xl">
          <div className="p-3 rounded-2xl bg-[#5a198f] text-white shrink-0 shadow-xs mt-0.5">
            <Compass className="size-6" />
          </div>
          <div>
            <h3 className="text-[17px] sm:text-[18px] font-bold text-[#111827] mb-1">
              {isRtl ? 'تفاعل فوري وسلس مع الملفات' : 'Interactive In-Card Experience'}
            </h3>
            <p className="text-[13.5px] sm:text-[14px] text-slate-600 leading-relaxed">
              {isRtl
                ? 'مرر مؤشر الفأرة على البطاقة (أو اضغط عليها على الهواتف) لمعاينة المشاريع البارزة، والمهارات، والإحصائيات المهنية دون الحاجة لفتح نوافذ منبثقة.'
                : 'Hover over any card on desktop (or tap on mobile) to smoothly expand career achievements, featured projects, and key advice without disruptive popups.'}
            </p>
          </div>
        </div>

        {/* Demo Tag Notice */}
        <div className="shrink-0 text-start md:text-end">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12px] font-medium bg-white/90 border border-purple-200/60 text-slate-500 shadow-xs">
            <Sparkles className="size-3 text-[#dc6e0d]" />
            <span>{t('experience.fictionalDisclaimer')}</span>
          </span>
        </div>
      </div>
    </section>
  );
};

// Also export as InternshipSection for backward compatibility with existing imports
export const InternshipSection = SeniorProfilesSection;
export default SeniorProfilesSection;
