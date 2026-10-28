import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  Code2,
  Server,
  Palette,
  BarChart3,
  Smartphone,
  ChevronRight,
  ChevronLeft,
  Clock,
  Users,
  Check,
  X,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import {
  COURSE_CATEGORIES,
  type CourseItem,
  type CourseCategory,
} from '@/data/coursesLandingData';
import { ROUTES } from '@/constants/routes';

// Import AI Generated Category Artwork
import frontendImg from '@/assets/images/categories/frontend.jpg';
import backendImg from '@/assets/images/categories/backend.jpg';
import uiuxImg from '@/assets/images/categories/uiux.jpg';
import datascienceImg from '@/assets/images/categories/datascience.jpg';
import mobileImg from '@/assets/images/categories/mobile.jpg';

const CATEGORY_IMAGES: Record<string, string> = {
  frontend: frontendImg,
  backend: backendImg,
  uiux: uiuxImg,
  datascience: datascienceImg,
  mobile: mobileImg,
};

// Custom SVG thumbnails for course rows
const CourseThumb: React.FC<{ type: CourseItem['thumbnailType']; className?: string }> = ({
  type,
  className = 'w-13 h-11',
}) => {
  switch (type) {
    case 'react':
      return (
        <div
          className={`${className} rounded-xl bg-gradient-to-br from-[#0e1726] to-[#1e1035] flex items-center justify-center p-1.5 shrink-0 relative overflow-hidden border border-cyan-500/20 shadow-2xs`}
        >
          <svg viewBox="-11.5 -10.23174 23 20.46348" className="size-7 text-[#00d8ff] animate-pulse">
            <circle cx="0" cy="0" r="2.05" fill="#00d8ff" />
            <g stroke="#00d8ff" strokeWidth="1" fill="none">
              <ellipse rx="11" ry="4.2" />
              <ellipse rx="11" ry="4.2" transform="rotate(60)" />
              <ellipse rx="11" ry="4.2" transform="rotate(120)" />
            </g>
          </svg>
        </div>
      );
    case 'js':
      return (
        <div
          className={`${className} rounded-xl bg-[#111116] flex items-center justify-center p-1 shrink-0 relative border border-amber-500/20 shadow-2xs`}
        >
          <div className="size-7 rounded-sm bg-[#f7df1e] flex items-end justify-end p-0.5 shadow-2xs">
            <span className="text-[11px] font-black text-black leading-none font-mono tracking-tight">JS</span>
          </div>
        </div>
      );
    case 'htmlcss':
      return (
        <div
          className={`${className} rounded-xl bg-gradient-to-br from-[#12131a] to-[#201526] flex items-center justify-center gap-1 p-1 shrink-0 border border-orange-500/20 shadow-2xs`}
        >
          <div className="size-5 bg-[#e34f26] rounded-xs flex items-center justify-center text-white font-black text-[9px] shadow-2xs">
            5
          </div>
          <div className="size-5 bg-[#1572b6] rounded-xs flex items-center justify-center text-white font-black text-[9px] shadow-2xs">
            3
          </div>
        </div>
      );
    case 'tailwind':
      return (
        <div
          className={`${className} rounded-xl bg-gradient-to-br from-[#0b1329] to-[#0f172a] flex items-center justify-center p-1.5 shrink-0 border border-teal-500/20 shadow-2xs`}
        >
          <svg viewBox="0 0 24 24" fill="none" className="size-6 text-[#38bdf8]">
            <path
              d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.336 6.182 14.975 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C7.666 17.818 9.027 19.2 12.001 19.2c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.336 13.382 8.975 12 6.001 12z"
              fill="currentColor"
            />
          </svg>
        </div>
      );
    case 'node':
      return (
        <div
          className={`${className} rounded-xl bg-[#0e171b] flex items-center justify-center p-1.5 shrink-0 border border-emerald-500/20 shadow-2xs`}
        >
          <span className="text-[11.5px] font-black text-[#539e43]">Node</span>
        </div>
      );
    case 'python':
      return (
        <div
          className={`${className} rounded-xl bg-[#111827] flex items-center justify-center p-1.5 shrink-0 border border-blue-500/20 shadow-2xs`}
        >
          <span className="text-[11.5px] font-black text-[#3776ab]">Py</span>
        </div>
      );
    case 'figma':
      return (
        <div
          className={`${className} rounded-xl bg-[#18181b] flex items-center justify-center p-1.5 shrink-0 border border-purple-500/20 shadow-2xs`}
        >
          <span className="text-[11.5px] font-black text-[#a259ff]">Fig</span>
        </div>
      );
    case 'flutter':
      return (
        <div
          className={`${className} rounded-xl bg-gradient-to-br from-[#041d30] to-[#022b42] flex items-center justify-center p-1.5 shrink-0 border border-sky-500/20 shadow-2xs`}
        >
          <Smartphone className="size-5 text-[#54c5f8]" />
        </div>
      );
    default:
      return (
        <div
          className={`${className} rounded-xl bg-[#0e1726] flex items-center justify-center p-1.5 shrink-0 border border-purple-500/20 shadow-2xs`}
        >
          <Code2 className="size-5 text-[#a855f7]" />
        </div>
      );
  }
};

