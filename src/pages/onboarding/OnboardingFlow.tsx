import React, { useEffect, useRef, useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { formatPackagePrice, PACKAGES } from '@/constants/packages';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/hooks/useAuth';
import { usePackagePrices } from '@/hooks/usePackagePrices';
import { apiErrorKey } from '@/lib/api/errors';
import { OnboardingHeader } from './OnboardingHeader';
import { PackageSelection } from './PackageSelection';
import { ProfileStep } from './ProfileStep';
import { CV_STEP, PACKAGE_FEATURE_KEYS, PACKAGES_BY_VALUE, PATH_STEP, PROFILE_STEP, type PackageValue, type TrackId } from './packages';
import { TrackSelection } from './TrackSelection';
import { CvUploadStep } from './CvUploadStep';
import { PaymentPanel } from './PaymentPanel';
import { hasPendingCheckout, usePaymentCheckout } from './usePaymentCheckout';
import { useMyCv } from './useMyCv';
import { EnrollmentChoiceError, useEnrollmentChoice } from './useEnrollmentChoice';
import { VerifyAccountStep } from './VerifyAccountStep';
import { InterviewResultFlow } from './interview/InterviewResultFlow';
import { InterviewSetupFlow } from './interview/InterviewSetupFlow';
import { interviewTypeFor, SAMPLE_RESUME } from './interview/mockInterview';
import { INITIAL_INTERVIEW_PROGRESS } from './interview/types';
import type { InterviewProgress, InterviewProgressPatch } from './interview/types';
import clockMutedIcon from '../../assets/onboarding/clock-muted.svg';
import shieldWhiteIcon from '../../assets/onboarding/shield-white.svg';
import uploadMutedIcon from '../../assets/onboarding/upload-muted.svg';
import arrowRightWhiteIcon from '../../assets/onboarding/arrow-right-white.svg';
import checkWhiteLgIcon from '../../assets/onboarding/check-white-lg.svg';
import lockPurpleSmIcon from '../../assets/onboarding/lock-purple-sm.svg';
import shieldPurpleSmIcon from '../../assets/onboarding/shield-purple-sm.svg';
import shieldWhiteLgIcon from '../../assets/onboarding/shield-white-lg.svg';

type ResultState = 'assigned' | 'pending' | 'incomplete';

// Step 08 result states, one per Figma frame (Level Assigned / Human Review / Attempt Incomplete)
const RESULT_STATES: Record<ResultState, {
  tab: string;
  panelBg: string;
  tileBg: string;
  tileShadow: string;
  icon: string;
  badge: string;
  badgeClass: string;
  title: string;
  description: string;
  action: string;
}> = {
  assigned: {
    tab: 'Level assigned',
    panelBg: 'bg-[linear-gradient(139deg,#EAF8F0_6%,#F9FDFB_94%)]',
    tileBg: 'bg-[linear-gradient(145deg,#299766_6%,#16794A_94%)]',
    tileShadow: 'drop-shadow-[0_15px_17px_rgba(22,121,74,0.2)]',
    icon: checkWhiteLgIcon,
    badge: 'TECHNICAL INTERVIEW',
    badgeClass: 'bg-[#EAF8F0] text-[#16794A]',
    title: 'Recommended level: [Assessment output]',
    description: 'Your level will appear here after the assessment and review process completes.',
    action: 'Continue to Squad'
  },
  pending: {
    tab: 'Pending review',
    panelBg: 'bg-[linear-gradient(141deg,#EFEDF1_6%,#FBFAFB_94%)]',
    tileBg: 'bg-[linear-gradient(145deg,#8D8491_6%,#625A66_94%)]',
    tileShadow: 'drop-shadow-[0_15px_17px_rgba(98,90,102,0.16)]',
    icon: shieldWhiteLgIcon,
    badge: 'HUMAN REVIEW',
    badgeClass: 'bg-[#F1EEF2] text-[#685F6D]',
    title: 'Your result is being reviewed',
    description: 'We’ll show the next-step timeline when reviewer data is available. No result is assumed.',
    action: 'View Enrollment Summary'
  },
  incomplete: {
    tab: 'Incomplete',
    panelBg: 'bg-[linear-gradient(141deg,#FCE9E7_6%,#FFF9F8_94%)]',
    tileBg: 'bg-[linear-gradient(145deg,#D75349_6%,#B42318_94%)]',
    tileShadow: 'drop-shadow-[0_15px_17px_rgba(180,35,24,0.18)]',
    icon: shieldWhiteLgIcon,
    badge: 'ATTEMPT INCOMPLETE',
    badgeClass: 'bg-[#FEF0EF] text-[#B42318]',
    title: 'Your interview needs another step',
    description: 'Resume eligibility, 48-hour retake timing, and remaining attempts will be calculated from actual attempt data.',
    action: 'View Attempt Details'
  }
};

const RESULT_STATE_ORDER: ResultState[] = ['assigned', 'pending', 'incomplete'];

type OnboardingFormData = {
  // No package or track until the learner picks them on the Path step; later steps require both.
  selectedPackage: PackageValue | null;
  selectedTrack: TrackId | null;
  selectedMentor: string;
};

export default function OnboardingFlow() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  // Step 01 counts as done only when the backend reports email and phone as confirmed, not when
  // the user has moved past it. National ID has no backend check, so it is not part of this.
  const isAccountVerified = user?.emailConfirmed === true && user.phoneNumberConfirmed === true;
  // Coming back from Paymob reopens the Payment step, where the result is checked with the backend.
  const [currentStep, setCurrentStep] = useState(() => (hasPendingCheckout() ? 5 : 1));
  const [viewMode, setViewMode] = useState<'onboarding' | 'cv-review'>('onboarding');
  const [resultState, setResultState] = useState<ResultState>('assigned');
  const activeResult = RESULT_STATES[resultState];
  const [formData, setFormData] = useState<OnboardingFormData>({
    selectedPackage: null,
    selectedTrack: null,
    selectedMentor: 'Amina M.'
  });
  const [showPackageError, setShowPackageError] = useState(false);
  const [showTrackError, setShowTrackError] = useState(false);
  const pathForm = useRef<HTMLFormElement>(null);
  const [interview, setInterview] = useState<InterviewProgress>(INITIAL_INTERVIEW_PROGRESS);
  const updateInterview = (patch: InterviewProgressPatch) => setInterview((current) => ({ ...current, ...patch }));
  const interviewType = interviewTypeFor(formData.selectedPackage ?? '');
  const selectedPackage = formData.selectedPackage ? PACKAGES_BY_VALUE[formData.selectedPackage] : null;
  const packageName = selectedPackage ? t(`onboarding.path.packages.${selectedPackage.key}.name`) : '';
  // Shown prices are the backend's package prices; the amount charged is the backend invoice.
  const { prices: packagePrices } = usePackagePrices();
  const packagePrice = selectedPackage
    ? t('onboarding.path.priceAmount', { value: formatPackagePrice(packagePrices, selectedPackage.id, i18n.language) })
    : '';
  const trackName = formData.selectedTrack ? t(`onboarding.path.tracks.${formData.selectedTrack}.name`) : '';
  const isPathComplete = Boolean(formData.selectedPackage && formData.selectedTrack);
  const enrollmentChoice = useEnrollmentChoice();
  const { savedChoice } = enrollmentChoice;
  const [isPathSaving, setIsPathSaving] = useState(false);
  const [pathErrorKey, setPathErrorKey] = useState<string | null>(null);
  // Path is done only once the cards on screen match the enrollment saved on the backend.
  const isPathSaved = Boolean(
    savedChoice && savedChoice.packageValue === formData.selectedPackage && savedChoice.trackId === formData.selectedTrack
  );

  const payment = usePaymentCheckout({ enrollment: enrollmentChoice.enrollment, onPaid: enrollmentChoice.refresh });
  const myCv = useMyCv();
  // The CV counts once the backend holds one whose parsing hasn't failed.
  const isCvReady = myCv.cv !== null && myCv.cv.parseStatus !== 'Failed';

  // An enrollment chosen earlier preselects its cards, once, unless the learner already picked some.
  const appliedSavedChoice = useRef(false);
  useEffect(() => {
    if (!savedChoice || appliedSavedChoice.current) return;
    appliedSavedChoice.current = true;
    setFormData((current) => current.selectedPackage || current.selectedTrack
      ? current
      : { ...current, selectedPackage: savedChoice.packageValue, selectedTrack: savedChoice.trackId });
  }, [savedChoice]);

  // Every step after Path needs a package and a track: without both the learner is kept on (or
  // sent back to) Path with the missing choice flagged, whether they used Confirm, Enter or the
  // progress bar.
  const goToStep = (step: number) => {
    // Steps after Profile also wait for the backend to stop listing CompleteProfile as missing.
    if (step > PROFILE_STEP && user?.missingOnboardingSteps?.includes('CompleteProfile')) {
      setCurrentStep(PROFILE_STEP);
      return;
    }
    if (step > PATH_STEP && !isPathComplete) {
      setCurrentStep(PATH_STEP);
      setShowPackageError(!formData.selectedPackage);
      setShowTrackError(!formData.selectedTrack);
      // Focus the first missing choice once the Path step has rendered.
      const missing = formData.selectedPackage ? 'track' : 'package';
      requestAnimationFrame(() => pathForm.current?.querySelector<HTMLInputElement>(`input[name="${missing}"]`)?.focus());
      return;
    }
    // ...and the choice must be saved as the learner's enrollment (Confirm does that).
    if (step > PATH_STEP && !isPathSaved) {
      setCurrentStep(PATH_STEP);
      return;
    }
    // ...and a CV uploaded to the backend.
    if (step > CV_STEP && !isCvReady) {
      setCurrentStep(CV_STEP);
      return;
    }
    setCurrentStep(step);
  };

  const selectPackage = (value: PackageValue) => {
    setFormData((current) => ({ ...current, selectedPackage: value }));
    setShowPackageError(false);
    setPathErrorKey(null);
  };

  const selectTrack = (value: TrackId) => {
    setFormData((current) => ({ ...current, selectedTrack: value }));
    setShowTrackError(false);
    setPathErrorKey(null);
  };

  // Saves the choice (POST or PUT /api/enrollments) before moving on; nothing advances on failure.
  const confirmPath = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isPathSaving) return;
    if (!formData.selectedPackage || !formData.selectedTrack) {
      goToStep(PATH_STEP + 1);
      return;
    }
    setPathErrorKey(null);
    setIsPathSaving(true);
    try {
      await enrollmentChoice.save({ packageValue: formData.selectedPackage, trackId: formData.selectedTrack });
    } catch (error) {
      setPathErrorKey(error instanceof EnrollmentChoiceError ? error.messageKey : apiErrorKey(error));
      setIsPathSaving(false);
      return;
    }
    setIsPathSaving(false);
    setCurrentStep(PATH_STEP + 1);
  };
  // Holds the navbar, progress bar and step content (not the footer); the interview's Start
  // Interview click puts this in fullscreen.
  const interviewPage = useRef<HTMLDivElement>(null);

  // Page chrome per Figma frame: Get Ready keeps the onboarding layout; the interview screens
  // (Overview → questions) and the outcome screens use the profile header and have no footer or
  // step label; only the Result outcome keeps the progress bar.
  const onInterviewScreens = currentStep === 6 && interview.screen !== 'setup';
  const onOutcomeScreens = currentStep === 7 && interview.outcome !== null;
  const usesProfileLayout = onInterviewScreens || onOutcomeScreens;
  const showProgressBar = !onOutcomeScreens || interview.outcome === 'result';

  // The interview API isn't available yet, so finishing shows the sample outcome for this type.
  const finishInterview = () => {
    updateInterview({
      screen: 'setup',
      questionIndex: 0,
      phase: 'answering',
      outcome: interviewType === 'orientation' ? 'orientation' : 'result',
    });
    setCurrentStep(7);
  };

  // Resuming repeats the device check, then continues from the interrupted (sample) question.
  const resumeInterview = () => {
    updateInterview({ screen: 'device-check', questionIndex: SAMPLE_RESUME.questionIndex, phase: 'answering', outcome: null });
    setCurrentStep(6);
  };

  // "Account" (index 0) is done before onboarding starts and is shown for the Figma numbering
  // only; internal step numbers start at Verify = 1, so the displayed number is step + 1.
  const stepsMeta = [
    { num: '01', title: 'Account' },
    { num: '02', title: 'Verify' },
    { num: '03', title: 'Profile' },
    { num: '04', title: 'Path' },
    { num: '05', title: 'CV' },
    { num: '06', title: 'Payment' },
    { num: '07', title: 'Setup' },
    { num: '08', title: 'Result' },
    { num: '09', title: 'Squad' },
    { num: '10', title: 'Mentorship' }
  ];

  // CV Review Screen View
  if (viewMode === 'cv-review') {
    return (
      <div className="min-h-screen flex flex-col justify-between bg-[#F8F6FA] bg-[radial-gradient(circle_at_8%_2%,rgba(139,93,176,0.12),transparent_26%),radial-gradient(circle_at_96%_20%,rgba(221,111,13,0.06),transparent_25%)] text-slate-900 font-['Plus_Jakarta_Sans',sans-serif] overflow-x-hidden">
        <header className="sticky top-0 z-50 flex items-center justify-between gap-4 px-4 md:px-[72px] h-[72px] bg-white/92 border-b border-[#E8E2EC]">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-[38px] h-[38px] bg-gradient-to-br from-[#5C1D87] to-[#3A0353] rounded-[13px_13px_13px_4px] flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-sm">ih</span>
              </div>
              <span className="font-bold text-xl text-[#111827]">Interns<span className="text-[#4C0585]">Hub</span></span>
              <span className="bg-[#F7F0FB] text-[#5C1D87] text-[10px] font-bold px-2.5 py-1 rounded-full">EDTECH</span>
            </div>
            <span className="text-[9px] font-normal tracking-[1.08px] text-[#6B7280] pl-2 border-l border-[#E8E2EC]">CV REVIEW</span>
          </div>
          <button onClick={() => setViewMode('onboarding')} className="px-4 py-2 bg-white border border-[#E8E2EC] text-[#5C1D87] text-xs font-normal rounded-[10px] hover:bg-slate-50">
            Exit preview
          </button>
        </header>

        <main className="flex-grow flex justify-center px-4 py-12">
          <div className="w-full max-w-[1146px] min-w-0 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
              <div className="space-y-3">
                <span className="inline-block px-3 py-1 bg-[#FFF7E6] text-[#9A5700] text-[9px] font-bold rounded-full tracking-[0.72px]">ILLUSTRATIVE EXTRACTION PREVIEW</span>
                <h1 className="text-[47px] font-extrabold text-[#21062E] tracking-[-2.115px]">Review your information</h1>
                <p className="text-xs text-[#6B7280]">Check the information extracted from your CV and correct anything that needs attention.</p>
              </div>
              <div className="bg-white p-3.5 border border-[#E8E2EC] rounded-[15px] shadow-sm flex items-center gap-3 w-full max-w-[300px]">
                <div className="w-9 h-9 bg-[#F3E9FA] text-[#5C1D87] rounded-[9px] flex items-center justify-center text-xs font-bold">PDF</div>
                <div className="flex-grow">
                  <h4 className="text-[10px] text-[#111827]">sample-cv.pdf</h4>
                  <p className="text-[8px] text-[#6B7280]">Illustrative file · not user data</p>
                </div>
                <span className="px-2.5 py-1 bg-[#EAF8F0] text-[#16794A] text-[9px] font-bold rounded-full">Parsed</span>
              </div>
            </div>

            <div className="bg-[#FBF7FE] p-4 rounded-[14px] border border-[#4C0585]/10 flex items-start gap-3">
              <div className="w-[22px] h-[22px] rounded-full border border-[#3A0353] flex items-center justify-center text-[#3A0353] text-xs font-serif italic">i</div>
              <div className="text-xs text-[#3A0353]">
                <p className="font-bold">Sample content only</p>
                <p className="text-[11px] mt-0.5">The information below demonstrates the review experience. It is not presented as data from a real user.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
              <div className="bg-white p-3 border border-[#E8E2EC] rounded-[18px] shadow-sm space-y-1">
                {[{ id: '01', title: 'Personal information', active: true }, { id: '02', title: 'Education', active: false }, { id: '03', title: 'Skills', active: false }, { id: '04', title: 'Projects', active: false }, { id: '05', title: 'Experience', active: false }].map((nav) => (
                  <div key={nav.id} className={`flex items-center gap-3 p-3 rounded-[10px] text-xs ${nav.active ? 'bg-[#F3E9FA] text-[#3A0353] font-bold' : 'text-[#6B7280]'}`}>
                    <span className={`w-6 h-6 rounded-[8px] flex items-center justify-center text-[8px] ${nav.active ? 'bg-[#3A0353] text-white' : 'bg-[#F2EEF4]'}`}>{nav.id}</span>
                    <span>{nav.title}</span>
                  </div>
                ))}
              </div>

              <div className="md:col-span-3 space-y-4">
                <div className="bg-white p-6 border border-[#3A0353]/10 rounded-[19px] shadow-xs space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2"><span className="text-[9px] text-[#DD6F0D]">01</span><h3 className="text-[15px] font-normal text-[#111827]">Personal information</h3></div>
                    <button className="px-3 py-1 bg-white border border-[#DACDE1] text-[#5C1D87] text-[8px] font-bold rounded-[9px]">Edit</button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="p-3.5 bg-[#FAF8FB] rounded-[11px]"><span className="text-[7px] text-[#8B5DB0] tracking-[0.7px] uppercase block">FULL NAME</span><p className="text-[10px] text-[#111827] mt-1">Sample Student</p></div>
                    <div className="p-3.5 bg-[#FAF8FB] rounded-[11px]"><span className="text-[7px] text-[#8B5DB0] tracking-[0.7px] uppercase block">EMAIL</span><p className="text-[10px] text-[#111827] mt-1">sample@example.com</p></div>
                    <div className="p-3.5 bg-[#FAF8FB] rounded-[11px]"><span className="text-[7px] text-[#8B5DB0] tracking-[0.7px] uppercase block">PHONE</span><p className="text-[10px] text-[#111827] mt-1">+20 ••• ••• 4821</p></div>
                    <div className="p-3.5 bg-[#FAF8FB] rounded-[11px]"><span className="text-[7px] text-[#8B5DB0] tracking-[0.7px] uppercase block">LOCATION</span><p className="text-[10px] text-[#111827] mt-1">Not extracted</p></div>
                  </div>
                </div>

                <div className="bg-white p-6 border border-[#3A0353]/10 rounded-[19px] shadow-xs space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2"><span className="text-[9px] text-[#DD6F0D]">02</span><h3 className="text-[15px] font-normal text-[#111827]">Education</h3></div>
                    <button className="px-3 py-1 bg-white border border-[#DACDE1] text-[#5C1D87] text-[8px] font-bold rounded-[9px]">Edit</button>
                  </div>
                  <div className="p-3.5 bg-[#FAF9FB] border border-[#E8E2EC] rounded-[12px] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-[38px] h-[38px] bg-[#3A0353] text-white rounded-[11px] flex items-center justify-center text-[8px]">ED</div>
                      <div><h4 className="text-[10px] text-[#111827]">Sample degree title</h4><p className="text-[8px] text-[#6B7280]">Sample institution · Graduation year unavailable</p></div>
                    </div>
                    <span className="px-3 py-1 bg-[#FFF7E6] text-[#9A5700] text-[9px] font-bold rounded-full">REVIEW NEEDED</span>
                  </div>
                </div>

                <div className="bg-white p-6 border border-[#3A0353]/10 rounded-[19px] shadow-xs space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2"><span className="text-[9px] text-[#DD6F0D]">03</span><h3 className="text-[15px] font-normal text-[#111827]">Skills</h3></div>
                    <button className="px-3 py-1 bg-white border border-[#DACDE1] text-[#5C1D87] text-[8px] font-bold rounded-[9px]">Edit</button>
                  </div>
                  <div className="flex gap-2">{['React', 'JavaScript', 'HTML', 'CSS'].map(skill => (<span key={skill} className="px-3 py-1.5 bg-[#F3E9FA] text-[#5C1D87] text-[8px] rounded-[8px]">{skill}</span>))}</div>
                </div>

                <div className="bg-white p-6 border border-[#3A0353]/10 rounded-[19px] shadow-xs space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2"><span className="text-[9px] text-[#DD6F0D]">04</span><h3 className="text-[15px] font-normal text-[#111827]">Projects</h3></div>
                    <button className="px-3 py-1 bg-white border border-[#DACDE1] text-[#5C1D87] text-[8px] font-bold rounded-[9px]">Edit</button>
                  </div>
                  <div className="p-3.5 bg-[#FAF9FB] border border-[#E8E2EC] rounded-[12px] flex items-center gap-3">
                    <div className="w-[38px] h-[38px] bg-[#3A0353] text-white rounded-[11px] flex items-center justify-center text-[8px]">PR</div>
                    <div><h4 className="text-[10px] text-[#111827]">Illustrative portfolio project</h4><p className="text-[8px] text-[#6B7280]">Project description will use extracted CV content</p></div>
                  </div>
                </div>

                <div className="bg-white p-6 border border-[#3A0353]/10 rounded-[19px] shadow-xs space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2"><span className="text-[9px] text-[#DD6F0D]">05</span><h3 className="text-[15px] font-normal text-[#111827]">Experience</h3></div>
                    <button className="px-3 py-1 bg-white border border-[#DACDE1] text-[#5C1D87] text-[8px] font-bold rounded-[9px]">Add manually</button>
                  </div>
                  <div className="p-3.5 bg-[#FAF9FB] rounded-[12px] flex items-center gap-3">
                    <img src={uploadMutedIcon} alt="" aria-hidden="true" width={20} height={20} />
                    <div><h4 className="text-[10px] text-[#111827]">No experience information extracted</h4><p className="text-[8px] text-[#6B7280]">You can add it manually or continue if this section does not apply.</p></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap justify-end gap-3 pt-6">
              <button className="px-6 py-3 bg-white border border-[#CCB8D8] text-[#3A0353] font-bold text-xs rounded-[13px]">Re-upload CV</button>
              <button onClick={() => setViewMode('onboarding')} className="px-7 py-3 bg-gradient-to-r from-[#4C0585] to-[#3A0353] text-white font-bold text-xs rounded-[13px] shadow">Confirm and continue →</button>
            </div>
          </div>
        </main>

        <footer className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 px-4 md:px-[72px] py-8 md:py-0 md:h-[130px] bg-gradient-to-tr from-[#22023C] via-[#22023C] to-[#8B5DB0]/30 text-white">
          <div className="flex flex-wrap items-center gap-3">
            <div className="w-[38px] h-[38px] bg-gradient-to-br from-[#5C1D87] to-[#3A0353] rounded-[13px_13px_13px_4px] flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-sm">ih</span>
            </div>
            <span className="font-bold text-xl text-white">Interns<span className="text-[#4C0585]">Hub</span></span>
            <span className="text-[11px] text-[#D7C8DF] pl-3 border-l border-white/20">From Student to a Tech Career.</span>
          </div>
          <span className="text-[9px] text-[#9F8DAC]">Modern Onboarding v6.0 · Interactive product demo</span>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#F8F6FA] bg-[radial-gradient(circle_at_8%_2%,rgba(139,93,176,0.12),transparent_26%),radial-gradient(circle_at_96%_20%,rgba(221,111,13,0.06),transparent_25%)] text-slate-900 font-['Plus_Jakarta_Sans',sans-serif] overflow-x-hidden">
      <div
        ref={interviewPage}
        className="flex-grow flex flex-col [&:fullscreen]:overflow-y-auto [&:fullscreen]:bg-[#F8F6FA]"
      >
      <OnboardingHeader variant={usesProfileLayout ? 'profile' : 'brand'} />

      {/* Progress Navigation Bar */}
      {showProgressBar && (
      <div className="w-full flex justify-center pt-[18px] px-4">
        <div className="w-full max-w-[1120px] h-[85.6px] bg-white/86 border border-[#3A0353]/10 shadow-[0_8px_28px_rgba(34,2,60,0.06)] backdrop-blur-md rounded-[20px] flex items-center justify-between px-4 md:px-8 relative overflow-x-auto">
          
          {stepsMeta.map((s, index) => {
            const stepNumber = index;
            const isAccountStep = stepNumber === 0;
            const isCompleted = isAccountStep || (stepNumber < currentStep && (stepNumber !== 1 || isAccountVerified));
            const isCurrent = stepNumber === currentStep;

            return (
              <React.Fragment key={s.num}>
                <button
                  disabled={isAccountStep}
                  onClick={() => goToStep(stepNumber)}
                  className="flex shrink-0 flex-col items-center gap-[7px] focus:outline-none transition group z-10"
                >
                  <div className={`w-[34px] h-[34px] rounded-full flex items-center justify-center text-[10px] transition ${
                    isCompleted ? 'bg-[#8B5DB0] text-white' :
                    isCurrent ? 'bg-gradient-to-br from-[#5C1D87] to-[#3A0353] text-white shadow-[0_0_0_5px_#F2E8F8,0_8px_16px_rgba(58,3,83,0.18)]' :
                    'bg-white border border-[#E6DFE9] text-[#AAA2AD]'
                  }`}>
                    {isCompleted ? '✓' : s.num}
                  </div>
                  <span className={`text-[10px] tracking-[0.1px] ${isCurrent ? 'text-[#3A0353]' : isCompleted ? 'text-[#5C1D87]' : 'text-[#AAA2AD]'}`}>{s.title}</span>
                </button>

                {index < stepsMeta.length - 1 && (
                  <div className={`flex-grow min-w-3 h-[2px] mx-2 transition-colors ${
                    stepNumber < currentStep ? 'bg-[#8B5DB0]' : 'bg-[#E8E2EC]'
                  }`} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
      )}

      {/* Main Content Area */}
      <main className="flex-grow flex justify-center px-4 md:px-6 pt-10 md:pt-[72px] pb-16 md:pb-[100px]">
        <div className="w-full max-w-[1240px] min-w-0">

          {!usesProfileLayout && (
          <div className="inline-flex items-center px-3 py-1.5 bg-[#FFF3E8] rounded-[9px] mb-3">
            <span className="text-[11px] font-bold text-[#DD6F0D] tracking-[1.32px]">
              STEP {String(currentStep + 1).padStart(2, '0')} · INTERNSHUB ONBOARDING
            </span>
          </div>
          )}

          {/* STEP 1: Verify */}
          {currentStep === 1 && (
            // Step 01 has no earlier step, and the sign-in pages replace their history entry, so
            // "back" goes to the home page; the user stays signed in.
            <VerifyAccountStep onBack={() => navigate(ROUTES.home)} onContinue={() => setCurrentStep(2)} />
          )}

          {/* STEP 2: Profile */}
          {currentStep === 2 && (
            // Moves on to Path only after PUT /api/me/profile succeeds and GET /api/me confirms it.
            <ProfileStep onBack={() => setCurrentStep(PROFILE_STEP - 1)} onContinue={() => setCurrentStep(PATH_STEP)} />
          )}

          {/* STEP 3: Path */}
          {currentStep === 3 && (
            // A form so Enter on a package (or anywhere in the step) runs the same check as Confirm.
            <form ref={pathForm} noValidate onSubmit={confirmPath} className="space-y-8">
              <div>
                <h1 className="text-[36px] sm:text-[46px] lg:text-[58px] leading-[1.08] font-extrabold text-[#21062E] tracking-[-0.045em] text-balance">{t('onboarding.path.title')}</h1>
                <p className="text-[#69616D] text-base">{t('onboarding.path.subtitle')}</p>
              </div>

              <PackageSelection value={formData.selectedPackage} onChange={selectPackage} hasError={showPackageError} prices={packagePrices} />

              <TrackSelection value={formData.selectedTrack} onChange={selectTrack} hasError={showTrackError} />

              {enrollmentChoice.isLoading && <p role="status" className="text-xs text-[#6B7280]">{t('onboarding.path.loading')}</p>}
              {enrollmentChoice.error && !enrollmentChoice.isLoading && (
                <div role="alert" className="bg-[#FEF0EF] p-4 rounded-[14px] text-xs text-[#B42318] flex flex-wrap items-center gap-3">
                  <span>{t(apiErrorKey(enrollmentChoice.error))}</span>
                  <button type="button" onClick={enrollmentChoice.reload} className="underline font-bold">{t('onboarding.path.retry')}</button>
                </div>
              )}
              {pathErrorKey && <div role="alert" className="bg-[#FEF0EF] p-4 rounded-[14px] text-xs text-[#B42318]">{t(pathErrorKey)}</div>}

              <div className="flex flex-wrap justify-end items-center gap-4 pt-4">
                <button type="button" onClick={() => setCurrentStep(2)} className="font-bold text-sm text-[#5C1D87]">{t('onboarding.path.back')}</button>
                {/* Stays focusable without a package so a click explains what is missing (as on the CV step). */}
                <button
                  type="submit"
                  aria-disabled={!isPathComplete || isPathSaving || enrollmentChoice.isLoading}
                  aria-busy={isPathSaving || undefined}
                  className={`px-7 py-3.5 font-bold text-sm rounded-[13px] shadow ${isPathComplete && !isPathSaving && !enrollmentChoice.isLoading ? 'bg-gradient-to-r from-[#4C0585] to-[#3A0353] rtl:bg-gradient-to-l text-white' : 'bg-[#ECEAED] text-[#9A939E] cursor-not-allowed'}`}
                >
                  {isPathSaving
                    ? t('onboarding.path.saving')
                    : <>{t('onboarding.path.confirm')} <span aria-hidden="true" className="inline-block rtl:-scale-x-100">→</span></>}
                </button>
              </div>
            </form>
          )}

          {/* STEP 4: CV */}
          {currentStep === 4 && (
            <CvUploadStep
              cv={myCv.cv}
              isLoading={myCv.isLoading}
              loadError={myCv.error}
              stage={myCv.stage}
              onRetry={myCv.retry}
              onUpload={myCv.upload}
              onBack={() => setCurrentStep(PATH_STEP)}
              onContinue={() => goToStep(CV_STEP + 1)}
              onPreviewReview={() => setViewMode('cv-review')}
            />
          )}

          {/* STEP 07: Setup and AI interview (frontend-only; see ./interview) */}
          {currentStep === 6 && (
            <InterviewSetupFlow
              progress={interview}
              onChange={updateInterview}
              type={interviewType}
              track={trackName}
              cvUploaded={isCvReady}
              fullscreenTarget={interviewPage}
              onExit={() => setCurrentStep(5)}
              onFinish={finishInterview}
            />
          )}

          {/* STEP 08: Result. After an interview, its (sample) outcome; otherwise the result overview. */}
          {currentStep === 7 && interview.outcome && (
            <InterviewResultFlow
              outcome={interview.outcome}
              onOutcomeChange={(outcome) => updateInterview({ outcome })}
              appealReason={interview.appealReason}
              onAppealReasonChange={(appealReason) => updateInterview({ appealReason })}
              type={interviewType}
              track={trackName}
              onContinue={() => setCurrentStep(8)}
              onHome={() => navigate(ROUTES.home)}
              onResume={resumeInterview}
            />
          )}
          {currentStep === 7 && !interview.outcome && (
            <div className="space-y-6">
              <div>
                <h1 className="text-[36px] sm:text-[46px] lg:text-[58px] leading-[1.08] font-extrabold text-[#21062E] tracking-[-0.045em] text-balance">Your Assessment Results</h1>
                <p className="text-[#69616D] text-base">A clear, supportive view of your interview outcome and next steps.</p>
              </div>

              <div className="!mt-9 bg-white/90 border border-[#3A0353]/8 rounded-[18px] shadow-[0_6px_20px_rgba(34,2,60,0.04)] px-4 py-[13px] flex flex-col md:flex-row md:items-center gap-3 md:gap-6">
                <div className="flex items-center gap-[11px] flex-1 min-w-0">
                  <div className="w-10 h-10 shrink-0 bg-[#3A0353] rounded-[13px_13px_13px_4px] flex items-center justify-center"><img src={shieldWhiteIcon} alt="" aria-hidden="true" width={20} height={20} /></div>
                  <p className="text-[11px] leading-[16.5px] text-[#111827]"><span className="text-[#8B5DB0] tracking-[0.8px] mr-2">ASSESSMENT PATH</span>Technical Interview</p>
                </div>
                <div className="flex flex-wrap items-center gap-3 md:gap-6">
                  <div className="md:border-l border-[#E8E2EC] md:pl-5 min-w-[130px] flex flex-col gap-1">
                    <span className="text-[8px] leading-[12px] tracking-[0.8px] text-[#8B5DB0]">PACKAGE</span>
                    <span className="text-[11px] leading-[16.5px] text-[#111827]">Dynamic months</span>
                  </div>
                  <div className="border-l border-[#E8E2EC] pl-5 min-w-[130px] flex flex-col gap-1">
                    <span className="text-[8px] leading-[12px] tracking-[0.8px] text-[#8B5DB0]">TRACK</span>
                    <span className="text-[11px] leading-[16.5px] text-[#111827]">Dynamic track</span>
                  </div>
                  <span className="px-2.5 py-1.5 bg-[#F3E9FA] text-[#5C1D87] text-[9px] font-bold tracking-[0.72px] rounded-full whitespace-nowrap">DEMO RESULT VIEW</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 pt-2">
                <div>
                  <p className="text-[9px] font-bold tracking-[0.9px] text-[#8B5DB0] pb-[5px]">PREVIEW RESULT STATES</p>
                  <p className="text-[10px] leading-[15px] text-[#6B7280]">Choose a state to preview how each outcome is communicated.</p>
                </div>
                <div role="tablist" aria-label="Result state" className="self-start sm:self-auto inline-flex gap-[3px] p-1 bg-[#F4F1F5] border border-[#E8E2EC] rounded-[13px]">
                  {RESULT_STATE_ORDER.map((state) => {
                    const isActive = resultState === state;
                    return (
                      <button
                        key={state}
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        onClick={() => setResultState(state)}
                        className={`min-h-[36px] px-3.5 rounded-[9px] text-[10px] leading-[15px] whitespace-nowrap transition ${isActive ? 'bg-white text-[#3A0353] shadow-[0_5px_7px_rgba(34,2,60,0.08)]' : 'text-[#6B7280] hover:text-[#3A0353]'}`}
                      >
                        {RESULT_STATES[state].tab}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div role="tabpanel" aria-label={activeResult.tab} className="!mt-[14px] bg-white border border-[#3A0353]/8 rounded-[30px] shadow-[0_22px_65px_rgba(34,2,60,0.09)] p-3 grid grid-cols-1 md:grid-cols-[330px_1fr] md:min-h-[410px] overflow-hidden">
                <div className={`${activeResult.panelBg} rounded-[22px] p-9 flex flex-col items-center justify-center text-center`}>
                  <div className="w-[126px] h-[126px] bg-white/70 rounded-full flex items-center justify-center">
                    <div className={`w-[88px] h-[88px] -rotate-5 rounded-[27px_27px_27px_9px] flex items-center justify-center ${activeResult.tileBg} ${activeResult.tileShadow}`}>
                      <img src={activeResult.icon} alt="" aria-hidden="true" width={38} height={38} />
                    </div>
                  </div>
                  <p className="pt-6 pb-1.5 text-[9px] font-bold tracking-[1.35px] text-[#3A0353]">ASSESSMENT OUTCOME</p>
                  <p className="w-[210px] text-[9px] leading-[13.5px] text-[#6B7280]">Based on the selected package and actual review output.</p>
                </div>

                <div className="px-3 py-8 sm:px-8 md:px-12 md:py-[42px] flex flex-col items-start justify-center">
                  <span className={`px-2.5 py-1.5 text-[9px] font-bold tracking-[0.72px] rounded-full ${activeResult.badgeClass}`}>{activeResult.badge}</span>
                  <h2 className="max-w-[650px] pt-[17px] pb-3 text-[28px] leading-[34px] sm:text-[36px] sm:leading-[43.2px] font-extrabold tracking-[-0.035em] text-[#111827]">{activeResult.title}</h2>
                  <p className="pb-6 text-xs leading-[21px] text-[#5C5C5C]">{activeResult.description}</p>
                  <div className="pb-[26px] w-full max-w-[560px] grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div className="bg-[#FAF9FB] border border-[#E8E2EC] rounded-[12px] px-4 py-3.5 flex flex-col gap-[5px]">
                      <span className="text-[8px] leading-[12px] text-[#8B5DB0]">PACKAGE</span>
                      <span className="text-[11px] leading-[16.5px] text-[#111827]">Dynamic months</span>
                    </div>
                    <div className="bg-[#FAF9FB] border border-[#E8E2EC] rounded-[12px] px-4 py-3.5 flex flex-col gap-[5px]">
                      <span className="text-[8px] leading-[12px] text-[#8B5DB0]">TRACK</span>
                      <span className="text-[11px] leading-[16.5px] text-[#111827]">Dynamic track</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-4">
                    {resultState === 'assigned' ? (
                      <button type="button" onClick={() => setCurrentStep(8)} className="min-h-[50px] px-6 flex items-center gap-[9px] rounded-[13px] bg-[linear-gradient(166deg,#4C0585_0%,#3A0353_100%)] text-white text-[13px] font-bold tracking-[0.13px] shadow-[0_10px_11px_rgba(58,3,83,0.18)]">
                        {activeResult.action}
                        <img src={arrowRightWhiteIcon} alt="" aria-hidden="true" width={20} height={20} />
                      </button>
                    ) : (
                      <button type="button" disabled aria-disabled="true" title="Not available yet: this destination is not implemented" className="min-h-[50px] px-6 flex items-center gap-[9px] rounded-[13px] bg-[linear-gradient(166deg,#4C0585_0%,#3A0353_100%)] text-white text-[13px] font-bold tracking-[0.13px] shadow-[0_10px_11px_rgba(58,3,83,0.18)] opacity-60 cursor-not-allowed">
                        {activeResult.action}
                        <img src={arrowRightWhiteIcon} alt="" aria-hidden="true" width={20} height={20} />
                      </button>
                    )}
                    <small className="max-w-[210px] text-[8px] leading-[11.6px] text-[#6B7280]">No score, level, or reasoning is fabricated.</small>
                  </div>
                </div>
              </div>

              <div className="!mt-[14px] grid grid-cols-1 md:grid-cols-2 gap-3">
                <article className="bg-white/90 border border-[#3A0353]/8 rounded-[16px] min-h-[92px] px-[18px] py-[17px] flex items-center gap-[13px]">
                  <div className="w-[38px] h-[38px] shrink-0 bg-[#F3E9FA] rounded-[12px] flex items-center justify-center"><img src={shieldPurpleSmIcon} alt="" aria-hidden="true" width={17} height={20} /></div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[11px] leading-[16.5px] font-normal text-[#111827]">Appeal within seven days</h4>
                    <p className="pt-[5px] text-[9px] leading-[13.5px] text-[#6B7280]">A different reviewer makes the final decision.</p>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => updateInterview({ outcome: 'appeal-form' })}
                    className="shrink-0 min-h-[38px] px-[15px] bg-white border border-[#CCB8D8] rounded-[13px] text-[9px] font-bold tracking-[0.09px] text-[#3A0353] hover:bg-[#F3E9FA] transition"
                  >
                    Request Appeal
                  </button>
                </article>
                <article className="bg-white/90 border border-[#3A0353]/8 rounded-[16px] min-h-[92px] px-[18px] py-[17px] flex items-center gap-[13px]">
                  <div className="w-[38px] h-[38px] shrink-0 bg-[#F3E9FA] rounded-[12px] flex items-center justify-center"><img src={lockPurpleSmIcon} alt="" aria-hidden="true" width={17} height={20} /></div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[11px] leading-[16.5px] font-normal text-[#111827]">Your interview privacy</h4>
                    <p className="pt-[5px] text-[9px] leading-[13.5px] text-[#6B7280]">Recordings are deleted 90 days after the final decision; scores and transcripts are retained.</p>
                  </div>
                </article>
              </div>

              <div className="!mt-4 flex flex-wrap items-center gap-4">
                <button type="button" onClick={() => { updateInterview({ screen: 'device-check' }); setCurrentStep(6); }} className="min-h-[50px] px-6 text-[13px] font-bold tracking-[0.13px] text-[#5C1D87]">Back to device check</button>
                <button type="button" onClick={() => { updateInterview({ screen: 'overview' }); setCurrentStep(6); }} className="min-h-[50px] px-6 text-[13px] font-bold tracking-[0.13px] text-[#5C1D87] underline">Review AI Interview</button>
              </div>
            </div>
          )}

          {/* STEP 5: Payment */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div>
                <h1 className="text-[36px] sm:text-[46px] lg:text-[58px] leading-[1.08] font-extrabold text-[#21062E] tracking-[-0.045em] text-balance">Complete Your Enrollment</h1>
                <p className="text-[#69616D] text-base">Review your selected package and securely complete your enrollment.</p>
              </div>

              <div className="bg-white/90 p-4 rounded-[18px] border border-[#3A0353]/10 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-[34px] h-[34px] bg-[#16794A] text-white rounded-[11px] flex items-center justify-center font-bold">✓</div>
                  <div><h5 className="font-normal text-[#111827]">CV upload</h5><p className="text-[8px] text-[#AAA2AD]">Required stage complete</p></div>
                </div>
                <div className="hidden md:block flex-grow h-[1px] bg-[#E8E2EC] mx-6"></div>
                <div className="flex items-center gap-3">
                  <div className="w-[34px] h-[34px] bg-[#3A0353] text-white rounded-[11px] flex items-center justify-center font-bold ring-4 ring-[#F3E9FA]">2</div>
                  <div><h5 className="font-normal text-[#111827]">Payment</h5><p className="text-[8px] text-[#AAA2AD]">Review and enroll</p></div>
                </div>
                <div className="hidden md:block flex-grow h-[1px] bg-[#E8E2EC] mx-6"></div>
                <div className="flex items-center gap-3">
                  <div className="w-[34px] h-[34px] bg-white border border-[#DDD4E1] text-[#AAA2AD] rounded-[11px] flex items-center justify-center font-bold">3</div>
                  <div><h5 className="font-normal text-[#111827]">Interview</h5><p className="text-[8px] text-[#AAA2AD]">Begins after confirmation</p></div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                <PaymentPanel
                  enrollment={enrollmentChoice.enrollment}
                  isTermsAccepted={user?.requiredPoliciesAccepted === true}
                  state={payment.state}
                  onPay={() => void payment.startCheckout()}
                  onCheckAgain={payment.checkAgain}
                  onReset={payment.reset}
                  onContinue={() => setCurrentStep(6)}
                />

                <div className="bg-white/92 p-7 rounded-[26px] border border-[#3A0353]/10 shadow-sm space-y-5">
                  <div className="flex justify-between items-start gap-3">
                    <div><span className="text-[9px] font-bold text-[#8B5DB0] uppercase">ORDER SUMMARY</span><h3 className="text-[21px] font-normal text-[#111827] mt-1">Your enrollment</h3></div>
                  </div>

                  <div className="p-5 bg-gradient-to-br from-[#22023C] to-[#4C0585] text-white rounded-[17px] shadow-md flex items-center gap-4">
                    <div className="w-[52px] h-[52px] bg-white/10 border border-white/20 rounded-[16px] flex items-center justify-center text-xl font-extrabold">{selectedPackage && PACKAGES[selectedPackage.id].months}</div>
                    <div><span className="text-[8px] text-[#CDBDD7] uppercase">SELECTED PACKAGE</span><h4 className="text-[17px] font-normal">{packageName}</h4><p className="text-[9px] text-[#E5DCE9]">{trackName}</p></div>
                  </div>

                  <div>
                    <span className="text-[8px] text-[#6B7280] uppercase block mb-2">WHAT’S INCLUDED</span>
                    <ul className="space-y-2 text-xs text-[#5C5C5C]">
                      {/* The selected package's benefits, as listed on the Path step. */}
                      {selectedPackage && PACKAGE_FEATURE_KEYS.map((feature) => (
                        <li key={feature}>✓ {t(`onboarding.path.packages.${selectedPackage.key}.features.${feature}`)}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 bg-[#FAF9FB] border border-[#E8E2EC] rounded-[15px] space-y-3 text-xs">
                    <div className="flex justify-between"><span className="text-slate-600">Package price</span><span className="font-bold text-[#111827]">{packagePrice}</span></div>
                    <div className="flex justify-between border-t border-[#E8E2EC] pt-3"><span className="text-slate-600">Approved discount</span><span className="font-bold text-[#111827]">Not supplied</span></div>
                    <div className="flex justify-between border-t border-[#E8E2EC] pt-3"><span className="text-[#3A0353]">Total in EGP</span><span className="font-bold text-[#3A0353]">{packagePrice}</span></div>
                  </div>

                  <div className="bg-[#FFF7E6] p-4 rounded-[14px] border border-[#9A5700]/20 text-xs text-[#9A5700] space-y-1">
                    <p className="font-bold">Refund policy pending final approval</p>
                    <p className="text-[11px] leading-relaxed">The proposed terms include a full refund before squad Start minus gateway fees, with course-use reductions for 6- and 12-month paths, and no refund after Start. Legal confirmation is required.</p>
                  </div>
                  <p className="text-[11px] text-[#6B7280]">Promo-code availability remains an open launch decision.</p>
                </div>
              </div>

              <div className="flex flex-wrap justify-end items-center gap-4 pt-[34px]">
                <button onClick={() => setCurrentStep(4)} className="font-bold text-sm text-[#5C1D87]">Back</button>
                <button onClick={() => setCurrentStep(6)} className="px-7 py-3.5 bg-gradient-to-r from-[#4C0585] to-[#3A0353] text-white font-bold text-sm rounded-[13px] shadow flex items-center gap-2">
                  Preview Interview Setup →
                </button>
              </div>
            </div>
          )}

          {/* STEP 8: Squad */}
          {currentStep === 8 && (
            <div className="space-y-6">
              <div>
                <h1 className="text-[36px] sm:text-[46px] lg:text-[58px] leading-[1.08] font-extrabold text-[#21062E] tracking-[-0.045em] text-balance">Your Journey Is About to Begin</h1>
                <p className="text-[#69616D] text-base">Your enrollment is confirmed. We’re preparing the next stage of your journey.</p>
              </div>

              <div className="p-6 md:p-8 bg-gradient-to-br from-[#22023C] via-[#22023C] to-[#400B63] text-white rounded-[30px] shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
                <div className="space-y-2">
                  <span className="px-3 py-1 bg-[#EAF8F0] text-[#16794A] text-[9px] font-bold rounded-full">PAYMENT CONFIRMED · DEMO</span>
                  <h2 className="text-[22px] font-normal">Welcome to your next chapter</h2>
                  <p className="text-xs text-[#D9CCE1]">Squad assignment is automatic. You do not need to select a squad or internship.</p>
                </div>
                <div className="w-[105px] h-[105px] bg-[#5C1D87] rounded-full flex flex-col items-center justify-center font-bold shadow-inner border border-white/10">
                  <span className="text-2xl font-normal">02</span>
                  <span className="text-[8px] text-[#D9CCE1] mt-0.5">Current stage</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                <div className="bg-white/92 p-8 rounded-[28px] border border-[#3A0353]/10 shadow-sm space-y-5">
                  <div>
                    <span className="text-[9px] font-bold text-[#6B7280] uppercase">JOURNEY STATUS</span>
                    <h3 className="text-xl font-normal text-[#111827] mt-1">Waiting for Your Squad</h3>
                    <span className="inline-block mt-2 px-3 py-1 bg-[#F1EEF2] text-[#685F6D] text-[9px] font-bold rounded-full">IN PROGRESS</span>
                  </div>

                  <div className="space-y-6 pt-4 border-t border-[#E8E2EC]">
                    <div className="flex items-start gap-4"><div className="w-[33px] h-[33px] bg-[#16794A] text-white rounded-full flex items-center justify-center text-xs">✓</div><div><h4 className="text-xs text-[#111827]">Enrollment confirmed</h4><p className="text-[9px] text-[#6B7280]">Completed in demo</p></div></div>
                    <div className="flex items-start gap-4"><div className="w-[33px] h-[33px] bg-[#3A0353] text-white rounded-full flex items-center justify-center text-xs ring-4 ring-[#F3E9FA]">2</div><div><h4 className="text-xs text-[#111827]">Waiting for squad assignment</h4><p className="text-[9px] text-[#6B7280]">No waiting-time promise available</p></div></div>
                    <div className="flex items-start gap-4 opacity-70"><div className="w-[33px] h-[33px] bg-[#F0EDF1] text-[#6B7280] rounded-full flex items-center justify-center text-xs">3</div><div><h4 className="text-xs text-[#111827]">Squad assignment completed</h4><p className="text-[9px] text-[#6B7280]">Pending</p></div></div>
                    <div className="flex items-start gap-4 opacity-70"><div className="w-[33px] h-[33px] bg-[#F0EDF1] text-[#6B7280] rounded-full flex items-center justify-center text-xs">4</div><div><h4 className="text-xs text-[#111827]">Official squad Start</h4><p className="text-[9px] text-[#6B7280]">Pending</p></div></div>
                    <div className="flex items-start gap-4 opacity-70"><div className="w-[33px] h-[33px] bg-[#F0EDF1] text-[#6B7280] rounded-full flex items-center justify-center text-xs">5</div><div><h4 className="text-xs text-[#111827]">Sprint work begins</h4><p className="text-[9px] text-[#6B7280]">Pending</p></div></div>
                  </div>
                </div>

                <div className="bg-white/92 p-8 rounded-[28px] border border-[#3A0353]/10 shadow-sm space-y-4">
                  <div className="p-4 border border-[#E8E2EC] rounded-[14px] grid grid-cols-2 gap-4 text-xs">
                    <div><span className="text-[8px] text-[#8B5DB0] block uppercase">PACKAGE</span><span className="font-normal text-[#111827]">{packageName}</span></div>
                    <div><span className="text-[8px] text-[#8B5DB0] block uppercase">TRACK</span><span className="font-normal text-[#111827]">{trackName}</span></div>
                  </div>
                  <div className="p-4 border border-[#E8E2EC] rounded-[14px] space-y-1"><h4 className="text-xs font-normal text-[#111827]">When your package starts</h4><p className="text-[10px] text-[#6B7280] leading-relaxed">Your package clock starts only at the official squad Start.</p></div>
                  <div className="p-4 border border-[#E8E2EC] rounded-[14px] space-y-2">
                    <h4 className="text-xs font-normal text-[#111827]">Mentorship</h4>
                    <p className="text-[10px] text-[#6B7280] leading-relaxed">Selected package sessions entitlement is proposed pending business confirmation. Usage data will appear when available.</p>
                    <span className="px-2.5 py-1 bg-[#FFF7E6] text-[#9A5700] text-[9px] font-bold rounded-full inline-block">ENTITLEMENT PROVISIONAL</span>
                  </div>
                  <div className="bg-[#FBF7FE] p-4 rounded-[14px] border border-[#3A0353]/10 flex gap-3 text-xs text-[#3A0353]">
                    <span aria-hidden="true" className="mt-px flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full border border-current text-[13px] leading-none">i</span><div><p className="font-bold">How squads start</p><p className="text-[11px] mt-0.5 leading-relaxed">The required seats must be filled before Start. The Senior leads the squad and is not counted as a member.</p></div>
                  </div>
                  <button className="w-full h-[50px] bg-white border border-[#CCB8D8] text-[#3A0353] font-bold text-xs rounded-[13px]">Contact support</button>
                </div>
              </div>

              <div className="flex flex-wrap justify-end items-center gap-4 pt-[34px]">
                <button onClick={() => setCurrentStep(7)} className="font-bold text-sm text-[#5C1D87]">Back</button>
                <button onClick={() => setCurrentStep(9)} className="px-7 py-3.5 bg-gradient-to-r from-[#4C0585] to-[#3A0353] text-white font-bold text-sm rounded-[13px] shadow flex items-center gap-2">
                  Explore Mentorship →
                </button>
              </div>
            </div>
          )}

          {/* STEP 9: Mentorship */}
          {currentStep === 9 && (
            <div className="space-y-6">
              <div>
                <h1 className="text-[36px] sm:text-[46px] lg:text-[58px] leading-[1.08] font-extrabold text-[#21062E] tracking-[-0.045em] text-balance">Learn from People<br />Who’ve Been There</h1>
                <p className="text-[#69616D] text-base mt-2">Book a session with a mentor who understands your technology track.</p>
              </div>

              <div className="p-6 md:p-8 bg-gradient-to-br from-[#22023C] via-[#22023C] to-[#400B63] text-white rounded-[30px] shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
                <div className="space-y-2">
                  <span className="px-3 py-1 bg-[#FFF7E6] text-[#CBBBD5] text-[9px] font-bold rounded-full">ILLUSTRATIVE PROFILES & AVAILABILITY</span>
                  <h2 className="text-[22px] font-normal">Frontend Development mentorship</h2>
                  <p className="text-xs text-[#D9CCE1]">Sample data only. Actual mentor profiles, session balance, and availability must come from the system.</p>
                </div>
                <div className="p-4 border border-white/15 rounded-[16px] text-center bg-white/5 min-w-[150px]">
                  <span className="text-[8px] text-[#CBBBD5] uppercase block">PROPOSED ENTITLEMENT</span>
                  <h3 className="text-[22px] font-normal mt-1">6 sessions</h3>
                  <span className="text-[8px] text-[#CBBBD5] block mt-0.5">Usage data not supplied</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                <div className="md:col-span-8 space-y-6">
                  <div>
                    <div className="flex items-center gap-2 mb-4"><span className="text-[#DD6F0D] font-bold text-xs">01</span><h2 className="text-xl font-normal text-[#111827]">Choose a mentor</h2></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div onClick={() => setFormData({...formData, selectedMentor: 'Amina M.'})} className={`p-6 rounded-[18px] relative shadow-md cursor-pointer transition ${formData.selectedMentor === 'Amina M.' ? 'bg-[#FBF7FE] border-2 border-[#5C1D87]' : 'bg-white border border-[#E8E2EC]'}`}>
                        <div className="absolute top-5 right-5 w-4 h-4 rounded-full border-4 border-[#5C1D87] bg-white flex items-center justify-center"></div>
                        <div className="w-12 h-12 bg-gradient-to-br from-[#8B5DB0] to-[#3A0353] rounded-[14px] text-white flex items-center justify-center font-bold text-sm mb-4 shadow-sm">AM</div>
                        <span className="px-2.5 py-1 bg-[#F3E9FA] text-[#5C1D87] text-[9px] font-bold rounded-full inline-block mb-2">SAMPLE PROFILE</span>
                        <h3 className="text-base font-normal text-[#111827]">Amina M.</h3>
                        <p className="text-[10px] text-[#6B7280]">Senior Frontend Engineer</p>
                        <p className="text-[9px] text-[#5C1D87] mt-1">React · Design systems</p>
                        <p className="text-[9px] text-[#6B7280] mt-3 leading-relaxed">Illustrative profile focused on scalable frontend architecture.</p>
                      </div>

                      <div onClick={() => setFormData({...formData, selectedMentor: 'Youssef K.'})} className={`p-6 rounded-[18px] relative shadow-sm cursor-pointer transition ${formData.selectedMentor === 'Youssef K.' ? 'bg-[#FBF7FE] border-2 border-[#5C1D87]' : 'bg-white border border-[#E8E2EC]'}`}>
                        <div className="absolute top-5 right-5 w-4 h-4 rounded-full border border-slate-300"></div>
                        <div className="w-12 h-12 bg-gradient-to-br from-[#8B5DB0] to-[#3A0353] rounded-[14px] text-white flex items-center justify-center font-bold text-sm mb-4 shadow-sm">YK</div>
                        <span className="px-2.5 py-1 bg-[#F3E9FA] text-[#5C1D87] text-[9px] font-bold rounded-full inline-block mb-2">SAMPLE PROFILE</span>
                        <h3 className="text-base font-normal text-[#111827]">Youssef K.</h3>
                        <p className="text-[10px] text-[#6B7280]">Frontend Tech Lead</p>
                        <p className="text-[9px] text-[#5C1D87] mt-1">React · Performance</p>
                        <p className="text-[9px] text-[#6B7280] mt-3 leading-relaxed">Illustrative profile focused on product engineering and career growth.</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-4"><span className="text-[#DD6F0D] font-bold text-xs">02</span><h2 className="text-xl font-normal text-[#111827]">Choose a demo time</h2></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white p-5 rounded-[14px] border border-[#E8E2EC] space-y-2">
                        <span className="text-[9px] text-[#5C5C5C] block">Date · 24 hours to 14 days ahead</span>
                        <div className="h-[42px] border border-[#E8E2EC] rounded-[10px] bg-white"></div>
                      </div>
                      <div className="bg-white p-5 rounded-[14px] border border-[#E8E2EC] space-y-2">
                        <span className="text-[9px] text-[#5C5C5C] block">45-minute slots · your local time</span>
                        <div className="flex gap-2">
                          <button className="px-3 py-2 border border-[#E8E2EC] rounded-[8px] text-[9px] text-[#5C1D87]">10:00</button>
                          <button className="px-3 py-2 border border-[#E8E2EC] rounded-[8px] text-[9px] text-[#5C1D87]">13:30</button>
                          <button className="px-3 py-2 border border-[#E8E2EC] rounded-[8px] text-[9px] text-[#5C1D87]">16:00</button>
                        </div>
                        <p className="text-[8px] text-[#6B7280] pt-1">Illustrative availability only</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[9px] text-[#5C5C5C] block">What would you like help with?</span>
                    <input type="text" placeholder="One line about your topic" className="w-full h-[50px] px-4 border border-[#E8E2EC] rounded-[12px] text-xs outline-none bg-white placeholder:text-slate-300" />
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                    <div className="p-4 bg-white border border-[#E8E2EC] rounded-[12px]"><span className="font-bold text-[9px] text-[#111827] block mb-1">Cancellation</span><p className="text-[9px] text-[#6B7280]">At least 24 hours before returns the session; later cancellation consumes it.</p></div>
                    <div className="p-4 bg-white border border-[#E8E2EC] rounded-[12px]"><span className="font-bold text-[9px] text-[#111827] block mb-1">Rescheduling</span><p className="text-[9px] text-[#6B7280]">Cancel and book again under the same rules.</p></div>
                    <div className="p-4 bg-white border border-[#E8E2EC] rounded-[12px]"><span className="font-bold text-[9px] text-[#111827] block mb-1">Availability</span><p className="text-[9px] text-[#6B7280]">Begins at package Start for 3/6 months and at payment for 12 months.</p></div>
                    <div className="p-4 bg-white border border-[#E8E2EC] rounded-[12px]"><span className="font-bold text-[9px] text-[#111827] block mb-1">Expiry</span><p className="text-[9px] text-[#6B7280]">Unused sessions expire when the package ends.</p></div>
                  </div>
                </div>

                <div className="md:col-span-4 bg-white/92 p-6 rounded-[28px] border border-[#3A0353]/10 shadow-lg space-y-4 md:sticky md:top-24">
                  <span className="text-[9px] font-bold text-[#8B5DB0] uppercase block">SESSION SUMMARY</span>
                  <div className="p-4 bg-[#FBF7FE] rounded-[12px] space-y-1"><span className="text-[8px] text-[#8B5DB0] uppercase block">MENTOR</span><h5 className="text-xs font-normal text-[#111827]">{formData.selectedMentor}</h5></div>
                  <div className="p-4 bg-[#FBF7FE] rounded-[12px] space-y-1"><span className="text-[8px] text-[#8B5DB0] uppercase block">DATE & TIME</span><h5 className="text-xs font-normal text-[#111827]">Choose a date · Choose a slot</h5></div>
                  <div className="p-4 bg-[#FBF7FE] rounded-[12px] space-y-1"><span className="text-[8px] text-[#8B5DB0] uppercase block">TRACK</span><h5 className="text-xs font-normal text-[#111827]">Selected track</h5></div>
                  <div className="p-4 bg-[#FBF7FE] rounded-[12px] space-y-1"><span className="text-[8px] text-[#8B5DB0] uppercase block">TOPIC</span><h5 className="text-xs font-normal text-[#111827]">Add your topic</h5></div>
                  <div className="flex items-center gap-2 text-[9px] text-[#6B7280] pt-1"><img src={clockMutedIcon} alt="" aria-hidden="true" width={14} height={14} /><p>Sessions are 45 minutes. Maximum two upcoming sessions at a time.</p></div>
                  <button disabled className="w-full h-[50px] bg-[#ECEAED] text-[#9A939E] font-bold text-xs rounded-[13px] cursor-not-allowed">Confirm Booking</button>
                </div>
              </div>

              <div className="flex flex-wrap justify-end items-center gap-4 pt-[34px]">
                <button onClick={() => setCurrentStep(8)} className="font-bold text-sm text-[#5C1D87]">Back</button>
                <button disabled className="px-7 py-3.5 bg-[#ECEAED] text-[#9A939E] font-bold text-sm rounded-[13px] flex items-center gap-2 cursor-not-allowed">
                  Confirm Booking →
                </button>
              </div>
            </div>
          )}

        </div>
      </main>
      </div>

      {/* Footer (outside the fullscreen area; the interview and outcome screens have none in Figma) */}
      {!usesProfileLayout && (
      <footer className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 px-4 md:px-[72px] py-8 md:py-0 md:h-[130px] bg-gradient-to-tr from-[#22023C] via-[#22023C] to-[#8B5DB0]/30 text-white">
        <div className="flex flex-wrap items-center gap-3">
          <div className="w-[38px] h-[38px] bg-gradient-to-br from-[#5C1D87] to-[#3A0353] rounded-[13px_13px_13px_4px] flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-sm">ih</span>
          </div>
          <span className="font-bold text-xl text-white">Interns<span className="text-[#4C0585]">Hub</span></span>
          <span className="text-[11px] text-[#D7C8DF] pl-3 border-l border-white/20">From Student to a Tech Career.</span>
        </div>
        <span className="text-[9px] text-[#9F8DAC]">Modern Onboarding v6.0 · Interactive product demo</span>
      </footer>
      )}

    </div>
  );
}
