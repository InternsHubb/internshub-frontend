import React, { useState, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  MapPin,
  ArrowRight,
  ArrowLeft,
  Building2,
  BadgeDollarSign,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { LANDING_INTERNSHIPS } from '@/features/landing/data/landingInternshipsData';
import { ROUTES, internshipDetailsPath } from '@/app/routes';

// Import AI Generated Human Work Internship Photographs
import internFrontendImg from '@/assets/images/internships/frontend_work.jpg';
import internUiuxImg from '@/assets/images/internships/uiux_work.jpg';
import internBackendImg from '@/assets/images/internships/backend_work.jpg';
import internDataImg from '@/assets/images/internships/data_work.jpg';

const INTERNSHIP_IMAGES: Record<string, string> = {
  'opp-fe-react': internFrontendImg,
  'opp-uiux-design': internUiuxImg,
  'opp-be-node': internBackendImg,
  'opp-data-analyst': internDataImg,
};

const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  frontend: internFrontendImg,
  design: internUiuxImg,
  backend: internBackendImg,
  data: internDataImg,
  mobile: internFrontendImg,
};

// ─── Coverflow card position config ────────────────────────────────────────
type OffsetStyle = {
  translateX: string;
  rotateY: string;
  scale: number;
  opacity: number;
  zIndex: number;
};

function getOffsetStyle(offset: number): OffsetStyle | null {
  const abs = Math.abs(offset);
  const sign = offset < 0 ? -1 : 1;

  if (abs === 0) return { translateX: '0%',           rotateY: '0deg',    scale: 1,    opacity: 1,    zIndex: 10 };
  if (abs === 1) return { translateX: `${sign * 52}%`, rotateY: `${-sign * 42}deg`, scale: 0.82, opacity: 0.88, zIndex: 7  };
  if (abs === 2) return { translateX: `${sign * 88}%`, rotateY: `${-sign * 58}deg`, scale: 0.65, opacity: 0.55, zIndex: 4  };
  if (abs === 3) return { translateX: `${sign * 112}%`,rotateY: `${-sign * 68}deg`, scale: 0.52, opacity: 0.25, zIndex: 2  };
  return null; // hidden
}

