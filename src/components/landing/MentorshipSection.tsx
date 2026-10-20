import React from 'react'
import { useTranslation } from 'react-i18next'

export const MentorshipSection: React.FC = () => {
  const { t, i18n } = useTranslation()
  const isRtl = i18n.language === 'ar'

  return (
    <section id="mentorship" className="w-full max-w-[1240px] xl:max-w-[1280px] mx-auto px-4 sm:px-6 py-12 lg:py-16 select-none">
      {/* Section Header with CTA on right (Figma node 1002:1124) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 sm:mb-16 reveal-on-scroll">
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

      {/* 4 Staggered Arched Mentor Cards (Figma node 1002:1134) */}
      <div className="w-full overflow-x-auto pb-6 pt-2 scrollbar-none snap-x flex justify-start xl:justify-center reveal-on-scroll reveal-delay-150">
        <div className="flex items-end justify-center min-w-max mx-auto" dir="ltr">
          {/* Card 1: Nadia Moazz (Figma node 1002:1135, height 720px) */}
          <div className="group bg-[#f7eeff] h-[720px] -mr-[1px] overflow-hidden relative rounded-tl-[167px] rounded-tr-[167px] shrink-0 w-[307px] transition-transform duration-300 hover:-translate-y-1">
            {/* Cloud / Sparkle Decor (Left) */}
            <div className="absolute flex items-center justify-center left-[-62.9px] size-[126px] top-[340px] pointer-events-none z-10">
              <div className="rotate-18">
                <img src="/images/mentorship-cloud-star.svg" alt="" className="w-[100px] h-[100px]" />
              </div>
            </div>

            {/* Mentor Cutout Photo */}
            <div className="absolute h-[410px] right-[-4px] top-[calc(50%+159px)] -translate-y-1/2 w-[258px] pointer-events-none z-10">
              <img
                src="/images/mentor-nadia-figma.png"
                alt="Nadia Moazz"
                className="w-full h-full object-cover pointer-events-none"
                loading="lazy"
                width={258}
                height={410}
              />
            </div>

            {/* 4-point Star Decor (Right) */}
            <div className="absolute flex items-center justify-center left-[269.84px] size-[36px] top-[429px] pointer-events-none z-10">
              <div className="rotate-[76.4deg]">
                <img src="/images/mentorship-star-4point.svg" alt="" className="w-[30px] h-[30px]" />
              </div>
            </div>

            {/* Top Text Content Box */}
            <div className="absolute flex flex-col gap-[22px] items-start left-[35px] top-[74px] w-[254px] z-20">
              <div className="flex flex-col gap-px items-center text-center w-[238px]">
                <h3 className="font-moul text-[32px] text-[#5c3577] text-center leading-[1.2] w-full">
                  {isRtl ? 'نادية معز' : 'Nadia Moazz'}
                </h3>
                <p className="text-[#3c0d5c] text-[12px] font-normal leading-normal text-center w-full">
                  {t('mentorship.available')}
                </p>
              </div>

              <div className="flex flex-col gap-[13px] items-start w-full">
                <div className="flex items-center gap-[12px] w-full">
                  <img src="/images/mentorship-work-purple.svg" alt="" className="size-[20px] shrink-0" />
                  <p className="text-[#3c0d5c] text-[14px] leading-normal whitespace-nowrap">
                    {isRtl ? (
                      <>مديرة منتج <span className="font-light">في</span> SpaceTech</>
                    ) : (
                      <>Product Manager <span className="font-light">at</span> SpaceTech</>
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-[6px] w-full">
                  <img src="/images/mentorship-verified-purple.svg" alt="" className="size-[20px] shrink-0" />
                  <p className="text-[#3c0d5c] text-[14px] leading-normal whitespace-nowrap">
                    {isRtl ? '+7 سنوات من الخبرة' : '+7 years of experience'}
                  </p>
                </div>
              </div>

              <div className="flex gap-[8px] items-start">
                <span className="bg-[#5c3577] text-[#f7eaff] h-[30px] px-[20px] rounded-[36px] text-[14px] flex items-center justify-center font-normal leading-none shadow-sm">
                  {t('mentorship.badgeExpert')}
                </span>
                <span className="bg-[#5c3577] text-[#f7eaff] h-[30px] px-[20px] rounded-[36px] text-[14px] flex items-center justify-center font-normal leading-none shadow-sm">
                  {t('mentorship.badgeTopMentor')}
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Ahmed Adel (Figma node 1002:1157, height 602px) */}
          <div className="group bg-[#b196c7] h-[602px] -mr-[1px] overflow-hidden relative rounded-tl-[167px] rounded-tr-[167px] shrink-0 w-[307px] transition-transform duration-300 hover:-translate-y-1">
            {/* Mentor Cutout Photo */}
            <div className="absolute h-[496px] left-[calc(50%-21px)] top-[calc(50%+223px)] -translate-x-1/2 -translate-y-1/2 w-[401px] pointer-events-none z-10">
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <img
                  src="/images/mentor-ahmed-figma.png"
                  alt="Ahmed Adel"
                  className="absolute h-[106.39%] left-[10.06%] top-[-1.43%] w-[92.5%] max-w-none object-cover pointer-events-none"
                  loading="lazy"
                  width={401}
                  height={496}
                />
              </div>
            </div>

            {/* 4-point Star Decor */}
            <div className="absolute flex items-center justify-center left-[269.84px] size-[36px] top-[429px] pointer-events-none z-10">
              <div className="rotate-[76.4deg]">
                <img src="/images/mentorship-star-4point.svg" alt="" className="w-[30px] h-[30px]" />
              </div>
            </div>

            {/* Cloud / Sparkle Decor */}
            <div className="absolute flex items-center justify-center left-[251.1px] size-[126px] top-[285px] pointer-events-none z-10">
              <div className="rotate-18">
                <img src="/images/mentorship-cloud-star.svg" alt="" className="w-[100px] h-[100px]" />
              </div>
            </div>

            {/* Top Text Content Box */}
            <div className="absolute flex flex-col gap-[22px] items-start left-[calc(50%+0.5px)] -translate-x-1/2 top-[71px] w-[254px] z-20">
              <div className="flex flex-col gap-px items-center text-center text-white w-[238px]">
                <h3 className="font-moul text-[32px] text-white text-center leading-[1.2] w-full">
                  {isRtl ? 'أحمد عادل' : 'Ahmed Adel'}
                </h3>
                <p className="text-white text-[12px] font-normal leading-normal text-center w-full">
                  {t('mentorship.available')}
                </p>
              </div>

              <div className="flex flex-col gap-[13px] items-start w-full text-white">
                <div className="flex items-center gap-[12px] w-full">
                  <img src="/images/mentorship-work-white.svg" alt="" className="size-[20px] shrink-0" />
                  <p className="text-white text-[14px] leading-normal whitespace-nowrap">
                    {isRtl ? (
                      <>مطور واجهات أمامية <span className="font-light">في</span> SpaceTech</>
                    ) : (
                      <>Frontend Developer <span className="font-light">at</span> SpaceTech</>
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-[6px] w-full">
                  <img src="/images/mentorship-verified-white.svg" alt="" className="size-[20px] shrink-0" />
                  <p className="text-white text-[14px] leading-normal whitespace-nowrap">
                    {isRtl ? '+5 سنوات من الخبرة' : '+5 years of experience'}
                  </p>
                </div>
              </div>

              <div className="flex gap-[8px] items-start">
                <span className="bg-[#f9f0ff] text-[#22023c] h-[30px] px-[20px] rounded-[36px] text-[14px] flex items-center justify-center font-normal leading-none shadow-sm">
                  {t('mentorship.badgeExpert')}
                </span>
                <span className="bg-[#f9f0ff] text-[#22023c] h-[30px] px-[20px] rounded-[36px] text-[14px] flex items-center justify-center font-normal leading-none shadow-sm">
                  {t('mentorship.badgeTopMentor')}
                </span>
              </div>
            </div>
          </div>

          {/* Card 3: Nadia Moazz (Figma node 1002:1179, height 720px) */}
          <div className="group bg-[#f7eeff] h-[720px] -mr-[1px] overflow-hidden relative rounded-tl-[167px] rounded-tr-[167px] shrink-0 w-[307px] transition-transform duration-300 hover:-translate-y-1">
            {/* Cloud / Sparkle Decor (Left) */}
            <div className="absolute flex items-center justify-center left-[-62.9px] size-[126px] top-[340px] pointer-events-none z-10">
              <div className="rotate-18">
                <img src="/images/mentorship-cloud-star.svg" alt="" className="w-[100px] h-[100px]" />
              </div>
            </div>

            {/* Mentor Cutout Photo */}
            <div className="absolute h-[410px] right-[-4px] top-[calc(50%+159px)] -translate-y-1/2 w-[258px] pointer-events-none z-10">
              <img
                src="/images/mentor-nadia-figma.png"
                alt="Nadia Moazz"
                className="w-full h-full object-cover pointer-events-none"
                loading="lazy"
                width={258}
                height={410}
              />
            </div>

            {/* 4-point Star Decor (Right) */}
            <div className="absolute flex items-center justify-center left-[269.84px] size-[36px] top-[429px] pointer-events-none z-10">
              <div className="rotate-[76.4deg]">
                <img src="/images/mentorship-star-4point.svg" alt="" className="w-[30px] h-[30px]" />
              </div>
            </div>

            {/* Top Text Content Box */}
            <div className="absolute flex flex-col gap-[22px] items-start left-[35px] top-[74px] w-[254px] z-20">
              <div className="flex flex-col gap-px items-center text-center w-[238px]">
                <h3 className="font-moul text-[32px] text-[#5c3577] text-center leading-[1.2] w-full">
                  {isRtl ? 'نادية معز' : 'Nadia Moazz'}
                </h3>
                <p className="text-[#3c0d5c] text-[12px] font-normal leading-normal text-center w-full">
                  {t('mentorship.available')}
                </p>
              </div>

              <div className="flex flex-col gap-[13px] items-start w-full">
                <div className="flex items-center gap-[12px] w-full">
                  <img src="/images/mentorship-work-purple.svg" alt="" className="size-[20px] shrink-0" />
                  <p className="text-[#3c0d5c] text-[14px] leading-normal whitespace-nowrap">
                    {isRtl ? (
                      <>مديرة منتج <span className="font-light">في</span> SpaceTech</>
                    ) : (
                      <>Product Manager <span className="font-light">at</span> SpaceTech</>
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-[6px] w-full">
                  <img src="/images/mentorship-verified-purple.svg" alt="" className="size-[20px] shrink-0" />
                  <p className="text-[#3c0d5c] text-[14px] leading-normal whitespace-nowrap">
                    {isRtl ? '+7 سنوات من الخبرة' : '+7 years of experience'}
                  </p>
                </div>
              </div>

              <div className="flex gap-[8px] items-start">
                <span className="bg-[#5c3577] text-[#f7eaff] h-[30px] px-[20px] rounded-[36px] text-[14px] flex items-center justify-center font-normal leading-none shadow-sm">
                  {t('mentorship.badgeExpert')}
                </span>
                <span className="bg-[#5c3577] text-[#f7eaff] h-[30px] px-[20px] rounded-[36px] text-[14px] flex items-center justify-center font-normal leading-none shadow-sm">
                  {t('mentorship.badgeTopMentor')}
                </span>
              </div>
            </div>
          </div>

          {/* Card 4: Ahmed Adel (Figma node 1002:1201, height 602px) */}
          <div className="group bg-[#b196c7] h-[602px] overflow-hidden relative rounded-tl-[167px] rounded-tr-[167px] shrink-0 w-[307px] transition-transform duration-300 hover:-translate-y-1">
            {/* Mentor Cutout Photo */}
            <div className="absolute h-[496px] left-[calc(50%-28px)] top-[calc(50%+214px)] -translate-x-1/2 -translate-y-1/2 w-[401px] pointer-events-none z-10">
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <img
                  src="/images/mentor-ahmed-figma.png"
                  alt="Ahmed Adel"
                  className="absolute h-[106.39%] left-[10.06%] top-[-1.43%] w-[92.5%] max-w-none object-cover pointer-events-none"
                  loading="lazy"
                  width={401}
                  height={496}
                />
              </div>
            </div>

            {/* 4-point Star Decor */}
            <div className="absolute flex items-center justify-center left-[269.84px] size-[36px] top-[429px] pointer-events-none z-10">
              <div className="rotate-[76.4deg]">
                <img src="/images/mentorship-star-4point.svg" alt="" className="w-[30px] h-[30px]" />
              </div>
            </div>

            {/* Cloud / Sparkle Decor */}
            <div className="absolute flex items-center justify-center left-[251.1px] size-[126px] top-[285px] pointer-events-none z-10">
              <div className="rotate-18">
                <img src="/images/mentorship-cloud-star.svg" alt="" className="w-[100px] h-[100px]" />
              </div>
            </div>

            {/* Top Text Content Box */}
            <div className="absolute flex flex-col gap-[22px] items-start left-[calc(50%+0.5px)] -translate-x-1/2 top-[71px] w-[254px] z-20">
              <div className="flex flex-col gap-px items-center text-center text-white w-[238px]">
                <h3 className="font-moul text-[32px] text-white text-center leading-[1.2] w-full">
                  {isRtl ? 'أحمد عادل' : 'Ahmed Adel'}
                </h3>
                <p className="text-white text-[12px] font-normal leading-normal text-center w-full">
                  {t('mentorship.available')}
                </p>
              </div>

              <div className="flex flex-col gap-[13px] items-start w-full text-white">
                <div className="flex items-center gap-[12px] w-full">
                  <img src="/images/mentorship-work-white.svg" alt="" className="size-[20px] shrink-0" />
                  <p className="text-white text-[14px] leading-normal whitespace-nowrap">
                    {isRtl ? (
                      <>مطور واجهات أمامية <span className="font-light">في</span> SpaceTech</>
                    ) : (
                      <>Frontend Developer <span className="font-light">at</span> SpaceTech</>
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-[6px] w-full">
                  <img src="/images/mentorship-verified-white.svg" alt="" className="size-[20px] shrink-0" />
                  <p className="text-white text-[14px] leading-normal whitespace-nowrap">
                    {isRtl ? '+5 سنوات من الخبرة' : '+5 years of experience'}
                  </p>
                </div>
              </div>

              <div className="flex gap-[8px] items-start">
                <span className="bg-[#f9f0ff] text-[#22023c] h-[30px] px-[20px] rounded-[36px] text-[14px] flex items-center justify-center font-normal leading-none shadow-sm">
                  {t('mentorship.badgeExpert')}
                </span>
                <span className="bg-[#f9f0ff] text-[#22023c] h-[30px] px-[20px] rounded-[36px] text-[14px] flex items-center justify-center font-normal leading-none shadow-sm">
                  {t('mentorship.badgeTopMentor')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
