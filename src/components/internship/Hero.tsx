import type { CSSProperties } from 'react'
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
  },
  {
    src: heroBlobOrange,
    box: { insetInlineStart: '25.13%', top: '0.59%', width: '58.25%', height: '60.07%' },
    shape: {
      height: 'hypot(0.958403cqw, 99.0734cqh)',
      width: 'hypot(99.0416cqw, -0.926566cqh)',
      transform: 'rotate(-0.43deg) skewX(0.27deg)',
    },
  },
  {
    src: heroBlobPurple,
    box: { insetInlineStart: '0%', top: '0%', width: '79.86%', height: '81.35%' },
    shape: {
      height: 'hypot(38.3701cqw, 62.4331cqh)',
      width: 'hypot(61.6299cqw, -37.5669cqh)',
      transform: 'rotate(-25.61deg) skewX(12.4deg)',
    },
  },
]

function HeroArtwork() {
  return (
    <div className="relative aspect-[872/673] w-full">
      {BLOBS.map((blob) => (
        <div
          key={blob.src}
          aria-hidden="true"
          className="absolute flex items-center justify-center"
          style={{ containerType: 'size', ...blob.box }}
        >
          <div className="flex-none" style={blob.shape}>
            <img alt="" src={blob.src} className="block size-full max-w-none" />
          </div>
        </div>
      ))}
      <div
        aria-hidden="true"
        className="absolute -end-[11%] -top-[15%] h-1/2 w-[39%] rounded-full bg-[#e7bffe] opacity-30 blur-[29px]"
      />
      <img
        src={heroTeam}
        alt="Four interns collaborating around a laptop"
        className="absolute start-[52.77%] top-[43.78%] h-[63.1%] w-[73.07%] -translate-x-1/2 -translate-y-1/2 rotate-[4deg] rounded-[24px] object-cover sm:rounded-[40px] xl:rounded-[51px] rtl:translate-x-1/2"
      />
    </div>
  )
}

function Hero({ onStart }: HeroProps) {
  return (
    <section aria-labelledby="internship-hero-heading" className="relative mx-auto max-w-[1440px] xl:min-h-[681px]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute start-[213px] top-[112px] hidden h-[296px] w-[290px] -rotate-2 rounded-full bg-[#c693fd] opacity-20 blur-[29px] lg:block"
      />

      <div className="relative z-10 flex flex-col gap-8 px-4 pt-10 sm:px-10 xl:w-[675px] xl:ps-[111px] xl:pe-0 xl:pt-[126px]">
        <div className="flex flex-col gap-6">
          <p className="flex h-[42px] w-fit items-center gap-2 rounded-full bg-[#d2c1e1]/86 px-4 py-2 text-xs font-bold text-[#612394]">
            <img alt="" src={heroBadgeBolt} />
            INTERNSHIP PROGRAM
          </p>
          <h1
            id="internship-hero-heading"
            className="text-[40px] leading-[48px] font-extrabold text-[#111827] sm:text-[52px] sm:leading-[64px] xl:text-[60px] xl:leading-[75px]"
          >
            Real Projects.
            <br />
            Real <span className="text-[#5a198f]">Teams.</span>
            <br />
            <span className="text-[#5a198f]">Real Experience.</span>
          </h1>
          <p className="max-w-[564px] text-base xl:w-[564px] leading-[26px] font-medium text-[#4b5563] sm:text-lg sm:leading-[29px]">
            Join an Agile squad, work on real projects, and gain hands-on experience with the guidance of a Senior
            Team Leader. Build your skills, collaborate with your team, and prepare for your career.
          </p>
        </div>
        <button
          type="button"
          onClick={onStart}
          className="flex w-fit items-center gap-3 rounded-full bg-[#3a0353] px-7 py-4 text-base leading-6 font-semibold text-white shadow-[0_10px_15px_-3px_rgba(224,191,254,0.75),0_4px_6px_-4px_#ddbffe] transition-colors hover:bg-[#5a198f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5a198f]"
        >
          Start Now
          <img alt="" src={arrowRightWhite} className="rtl:-scale-x-100" />
        </button>
      </div>

      <div className="relative mx-auto mt-12 w-full max-w-[640px] px-4 xl:absolute xl:start-[42.7%] xl:top-[38px] xl:mt-0 xl:w-[60.5%] xl:max-w-none xl:px-0">
        <HeroArtwork />
      </div>
    </section>
  )
}

export default Hero
