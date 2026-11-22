import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { COURSES_JOURNEY_STEPS, JOURNEY_STEPS, type JourneyStep, type StepperState } from '@/features/internships/data/internshipDashboard';
import { ROUTES } from '@/app/routes';
import { cn } from '@/shared/utils/cn';

// Internship journey header (Figma "Header" in the "3 months" frames, and with the extra
// "Courses" step in the "6 and 12 months" frames): done steps are green, the current step is
// the purple gradient with a lilac halo, later steps are outlined grey color. Steps are clickable
// to allow navigating between the stages.

const CIRCLE = 'relative z-10 flex size-[34px] items-center justify-center rounded-full border-[0.8px] text-[10px] leading-[15px]';
const HALO = 'shadow-[0_0_0_5px_#f2e8f8,0_8px_16px_rgba(58,3,83,0.18)]';

export function JourneyStepper({
  stepper,
  onStepClick,
}: {
  stepper: StepperState;
  onStepClick?: (step: JourneyStep) => void;
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const steps = stepper.withCourses ? COURSES_JOURNEY_STEPS : JOURNEY_STEPS;

  const handleStepClick = (step: JourneyStep) => {
    if (onStepClick) {
      onStepClick(step);
      return;
    }
    if (step === 'project') {
      navigate(ROUTES.dashboardProject);
    } else if (step === 'courses') {
      navigate(`${ROUTES.dashboardInternship}?step=courses`);
    } else {
      navigate(`${ROUTES.dashboardInternship}?step=${step}`);
    }
  };

  return (
    <nav
      aria-label={t('dashboard.journey.label')}
      className="rounded-[20px] border-[0.8px] border-[rgba(58,3,83,0.07)] bg-white/86 px-3 pb-3 pt-[15px] shadow-[0_8px_28px_rgba(34,2,60,0.06)] backdrop-blur-[16px]"
    >
      <ol className={cn('mx-auto grid', stepper.withCourses ? 'max-w-[620px] grid-cols-5' : 'max-w-[492px] grid-cols-4')}>
        {steps.map((step, index) => {
          const isDone = index < stepper.currentIndex;
          const isCurrent = index === stepper.currentIndex;
          const number = String(stepper.firstNumber + index).padStart(2, '0');
          const isLast = index === steps.length - 1;
          return (
            <li
              key={step}
              aria-current={isCurrent ? 'step' : undefined}
              onClick={() => handleStepClick(step)}
              className="group relative flex cursor-pointer select-none flex-col items-center gap-[7px] text-center transition-transform active:scale-95"
            >
              {!isLast && (
                <span aria-hidden="true" className="pointer-events-none absolute start-1/2 top-[16px] h-0.5 w-full bg-[#e8e2ec]" />
              )}
              <span
                className={cn(
                  CIRCLE,
                  'transition-all duration-200 group-hover:scale-110',
                  isDone && `border-[#13b531] bg-[#00c707] font-medium text-white ${HALO}`,
                  isCurrent && `border-[#3a0353] bg-[linear-gradient(127deg,rgba(106,42,138,0.92)_0%,rgba(59,4,84,0.96)_71.43%)] text-white ${HALO}`,
                  !isDone && !isCurrent && 'border-[#e6dfe9] bg-white text-[#aaa2ad] group-hover:border-[#3a0353] group-hover:text-[#3a0353]',
                )}
              >
                {number}
              </span>
              <span
                className={cn(
                  'max-w-[110px] text-[10px] leading-[15px] tracking-[0.1px] sm:max-w-none sm:whitespace-nowrap transition-colors duration-200',
                  isCurrent ? 'font-semibold text-black' : isDone ? 'text-[#030303]' : 'text-[#aaa2ad] group-hover:text-[#3a0353]',
                )}
              >
                {t(`dashboard.journey.${step}`)}
                {isDone && <span className="sr-only"> — {t('dashboard.journey.done')}</span>}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default JourneyStepper;
