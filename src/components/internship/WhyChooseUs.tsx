import stepLine1 from '../../assets/internship/step-line-1.svg'
import stepLine2 from '../../assets/internship/step-line-2.svg'
import stepLine3 from '../../assets/internship/step-line-3.svg'
import { PROGRAM_STEPS } from './mockData'

// Connectors between consecutive step numbers: solid after step 1, dashed afterwards.
const STEP_CONNECTORS: ReadonlyArray<string> = [stepLine1, stepLine2, stepLine3]

function WhyChooseUs() {
  return (
    <section
      aria-labelledby="why-choose-us-heading"
      className="relative overflow-hidden rounded-[30px] bg-white px-6 py-8 lg:flex lg:min-h-[196px] lg:items-center lg:gap-14 lg:px-[35px] lg:py-4"
    >
      <div className="relative flex shrink-0 flex-col gap-[22px] lg:w-[277px]">
        <h2 id="why-choose-us-heading" className="text-sm leading-5 font-bold tracking-[0.35px] text-[#5a198f]">
          WHY CHOOSE US
        </h2>
        <div className="flex flex-col gap-2">
          <p className="text-[17px] leading-6 font-extrabold text-[#111827]">Weekly Sprints Real tasks &amp; PRs</p>
          <p className="text-base leading-7 text-[#6b7280]">Follow clear path</p>
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -start-[72px] -top-[73px] h-[296px] w-[290px] -rotate-2 rounded-full bg-[#c693fd] opacity-20 blur-[29px]"
        />
      </div>

      <ol className="relative mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:mt-0 lg:flex-1 lg:grid-cols-4 lg:gap-0">
        {PROGRAM_STEPS.map((step, index) => {
          const connector = STEP_CONNECTORS[index]
          return (
            <li key={step.title} className="relative flex flex-col items-center text-center">
              <span className="flex size-[50px] items-center justify-center rounded-full bg-[#5a198f] text-[17px] font-extrabold text-white">
                {index + 1}
              </span>
              {connector && (
                <img
                  alt=""
                  src={connector}
                  className="absolute start-[calc(50%+25px)] top-6 hidden w-[calc(100%-50px)] lg:block rtl:-scale-x-100"
                />
              )}
              <h3 className="mt-2 text-sm leading-10 font-extrabold text-[#111827]">{step.title}</h3>
              <p className="max-w-[202px] text-[13px] leading-7 text-[#6b7280]">{step.description}</p>
            </li>
          )
        })}
      </ol>
    </section>
  )
}

export default WhyChooseUs
