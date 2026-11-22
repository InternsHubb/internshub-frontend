import { useTranslation } from 'react-i18next'
import arrowRightBanner from '@/assets/internship/arrow-right-banner.svg'
import bannerBackground from '@/assets/internship/banner-background.svg'
import iconGradCap from '@/assets/internship/icon-grad-cap.svg'

interface PromoBannerProps {
  onStart: () => void
}

function PromoBanner({ onStart }: PromoBannerProps) {
  const { t } = useTranslation()

  return (
    <section
      aria-labelledby="promo-banner-heading"
      className="relative overflow-hidden rounded-[30px] bg-gradient-to-r from-[rgba(162,102,188,0.2)] to-[rgba(178,148,203,0.9)] reveal-on-scroll reveal-scale"
    >
      {/* Gradient + six wave vectors from the Figma banner export (text layers removed). */}
      <img
        alt=""
        aria-hidden="true"
        src={bannerBackground}
        className="pointer-events-none absolute inset-0 size-full object-cover"
      />

      <div className="relative flex min-h-[196px] flex-col items-start gap-6 px-6 py-8 md:flex-row md:items-center md:justify-between md:ps-[120px] md:pe-[60px] lg:ps-[174px] lg:pe-[110px]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-[23px]">
          <img alt="" src={iconGradCap} className="shrink-0 self-start sm:self-center" />
          <div className="flex max-w-[539px] flex-col gap-2 text-[17px] text-[#3a0353]">
            <h2 id="promo-banner-heading" className="leading-6 font-extrabold">
              {t('internshipPage.promo.title')}
            </h2>
            <p className="leading-7">{t('internshipPage.promo.description')}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onStart}
          className="flex h-12 shrink-0 items-center gap-1 rounded-full bg-[#5a198f] px-[15px] text-[15px] font-bold text-white drop-shadow-[0_0_8px_#3a0353] transition-colors hover:bg-[#3b0454] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:mt-[50px]"
        >
          {t('internshipPage.promo.cta')}
          <img alt="" src={arrowRightBanner} className="rtl:-scale-x-100" />
        </button>
      </div>
    </section>
  )
}

export default PromoBanner
