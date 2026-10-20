import { useTranslation } from 'react-i18next'
import testimonialStar from '../../assets/internship/testimonial-star.svg'
import testimonialStarOutline from '../../assets/internship/testimonial-star-outline.svg'
import SectionHeading from './SectionHeading'
import { TESTIMONIALS } from './mockData'

const MAX_RATING = 5

// Matches the Figma order: unfilled stars come first, followed by the filled ones.
function getStarIcons(rating: number): ReadonlyArray<string> {
  const filled = Math.min(Math.max(Math.round(rating), 0), MAX_RATING)
  return [
    ...Array.from({ length: MAX_RATING - filled }, () => testimonialStarOutline),
    ...Array.from({ length: filled }, () => testimonialStar),
  ]
}

function Testimonials() {
  const { t } = useTranslation()

  return (
    <section aria-labelledby="testimonials-heading" className="flex flex-col gap-16">
      <SectionHeading
        id="testimonials-heading"
        eyebrow={t('internshipPage.testimonials.eyebrow')}
        title={t('internshipPage.testimonials.title')}
        className="reveal-on-scroll"
      >
        {t('internshipPage.testimonials.descriptionLine1')}
        <br className="hidden sm:block" /> {t('internshipPage.testimonials.descriptionLine2')}
      </SectionHeading>

      <ul className="mx-auto grid w-full max-w-[640px] grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-3 lg:items-end">
        {TESTIMONIALS.map((testimonial, idx) => {
          const delayClass =
            idx === 0
              ? 'reveal-delay-100'
              : idx === 1
              ? 'reveal-delay-200'
              : 'reveal-delay-300'
          return (
            <li
              key={testimonial.id}
              className={`flex min-h-[284px] flex-col justify-center gap-5 rounded-2xl bg-[rgba(224,175,255,0.4)] p-8 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-4px_rgba(0,0,0,0.1)] reveal-on-scroll ${delayClass}`}
            >
            <figure className="flex flex-col gap-5">
              <div className="flex items-center gap-1" role="img" aria-label={t('internshipPage.testimonials.rated', { rating: testimonial.rating })}
              >
                {getStarIcons(testimonial.rating).map((icon, index) => (
                  <img key={index} alt="" src={icon} className="my-1" />
                ))}
              </div>
              <blockquote className="text-base leading-[26px] font-medium text-[rgba(35,0,73,0.8)]">
                {t(`internshipPage.testimonials.items.${testimonial.id}.quote`)}
              </blockquote>
              <figcaption className="flex items-center gap-3 pt-1">
                <img
                  src={testimonial.avatar}
                  alt=""
                  className="size-12 rounded-full object-cover"
                  loading="lazy"
                />
                <span className="flex flex-col">
                  <span className="text-base leading-6 font-extrabold text-[#5a198f]">
                    {t(`internshipPage.testimonials.items.${testimonial.id}.name`)}
                  </span>
                  <span className="text-sm leading-5 font-medium text-[rgba(41,0,73,0.6)]">
                    {t(`internshipPage.testimonials.items.${testimonial.id}.role`)}
                  </span>
                </span>
              </figcaption>
            </figure>
          </li>
        )})}
      </ul>
    </section>
  )
}

export default Testimonials
