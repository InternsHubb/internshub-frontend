import type { CSSProperties } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { revealDelay } from '@/lib/motion'
import arrowRightWhite from '../../assets/internship/arrow-right-white.svg'
import heroBadgeBolt from '../../assets/internship/hero-badge-bolt.svg'
import heroBlobOrange from '../../assets/internship/hero-blob-orange.svg'
import heroBlobPurple from '../../assets/internship/hero-blob-purple.svg'
import heroBlobSand from '../../assets/internship/hero-blob-sand.svg'
import heroTeam from '../../assets/internship/hero-team.png'

interface HeroProps {
  onStart: () => void
}

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
        src={heroTeam}
        alt={t('internshipPage.hero.imageAlt')}
        className="ih-enter-zoom absolute start-[52.77%] top-[43.78%] h-[63.1%] w-[73.07%] -translate-x-1/2 -translate-y-1/2 rotate-[4deg] rounded-[24px] object-cover sm:rounded-[40px] xl:rounded-[51px] rtl:translate-x-1/2"
        style={revealDelay(450)}
      />
    </div>
  )
}

// Below xl the text and artwork stack; from xl they sit side by side in a 5:7 grid inside the page
// container, so the text starts on the same edge as every section below the hero.
function Hero({ onStart }: HeroProps) {
  const { t } = useTranslation()

  return (
    <section
      aria-labelledby="internship-hero-heading"
      className="relative grid grid-cols-1 gap-12 pt-10 xl:grid-cols-[minmax(520px,5fr)_7fr] xl:items-center xl:gap-10 xl:py-12"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute start-[100px] top-[90px] hidden h-[296px] w-[290px] -rotate-2 rounded-full bg-[#c693fd] opacity-20 blur-[29px] lg:block"
      />

      <div className="relative z-10 flex flex-col gap-8">
        <div className="flex flex-col gap-6">
          <p
            className="ih-enter flex h-[42px] w-fit items-center gap-2 rounded-full bg-[#d2c1e1]/86 px-4 py-2 text-xs font-bold text-[#612394]"
            style={revealDelay(0)}
          >
            <img alt="" src={heroBadgeBolt} />
            {t('internshipPage.hero.badge')}
          </p>
          <h1
            id="internship-hero-heading"
            className="ih-enter text-[40px] leading-[48px] font-extrabold text-[#111827] sm:text-[52px] sm:leading-[64px] xl:text-[60px] xl:leading-[75px]"
            style={revealDelay(110)}
          >
            {t('internshipPage.hero.titleLine1')}
            <br />
            <Trans
              i18nKey="internshipPage.hero.titleLine2"
              components={{ accent: <span className="text-[#5a198f]" /> }}
            />
            <br />
            <span className="text-[#5a198f]">{t('internshipPage.hero.titleLine3')}</span>
          </h1>
          <p
            className="ih-enter max-w-[564px] text-base leading-[26px] font-medium text-[#4b5563] sm:text-lg sm:leading-[29px]"
            style={revealDelay(230)}
          >
            {t('internshipPage.hero.description')}
          </p>
        </div>
        <button
          type="button"
          onClick={onStart}
          className="ih-enter group flex w-fit items-center gap-3 rounded-full bg-[#3a0353] px-7 py-4 text-base leading-6 font-semibold text-white shadow-[0_10px_15px_-3px_rgba(224,191,254,0.75),0_4px_6px_-4px_#ddbffe] transition-[background-color,translate,box-shadow] duration-300 hover:-translate-y-0.5 hover:bg-[#5a198f] hover:shadow-[0_16px_24px_-6px_rgba(198,147,253,0.8),0_6px_10px_-6px_#ddbffe] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5a198f]"
          style={revealDelay(350)}
        >
          {t('internshipPage.hero.cta')}
          <img
            alt=""
            src={arrowRightWhite}
            className="transition-[translate] duration-300 group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1"
          />
        </button>
      </div>

      <div className="relative mx-auto w-full max-w-[640px] xl:max-w-none">
        <HeroArtwork />
      </div>
    </section>
  )
}

export default Hero
