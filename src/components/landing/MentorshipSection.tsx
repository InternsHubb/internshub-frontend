import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

const GitHubIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
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
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
)

const LinkedInIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
  </svg>
)

interface MentorCardData {
  id: string
  nameEn: string
  nameAr: string
  roleEn: string
  roleAr: string
  expEn: string
  expAr: string
  image: string
  theme: 'light' | 'dark'
  github: string
  linkedin: string
  photoWidth: number
  photoHeight: number
  photoClassName: string
  decorCloud: { left: string; bottom?: string; top?: string; rot: string }
  decorStar: { left: string; bottom?: string; top?: string; rot: string }
}

const MENTORS: MentorCardData[] = [
  {
    id: 'nadia-1',
    nameEn: 'Nadia Moazz',
    nameAr: 'نادية معز',
    roleEn: 'Product Manager at SpaceTech',
    roleAr: 'مديرة منتج في SpaceTech',
    expEn: '+7 years of experience',
    expAr: '+7 سنوات من الخبرة',
    image: '/images/mentor-nadia-figma.webp',
    theme: 'light',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    photoWidth: 258,
    photoHeight: 410,
    photoClassName: 'bottom-0 right-[-4px] w-[258px] h-[410px]',
    decorCloud: { left: '-62.9px', bottom: '150px', rot: 'rotate-18' },
    decorStar: { left: '269.84px', bottom: '90px', rot: 'rotate-[76.4deg]' },
  },
  {
    id: 'ahmed-1',
    nameEn: 'Ahmed Adel',
    nameAr: 'أحمد عادل',
    roleEn: 'Frontend Developer at SpaceTech',
    roleAr: 'مطور واجهات أمامية في SpaceTech',
    expEn: '+5 years of experience',
    expAr: '+5 سنوات من الخبرة',
    image: '/images/mentor-ahmed-figma.webp',
    theme: 'dark',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    photoWidth: 401,
    photoHeight: 496,
    photoClassName: 'bottom-[-70px] left-[calc(50%-21px)] -translate-x-1/2 w-[401px] h-[496px]',
    decorCloud: { left: '251.1px', bottom: '170px', rot: 'rotate-18' },
    decorStar: { left: '269.84px', bottom: '90px', rot: 'rotate-[76.4deg]' },
  },
  {
    id: 'nadia-2',
    nameEn: 'Nadia Moazz',
    nameAr: 'نادية معز',
    roleEn: 'Product Manager at SpaceTech',
    roleAr: 'مديرة منتج في SpaceTech',
    expEn: '+7 years of experience',
    expAr: '+7 سنوات من الخبرة',
    image: '/images/mentor-nadia-figma.webp',
    theme: 'light',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    photoWidth: 258,
    photoHeight: 410,
    photoClassName: 'bottom-0 right-[-4px] w-[258px] h-[410px]',
    decorCloud: { left: '-62.9px', bottom: '150px', rot: 'rotate-18' },
    decorStar: { left: '269.84px', bottom: '90px', rot: 'rotate-[76.4deg]' },
  },
  {
    id: 'ahmed-2',
    nameEn: 'Ahmed Adel',
    nameAr: 'أحمد عادل',
    roleEn: 'Frontend Developer at SpaceTech',
    roleAr: 'مطور واجهات أمامية في SpaceTech',
    expEn: '+5 years of experience',
    expAr: '+5 سنوات من الخبرة',
    image: '/images/mentor-ahmed-figma.webp',
    theme: 'dark',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    photoWidth: 401,
    photoHeight: 496,
    photoClassName: 'bottom-[-70px] left-[calc(50%-21px)] -translate-x-1/2 w-[401px] h-[496px]',
    decorCloud: { left: '251.1px', bottom: '170px', rot: 'rotate-18' },
    decorStar: { left: '269.84px', bottom: '90px', rot: 'rotate-[76.4deg]' },
  },
]