export const CourseSection: React.FC = () => {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  // Category state (hover or click selection)
  const [hoveredCategoryId, setHoveredCategoryId] = useState<string | null>(null);
  const [pinnedCategoryId, setPinnedCategoryId] = useState<string | null>(null);
  const activeCategoryId = pinnedCategoryId || hoveredCategoryId;

  // Sub-course hover details popup state
  // Appears ONLY when hovering an individual sub-course row!
  const [hoveredCourse, setHoveredCourse] = useState<CourseItem | null>(null);

  // Timers to prevent flickering when moving pointer between sub-course and popup
  const courseHoverTimerRef = useRef<NodeJS.Timeout | null>(null);
  const sectionLeaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Active category object
  const activeCategory: CourseCategory | null = useMemo(() => {
    if (!activeCategoryId) return null;
    return COURSE_CATEGORIES.find((c) => c.id === activeCategoryId) || null;
  }, [activeCategoryId]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (courseHoverTimerRef.current) clearTimeout(courseHoverTimerRef.current);
      if (sectionLeaveTimerRef.current) clearTimeout(sectionLeaveTimerRef.current);
    };
  }, []);

  // Keyboard navigation: Escape key closes the details popup
  const dismissCoursePopup = useCallback(() => {
    if (courseHoverTimerRef.current) {
      clearTimeout(courseHoverTimerRef.current);
      courseHoverTimerRef.current = null;
    }
    setHoveredCourse(null);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        dismissCoursePopup();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dismissCoursePopup]);

  // Section-level hover management (resets category selection when mouse leaves area)
  const handleSectionMouseEnter = () => {
    if (sectionLeaveTimerRef.current) {
      clearTimeout(sectionLeaveTimerRef.current);
      sectionLeaveTimerRef.current = null;
    }
  };

  const handleSectionMouseLeave = () => {
    sectionLeaveTimerRef.current = setTimeout(() => {
      setHoveredCategoryId(null);
      setHoveredCourse(null);
    }, 350);
  };

  // Category card interactions
  const handleCategoryMouseEnter = (categoryId: string) => {
    if (sectionLeaveTimerRef.current) {
      clearTimeout(sectionLeaveTimerRef.current);
      sectionLeaveTimerRef.current = null;
    }
    setHoveredCategoryId(categoryId);
  };

  const handleCategoryClick = (categoryId: string) => {
    setPinnedCategoryId((prev) => (prev === categoryId ? null : categoryId));
  };

  // Sub-course row hover interactions
  const handleCourseMouseEnter = (course: CourseItem) => {
    if (courseHoverTimerRef.current) {
      clearTimeout(courseHoverTimerRef.current);
      courseHoverTimerRef.current = null;
    }
    setHoveredCourse(course);
  };

  const handleCourseMouseLeave = () => {
    courseHoverTimerRef.current = setTimeout(() => {
      setHoveredCourse(null);
    }, 280);
  };

  const handleCourseClick = (course: CourseItem) => {
    setHoveredCourse((prev) => (prev?.id === course.id ? null : course));
  };

  // Popup card hover interactions (allows moving pointer into popup without closing)
  const handlePopupMouseEnter = () => {
    if (courseHoverTimerRef.current) {
      clearTimeout(courseHoverTimerRef.current);
      courseHoverTimerRef.current = null;
    }
    if (sectionLeaveTimerRef.current) {
      clearTimeout(sectionLeaveTimerRef.current);
      sectionLeaveTimerRef.current = null;
    }
  };

  const handlePopupMouseLeave = () => {
    courseHoverTimerRef.current = setTimeout(() => {
      setHoveredCourse(null);
    }, 280);
  };

  return (
    <section
      id="courses"
      onMouseEnter={handleSectionMouseEnter}
      onMouseLeave={handleSectionMouseLeave}
      className="w-full max-w-[1280px] xl:max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 select-none scroll-mt-24"
    >
      {/* SECTION HEADER: Eyebrow, Main Headline, Subtitle */}
      <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#f8f0fd] border border-purple-200/60 mb-3.5 shadow-2xs">
          <Sparkles className="size-3.5 text-[#601490]" />
          <span className="text-[12px] font-black uppercase tracking-[0.14em] text-[#601490]">
            {isRtl ? 'التعلم بالممارسة والعمل' : 'LEARN BY DOING'}
          </span>
        </div>

        <h2 className="text-[32px] sm:text-[40px] lg:text-[46px] font-extrabold text-[#111827] leading-[1.18] tracking-tight mb-3.5">
          {isRtl ? (
            <>
              ابنِ مهارات حقيقية من أجل <span className="text-[#601490]">مستقبل أكثر إشراقاً</span>
            </>
          ) : (
            <>
              Build Real Skills for a <span className="text-[#601490]">Brighter Future</span>
            </>
          )}
        </h2>

        <p className="text-[15.5px] sm:text-[17px] text-[#5c5c5c] font-medium leading-[1.6]">
          {isRtl
            ? 'استكشف دوراتنا التطبيقية وحوّل معرفتك النظرية إلى خبرة عملية حقيقية.'
            : 'Explore our hands-on courses and turn your knowledge into practical experience.'}
        </p>
      </div>

      {/* STATE A & B: Large, Prominent Main Category Cards with AI Artwork */}
      <div className="w-full mb-8">
        <div
          role="tablist"
          aria-label={isRtl ? 'فئات الدورات التدريبية' : 'Course categories'}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 lg:gap-5"
        >
          {COURSE_CATEGORIES.map((category) => {
            const isSelected = activeCategoryId === category.id;
            const categoryImage = CATEGORY_IMAGES[category.id];

            return (
              <button
                key={category.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                aria-expanded={isSelected}
                aria-haspopup="true"
                onMouseEnter={() => handleCategoryMouseEnter(category.id)}
                onClick={() => handleCategoryClick(category.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleCategoryClick(category.id);
                  }
                }}
                className={`p-3.5 sm:p-4 rounded-3xl border transition-all duration-300 text-start flex flex-col justify-between group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#601490] cursor-pointer relative overflow-hidden ${
                  isSelected
                    ? 'bg-[#f8f0fd] border-[#c084fc] shadow-xl ring-2 ring-[#c084fc]/70 -translate-y-2'
                    : 'bg-white hover:bg-slate-50/90 border-[#e5dfed] shadow-sm hover:border-purple-300 hover:shadow-md hover:-translate-y-1'
                }`}
              >
                {/* Large 3D AI Illustrated Category Banner: Upper Frontend, Upper Backend, etc. */}
                <div className="w-full h-36 sm:h-44 rounded-2xl overflow-hidden mb-3.5 relative bg-slate-100 shrink-0 border border-slate-200/50 shadow-inner">
                  <img
                    src={categoryImage}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-500 ease-out"
                    loading="lazy"
                  />

                  {/* Gradient bottom shadow inside image for depth */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />

                  {/* Floating icon badge in top-left */}
                  <div
                    className={`absolute top-2.5 left-2.5 rtl:left-auto rtl:right-2.5 size-8 rounded-xl flex items-center justify-center transition-colors shadow-sm ${
                      isSelected
                        ? 'bg-[#601490] text-white'
                        : 'bg-white/95 backdrop-blur-xs text-slate-700 group-hover:bg-[#601490] group-hover:text-white'
                    }`}
                  >
                    {category.iconType === 'code' && <Code2 className="size-4 stroke-[2.5]" />}
                    {category.iconType === 'server' && <Server className="size-4 stroke-[2.5]" />}
                    {category.iconType === 'palette' && <Palette className="size-4 stroke-[2.5]" />}
                    {category.iconType === 'chart' && <BarChart3 className="size-4 stroke-[2.5]" />}
                    {category.iconType === 'mobile' && <Smartphone className="size-4 stroke-[2.5]" />}
                  </div>

                  {/* Active pulsing status badge */}
                  {isSelected && (
                    <span className="absolute top-2.5 right-2.5 rtl:right-auto rtl:left-2.5 flex size-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75" />
                      <span className="relative inline-flex rounded-full size-3 bg-[#601490]" />
                    </span>
                  )}
                </div>

                {/* Bottom Information Row: Prominent Category Title + Course Count */}
                <div className="flex items-center justify-between w-full pt-1">
                  <div>
                    <div
                      className={`text-[15.5px] sm:text-[17px] font-extrabold leading-snug transition-colors ${
                        isSelected ? 'text-[#601490]' : 'text-[#111827] group-hover:text-[#601490]'
                      }`}
                    >
                      {isRtl ? category.nameAr : category.name}
                    </div>
                    <div className="text-[12px] sm:text-[13px] text-[#71717a] font-semibold mt-1">
                      {category.courses.length} {isRtl ? 'دورات متاحة' : 'courses'}
                    </div>
                  </div>

                  {isRtl ? (
                    <ChevronLeft
                      className={`size-4.5 transition-transform duration-200 ${
                        isSelected ? 'text-[#601490] -translate-x-1' : 'text-slate-300 group-hover:text-slate-700'
                      }`}
                    />
                  ) : (
                    <ChevronRight
                      className={`size-4.5 transition-transform duration-200 ${
                        isSelected ? 'text-[#601490] translate-x-1' : 'text-slate-300 group-hover:text-slate-700'
                      }`}
                    />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* STATE B & C: Expanded Category Area
          - Step 1: Sub-course list appears below categories. No popup yet, no dark overlay!
          - Step 2: When hovering a sub-course, details popup appears to the RIGHT of the course list!
          - Both Screen 1 (Course List) and Screen 2 (Details Popup) share EXACT SAME size, weight, and height!
      */}
      {activeCategory ? (
        <div
          className={`w-full transition-all duration-300 ${
            hoveredCourse
              ? 'grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch max-w-5xl xl:max-w-6xl mx-auto'
              : 'max-w-2xl mx-auto'
          }`}
        >
          {/* SCREEN 1: Category Sub-Course List Card */}
          <div className="w-full bg-white rounded-3xl border border-[#e8e2f0] shadow-[0_8px_30px_rgba(0,0,0,0.06)] overflow-hidden flex flex-col justify-between transition-all duration-300">
            <div>
              {/* Header Bar */}
              <div className="p-4 sm:p-5 flex items-center justify-between border-b border-purple-50/90 bg-[#faf7fd]/80">
                <div className="flex items-center gap-3">
                  <div className="size-11 rounded-2xl bg-[#edd9fb] text-[#601490] flex items-center justify-center shrink-0 shadow-2xs">
                    {activeCategory.iconType === 'code' && <Code2 className="size-5.5 stroke-[2.5]" />}
                    {activeCategory.iconType === 'server' && <Server className="size-5.5 stroke-[2.5]" />}
                    {activeCategory.iconType === 'palette' && <Palette className="size-5.5 stroke-[2.5]" />}
                    {activeCategory.iconType === 'chart' && <BarChart3 className="size-5.5 stroke-[2.5]" />}
                    {activeCategory.iconType === 'mobile' && <Smartphone className="size-5.5 stroke-[2.5]" />}
                  </div>
                  <div>
                    <h3 className="text-[16px] sm:text-[17.5px] font-bold text-[#111827] leading-tight">
                      {isRtl ? activeCategory.fullNameAr : activeCategory.fullName}
                    </h3>
                    <p className="text-[12px] sm:text-[13px] text-[#71717a] font-medium mt-0.5">
                      {activeCategory.courses.length}{' '}
                      {isRtl
                        ? 'دورات متاحة • مرّر الفأرة على أي دورة لعرض التفاصيل'
                        : 'courses available • Hover any course to view details on the right'}
                    </p>
                  </div>
                </div>

                <span className="text-[12px] sm:text-[13px] font-bold text-[#601490] bg-[#edd9fb]/90 px-3.5 py-1 rounded-full border border-purple-200/60 shadow-2xs">
                  {isRtl ? activeCategory.nameAr : activeCategory.name}
                </span>
              </div>

              {/* Sub-Course Rows */}
              <div className="p-3 sm:p-4 divide-y divide-slate-100">
                {activeCategory.courses.map((course) => {
                  const isHovered = hoveredCourse?.id === course.id;

                  return (
                    <div
                      key={course.id}
                      role="button"
                      tabIndex={0}
                      aria-haspopup="dialog"
                      aria-expanded={isHovered}
                      onMouseEnter={() => handleCourseMouseEnter(course)}
                      onMouseLeave={handleCourseMouseLeave}
                      onClick={() => handleCourseClick(course)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleCourseClick(course);
                        }
                      }}
                      className={`p-3.5 rounded-2xl flex items-center justify-between gap-3.5 cursor-pointer transition-all duration-200 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#601490] ${
                        isHovered
                          ? 'bg-[#fbf7fe] ring-2 ring-[#c084fc] shadow-sm'
                          : 'hover:bg-slate-50/90'
                      }`}
                    >
                      {/* Left: Thumbnail + Title + Metadata */}
                      <div className="flex items-center gap-3.5 min-w-0">
                        <CourseThumb type={course.thumbnailType} />

                        <div className="min-w-0">
                          <h4
                            className={`text-[14px] sm:text-[15px] font-bold leading-snug transition-colors truncate ${
                              isHovered ? 'text-[#601490]' : 'text-[#111827] group-hover:text-[#601490]'
                            }`}
                          >
                            {isRtl ? course.titleAr : course.title}
                          </h4>

                          <div className="flex items-center gap-2.5 text-[11.5px] text-[#71717a] font-medium mt-1">
                            <span className="flex items-center gap-1">
                              <Clock className="size-3 text-[#94a3b8]" />
                              <span>{isRtl ? course.durationAr : course.duration}</span>
                            </span>
                            <span>&bull;</span>
                            <span className="flex items-center gap-1">
                              <BarChart3 className="size-3 text-[#94a3b8]" />
                              <span>{isRtl ? course.levelAr : course.level}</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Chevron */}
                      <div className="shrink-0 flex items-center gap-2">
                        <span
                          className={`text-[11.5px] font-bold px-2 py-0.5 rounded-full transition-all duration-200 hidden sm:inline-block ${
                            isHovered
                              ? 'bg-[#edd9fb] text-[#601490]'
                              : 'text-slate-400 group-hover:text-[#601490]'
                          }`}
                        >
                          {isRtl ? 'عرض التفاصيل' : 'Details'}
                        </span>

                        {isRtl ? (
                          <ChevronLeft
                            className={`size-4 transition-transform duration-200 ${
                              isHovered
                                ? 'text-[#601490] -translate-x-1'
                                : 'text-slate-300 group-hover:text-slate-700'
                            }`}
                          />
                        ) : (
                          <ChevronRight
                            className={`size-4 transition-transform duration-200 ${
                              isHovered
                                ? 'text-[#601490] translate-x-1'
                                : 'text-slate-300 group-hover:text-slate-700'
                            }`}
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Action Link */}
            <div className="p-4 sm:p-5 border-t border-slate-100 flex items-center justify-between bg-slate-50/40">
              <Link
                to={ROUTES.register}
                className="inline-flex items-center gap-1.5 text-[13px] font-bold text-[#601490] hover:text-[#4a0d70] hover:underline transition-colors"
              >
                <span>
                  {isRtl
                    ? `عرض جميع دورات ${activeCategory.nameAr}`
                    : `View All ${activeCategory.name} Courses`}
                </span>
                {isRtl ? <ArrowLeft className="size-4" /> : <ArrowRight className="size-4" />}
              </Link>

              <span className="text-[11.5px] text-slate-400 font-medium hidden sm:inline-block">
                {isRtl ? 'مرّر على أي دورة للمعاينة' : 'Hover any course to preview'}
              </span>
            </div>
          </div>

          {/* SCREEN 2: Course Details Popup Screen
              - EXACT SAME WIDTH, WEIGHT, AND HEIGHT AS SCREEN 1!
              - Mirrors Screen 1's header bar, footer bar, and border styling.
              - No scrollbar. All content fits harmoniously.
          */}
          {hoveredCourse && (
            <div
              onMouseEnter={handlePopupMouseEnter}
              onMouseLeave={handlePopupMouseLeave}
              className="w-full bg-white rounded-3xl border border-[#e8e2f0] shadow-[0_8px_30px_rgba(0,0,0,0.06)] overflow-hidden flex flex-col justify-between text-start transition-all duration-300 animate-in fade-in slide-in-from-left-2"
            >
              {/* Header Bar matching Screen 1 weight and background */}
              <div className="p-4 sm:p-5 flex items-center justify-between border-b border-purple-50/90 bg-[#faf7fd]/80">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-[12px] sm:text-[13px] font-bold text-[#601490] bg-[#edd9fb]/90 px-3.5 py-1 rounded-full border border-purple-200/60 shadow-2xs shrink-0">
                    {isRtl ? activeCategory.nameAr : activeCategory.name}
                  </span>
                  <span className="text-[12px] sm:text-[13px] text-[#71717a] font-medium truncate">
                    {isRtl ? 'معاينة تفاصيل الدورة' : 'Course Details Preview'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={dismissCoursePopup}
                  aria-label={isRtl ? 'إغلاق المعاينة' : 'Close preview'}
                  className="size-8 rounded-full bg-white hover:bg-purple-100/70 text-slate-500 hover:text-[#601490] border border-purple-100 flex items-center justify-center transition-colors cursor-pointer shadow-2xs shrink-0"
                >
                  <X className="size-4" />
                </button>
              </div>

              {/* Middle Body Area: Sits between Header and Footer with balanced weight */}
              <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between gap-2 overflow-hidden">
                {/* Glowing Dark Tech Cover Banner */}
                <div className="w-full rounded-2xl bg-gradient-to-br from-[#0b1021] via-[#1a1130] to-[#0f172a] p-3 text-white relative overflow-hidden border border-cyan-500/20 shadow-inner shrink-0">
                  <div className="flex items-center gap-3">
                    {/* Glowing Icon */}
                    <div className="size-10 rounded-xl bg-cyan-500/10 flex items-center justify-center ring-1 ring-cyan-400/30 shadow-[0_0_12px_rgba(6,182,212,0.3)] shrink-0">
                      {hoveredCourse.thumbnailType === 'react' && (
                        <svg viewBox="-11.5 -10.23174 23 20.46348" className="size-6 text-[#00d8ff]">
                          <circle cx="0" cy="0" r="2.05" fill="#00d8ff" />
                          <g stroke="#00d8ff" strokeWidth="1" fill="none">
                            <ellipse rx="11" ry="4.2" />
                            <ellipse rx="11" ry="4.2" transform="rotate(60)" />
                            <ellipse rx="11" ry="4.2" transform="rotate(120)" />
                          </g>
                        </svg>
                      )}
                      {hoveredCourse.thumbnailType === 'js' && (
                        <span className="text-[13px] font-black text-[#f7df1e] font-mono">JS</span>
                      )}
                      {hoveredCourse.thumbnailType === 'htmlcss' && (
                        <span className="text-[11px] font-black text-[#e34f26]">HTML5</span>
                      )}
                      {hoveredCourse.thumbnailType === 'tailwind' && (
                        <svg viewBox="0 0 24 24" fill="none" className="size-5 text-[#38bdf8]">
                          <path
                            d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.336 6.182 14.975 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C7.666 17.818 9.027 19.2 12.001 19.2c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.336 13.382 8.975 12 6.001 12z"
                            fill="currentColor"
                          />
                        </svg>
                      )}
                      {hoveredCourse.thumbnailType === 'node' && (
                        <span className="text-[12px] font-black text-[#539e43]">Node</span>
                      )}
                      {hoveredCourse.thumbnailType === 'python' && (
                        <span className="text-[12px] font-black text-[#3776ab]">Py</span>
                      )}
                      {hoveredCourse.thumbnailType === 'figma' && (
                        <span className="text-[12px] font-black text-[#a259ff]">Fig</span>
                      )}
                      {hoveredCourse.thumbnailType === 'flutter' && (
                        <Smartphone className="size-5 text-[#54c5f8]" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <h4 className="text-[14px] sm:text-[15px] font-bold text-white leading-tight truncate">
                        {isRtl ? hoveredCourse.titleAr : hoveredCourse.title}
                      </h4>

                      <div className="flex items-center flex-wrap gap-2 text-[11px] text-slate-300 font-medium mt-1">
                        <span className="flex items-center gap-1">
                          <Clock className="size-3 text-cyan-400" />
                          <span>{isRtl ? hoveredCourse.durationAr : hoveredCourse.duration}</span>
                        </span>
                        <span>&bull;</span>
                        <span className="flex items-center gap-1">
                          <BarChart3 className="size-3 text-cyan-400" />
                          <span>{isRtl ? hoveredCourse.levelAr : hoveredCourse.level}</span>
                        </span>
                        {hoveredCourse.enrolledCount && (
                          <>
                            <span>&bull;</span>
                            <span className="flex items-center gap-1 text-slate-300">
                              <Users className="size-3 text-cyan-400" />
                              <span>
                                {isRtl ? hoveredCourse.enrolledCountAr : hoveredCourse.enrolledCount}
                              </span>
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-[11.5px] sm:text-[12px] text-slate-600 leading-snug line-clamp-2">
                  {isRtl ? hoveredCourse.descriptionAr : hoveredCourse.description}
                </p>

                {/* What You'll Learn Checklist */}
                <div>
                  <h5 className="text-[11px] font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                    <Check className="size-3 text-[#601490]" />
                    <span>{isRtl ? 'ما ستتعلمه في هذه الدورة' : "What You'll Learn"}</span>
                  </h5>
                  <ul className="space-y-0.5">
                    {(isRtl ? hoveredCourse.learningOutcomesAr : hoveredCourse.learningOutcomes)
                      .slice(0, 2)
                      .map((outcome, i) => (
                        <li key={i} className="flex items-center gap-1.5 text-[11px] text-slate-700 font-medium">
                          <div className="size-3 rounded-full bg-[#601490] text-white flex items-center justify-center shrink-0">
                            <Check className="size-2 stroke-[3]" />
                          </div>
                          <span className="truncate leading-snug">{outcome}</span>
                        </li>
                      ))}
                  </ul>
                </div>

                {/* Curriculum Preview (2 lessons) */}
                {hoveredCourse.curriculum && hoveredCourse.curriculum.length > 0 && (
                  <div>
                    <h5 className="text-[11px] font-bold text-slate-900 mb-1 flex items-center gap-1">
                      <BookOpen className="size-3 text-[#601490]" />
                      <span>{isRtl ? 'منهج الدورة' : 'Curriculum Preview'}</span>
                    </h5>
                    <div className="space-y-1 rounded-xl border border-slate-100 p-1 bg-slate-50/70">
                      {hoveredCourse.curriculum.slice(0, 2).map((lesson, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between gap-2 px-2 py-0.5 rounded-lg bg-white border border-slate-100 text-[10.5px]"
                        >
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span className="size-3.5 rounded-full bg-purple-50 text-[#601490] font-bold text-[8.5px] flex items-center justify-center shrink-0">
                              {idx + 1}
                            </span>
                            <span className="text-slate-800 font-medium truncate">
                              {isRtl ? lesson.titleAr : lesson.title}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono shrink-0">
                            {isRtl ? lesson.durationAr : lesson.duration}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Info Stats Strip */}
                <div className="grid grid-cols-3 gap-1 p-1.5 rounded-xl bg-[#f8f2fd] border border-purple-100 text-center">
                  <div className="flex flex-col items-center">
                    <span className="text-[9px] text-slate-500 font-medium">{isRtl ? 'المدة' : 'Duration'}</span>
                    <span className="text-[10.5px] font-bold text-slate-900 leading-tight">
                      {isRtl ? hoveredCourse.durationAr : hoveredCourse.duration}
                    </span>
                  </div>

                  <div className="flex flex-col items-center border-x border-purple-200/60">
                    <span className="text-[9px] text-slate-500 font-medium">{isRtl ? 'المستوى' : 'Level'}</span>
                    <span className="text-[10.5px] font-bold text-slate-900 leading-tight">
                      {isRtl ? hoveredCourse.levelAr : hoveredCourse.level}
                    </span>
                  </div>

                  <div className="flex flex-col items-center">
                    <span className="text-[9px] text-slate-500 font-medium">{isRtl ? 'شهادة' : 'Certificate'}</span>
                    <span className="text-[10.5px] font-bold text-slate-900 leading-tight">
                      {isRtl ? hoveredCourse.certificateAr : hoveredCourse.certificate}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Footer Bar matching Screen 1 weight and background */}
              <div className="p-4 sm:p-5 border-t border-slate-100 flex items-center justify-between bg-slate-50/40">
                <Link
                  to={hoveredCourse.enrollUrl || ROUTES.register}
                  className="w-full inline-flex items-center justify-center gap-2 py-2 px-5 rounded-full bg-[#601490] hover:bg-[#4a0d70] text-white text-[13px] font-bold shadow-md shadow-[#601490]/25 transition-all duration-200 active:scale-[0.98]"
                >
                  <span>{isRtl ? 'ابدأ التعلم الآن' : 'Start Learning'}</span>
                  {isRtl ? <ArrowLeft className="size-3.5" /> : <ArrowRight className="size-3.5" />}
                </Link>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* State A Hint when no category is hovered */
        <div className="text-center py-6 text-slate-400 text-[14px] font-medium flex items-center justify-center gap-2">
          <Sparkles className="size-4 text-purple-400" />
          <span>
            {isRtl
              ? 'مرّر الفأرة فوق أي تخصص لعرض الدورات المتاحة'
              : 'Hover over any category above to reveal its courses'}
          </span>
        </div>
      )}
    </section>
  );
};

export default CourseSection;
