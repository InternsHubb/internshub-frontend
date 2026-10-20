import type { CSSProperties } from 'react'
import { useTranslation } from 'react-i18next'
import { ArrowRight, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'
import { revealDelay } from '@/lib/motion'
import heroBlobOrange from '@/assets/internship/hero-blob-orange.svg'
import heroBlobPurple from '@/assets/internship/hero-blob-purple.svg'
import heroBlobSand from '@/assets/internship/hero-blob-sand.svg'
import heroStudents from '@/assets/internship/hero-team.webp'

interface BlobShape {
  src: string
  // Bounding box inside the artwork, in % of the artwork size (from Figma).
  box: CSSProperties
  // Rotation/skew reproduced from Figma; cq units resolve against the bounding box.
  shape: CSSProperties
  // Ambient float cycle; blobs use different lengths so they drift out of sync.
  floatDuration: string
}

const BLOBS: ReadonlyArray<BlobShape> = [
  {
    src: heroBlobSand,
    box: { insetInlineStart: '32.47%', top: '6.2%', width: '67.54%', height: '69.29%' },
    shape: {
      height: 'hypot(-16.0071cqw, 84.4461cqh)',
      width: 'hypot(83.9929cqw, 15.5539cqh)',
      transform: 'rotate(8.35deg) skewX(-5.11deg)',
    },
    floatDuration: '11s',
  },
  {
    src: heroBlobOrange,
    box: { insetInlineStart: '25.13%', top: '0.59%', width: '58.25%', height: '60.07%' },
    shape: {
      height: 'hypot(0.958403cqw, 99.0734cqh)',
      width: 'hypot(99.0416cqw, -0.926566cqh)',
      transform: 'rotate(-0.43deg) skewX(0.27deg)',
    },
    floatDuration: '9s',
  },
  {
    src: heroBlobPurple,
    box: { insetInlineStart: '0%', top: '0%', width: '79.86%', height: '81.35%' },
    shape: {
      height: 'hypot(38.3701cqw, 62.4331cqh)',
      width: 'hypot(61.6299cqw, -37.5669cqh)',
      transform: 'rotate(-25.61deg) skewX(12.4deg)',
    },
    floatDuration: '13s',
  },
]

function HeroArtwork() {
  const { t } = useTranslation()

  return (
    <div className="relative aspect-[872/673] w-full">
      {BLOBS.map((blob, index) => (
        <div
          key={blob.src}
          aria-hidden="true"
          className="ih-enter-zoom absolute flex items-center justify-center"
          style={{ containerType: 'size', ...blob.box, ...revealDelay(150 + index * 120) }}
        >
          <div className="flex-none" style={blob.shape}>
            <img
              alt=""
              src={blob.src}
              className="ih-float block size-full max-w-none"
              style={{ '--ih-float-duration': blob.floatDuration } as CSSProperties}
            />
          </div>
        </div>
      ))}
      <div
        aria-hidden="true"
        className="absolute -end-[11%] -top-[15%] h-1/2 w-[39%] rounded-full bg-[#e7bffe] opacity-30 blur-[29px]"
      />
      <img
        src={heroStudents}
        alt={t('hero.imageAlt')}
        loading="eager"
        fetchPriority="high"
        decoding="async"
        className="ih-enter-zoom absolute start-[52.77%] top-[43.78%] h-[63.1%] w-[73.07%] -translate-x-1/2 -translate-y-1/2 rotate-[4deg] rounded-[24px] object-cover sm:rounded-[40px] xl:rounded-[51px] rtl:translate-x-1/2 shadow-[0px_18px_40px_-10px_rgba(58,4,83,0.18),0px_8px_20px_-4px_rgba(198,147,253,0.25)]"
        style={revealDelay(450)}
      />
    </div>
  )
}

export const Hero: React.FC = () => {
  const { t, i18n } = useTranslation()
  const isRtl = i18n.dir() === 'rtl'

  return (
    <section className="relative overflow-hidden pt-6 pb-14 lg:pt-10 lg:pb-20">
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

          {/* Right Column: Hero Visual with exact animation from internship page */}
          <div className="w-full lg:flex-1 relative flex justify-center lg:justify-end items-center py-0 lg:-mt-8 xl:-mt-12 lg:-ms-8 xl:-ms-16">
            <div className="relative w-full max-w-[620px] sm:max-w-[720px] lg:max-w-[820px] xl:max-w-[880px] 2xl:max-w-[920px]">
              <HeroArtwork />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
