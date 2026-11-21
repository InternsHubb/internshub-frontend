import stepLine1 from '@/assets/internship/step-line-1.svg'
import stepLine2 from '@/assets/internship/step-line-2.svg'
import stepLine3 from '@/assets/internship/step-line-3.svg'
import { useTranslation } from 'react-i18next'
import { revealDelay } from '@/shared/utils/motion'
import { PROGRAM_STEPS } from '@/features/landing/components/internship-showcase/mockData'

// Connectors between consecutive step numbers: solid after step 1, dashed afterwards.
const STEP_CONNECTORS: ReadonlyArray<string> = [stepLine1, stepLine2, stepLine3]

// Same scroll reveal as the landing LearningJourney card: the card fades up, the heading follows at
// 100ms and the steps at 100/200/300/400ms (useScrollReveal on InternshipPage adds .is-revealed).
// Class names here must stay static: a React-driven className change would drop .is-revealed again.
const STEP_DELAY_CLASSES: ReadonlyArray<string> = ['reveal-delay-100', 'reveal-delay-200', 'reveal-delay-300', 'reveal-delay-400']
const STEP_DELAY_GAP_MS = 100
// Each connector starts drawing once the step before it has mostly faded in.
const LINE_DELAY_OFFSET_MS = 300

function WhyChooseUs() {
  const { t } = useTranslation()

  return (
    <section
      aria-labelledby="why-choose-us-heading"
      className="reveal-on-scroll relative overflow-hidden rounded-[30px] bg-white px-6 py-8 transition-shadow duration-500 hover:shadow-[0_18px_40px_-18px_rgba(90,25,143,0.25)] lg:flex lg:min-h-[196px] lg:items-center lg:gap-14 lg:px-[35px] lg:py-4"
    >
      <div className="reveal-on-scroll reveal-delay-100 relative flex shrink-0 flex-col gap-[22px] lg:w-[277px]">
        <h2 id="why-choose-us-heading" className="text-sm leading-5 font-bold tracking-[0.35px] text-[#5a198f]">
          {t('internshipPage.whyChooseUs.eyebrow')}
        </h2>
        <div className="flex flex-col gap-2">
          <p className="text-[17px] leading-6 font-extrabold text-[#111827]">{t('internshipPage.whyChooseUs.title')}</p>
          <p className="text-base leading-7 text-[#6b7280]">{t('internshipPage.whyChooseUs.subtitle')}</p>
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -start-[72px] -top-[73px] h-[296px] w-[290px] -rotate-2 rounded-full bg-[#c693fd] opacity-20 blur-[29px]"
        />
      </div>

      <ol className="relative mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:mt-0 lg:flex-1 lg:grid-cols-4 lg:gap-0">
        {PROGRAM_STEPS.map((step, index) => {
          const connector = STEP_CONNECTORS[index]
          const lineDelay = (index + 1) * STEP_DELAY_GAP_MS + LINE_DELAY_OFFSET_MS
          return (
            <li
              key={step.id}
              className={`reveal-on-scroll ${STEP_DELAY_CLASSES[index]} group relative flex flex-col items-center text-center`}
            >
              <span className="flex size-[50px] items-center justify-center rounded-full bg-[#5a198f] text-[17px] font-extrabold text-white transition-[scale,box-shadow] duration-300 group-hover:scale-110 group-hover:shadow-[0_8px_20px_-4px_rgba(90,25,143,0.45)]">
                {index + 1}
              </span>
              {connector && (
                <img
                  alt=""
                  src={connector}
                  className="ih-reveal-line absolute start-[calc(50%+25px)] top-6 hidden w-[calc(100%-50px)] lg:block rtl:-scale-x-100"
                  style={revealDelay(lineDelay)}
                />
              )}
              <h3 className="mt-2 text-sm leading-10 font-extrabold text-[#111827] transition-colors duration-300 group-hover:text-[#5a198f]">
                {t(`internshipPage.steps.${step.id}.title`)}
              </h3>
              <p className="max-w-[202px] text-[13px] leading-7 text-[#6b7280]">
                {t(`internshipPage.steps.${step.id}.description`)}
              </p>
            </li>
          )
        })}
      </ol>
    </section>
  )
}

export default WhyChooseUs
