import React from 'react'
import { useTranslation } from 'react-i18next'

export const InternshipSection: React.FC = () => {
  const { t, i18n } = useTranslation()
  const isRtl = i18n.language === 'ar'

  const tracks = [
    {
      id: 'track-1',
      title: isRtl ? 'أنظمة التصميم المتقدمة ومكتبات المكونات' : 'Advanced Design Systems & Component Libraries',
      category: isRtl ? 'تصميم واجهات المستخدم' : 'UI/UX Design',
      instructor: isRtl ? 'سينيور علاء خميس' : 'Senior Alaa Khamis',
      instructorAvatar: '/images/course-avatar-elena.png',
      rating: '4.7',
      reviews: '(1,802)',
      duration: isRtl ? '22 ساعة' : '22 hours',
      level: isRtl ? 'متقدم' : 'Advanced',
      lessons: isRtl ? '40 درساً' : '40 lessons',
      thumbnail: '/images/course-thumb-1.png',
      applicantBadge: '+6',
    },
    {
      id: 'track-2',
      title: isRtl ? 'رياكت وريدكس: من الأساسيات إلى الاحتراف' : 'React & Redux: From Basics to Advanced',
      category: isRtl ? 'تطوير واجهات المستخدم' : 'Frontend Development',
      instructor: isRtl ? 'المدربة ميا تشن' : 'Instructor Mia Chen',
      instructorAvatar: '/images/course-avatar-elena.png',
      rating: '4.8',
      reviews: '(3,012)',
      duration: isRtl ? '25 ساعة' : '25 hours',
      level: isRtl ? 'متقدم' : 'Advanced',
      lessons: isRtl ? '50 درساً' : '50 lessons',
      thumbnail: '/images/course-thumb-2.png',
      applicantBadge: '+7',
    },
    {
      id: 'track-3',
      title: isRtl ? 'أنظمة التصميم المتقدمة ومكتبات المكونات' : 'Advanced Design Systems & Component Libraries',
      category: isRtl ? 'تصميم واجهات المستخدم' : 'UI/UX Design',
      instructor: isRtl ? 'سينيور علاء خميس' : 'Senior Alaa Khamis',
      instructorAvatar: '/images/course-avatar-elena.png',
      rating: '4.7',
      reviews: '(1,802)',
      duration: isRtl ? '22 ساعة' : '22 hours',
      level: isRtl ? 'متقدم' : 'Advanced',
      lessons: isRtl ? '40 درساً' : '40 lessons',
      thumbnail: '/images/course-thumb-3.png',
      applicantBadge: '+6',
    },
    {
      id: 'track-4',
      title: isRtl ? 'إتقان منهجيات أجايل ولين في فرق العمل' : 'Mastering Agile & Lean Methodologies',
      category: isRtl ? 'إدارة المنتجات' : 'Product Management',
      instructor: isRtl ? 'القائد جوردان سميث' : 'Lead Jordan Smith',
      instructorAvatar: '/images/course-avatar-elena.png',
      rating: '4.9',
      reviews: '(2,134)',
      duration: isRtl ? '18 ساعة' : '18 hours',
      level: isRtl ? 'متوسط' : 'Intermediate',
      lessons: isRtl ? '35 درساً' : '35 lessons',
      thumbnail: '/images/course-thumb-4.png',
      applicantBadge: '+4',
    },
  ]

  return (
    <section id="internship" className="w-full max-w-[1240px] xl:max-w-[1280px] mx-auto px-4 sm:px-6 py-12 lg:py-16 select-none">
      {/* Section Header with CTA on right (Figma node 1002:1460) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 sm:mb-16 reveal-on-scroll">
        <div className="text-start max-w-[884px]">
          <h2 className="text-[32px] sm:text-[38px] lg:text-[40px] font-bold text-[#111827] leading-tight mb-4">
            {t('internship.title')}
          </h2>
          <p className="text-[18px] sm:text-[22px] lg:text-[24px] text-[#5c5c5c] font-medium leading-[1.5]">
            {t('internship.subtitle')}
          </p>
        </div>

        <div className="shrink-0 text-start md:text-end">
          <a
            href="#all-internships"
            className="group relative inline-flex items-center gap-[12px] px-[40px] py-[16px] rounded-[9999px] bg-[#3a0353] hover:bg-[#4d076d] text-white text-[16px] font-semibold tracking-[0.0156px] shadow-[0px_10px_15px_-3px_rgba(224,191,254,0.75),0px_4px_6px_-4px_#ddbffe] transition-all duration-200 active:scale-98"
          >
            <span>{t('internship.cta')}</span>
            <img
              src="/images/mentorship-arrow.svg"
              alt=""
              className="w-[14px] h-[16px] shrink-0 rtl:rotate-180 transition-transform duration-200 group-hover:translate-x-1 rtl:group-hover:-translate-x-1"
            />
          </a>
        </div>
      </div>

      {/* 4 Internship Track Cards Grid (Figma node 1002:1470) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {tracks.map((track, idx) => {
          const delayClass =
            idx === 0
              ? 'reveal-delay-100'
              : idx === 1
              ? 'reveal-delay-200'
              : idx === 2
              ? 'reveal-delay-300'
              : 'reveal-delay-400'
          return (
            <div key={track.id} className={`reveal-on-scroll ${delayClass} h-full`}>
              <div
                className="group bg-white rounded-[11.6px] border border-[#e5e7eb] shadow-[0px_2.9px_11.6px_0px_rgba(0,0,0,0.06)] hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col justify-between h-full"
              >
            {/* Thumbnail Header with Magenta/Pink Category Tag (Figma node 1002:1472) */}
            <div className="relative h-[155px] w-full overflow-hidden bg-slate-900 shrink-0">
              <img
                src={track.thumbnail}
                alt={track.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
                width={297}
                height={155}
              />
              <div className="absolute bottom-[11px] start-[13px] z-10">
                <span className="bg-[#ff25e9]/75 backdrop-blur-xs px-[8.7px] py-[2.9px] rounded-full text-[#5a198f] font-bold text-[8.7px] tracking-[0.0595px] leading-[11.6px] shadow-xs inline-block">
                  {track.category}
                </span>
              </div>
            </div>

            {/* Content Area (Figma node 1002:1476) */}
            <div className="pt-[14.5px] px-[14.5px] pb-[11px] flex flex-col gap-[10.15px] text-start flex-1 justify-between">
              <div className="flex flex-col gap-[10.15px]">
                {/* Title (Figma node 1002:1477) */}
                <h3 className="text-[13.05px] font-medium text-[#111827] leading-[17.4px] line-clamp-2 min-h-[35px] group-hover:text-[#5a198f] transition-colors">
                  {track.title}
                </h3>

                {/* Author Avatar & Name (Figma node 1002:1479) */}
                <div className="flex items-center gap-[7.25px]">
                  <img
                    src={track.instructorAvatar}
                    alt={track.instructor}
                    className="size-[23px] rounded-full object-cover shrink-0"
                    loading="lazy"
                    width={23}
                    height={23}
                  />
                  <span className="text-[10.15px] font-medium text-[#475569] leading-[14.5px]">
                    {track.instructor}
                  </span>
                </div>

                {/* Rating & Reviews (Figma node 1002:1483) */}
                <div className="flex items-center gap-[4.35px]">
                  <div className="flex items-center gap-[1.45px]">
                    <img src="/images/course-star-filled.svg" alt="" className="w-[11px] h-[9px]" />
                    <img src="/images/course-star-filled.svg" alt="" className="w-[11px] h-[9px]" />
                    <img src="/images/course-star-filled.svg" alt="" className="w-[11px] h-[9px]" />
                    <img src="/images/course-star-filled.svg" alt="" className="w-[11px] h-[9px]" />
                    <img src="/images/course-star-empty.svg" alt="" className="w-[11px] h-[9px]" />
                  </div>
                  <span className="text-[10.15px] font-semibold text-[#334155] leading-[14.5px]">
                    {track.rating}
                  </span>
                  <span className="text-[9.4px] font-normal text-[#94a3b8] leading-[11.6px]">
                    {track.reviews}
                  </span>
                </div>

                {/* Metadata Row with Divider (Figma node 1002:1504) */}
                <div className="border-b border-[#f1f5f9] pb-[11.6px] pt-[2.9px] flex items-center justify-between text-[#64748b] text-[9.4px] font-medium">
                  <div className="flex items-center gap-[4.35px]">
                    <img src="/images/course-clock.svg" alt="" className="size-[9px] shrink-0" />
                    <span>{track.duration}</span>
                  </div>
                  <div className="flex items-center gap-[4.35px]">
                    <img src="/images/course-level.svg" alt="" className="w-[12px] h-[9px] shrink-0" />
                    <span>{track.level}</span>
                  </div>
                  <div className="flex items-center gap-[4.35px]">
                    <img src="/images/course-lessons.svg" alt="" className="w-[11px] h-[9px] shrink-0" />
                    <span>{track.lessons}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Row: Overlapping Avatars + Select Track Button (Figma node 1002:1523) */}
              <div className="flex items-center justify-between gap-[12px] pt-[1.45px] h-[44px]">
                {/* Overlapping User Avatars Stack */}
                <div className="flex items-center -space-x-[7px] rtl:space-x-reverse shrink-0">
                  <img
                    src="/images/internship-avatar-stack.png"
                    alt="Applicant"
                    className="size-[28px] rounded-full object-cover border-2 border-white"
                  />
                  <img
                    src="/images/internship-avatar-stack.png"
                    alt="Applicant"
                    className="size-[28px] rounded-full object-cover border-2 border-white"
                  />
                  <img
                    src="/images/internship-avatar-stack.png"
                    alt="Applicant"
                    className="size-[28px] rounded-full object-cover border-2 border-white"
                  />
                  <img
                    src="/images/internship-avatar-stack.png"
                    alt="Applicant"
                    className="size-[28px] rounded-full object-cover border-2 border-white"
                  />
                  <div className="size-[28px] rounded-full bg-[#d8adfb] border-2 border-white flex items-center justify-center text-[10px] font-medium text-[#3a0353] shrink-0">
                    {track.applicantBadge}
                  </div>
                </div>

                {/* Select Track Button */}
                <a
                  href={`#track-${track.id}`}
                  className="w-[137px] inline-flex items-center justify-center py-[10px] px-[14.5px] rounded-full bg-[#5a198f] hover:bg-[#471273] text-white text-[10.15px] font-bold tracking-[0.0496px] leading-[14.5px] whitespace-nowrap shadow-xs hover:shadow-md transition-all duration-200 active:scale-98 text-center"
                >
                  {t('internship.applyBtn')}
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
