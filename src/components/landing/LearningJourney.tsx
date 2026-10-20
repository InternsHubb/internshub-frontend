import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

export const LearningJourney: React.FC = () => {
  const { t, i18n } = useTranslation()
  const isRtl = i18n.language === 'ar'

  const steps = useMemo(
    () => [
      {
        number: '1',
        title: t('journey.step1Title'),
        desc: t('journey.step1Desc'),
        lineType: 'solid' as const,
      },
      {
        number: '2',
        title: t('journey.step2Title'),
        desc: t('journey.step2Desc'),
        lineType: 'dashed' as const,
      },
      {
        number: '3',
        title: t('journey.step3Title'),
        desc: t('journey.step3Desc'),
        lineType: 'dashed' as const,
      },
      {
        number: '4',
        title: t('journey.step4Title'),
        desc: t('journey.step4Desc'),
        lineType: 'none' as const,
      },
    ],
    [t]
  )

  return (
    <section className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 py-6 sm:py-10">
      <div className="bg-white rounded-[30px] border border-slate-100 shadow-[0px_4px_25px_rgba(0,0,0,0.03)] relative overflow-hidden px-6 py-8 sm:px-8 lg:px-10 lg:py-8 reveal-on-scroll">
        {/* Soft Ambient Purple Glow in bottom-left corner matching Figma node 1002:1042 (opacity 20%, blur 29px) */}
        <div
          aria-hidden="true"
          className="absolute -bottom-20 -start-10 w-[290px] h-[296px] bg-[#c693fd]/20 rounded-full blur-[29px] pointer-events-none"
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center relative z-10">
          {/* Left Title matching Figma node 1002:1041 */}
          <div className="lg:col-span-4 text-start reveal-on-scroll reveal-delay-100">
            <h2 className="text-[22px] sm:text-[24px] font-extrabold leading-[1.35] text-[#060607] max-w-[340px]">
              {isRtl ? (
                <>
                  <span className="text-[#471062]">كل ما تحتاجه</span> لتصبح{' '}
                  <span className="text-[#602a80]">جاهزاً لسوق العمل</span>
                </>
              ) : (
                <>
                  <span className="text-[#471062]">Everything</span> You Need to
                  Become <span className="text-[#602a80]">Job-Ready</span>
                </>
              )}
            </h2>
          </div>

          {/* Right 4 Steps matching Figma node 1002:1043 to 1002:1069 */}
          <div className="lg:col-span-8 relative">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-2 relative">
              {steps.map((step, idx) => {
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
                    key={step.number}
                    className={`flex flex-col items-start lg:items-center text-start lg:text-center relative group reveal-on-scroll ${delayClass}`}
                  >
                  {/* Step Connector Line on Desktop with exact Figma gradient for Step 1 -> 2 (Figma node 1002:1067) */}
                  {step.lineType !== 'none' &&
                    (step.lineType === 'solid' ? (
                      <div
                        aria-hidden="true"
                        className="hidden lg:block absolute top-[24px] start-[calc(50%+25px)] w-[calc(100%-50px)] h-[2.5px] z-0 pointer-events-none rounded-full"
                        style={{
                          background: isRtl
                            ? 'linear-gradient(to left, #3A0353 0%, #3A0353 64%, rgba(102, 102, 102, 0.49) 100%)'
                            : 'linear-gradient(to right, #3A0353 0%, #3A0353 64%, rgba(102, 102, 102, 0.49) 100%)',
                        }}
                      />
                    ) : (
                      <div
                        aria-hidden="true"
                        className="hidden lg:block absolute top-[24px] start-[calc(50%+25px)] w-[calc(100%-50px)] h-0 z-0 pointer-events-none border-t-[1.5px] border-dashed border-[#9ca3af]"
                      />
                    ))}

                  {/* Step Number Circle (Figma size: 50x50, bg: #5a198f, font: 17px ExtraBold) */}
                  <div className="size-[50px] rounded-full bg-[#5a198f] text-white text-[17px] font-extrabold flex items-center justify-center relative z-10 shrink-0 shadow-md shadow-[#5a198f]/20 group-hover:scale-105 transition-transform">
                    {step.number}
                  </div>

                  {/* Title (Figma size: 14px ExtraBold, text: #111827) */}
                  <h3 className="text-[14px] font-extrabold text-[#111827] mt-[9px] mb-1 min-h-[19px]">
                    {step.title}
                  </h3>

                  {/* Description (Figma size: 14px Regular, text: #6b7280, leading: 1.4, max-w: 196px) */}
                  <p className="text-[14px] font-normal text-[#6b7280] leading-[1.4] max-w-[196px]">
                    {step.desc}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
        </div>
      </div>
    </section>
  )
}