export const MentorshipSection: React.FC = () => {
  const { t, i18n } = useTranslation()
  const isRtl = i18n.language === 'ar'
  const [activeMentorId, setActiveMentorId] = useState<string | null>(null)

  return (
    <section
      id="mentorship"
      className="w-full max-w-[1240px] xl:max-w-[1280px] mx-auto px-4 sm:px-6 py-12 lg:py-16 select-none scroll-mt-28"
    >
      {/* Section Header with CTA on right (Figma node 1002:1124) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 sm:mb-12 reveal-on-scroll">
        <div className="text-start max-w-[911px]">
          <h2 className="text-[32px] sm:text-[38px] lg:text-[40px] font-bold text-[#111827] leading-tight mb-4">
            {t('mentorship.title')}
          </h2>
          <p className="text-[18px] sm:text-[22px] lg:text-[24px] text-[#5c5c5c] font-medium leading-[1.5]">
            {t('mentorship.subtitle')}
          </p>
        </div>

        <div className="shrink-0 text-start md:text-end">
          <a
            href="#all-mentors"
            className="group relative inline-flex items-center gap-[12px] px-[40px] py-[16px] rounded-[9999px] bg-[#3a0353] hover:bg-[#4d076d] text-white text-[16px] font-semibold tracking-[0.0156px] shadow-[0px_10px_15px_-3px_rgba(224,191,254,0.75),0px_4px_6px_-4px_#ddbffe] transition-all duration-200 active:scale-98"
          >
            <span>{t('mentorship.cta')}</span>
            <img
              src="/images/mentorship-arrow.svg"
              alt=""
              className="w-[14px] h-[16px] shrink-0 rtl:rotate-180 transition-transform duration-200 group-hover:translate-x-1 rtl:group-hover:-translate-x-1"
            />
          </a>
        </div>
      </div>

      {/* 4 Uniform Arched Mentor Cards: data visible on mobile, hover-extending on desktop */}
      <div className="w-full overflow-x-auto pb-10 sm:pb-12 pt-8 sm:pt-14 lg:pt-20 scrollbar-none snap-x flex justify-start xl:justify-center reveal-on-scroll reveal-delay-150">
        <div className="flex items-end justify-center min-w-max mx-auto px-4 h-[700px] sm:h-[720px] lg:h-[730px]" dir="ltr">
          {MENTORS.map((mentor) => {
            const isDark = mentor.theme === 'dark'
            const isSelected = activeMentorId === mentor.id

            return (
              <div
                key={mentor.id}
                tabIndex={0}
                onClick={() => setActiveMentorId((prev) => (prev === mentor.id ? null : mentor.id))}
                className={`group ${
                  isSelected
                    ? 'h-[680px] sm:h-[700px] z-30 shadow-[0_24px_50px_-10px_rgba(58,4,83,0.35)]'
                    : 'h-[680px] sm:h-[700px] lg:h-[520px]'
                } lg:hover:h-[700px] lg:focus-within:h-[700px] w-[285px] sm:w-[307px] shrink-0 -mr-[1px] relative overflow-hidden rounded-tl-[167px] rounded-tr-[167px] transition-all duration-500 cubic-bezier(0.16,1,0.3,1) z-10 lg:hover:z-30 lg:focus-within:z-30 lg:hover:shadow-[0_24px_50px_-10px_rgba(58,4,83,0.35)] lg:focus-within:shadow-[0_24px_50px_-10px_rgba(58,4,83,0.35)] cursor-pointer lg:cursor-default ${
                  isDark ? 'bg-[#b196c7]' : 'bg-[#f7eeff]'
                }`}
              >
                {/* Cloud / Sparkle Decor */}
                <div
                  className="absolute flex items-center justify-center size-[126px] pointer-events-none z-10 opacity-80"
                  style={{ left: mentor.decorCloud.left, bottom: mentor.decorCloud.bottom }}
                >
                  <div className={mentor.decorCloud.rot}>
                    <img src="/images/mentorship-cloud-star.svg" alt="" className="w-[100px] h-[100px]" />
                  </div>
                </div>

                {/* 4-point Star Decor */}
                <div
                  className="absolute flex items-center justify-center size-[36px] pointer-events-none z-10 opacity-80"
                  style={{ left: mentor.decorStar.left, bottom: mentor.decorStar.bottom }}
                >
                  <div className={mentor.decorStar.rot}>
                    <img src="/images/mentorship-star-4point.svg" alt="" className="w-[30px] h-[30px]" />
                  </div>
                </div>

                {/* Mentor Cutout Photo (Grounded at bottom, stays stable while card extends) */}
                <div className={`absolute pointer-events-none z-10 ${mentor.photoClassName}`}>
                  <img
                    src={mentor.image}
                    alt={isRtl ? mentor.nameAr : mentor.nameEn}
                    className="w-full h-full object-cover pointer-events-none transition-transform duration-500 ease-out group-hover:scale-105"
                    loading="lazy"
                    decoding="async"
                    width={mentor.photoWidth}
                    height={mentor.photoHeight}
                  />
                </div>

                {/* Top Header: Name and Availability Status */}
                <div className="absolute top-[34px] sm:top-[42px] inset-x-0 flex flex-col items-center text-center z-20 px-6 transition-all duration-500">
                  <h3
                    className={`font-moul text-[24px] sm:text-[30px] leading-[1.2] text-center w-full transition-colors duration-300 ${
                      isDark ? 'text-white' : 'text-[#5c3577]'
                    }`}
                  >
                    {isRtl ? mentor.nameAr : mentor.nameEn}
                  </h3>
                  <div
                    className={`mt-1.5 inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-semibold tracking-wide transition-all duration-300 ${
                      isDark
                        ? 'bg-white/15 text-white/95 border border-white/20'
                        : 'bg-white/80 text-[#3c0d5c] border border-purple-100 shadow-xs'
                    }`}
                  >
                    <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>{t('mentorship.available')}</span>
                  </div>
                </div>

                {/* Details Panel: Visible by default on mobile/tablet; smoothly reveals on desktop hover or tap */}
                <div
                  className={`absolute top-[106px] sm:top-[112px] inset-x-0 px-3 z-20 transition-all duration-400 ease-out ${
                    isSelected
                      ? 'opacity-100 max-h-[240px] pointer-events-auto translate-y-0 scale-100'
                      : 'opacity-100 max-h-[240px] pointer-events-auto translate-y-0 scale-100 lg:opacity-0 lg:max-h-0 lg:pointer-events-none lg:-translate-y-2 lg:scale-95 lg:overflow-hidden lg:group-hover:opacity-100 lg:group-hover:max-h-[220px] lg:group-hover:pointer-events-auto lg:group-hover:translate-y-0 lg:group-hover:scale-100 lg:focus-within:opacity-100 lg:focus-within:max-h-[220px] lg:focus-within:pointer-events-auto lg:focus-within:translate-y-0 lg:focus-within:scale-100 delay-100'
                  }`}
                >
                  <div
                    className={`w-full p-3.5 rounded-2xl flex flex-col gap-2.5 shadow-lg ${
                      isDark
                        ? 'bg-[#2f084d]/92 text-white border border-white/20 backdrop-blur-md'
                        : 'bg-white/95 text-[#3c0d5c] border border-purple-100 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.08)]'
                    }`}
                  >
                    {/* Role */}
                    <div className="flex items-center gap-2 w-full">
                      <img
                        src={isDark ? '/images/mentorship-work-white.svg' : '/images/mentorship-work-purple.svg'}
                        alt=""
                        className="size-4 shrink-0"
                      />
                      <p className="text-[12px] font-semibold leading-tight truncate">
                        {isRtl ? mentor.roleAr : mentor.roleEn}
                      </p>
                    </div>

                    {/* Experience */}
                    <div className="flex items-center gap-2 w-full">
                      <img
                        src={isDark ? '/images/mentorship-verified-white.svg' : '/images/mentorship-verified-purple.svg'}
                        alt=""
                        className="size-4 shrink-0"
                      />
                      <p className="text-[12px] font-medium leading-tight">
                        {isRtl ? mentor.expAr : mentor.expEn}
                      </p>
                    </div>

                    {/* Badges */}
                    <div className="flex items-center gap-1.5 pt-0.5">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          isDark
                            ? 'bg-white/20 text-white border border-white/20'
                            : 'bg-[#5c3577] text-[#f7eaff] shadow-xs'
                        }`}
                      >
                        {t('mentorship.badgeExpert')}
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          isDark
                            ? 'bg-white/20 text-white border border-white/20'
                            : 'bg-[#5c3577] text-[#f7eaff] shadow-xs'
                        }`}
                      >
                        {t('mentorship.badgeTopMentor')}
                      </span>
                    </div>

                    {/* GitHub & LinkedIn Buttons */}
                    <div className="grid grid-cols-2 gap-2 pt-1 border-t border-purple-200/30">
                      <a
                        href={mentor.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${mentor.nameEn} GitHub`}
                        className={`inline-flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-full text-[11px] font-bold transition-all duration-200 active:scale-95 ${
                          isDark
                            ? 'bg-white/15 hover:bg-white/25 text-white border border-white/20 hover:scale-[1.03] shadow-xs'
                            : 'bg-slate-900 hover:bg-black text-white hover:scale-[1.03] shadow-xs'
                        }`}
                      >
                        <GitHubIcon className="w-3.5 h-3.5 shrink-0" />
                        <span>GitHub</span>
                      </a>

                      <a
                        href={mentor.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${mentor.nameEn} LinkedIn`}
                        className={`inline-flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-full text-[11px] font-bold transition-all duration-200 active:scale-95 ${
                          isDark
                            ? 'bg-[#7a28bf] hover:bg-[#8e38d6] text-white border border-purple-300/30 hover:scale-[1.03] shadow-xs'
                            : 'bg-[#5a198f] hover:bg-[#471173] text-white hover:scale-[1.03] shadow-xs'
                        }`}
                      >
                        <LinkedInIcon className="w-3.5 h-3.5 shrink-0" />
                        <span>LinkedIn</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