// ─── Component ──────────────────────────────────────────────────────────────
export const LandingInternshipsSection: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [activeIndex, setActiveIndex] = useState(0);

  const categories = useMemo(
    () => [
      { id: 'all',      label: isRtl ? 'جميع التخصصات'              : 'All Tracks'   },
      { id: 'frontend', label: isRtl ? 'الواجهات الأمامية'           : 'Frontend'     },
      { id: 'design',   label: isRtl ? 'تصميم واجهة وتجربة المستخدم' : 'UI/UX Design' },
      { id: 'backend',  label: isRtl ? 'الواجهات الخلفية'            : 'Backend'      },
      { id: 'data',     label: isRtl ? 'علم البيانات'                : 'Data Science' },
    ],
    [isRtl],
  );

  const filteredOpportunities = useMemo(() => {
    const list =
      activeFilter === 'all'
        ? LANDING_INTERNSHIPS
        : LANDING_INTERNSHIPS.filter((opp) => opp.category === activeFilter);
    return list;
  }, [activeFilter]);

  // Reset index when filter changes
  const handleFilterChange = useCallback((id: string) => {
    setActiveFilter(id);
    setActiveIndex(0);
  }, []);

  const total = filteredOpportunities.length;

  const prev = useCallback(() => setActiveIndex((i) => (i - 1 + total) % total), [total]);
  const next = useCallback(() => setActiveIndex((i) => (i + 1) % total), [total]);

  // Drag / swipe support
  const dragStartX = React.useRef<number | null>(null);
  const onPointerDown = (e: React.PointerEvent) => { dragStartX.current = e.clientX; };
  const onPointerUp   = (e: React.PointerEvent) => {
    if (dragStartX.current === null) return;
    const delta = e.clientX - dragStartX.current;
    if (Math.abs(delta) > 50) {
      if (isRtl) {
        if (delta > 0) prev();
        else next();
      } else if (delta < 0) {
        next();
      } else {
        prev();
      }
    }
    dragStartX.current = null;
  };

  return (
    <section
      id="internship"
      className="w-full max-w-[1240px] xl:max-w-[1280px] mx-auto px-4 sm:px-6 py-14 lg:py-20 select-none scroll-mt-28"
    >
      {/* ── Section Header ─────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-12 reveal-on-scroll">
        <div className="text-start max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[12px] sm:text-[13px] font-semibold bg-[#faf2ff] text-[#5a198f] border border-[#e8d5f5] mb-4">
            <Briefcase className="size-3.5 text-[#dc6e0d]" />
            <span>{t('landingInternships.badge', 'REAL-WORLD INTERNSHIP OPPORTUNITIES')}</span>
          </div>

          <h2 className="text-[32px] sm:text-[40px] lg:text-[44px] font-extrabold text-[#111827] leading-[1.18] tracking-tight mb-4">
            {isRtl ? (
              <>فرص تدريب عملي <span className="text-[#3a0453]">تحاكي بيئة العمل</span></>
            ) : (
              <>Hands-On Internships <span className="text-[#3a0453]">in Real Teams</span></>
            )}
          </h2>

          <p className="text-[17px] sm:text-[20px] lg:text-[22px] text-[#4b5563] font-medium leading-[1.5]">
            {t(
              'landingInternships.subtitle',
              'Join realistic product squads, work with industry mentors, and build verified experience that stands out to tech employers.',
            )}
          </p>
        </div>

        <div className="shrink-0 text-start md:text-end">
          <Link
            to={ROUTES.internship}
            className="group relative inline-flex items-center gap-[12px] px-[36px] py-[15px] rounded-[9999px] bg-[#3a0353] hover:bg-[#4d076d] text-white text-[15px] sm:text-[16px] font-semibold tracking-[0.0156px] shadow-[0px_10px_15px_-3px_rgba(224,191,254,0.75),0px_4px_6px_-4px_#ddbffe] transition-all duration-200 active:scale-98"
          >
            <span>{t('landingInternships.cta', 'Explore Internship Portal')}</span>
            {isRtl
              ? <ArrowLeft  className="size-4 shrink-0 transition-transform duration-200 group-hover:-translate-x-1" />
              : <ArrowRight className="size-4 shrink-0 transition-transform duration-200 group-hover:translate-x-1"  />}
          </Link>
        </div>
      </div>

      {/* ── Filter Tabs ─────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 mb-12 pb-2 overflow-x-auto scrollbar-none reveal-on-scroll reveal-delay-100">
        {categories.map((cat) => {
          const isActive = activeFilter === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => handleFilterChange(cat.id)}
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

      {/* ── Coverflow Carousel ──────────────────────────────────────────── */}
      <div className="reveal-on-scroll reveal-delay-200">
        {/* Stage: 3-D perspective container */}
        <div
          className="relative mx-auto overflow-visible"
          style={{ perspective: '1400px', height: '560px', maxWidth: '520px' }}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
        >
          {filteredOpportunities.map((opportunity, idx) => {
            const offset   = idx - activeIndex;
            const style    = getOffsetStyle(offset);
            if (!style) return null;

            const cardImage =
              INTERNSHIP_IMAGES[opportunity.id] ||
              CATEGORY_FALLBACK_IMAGES[opportunity.category] ||
              internFrontendImg;

            const isActive = offset === 0;

            return (
              <div
                key={opportunity.id}
                onClick={() => !isActive && setActiveIndex(idx)}
                style={{
                  position:  'absolute',
                  inset:     0,
                  transform: `translateX(${style.translateX}) rotateY(${style.rotateY}) scale(${style.scale})`,
                  opacity:    style.opacity,
                  zIndex:     style.zIndex,
                  transformOrigin: 'center center',
                  transition: 'transform 0.55s cubic-bezier(0.25,0.46,0.45,0.94), opacity 0.55s ease',
                  cursor:     isActive ? 'default' : 'pointer',
                  willChange: 'transform, opacity',
                }}
              >
                <article
                  aria-label={`${opportunity.title} at ${opportunity.company}`}
                  className={`w-full h-full rounded-[24px] bg-white flex flex-col overflow-hidden text-start border transition-[border-color,box-shadow] duration-300 ${
                    isActive
                      ? 'border-[#cb8cfe] shadow-[0_24px_60px_-12px_rgba(90,25,143,0.28)]'
                      : 'border-[#e5e7eb] shadow-[0_8px_24px_rgba(0,0,0,0.08)]'
                  }`}
                >
                  {/* Active top accent bar */}
                  {isActive && (
                    <div className="h-1 w-full bg-gradient-to-r from-[#5a198f] via-[#9333ea] to-[#5a198f] shrink-0" />
                  )}

                  {/* Photo */}
                  <div className="relative w-full h-48 shrink-0 bg-slate-900">
                    <img
                      src={cardImage}
                      alt={opportunity.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/15 pointer-events-none" />

                    {/* Badge pills */}
                    <div className="absolute top-3 inset-x-3 flex items-center justify-between gap-2 pointer-events-none">
                      <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-white/95 backdrop-blur-xs text-[#5a198f] shadow-xs">
                        {isRtl ? opportunity.categoryLabelAr : opportunity.categoryLabel}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-[#3a0353]/90 text-white">
                          {isRtl ? opportunity.workModeAr : opportunity.workMode}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold bg-white/95 text-slate-800">
                          {isRtl ? opportunity.durationAr : opportunity.duration}
                        </span>
                      </div>
                    </div>

                    {/* Company overlay */}
                    <div className="absolute bottom-2.5 left-3 rtl:left-auto rtl:right-3 pointer-events-none flex items-center gap-1.5">
                      <Building2 className="size-3.5 text-purple-200 shrink-0" />
                      <span className="text-[12px] font-semibold text-white truncate">
                        {isRtl ? opportunity.companyAr : opportunity.company}
                      </span>
                    </div>
                  </div>

                  {/* Card body */}
                  <div className="flex flex-col flex-1 p-5 gap-3 min-h-0">
                    <h3 className="text-[19px] font-extrabold text-[#111827] leading-snug">
                      {isRtl ? opportunity.titleAr : opportunity.title}
                    </h3>

                    <div className="flex items-center gap-2 text-[12.5px] text-slate-500 font-medium">
                      <MapPin className="size-3.5 text-[#5a198f] shrink-0" />
                      <span className="truncate">{isRtl ? opportunity.locationAr : opportunity.location}</span>
                    </div>

                    <p className="text-[13px] text-slate-600 leading-relaxed line-clamp-2">
                      {isRtl ? opportunity.shortDescriptionAr : opportunity.shortDescription}
                    </p>

                    {/* Badges row */}
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200/70 text-[11px] font-semibold">
                        <BadgeDollarSign className="size-3 text-emerald-600" />
                        <span>{isRtl ? opportunity.compensationAr : opportunity.compensation}</span>
                      </div>
                      <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-50 text-slate-600 border border-slate-200 text-[11px] font-medium">
                        <GraduationCap className="size-3 text-slate-400" />
                        <span>{isRtl ? opportunity.levelAr : opportunity.level}</span>
                      </div>
                    </div>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-1.5">
                      {opportunity.skills.slice(0, 4).map((skill) => (
                        <span
                          key={skill}
                          className="px-2 py-0.5 text-[10.5px] font-medium rounded-md bg-[#faf7fd] text-[#5a198f] border border-purple-100"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    {/* CTA row — only interactive on active card */}
                    <div className="mt-auto pt-3 border-t border-purple-50 flex items-center justify-between gap-3">
                      <Link
                        to={internshipDetailsPath(opportunity.id)}
                        tabIndex={isActive ? 0 : -1}
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 text-[12px] font-bold text-[#5a198f] hover:underline"
                      >
                        <span>{isRtl ? 'المزيد من التفاصيل' : 'More Details'}</span>
                        {isRtl ? <ArrowLeft className="size-3.5" /> : <ArrowRight className="size-3.5" />}
                      </Link>

                      <Link
                        to={opportunity.applicationUrl || ROUTES.internship}
                        tabIndex={isActive ? 0 : -1}
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full bg-[#5a198f] hover:bg-[#3a0353] text-white text-[12px] font-bold shadow-xs hover:shadow-md transition-all duration-200 active:scale-98"
                      >
                        <span>{isRtl ? 'التقديم عبر المنصة' : 'Apply via InternsHub'}</span>
                        {isRtl ? <ArrowLeft className="size-3" /> : <ArrowRight className="size-3" />}
                      </Link>
                    </div>
                  </div>
                </article>
              </div>
            );
          })}
        </div>

        {/* ── Navigation Controls ───────────────────────────────────────── */}
        <div className="flex items-center justify-center gap-6 mt-10">
          {/* Prev */}
          <button
            type="button"
            onClick={isRtl ? next : prev}
            aria-label="Previous"
            className="flex size-11 items-center justify-center rounded-full bg-white border border-purple-200 text-[#5a198f] hover:bg-[#5a198f] hover:text-white hover:border-[#5a198f] shadow-sm transition-all duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5a198f]"
          >
            <ChevronLeft className="size-5" />
          </button>

          {/* Dot indicators */}
          <div className="flex items-center gap-2">
            {filteredOpportunities.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveIndex(idx)}
                aria-label={`Go to card ${idx + 1}`}
                className={`rounded-full transition-all duration-300 focus-visible:outline-none ${
                  idx === activeIndex
                    ? 'w-6 h-2.5 bg-[#5a198f]'
                    : 'w-2.5 h-2.5 bg-purple-200 hover:bg-purple-400'
                }`}
              />
            ))}
          </div>

          {/* Next */}
          <button
            type="button"
            onClick={isRtl ? prev : next}
            aria-label="Next"
            className="flex size-11 items-center justify-center rounded-full bg-white border border-purple-200 text-[#5a198f] hover:bg-[#5a198f] hover:text-white hover:border-[#5a198f] shadow-sm transition-all duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5a198f]"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>
      </div>

      {/* ── Program Summary Banner ───────────────────────────────────────── */}
      <div className="mt-16 sm:mt-20 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#2a033d] to-[#4c0585] text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 reveal-on-scroll reveal-delay-200">
        <div className="max-w-2xl">
          <h3 className="text-[20px] sm:text-[22px] font-bold mb-1.5">
            {isRtl ? 'جاهز لبدء تجربتك العملية الأولى؟' : 'Ready to Start Your Apprenticeship?'}
          </h3>
          <p className="text-[13.5px] sm:text-[14px] text-purple-200 leading-relaxed">
            {isRtl
              ? 'سجّل في المنصة، واجتز المقابلة التقييمية الذكية، وانضم مباشرة إلى فريق عمل لبناء مشاريع حقيقية بإشراف نخبة من كبار المهندسين.'
              : 'Register now, complete your smart onboarding evaluation, and get placed into an active squad to build production-grade projects.'}
          </p>
        </div>

        <div className="shrink-0">
          <Link
            to={ROUTES.register}
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-white hover:bg-purple-50 text-[#3a0353] font-bold text-[14px] shadow-lg transition-all duration-200 active:scale-98"
          >
            <span>{isRtl ? 'ابدأ التسجيل الآن' : 'Get Started'}</span>
            {isRtl ? <ArrowLeft className="size-4" /> : <ArrowRight className="size-4" />}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LandingInternshipsSection;
