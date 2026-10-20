import React from 'react'
import { useTranslation } from 'react-i18next'

export const CourseSection: React.FC = () => {
  const { t, i18n } = useTranslation()
  const isRtl = i18n.language === 'ar'

  const courseList = [
    {
      id: 'course-1',
      title: isRtl ? 'أنظمة التصميم المتقدمة ومكتبات المكونات' : 'Advanced Design Systems & Component Libraries',
      category: isRtl ? 'تصميم واجهات المستخدم' : 'UI/UX Design',
      instructor: isRtl ? 'إلينا فاسكيز' : 'Elena Vasquez',
      instructorAvatar: '/images/course-avatar-elena.png',
      rating: '4.7',
      reviews: '(1,802)',
      duration: isRtl ? '22 ساعة' : '22 hours',
      level: isRtl ? 'متقدم' : 'Advanced',
      lessons: isRtl ? '40 درساً' : '40 lessons',
      thumbnail: '/images/course-thumb-1.png',
    },
    {
      id: 'course-2',
      title: isRtl ? 'أنظمة التصميم المتقدمة ومكتبات المكونات' : 'Advanced Design Systems & Component Libraries',
      category: isRtl ? 'تصميم واجهات المستخدم' : 'UI/UX Design',
      instructor: isRtl ? 'إلينا فاسكيز' : 'Elena Vasquez',
      instructorAvatar: '/images/course-avatar-elena.png',
      rating: '4.7',
      reviews: '(1,802)',
      duration: isRtl ? '22 ساعة' : '22 hours',
      level: isRtl ? 'متقدم' : 'Advanced',
      lessons: isRtl ? '40 درساً' : '40 lessons',
      thumbnail: '/images/course-thumb-2.png',
    },
    {
      id: 'course-3',
      title: isRtl ? 'أنظمة التصميم المتقدمة ومكتبات المكونات' : 'Advanced Design Systems & Component Libraries',
      category: isRtl ? 'تصميم واجهات المستخدم' : 'UI/UX Design',
      instructor: isRtl ? 'إلينا فاسكيز' : 'Elena Vasquez',
      instructorAvatar: '/images/course-avatar-elena.png',
      rating: '4.7',
      reviews: '(1,802)',
      duration: isRtl ? '22 ساعة' : '22 hours',
      level: isRtl ? 'متقدم' : 'Advanced',
      lessons: isRtl ? '40 درساً' : '40 lessons',
      thumbnail: '/images/course-thumb-3.png',
    },
    {
      id: 'course-4',
      title: isRtl ? 'أنظمة التصميم المتقدمة ومكتبات المكونات' : 'Advanced Design Systems & Component Libraries',
      category: isRtl ? 'تصميم واجهات المستخدم' : 'UI/UX Design',
      instructor: isRtl ? 'إلينا فاسكيز' : 'Elena Vasquez',
      instructorAvatar: '/images/course-avatar-elena.png',
      rating: '4.7',
      reviews: '(1,802)',
      duration: isRtl ? '22 ساعة' : '22 hours',
      level: isRtl ? 'متقدم' : 'Advanced',
      lessons: isRtl ? '40 درساً' : '40 lessons',
      thumbnail: '/images/course-thumb-4.png',
    },
  ]

  return (
    <section id="courses" className="w-full max-w-[1240px] xl:max-w-[1280px] mx-auto px-4 sm:px-6 py-12 lg:py-16 select-none">
      {/* Section Header with CTA on right (Figma node 1002:1224) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 sm:mb-16 reveal-on-scroll">
        <div className="text-start max-w-[926px]">
          <h2 className="text-[32px] sm:text-[38px] lg:text-[40px] font-bold text-[#111827] leading-tight mb-4">
            {t('courses.title')}
          </h2>
          <p className="text-[18px] sm:text-[22px] lg:text-[24px] text-[#5c5c5c] font-medium leading-[1.5]">
            {t('courses.subtitle')}
          </p>
        </div>

        <div className="shrink-0 text-start md:text-end">
          <a
            href="#all-courses"
            className="group relative inline-flex items-center gap-[12px] px-[40px] py-[16px] rounded-[9999px] bg-[#3a0353] hover:bg-[#4d076d] text-white text-[16px] font-semibold tracking-[0.0156px] shadow-[0px_10px_15px_-3px_rgba(224,191,254,0.75),0px_4px_6px_-4px_#ddbffe] transition-all duration-200 active:scale-98"
          >
            <span>{t('courses.cta')}</span>
            <img
              src="/images/mentorship-arrow.svg"
              alt=""
              className="w-[14px] h-[16px] shrink-0 rtl:rotate-180 transition-transform duration-200 group-hover:translate-x-1 rtl:group-hover:-translate-x-1"
            />
          </a>
        </div>
      </div>

      {/* 4 Course Cards Grid (Figma node 1002:1234) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {courseList.map((course, idx) => {
          const delayClass =
            idx === 0
              ? 'reveal-delay-100'
              : idx === 1
              ? 'reveal-delay-200'
              : idx === 2
              ? 'reveal-delay-300'
              : 'reveal-delay-400'
          return (
            <div key={course.id} className={`reveal-on-scroll ${delayClass} h-full`}>
              <div
                className="group bg-white rounded-[11.6px] border border-[#e5e7eb] shadow-[0px_2.9px_11.6px_0px_rgba(0,0,0,0.06)] hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col justify-between h-full"
              >
            {/* Thumbnail Header with Category Tag (Figma node 1002:1236) */}
            <div className="relative h-[141px] w-full overflow-hidden bg-slate-900 shrink-0">
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
                width={297}
                height={141}
              />
              <div className="absolute top-[12px] start-[12px] z-10">
                <span className="bg-white/90 backdrop-blur-xs px-[8.7px] py-[2.9px] rounded-full text-[#5a198f] font-bold text-[8.7px] tracking-[0.0595px] leading-[11.6px] shadow-xs inline-block">
                  {course.category}
                </span>
              </div>
            </div>

            {/* Content Area (Figma node 1002:1240) */}
            <div className="p-[14.5px] flex flex-col gap-[10px] text-start flex-1 justify-between">
              <div className="flex flex-col gap-[10px]">
                {/* Rating & Reviews (Figma node 1002:1241) */}
                <div className="flex items-center gap-[4.35px]">
                  <div className="flex items-center gap-[1.45px]">
                    <img src="/images/course-star-filled.svg" alt="" className="w-[11px] h-[9px]" />
                    <img src="/images/course-star-filled.svg" alt="" className="w-[11px] h-[9px]" />
                    <img src="/images/course-star-filled.svg" alt="" className="w-[11px] h-[9px]" />
                    <img src="/images/course-star-filled.svg" alt="" className="w-[11px] h-[9px]" />
                    <img src="/images/course-star-empty.svg" alt="" className="w-[11px] h-[9px]" />
                  </div>
                  <span className="text-[10.15px] font-semibold text-[#334155] leading-[14.5px]">
                    {course.rating}
                  </span>
                  <span className="text-[9.4px] font-normal text-[#94a3b8] leading-[11.6px]">
                    {course.reviews}
                  </span>
                </div>

                {/* Title (Figma node 1002:1262) */}
                <h3 className="text-[13.05px] font-medium text-[#111827] leading-[17.4px] line-clamp-2 min-h-[35px] group-hover:text-[#5a198f] transition-colors">
                  {course.title}
                </h3>

                {/* Author Avatar & Name (Figma node 1002:1264) */}
                <div className="flex items-center gap-[7.25px]">
                  <img
                    src={course.instructorAvatar}
                    alt={course.instructor}
                    className="size-[23px] rounded-full object-cover shrink-0"
                    loading="lazy"
                    width={23}
                    height={23}
                  />
                  <span className="text-[10.15px] font-medium text-[#475569] leading-[14.5px]">
                    {course.instructor}
                  </span>
                </div>

                {/* Metadata Row with Divider (Figma node 1002:1268) */}
                <div className="border-b border-[#f1f5f9] pb-[11.6px] pt-[2.9px] flex items-center justify-between text-[#64748b] text-[9.4px] font-medium">
                  <div className="flex items-center gap-[4.35px]">
                    <img src="/images/course-clock.svg" alt="" className="size-[9px] shrink-0" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-[4.35px]">
                    <img src="/images/course-level.svg" alt="" className="w-[12px] h-[9px] shrink-0" />
                    <span>{course.level}</span>
                  </div>
                  <div className="flex items-center gap-[4.35px]">
                    <img src="/images/course-lessons.svg" alt="" className="w-[11px] h-[9px] shrink-0" />
                    <span>{course.lessons}</span>
                  </div>
                </div>
              </div>

              {/* Action Button: Enroll Now (Figma node 1002:1287) */}
              <div className="pt-[2px]">
                <a
                  href={`#enroll-${course.id}`}
                  className="w-full inline-flex items-center justify-center py-[10px] px-[14.5px] rounded-full bg-[#5a198f] hover:bg-[#471273] text-white text-[12px] font-semibold leading-none shadow-xs hover:shadow-md transition-all duration-200 active:scale-98"
                >
                  {t('courses.enrollBtn')}
                </a>
              </div>
              </div>
            </div>
          </div>
        )
      })}
      </div>
    </section>
  )
}
