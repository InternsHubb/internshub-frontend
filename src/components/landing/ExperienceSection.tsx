import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

export const ExperienceSection: React.FC = () => {
  const { t, i18n } = useTranslation()
  const isRtl = i18n.language === 'ar'

  const items = useMemo(
    () => [
      {
        num: '1',
        title: t('experience.item1Title'),
        desc: t('experience.item1Desc'),
        dashed: true,
      },
      {
        num: '2',
        title: t('experience.item2Title'),
        desc: t('experience.item2Desc'),
        dashed: false,
      },
      {
        num: '3',
        title: t('experience.item3Title'),
        desc: t('experience.item3Desc'),
        dashed: true,
      },
      {
        num: '4',
        title: t('experience.item4Title'),
        desc: t('experience.item4Desc'),
        dashed: false,
      },
    ],
    [t]
  )

  return (
    <section className="w-full max-w-[1240px] xl:max-w-[1280px] mx-auto px-4 sm:px-6 py-12 lg:py-16">
      {/* Section Header (Figma node 1002:1071) */}
      <div className="text-start mb-12 sm:mb-16 reveal-on-scroll">
        <h2 className="text-[32px] sm:text-[38px] lg:text-[40px] font-bold text-[#161616] leading-tight mb-4">
          {isRtl ? (
            <>
              <span className="text-[#3a0453]">عِش تجربة العمل الحقيقي</span> قبل أن{' '}
              <span className="text-[#3a0453]">يتم توظيفك</span>
            </>
          ) : (
            <>
              <span className="text-[#3a0453]">Experience Work</span> Before You{' '}
              <span className="text-[#3a0453]">Get Hired</span>
            </>
          )}
        </h2>
        <p className="text-[18px] sm:text-[22px] lg:text-[24px] text-[#5c5c5c] font-medium leading-[1.5] max-w-3xl">
          {t('experience.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        {/* Left Column: 4 Benefit Cards (Figma node 1002:1075) */}
        <div className="lg:col-span-6 flex flex-col gap-6 max-w-[507px] w-full">
          {items.map((item, idx) => {
            const delayClass =
              idx === 0
                ? 'reveal-delay-100'
                : idx === 1
                ? 'reveal-delay-200'
                : idx === 2
                ? 'reveal-delay-300'
                : 'reveal-delay-400'
            return (
              <div
                key={item.num}
                className={`p-3 sm:p-3.5 rounded-[50px] border-2 border-[#cb8cfe] ${
                  item.dashed ? 'border-dashed' : 'border-solid'
                } bg-white flex items-center gap-4 transition-all duration-200 hover:shadow-md hover:bg-purple-50/15 reveal-on-scroll ${delayClass}`}
              >
              {/* Number Badge (Figma: size 50px, rounded 25px, bg #5a198f, font 17px ExtraBold) */}
              <div className="size-[50px] rounded-[25px] bg-[#5a198f] text-white font-extrabold text-[17px] flex items-center justify-center shrink-0 shadow-md shadow-[#5a198f]/20">
                {item.num}
              </div>

              {/* Text info */}
              <div className="text-start flex-1 min-w-0">
                <h3 className="text-[18px] sm:text-[20px] font-extrabold text-[#111827] leading-[20px] mb-1.5">
                  {item.title}
                </h3>
                <p className="text-[15px] sm:text-[16px] font-medium text-[#6b7280] leading-[1.4]">
                  {item.desc}
                </p>
              </div>
            </div>
          )
        })}
        </div>

        {/* Right Column: Visual Mentor Showcase matching Figma node 1002:1100 */}
        <div className="lg:col-span-6 relative flex justify-center items-center py-4 reveal-on-scroll reveal-scale reveal-delay-200">
          <div
            className="relative w-full max-w-[588px] aspect-[588/568] flex items-center justify-center select-none"
            dir="ltr"
          >
            {/* Inner Circle & Mask Container for Mentor (Figma node 1002:1101 & 1002:1102, size 525px) */}
            <div
              className="absolute left-[10.71%] top-[3.35%] w-[89.29%] h-[92.43%] rounded-full overflow-hidden z-10"
            >
              {/* Ellipse 10: Concentric 408px light lavender circle background (Figma node 1002:1101) */}
              <div
                aria-hidden="true"
                className="absolute left-[11.24%] top-[11.05%] w-[77.71%] h-[77.71%] rounded-full bg-[#FFF7FF]"
              />

              {/* Mentor Cutout Image positioned to match Figma proportions with lower legs cleanly clipped (Figma node 1002:1104) */}
              <img
                src="/images/experience-mentor-figma.webp"
                alt={t('experience.mentorImageAlt')}
                className="absolute left-[2.98%] top-[-12.64%] w-[84.48%] h-[126.70%] max-w-none object-cover pointer-events-none"
                loading="lazy"
                decoding="async"
                width={444}
                height={665}
              />
            </div>

            {/* Rotating Outer Circle Assembly (Outer Ring + 4 Badges that orbit around the mentor) */}
            <div
              className="absolute left-[10.71%] top-[3.35%] w-[89.29%] h-[92.43%] z-20 experience-circle-spin pointer-events-none"
            >
              {/* Outer Purple Ring (Figma node 1002:1105, Ellipse 11: size 525px, stroke #7D5E92) */}
              <img
                src="/images/experience-outer-ring.svg"
                alt=""
                className="w-full h-full pointer-events-none"
              />

              {/* Floating Document Badge (Top) */}
              <div
                className="absolute left-[26.29%] top-[-3.62%] w-[12%] h-[12%] rounded-full bg-white shadow-[0px_4px_16px_rgba(0,0,0,0.08)] flex items-center justify-center z-30 border border-purple-50 experience-badge-counter pointer-events-auto cursor-pointer hover:scale-110 transition-transform"
              >
                <img
                  src="/images/experience-doc.svg"
                  alt=""
                  className="w-[22px] h-[25px]"
                />
              </div>

              {/* Floating Thumbnail Circle Top-Right: 'LOVE TO LEARN' */}
              <div
                className="absolute left-[81.33%] top-[9.90%] w-[12%] h-[12%] rounded-full overflow-hidden border-2 border-white shadow-[0px_4px_16px_rgba(0,0,0,0.12)] z-30 bg-white flex items-center justify-center experience-badge-counter pointer-events-auto cursor-pointer hover:scale-110 transition-transform"
              >
                <img
                  src="/images/experience-thumb-1-cropped.png"
                  alt="Love to Learn"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Floating Shield-Done Badge Bottom-Right */}
              <div
                className="absolute left-[84.00%] top-[72.76%] w-[12%] h-[12%] rounded-full bg-white shadow-[0px_4px_16px_rgba(0,0,0,0.08)] flex items-center justify-center z-30 border border-purple-50 experience-badge-counter pointer-events-auto cursor-pointer hover:scale-110 transition-transform"
              >
                <img
                  src="/images/experience-shield.svg"
                  alt=""
                  className="w-[21px] h-[24px]"
                />
              </div>

              {/* Floating Thumbnail Circle Bottom-Left: Stickers & Notes */}
              <div
                className="absolute left-[1.14%] top-[67.62%] w-[12%] h-[12%] rounded-full overflow-hidden border-2 border-white shadow-[0px_4px_16px_rgba(0,0,0,0.12)] z-30 bg-white flex items-center justify-center experience-badge-counter pointer-events-auto cursor-pointer hover:scale-110 transition-transform"
              >
                <img
                  src="/images/experience-thumb-2-cropped.png"
                  alt="Projects"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Floating Card: 1850+ Courses (Figma node 1002:1106) */}
            <div
              className="absolute left-0 top-[23.59%] w-[23.13%] h-[15.49%] bg-white rounded-[10px] shadow-[0px_9px_40px_0px_#d6b7d4,0px_3px_18px_0px_#d6b7d7] flex flex-col items-center justify-center px-3 py-2 z-30 border border-purple-50/50 hero-photo-float"
            >
              <img
                src="/images/experience-heart.svg"
                alt=""
                className="w-[16px] h-[15px] mb-1.5 shrink-0"
              />
              <p className="text-[16px] font-bold text-[#482e57] leading-none mb-0.5">
                {t('experience.coursesCount')}
              </p>
              <p className="text-[14px] font-normal text-[#8d8d8d] leading-none">
                {t('experience.coursesLabel')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
