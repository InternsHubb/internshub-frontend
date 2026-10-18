import React from 'react'
import { useTranslation } from 'react-i18next'
import { ArrowRight, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'

export const Hero: React.FC = () => {
  const { t, i18n } = useTranslation()
  const isRtl = i18n.dir() === 'rtl'

  return (
    <section id="home" className="relative overflow-hidden pt-6 pb-14 lg:pt-10 lg:pb-20">
      {/* Soft Ambient Background Glows matching Figma layer 1002:1022 & 1002:1034 */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 end-0 -z-10 w-[550px] h-[480px] bg-gradient-to-bl from-purple-200/20 via-purple-100/10 to-transparent rounded-full blur-[90px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/3 -start-24 -z-10 w-[400px] h-[360px] bg-purple-100/20 rounded-full blur-[80px]"
      />

      <div className="max-w-[1400px] xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-10 lg:gap-0 pt-2 lg:pt-4">
          {/* Left Column: Headline & CTA (Figma node 1002:1018) */}
          <div className="w-full lg:w-[540px] xl:w-[560px] shrink-0 text-start flex flex-col items-start z-10 relative lg:pt-6 xl:pt-10">
            {/* Ambient Purple Glow Behind Headline matching Figma node 1002:1022 (opacity 20%, blur 29px) */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute top-8 left-1/4 sm:left-1/3 w-[290px] h-[296px] bg-[#c693fd]/20 blur-[29px] rounded-full -z-10"
            />

            {/* Main Headline (Figma node 1002:1020) */}
            <h1 className="text-[40px] sm:text-[52px] lg:text-[58px] xl:text-[62px] font-black text-[#1e2029] tracking-tight leading-[1.12] mb-6 font-sans">
              {isRtl ? (
                <>
                  تعلم <span className="text-[#4a1068]">المهارات.</span> واكتسب{' '}
                  <span className="text-[#4a1068]">الخبرة.</span> وابنِ{' '}
                  <span className="text-[#4a1068]">مسارك المهني.</span>
                </>
              ) : (
                <>
                  Learn <span className="text-[#4a1068]">Skills.</span> Gain{' '}
                  <span className="text-[#4a1068]">Experience.</span> Build Your{' '}
                  <span className="text-[#4a1068]">Career.</span>
                </>
              )}
            </h1>

            {/* Supporting Subtitle (Figma node 1002:1021) */}
            <p className="text-[17px] sm:text-[18px] lg:text-[19px] text-[#5c5c5c] font-medium leading-[1.6] max-w-[564px] mb-8">
              {t('hero.subtitle')}
            </p>

            {/* CTA Button: Single Start Now Button with glowing purple shadow (Figma node 1002:1024 & 1002:1025) */}
            <div>
              <Link
                to={ROUTES.register}
                className="inline-flex items-center justify-center gap-3 px-9 py-4 text-[16px] sm:text-[17px] font-bold text-white bg-[#3a0453] hover:bg-[#4d076d] rounded-full shadow-[0px_10px_25px_0px_rgba(224,191,254,0.75),0px_4px_12px_-2px_rgba(58,4,83,0.35)] hover:shadow-[0px_14px_32px_0px_rgba(224,191,254,0.85),0px_6px_16px_-2px_rgba(58,4,83,0.45)] transition-all duration-200"
              >
                <span>{t('hero.cta')}</span>
                {isRtl ? (
                  <ArrowLeft className="w-5 h-5" />
                ) : (
                  <ArrowRight className="w-5 h-5" />
                )}
              </Link>
            </div>
          </div>

          {/* Right Column: Hero Visual with exact background patterns, tuned purple glow, and image from Figma (node 1002:1030) */}
          <div className="w-full lg:flex-1 relative flex justify-center lg:justify-end items-center py-0 lg:-mt-8 xl:-mt-12 lg:-ms-8 xl:-ms-16">
            <div
              className="relative w-full max-w-[620px] sm:max-w-[720px] lg:max-w-[820px] xl:max-w-[880px] 2xl:max-w-[920px] aspect-[872/673] select-none"
              dir="ltr"
            >
              {/* Vector 1: Peach / Gold Organic Pattern (Figma node 1002:1031) */}
              <div
                aria-hidden="true"
                className="absolute pointer-events-none flex items-center justify-center z-[1]"
                style={{
                  left: '32.44%',
                  top: '6.20%',
                  width: '67.56%',
                  height: '69.33%',
                }}
              >
                <div
                  className="w-[85%] h-[87%] flex-none"
                  style={{
                    transform: 'rotate(8.35deg) skewX(-5.11deg)',
                  }}
                >
                  <img
                    src="/images/hero-vector-peach.svg"
                    alt=""
                    className="w-full h-full object-contain pointer-events-none"
                    draggable={false}
                  />
                </div>
              </div>

              {/* Vector 2: Orange / Coral Top Wave Pattern (Figma node 1002:1032) */}
              <div
                aria-hidden="true"
                className="absolute pointer-events-none flex items-center justify-center z-[2]"
                style={{
                  left: '25.12%',
                  top: '0.59%',
                  width: '58.26%',
                  height: '60.15%',
                }}
              >
                <div
                  className="w-[99%] h-[99%] flex-none"
                  style={{
                    transform: 'rotate(-0.43deg) skewX(0.27deg)',
                  }}
                >
                  <img
                    src="/images/hero-vector-purple-top.svg"
                    alt=""
                    className="w-full h-full object-contain pointer-events-none"
                    draggable={false}
                  />
                </div>
              </div>

              {/* Vector 3: Rich Purple Left Petal Pattern (Figma node 1002:1033) */}
              <div
                aria-hidden="true"
                className="absolute pointer-events-none flex items-center justify-center z-[3]"
                style={{
                  left: '0%',
                  top: '0%',
                  width: '79.91%',
                  height: '81.39%',
                }}
              >
                <div
                  className="w-[68.3%] h-[79.3%] flex-none"
                  style={{
                    transform: 'rotate(-25.6deg) scaleY(0.98) skewX(12.41deg)',
                  }}
                >
                  <img
                    src="/images/hero-vector-purple-left.svg"
                    alt=""
                    className="w-full h-full object-contain pointer-events-none"
                    draggable={false}
                  />
                </div>
              </div>

              {/* Soft Bottom-Left Ambient Purple Glow matching Figma node 1002:1034 (opacity 20%, blur 29px) */}
              <div
                aria-hidden="true"
                className="absolute pointer-events-none flex items-center justify-center z-[4]"
                style={{
                  left: '0%',
                  top: '54.39%',
                  width: '34.54%',
                  height: '45.61%',
                }}
              >
                <div
                  className="w-full h-full flex-none"
                  style={{ transform: 'rotate(-2.19deg)' }}
                >
                  <div className="w-[96%] h-[96%] bg-[#c693fd]/20 blur-[29px] rounded-full" />
                </div>
              </div>

              {/* Container: Photo & Top-Right Glow (Figma node 1002:1035) */}
              <div
                className="absolute flex items-center justify-center z-[5]"
                style={{
                  left: '17.67%',
                  top: '8.66%',
                  width: '70.30%',
                  height: '70.36%',
                }}
              >
                <div
                  className="relative w-full h-full flex items-center justify-center"
                  style={{ transform: 'rotate(-2.19deg)' }}
                >
                  {/* Ambient Glow Top Right matching Figma node 1002:1036 (opacity 30%, blur 29px) */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -top-[18%] -right-[12%] w-[58%] h-[72%] bg-[#e7bffe]/30 blur-[29px] rounded-full -z-10"
                  />

                  {/* Main Students Image with Refined Soft Purple Drop Shadow (Figma node 1002:1038) */}
                  <div
                    className="w-[104%] h-[90%] flex items-center justify-center flex-none"
                    style={{ transform: 'rotate(6.28deg)' }}
                  >
                    <div className="w-full h-full rounded-[28px] sm:rounded-[38px] lg:rounded-[51px] overflow-hidden shadow-[0px_18px_40px_-10px_rgba(58,4,83,0.18),0px_8px_20px_-4px_rgba(198,147,253,0.25)] bg-slate-100/50">
                      <img
                        src="/images/hero-students-figma.png"
                        alt={t('hero.imageAlt')}
                        className="w-full h-full object-cover object-center pointer-events-none rounded-[28px] sm:rounded-[38px] lg:rounded-[51px]"
                        loading="eager"
                        width={637}
                        height={425}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
