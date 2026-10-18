import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import calendarIcon from '../../assets/onboarding/calendar.svg';
import cardWhiteIcon from '../../assets/onboarding/card-white.svg';
import clockMutedIcon from '../../assets/onboarding/clock-muted.svg';
import idCardPurpleIcon from '../../assets/onboarding/id-card-purple.svg';
import lockMutedIcon from '../../assets/onboarding/lock-muted.svg';
import lockPurpleIcon from '../../assets/onboarding/lock-purple.svg';
import lockWhiteIcon from '../../assets/onboarding/lock-white.svg';
import receiptPurpleIcon from '../../assets/onboarding/receipt-purple.svg';
import shieldGreenIcon from '../../assets/onboarding/shield-green.svg';
import shieldPurpleIcon from '../../assets/onboarding/shield-purple.svg';
import shieldWhiteIcon from '../../assets/onboarding/shield-white.svg';
import shieldWhiteNarrowIcon from '../../assets/onboarding/shield-white-narrow.svg';
import uploadMutedIcon from '../../assets/onboarding/upload-muted.svg';
import uploadPurpleIcon from '../../assets/onboarding/upload-purple.svg';
import uploadWhiteIcon from '../../assets/onboarding/upload-white.svg';
import walletPurpleIcon from '../../assets/onboarding/wallet-purple.svg';
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

export default function OnboardingFlow() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [viewMode, setViewMode] = useState<'onboarding' | 'cv-review'>('onboarding');
  const [resultState, setResultState] = useState<ResultState>('assigned');
  const activeResult = RESULT_STATES[resultState];
  const [formData, setFormData] = useState({
    selectedPackage: '6 Months',
    selectedTrack: 'Frontend Development',
    cvUploaded: false,
    selectedMentor: 'Amina M.'
  });

  const stepsMeta = [
    { num: '01', title: 'Verify' },
    { num: '02', title: 'Profile' },
    { num: '03', title: 'Path' },
    { num: '04', title: 'CV' },
    { num: '05', title: 'Payment' },
    { num: '06', title: 'Setup' },
    { num: '07', title: 'Result' },
    { num: '08', title: 'Squad' },
    { num: '09', title: 'Mentorship' }
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
      
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between gap-4 px-4 md:px-[72px] h-[72px] bg-white/82 border-b border-[#3A0353]/10 shadow-[0_1px_0_rgba(58,3,83,0.04)] backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <div className="w-[38px] h-[38px] bg-gradient-to-br from-[#5C1D87] to-[#3A0353] shadow-[0_8px_18px_rgba(58,3,83,0.2)] rounded-[13px_13px_13px_4px] flex items-center justify-center relative">
            <span className="text-white font-bold text-sm tracking-[-1.12px]">ih</span>
          </div>
          <span className="font-bold text-xl text-[#111827]">Interns<span className="text-[#4C0585]">Hub</span></span>
          <span className="bg-[#F7F0FB] text-[#5C1D87] text-[10px] font-bold px-2.5 py-1 rounded-full tracking-[1.6px]">EDTECH</span>
        </div>

        <div className="flex items-center gap-6">
          <span className="hidden sm:inline text-xs text-[#6B7280]">Demo onboarding</span>
          <button className="text-[#5C1D87] font-bold text-[13px] hover:underline">Need help?</button>
        </div>
      </header>

      {/* Progress Navigation Bar */}
      <div className="w-full flex justify-center pt-[18px] px-4">
        <div className="w-full max-w-[1120px] h-[85.6px] bg-white/86 border border-[#3A0353]/10 shadow-[0_8px_28px_rgba(34,2,60,0.06)] backdrop-blur-md rounded-[20px] flex items-center justify-between px-4 md:px-8 relative overflow-x-auto">
          
          {stepsMeta.map((s, index) => {
            const stepNumber = index + 1;
            const isCompleted = stepNumber < currentStep;
            const isCurrent = stepNumber === currentStep;

            return (
              <React.Fragment key={s.num}>
                <button
                  onClick={() => setCurrentStep(stepNumber)}
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

      {/* Main Content Area */}
      <main className="flex-grow flex justify-center px-4 md:px-6 pt-10 md:pt-[72px] pb-16 md:pb-[100px]">
        <div className="w-full max-w-[1240px] min-w-0">
          
          <div className="inline-flex items-center px-3 py-1.5 bg-[#FFF3E8] rounded-[9px] mb-3">
            <span className="text-[11px] font-bold text-[#DD6F0D] tracking-[1.32px]">
              STEP {String(currentStep).padStart(2, '0')} · INTERNSHUB ONBOARDING
            </span>
          </div>

          {/* STEP 1: Verify */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h1 className="text-[36px] sm:text-[46px] lg:text-[58px] leading-[1.08] font-extrabold text-[#21062E] tracking-[-0.045em] text-balance">Verify Your Account</h1>
              <p className="text-[#69616D] text-base">Confirm your email, phone number and National ID to secure your account.</p>
              
              <div className="bg-[#FBF7FE] p-4 rounded-[14px] border border-[#4C0585]/10 flex items-start gap-3">
                <div className="w-[22px] h-[22px] rounded-full border border-[#3A0353] flex items-center justify-center text-[#3A0353] text-xs font-serif italic">i</div>
                <div className="text-xs text-[#3A0353]">
                  <p className="font-bold">All three verifications are required, in order</p>
                  <p className="text-[11px] mt-0.5">Google sign-in does not bypass email, phone and National ID verification before payment or AI interview.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="bg-white/92 p-6 rounded-[28px] border border-[#3A0353]/10 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-start gap-3 mb-6">
                      <div className="w-[42px] h-[42px] shrink-0 bg-[#F3E9FA] rounded-[12px] flex items-center justify-center"><img src={shieldPurpleIcon} alt="" aria-hidden="true" width={20} height={20} /></div>
                      <div className="min-w-0 flex-1 pt-0.5">
                        <h3 className="text-base font-normal text-[#111827]">Email verification</h3>
                        <p className="text-[11px] text-[#6B7280] mt-1">Code sent to m***@gmail.com</p>
                      </div>
                      <span className="shrink-0 px-2.5 py-1 bg-[#F1EEF2] text-[#685F6D] text-[9px] font-bold rounded-full">Pending</span>
                    </div>
                    <p className="text-[11px] text-[#111827] mb-3">Enter the 6-digit code we sent to your email address, then tap Verify Email.</p>
                    <div className="flex gap-1.5 mb-5">
                      {[...Array(6)].map((_, i) => (<input key={i} type="text" maxLength={1} className="w-11 min-w-0 shrink h-[52px] text-center border border-[#D9D1DD] rounded-[10px] text-base font-bold bg-[#FAF9FB] outline-none" />))}
                    </div>
                    <div className="mb-6"><a href="#resend" className="text-xs text-[#5C1D87] underline">Resend code · 00:24</a></div>
                  </div>
                  <div>
                    <button className="min-h-[50px] px-6 bg-gradient-to-r from-[#4C0585] to-[#3A0353] text-white font-bold text-[13px] rounded-[13px] shadow-[0_10px_22px_rgba(58,3,83,0.2)] mb-3">Verify Email</button>
                    <p className="text-[10px] text-[#6B7280]">Demo only. No real message is sent or verified.</p>
                  </div>
                </div>

                <div className="bg-white/92 p-6 rounded-[28px] border border-[#3A0353]/10 shadow-sm opacity-70 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start gap-3 mb-6">
                      <div className="w-[42px] h-[42px] shrink-0 bg-[#F3E9FA] rounded-[12px] flex items-center justify-center"><img src={lockPurpleIcon} alt="" aria-hidden="true" width={20} height={20} /></div>
                      <div className="min-w-0 flex-1 pt-0.5">
                        <h3 className="text-base font-normal text-[#111827]">Phone verification</h3>
                        <p className="text-[11px] text-[#6B7280] mt-1">Code will be sent to +20 ••• ••• 4821</p>
                      </div>
                      <span className="shrink-0 px-2.5 py-1 bg-[#F1EEF2] text-[#685F6D] text-[9px] font-bold rounded-full">Pending</span>
                    </div>
                    <p className="text-[11px] text-[#111827] mb-3">Enter the 6-digit code we send by SMS to your phone. Available after your email is verified.</p>
                    <div className="flex gap-1.5 mb-5">
                      {[...Array(6)].map((_, i) => (<input key={i} type="text" maxLength={1} disabled className="w-11 min-w-0 shrink h-[52px] text-center border border-[#D9D1DD] rounded-[10px] text-base bg-[#FAF9FB] outline-none" />))}
                    </div>
                    <div className="mb-6"><a href="#resend" className="text-xs text-[#5C1D87] underline">Resend code</a></div>
                  </div>
                  <div>
                    <button disabled className="min-h-[50px] px-6 bg-[#ECEAED] text-[#9A939E] font-bold text-[13px] rounded-[13px] mb-3">Verify Phone</button>
                    <p className="text-[10px] text-[#6B7280]">Demo only. No real message is sent or verified.</p>
                  </div>
                </div>

                <div className="bg-white/92 p-6 rounded-[28px] border border-[#3A0353]/10 shadow-sm opacity-70 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start gap-3 mb-6">
                      <div className="w-[42px] h-[42px] shrink-0 bg-[#F3E9FA] rounded-[12px] flex items-center justify-center"><img src={idCardPurpleIcon} alt="" aria-hidden="true" width={20} height={20} /></div>
                      <div className="min-w-0 flex-1 pt-0.5">
                        <h3 className="text-base font-normal text-[#111827]">National ID verification</h3>
                        <p className="text-[11px] text-[#6B7280] mt-1">Egyptian National ID · 14 digits</p>
                      </div>
                      <span className="shrink-0 px-2.5 py-1 bg-[#F1EEF2] text-[#685F6D] text-[9px] font-bold rounded-full">Pending</span>
                    </div>
                    <p className="text-[11px] text-[#111827] mb-3">Enter your 14-digit National ID number to verify your identity. Available after your phone is verified.</p>
                    <input type="text" disabled placeholder="Enter 14-digit National ID" className="w-full h-[52px] px-4 border border-[#D9D1DD] rounded-[10px] text-xs bg-[#FAF9FB] mb-5 outline-none" />
                  </div>
                  <div>
                    <button disabled className="min-h-[50px] px-6 bg-[#ECEAED] text-[#9A939E] font-bold text-[13px] rounded-[13px] mb-3">Verify National ID</button>
                    <p className="text-[10px] text-[#6B7280]">Demo only. No real message is sent or verified.</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end items-center gap-4 pt-6">
                <button 
                  type="button"
                  onClick={() => navigate(ROUTES.register)}
                  className="font-bold text-sm text-[#5C1D87] hover:underline"
                >
                  Back to Register
                </button>
                <button onClick={() => setCurrentStep(2)} className="px-7 py-3.5 bg-gradient-to-r from-[#4C0585] to-[#3A0353] text-white font-bold text-sm rounded-[13px] shadow">Continue to Profile →</button>
              </div>
            </div>
          )}

          {/* STEP 2: Profile */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h1 className="text-[36px] sm:text-[46px] lg:text-[58px] leading-[1.08] font-extrabold text-[#21062E] tracking-[-0.045em] text-balance">Let’s Get to Know You</h1>
                <p className="text-[#69616D] text-base mt-2">Add the essential details needed to set up your InternsHub account.</p>
              </div>

              <div className="bg-white/92 rounded-[28px] border border-[#3A0353]/10 max-w-[1020px] grid grid-cols-1 md:grid-cols-3 overflow-hidden shadow-xl">
                <div className="p-8 bg-gradient-to-b from-[#551683] via-[#481170] to-[#2E054D] text-white flex flex-col justify-between relative overflow-hidden min-h-[420px]">
                  <div className="absolute -right-16 -top-16 w-64 h-64 border-[24px] border-white/5 rounded-full pointer-events-none"></div>
                  <div className="absolute right-4 top-20 w-36 h-36 border border-white/10 rounded-full pointer-events-none"></div>

                  <div className="w-[52px] h-[52px] bg-white/12 border border-white/15 rounded-[14px] flex items-center justify-center font-extrabold text-sm tracking-wide z-10 text-white">
                    18+
                  </div>

                  <div className="z-10 pb-2">
                    <h4 className="text-[20px] font-normal text-white leading-snug">
                      Two essentials.<br />
                      One clear start.
                    </h4>
                  </div>
                </div>

                <div className="md:col-span-2 p-8 space-y-6 bg-white flex flex-col justify-between">
                  <div className="space-y-5">
                    <div className="flex items-center justify-between border-b border-[#E8E2EC] pb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 shrink-0 bg-[#3A0353] rounded-[12px] flex items-center justify-center"><img src={shieldWhiteIcon} alt="" aria-hidden="true" width={20} height={20} /></div>
                        <div>
                          <span className="text-[9px] font-bold text-[#8B5DB0] uppercase tracking-[0.9px]">ACCOUNT ESSENTIALS</span>
                          <h3 className="text-[18px] font-normal text-[#111827]">Your basic information</h3>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-[#F3E9FA] text-[#5C1D87] text-[9px] font-bold rounded-full tracking-[0.72px]">2 REQUIRED</span>
                    </div>

                    <div className="bg-[#FFF7E6] p-4 rounded-[14px] border border-[#9A5700]/20 flex gap-3 text-xs text-[#9A5700]">
                      <span aria-hidden="true" className="mt-px flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full border border-current text-[13px] leading-none">i</span>
                      <div>
                        <p className="font-bold">Age requirement</p>
                        <p className="text-[11px] mt-0.5">You must be 18 or older to join InternsHub.</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] text-[#34303A] mb-1 font-medium">Full name</label>
                        <input type="text" placeholder="Enter your full name" className="w-full h-[52px] px-4 rounded-[12px] border border-[#E3DCE6] bg-[#FAF9FB] text-xs outline-none placeholder:text-slate-400" />
                      </div>
                      <div>
                        <label className="block text-[11px] text-[#34303A] mb-1 font-medium">Date of birth</label>
                        <div className="relative flex items-center">
                          <input type="text" placeholder="Enter your birthday" className="w-full h-[52px] px-4 rounded-[12px] border border-[#E3DCE6] bg-[#FAF9FB] text-xs outline-none placeholder:text-slate-400" />
                          <span className="absolute right-4 flex"><img src={calendarIcon} alt="" aria-hidden="true" width={18} height={18} /></span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-[#6B7280] text-[11px] pt-1">
                      <img src={lockMutedIcon} alt="" aria-hidden="true" width={16} height={16} />
                      <p>Your date of birth is saved once and cannot be changed later.</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap justify-end items-center gap-4 pt-4">
                    <button onClick={() => setCurrentStep(1)} className="font-bold text-sm text-[#5C1D87]">Back</button>
                    <button onClick={() => setCurrentStep(3)} className="px-7 py-3.5 bg-[#ECEAED] text-[#9A939E] font-bold text-sm rounded-[13px] flex items-center gap-2 cursor-not-allowed">
                      Save & Continue →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Path */}
          {currentStep === 3 && (
            <div className="space-y-8">
              <div>
                <h1 className="text-[36px] sm:text-[46px] lg:text-[58px] leading-[1.08] font-extrabold text-[#21062E] tracking-[-0.045em] text-balance">Choose Your Path to a Tech Career</h1>
                <p className="text-[#69616D] text-base">Choose the program duration and technology track that match your goals.</p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2"><span className="text-[#DD6F0D] font-bold text-xs">01</span><h2 className="text-xl font-normal text-[#111827]">Select your package</h2></div>
                  <span className="px-3 py-1 bg-[#FFF7E6] text-[#9A5700] text-[9px] font-bold rounded-full">PRICING PENDING</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="bg-white p-7 rounded-[24px] border border-[#3A0353]/10 shadow-sm flex flex-col justify-between">
                    <div>
                      <span className="text-[9px] font-bold text-[#8B5DB0] uppercase">INTERNSHIP FOCUS</span>
                      <h3 className="text-[28px] font-normal text-[#111827] mt-1 mb-2">3 Months</h3>
                      <div className="flex items-end gap-1 mb-6"><span className="text-xs font-bold text-slate-500">EGP</span><span className="text-[28px] font-bold text-[#3A0353]">3,000</span><span className="text-[11px] text-slate-400">/ package</span></div>
                      <ul className="space-y-3 text-xs text-[#5C5C5C] mb-6">
                        <li>✓ Practical internship</li>
                        <li>✓ 3 mentorship sessions · proposed</li>
                        <li>✓ Internship certificate</li>
                        <li>✓ Courses not included</li>
                      </ul>
                    </div>
                    <button onClick={() => setFormData({...formData, selectedPackage: '3 Months'})} className="w-full h-[50px] rounded-[13px] border border-[#CCB8D8] text-[#3A0353] font-bold text-xs bg-white">Choose 3 Months</button>
                  </div>

                  <div className="bg-white p-7 rounded-[24px] border border-[#3A0353]/10 relative flex flex-col justify-between shadow-md">
                    <div className="absolute top-0 left-0 right-0 h-[5px] bg-gradient-to-r from-[#8B5DB0] to-[#5C1D87] rounded-t-[24px]"></div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[9px] font-bold text-[#8B5DB0] uppercase">BALANCED PATHWAY</span>
                        <span className="px-2.5 py-1 bg-[#F3E9FA] text-[#5C1D87] text-[9px] font-bold rounded-full">POPULAR PATH</span>
                      </div>
                      <h3 className="text-[28px] font-normal text-[#111827] mb-2">6 Months</h3>
                      <div className="flex items-end gap-1 mb-6"><span className="text-xs font-bold text-slate-500">EGP</span><span className="text-[28px] font-bold text-[#3A0353]">5,500</span><span className="text-[11px] text-slate-400">/ package</span></div>
                      <ul className="space-y-3 text-xs text-[#5C5C5C] mb-6">
                        <li>✓ Published courses after payment</li>
                        <li>✓ Practical internship</li>
                        <li>✓ 6 mentorship sessions · proposed</li>
                        <li>✓ Course + internship certificate types</li>
                      </ul>
                    </div>
                    <button onClick={() => setFormData({...formData, selectedPackage: '6 Months'})} className="w-full h-[50px] rounded-[13px] border border-[#CCB8D8] text-[#3A0353] font-bold text-xs bg-white">Choose 6 Months</button>
                  </div>

                  <div className="bg-white p-7 rounded-[24px] border border-[#3A0353]/10 shadow-sm flex flex-col justify-between">
                    <div>
                      <span className="text-[9px] font-bold text-[#8B5DB0] uppercase">COMPLETE LEARNING PATH</span>
                      <h3 className="text-[28px] font-normal text-[#111827] mt-1 mb-2">12 Months</h3>
                      <div className="flex items-end gap-1 mb-6"><span className="text-xs font-bold text-slate-500">EGP</span><span className="text-[28px] font-bold text-[#3A0353]">9,500</span><span className="text-[11px] text-slate-400">/ package</span></div>
                      <ul className="space-y-3 text-xs text-[#5C5C5C] mb-6">
                        <li>✓ 6-month unified Learning Path</li>
                        <li>✓ Mentorship from payment</li>
                        <li>✓ Advisory Orientation interview</li>
                        <li>✓ Squad stage follows learning stage</li>
                      </ul>
                    </div>
                    <button onClick={() => setFormData({...formData, selectedPackage: '12 Months'})} className="w-full h-[50px] rounded-[13px] border border-[#CCB8D8] text-[#3A0353] font-bold text-xs bg-white">Choose 12 Months</button>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2"><span className="text-[#DD6F0D] font-bold text-xs">02</span><h2 className="text-xl font-normal text-[#111827]">Choose your technology track</h2></div>
                  <span className="text-[11px] text-[#6B7280]">Catalog managed by InternsHub</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {[
                    { code: 'FE', title: 'Frontend Development', tech: 'React', desc: 'Build polished, accessible web products.' },
                    { code: 'BE', title: 'Backend Development', tech: 'ASP.NET / Node.js', desc: 'Design reliable APIs and services.' },
                    { code: 'MB', title: 'Mobile Development', tech: 'Flutter', desc: 'Create cross-platform mobile experiences.' },
                    { code: 'DE', title: 'Data Engineering', tech: 'Data Engineering', desc: 'Shape dependable data pipelines.' }
                  ].map((track) => (
                    <div key={track.code} onClick={() => setFormData({...formData, selectedTrack: track.title})} className={`p-5 bg-white border rounded-[20px] cursor-pointer transition relative shadow-sm ${formData.selectedTrack === track.title ? 'border-[#5C1D87] shadow-md' : 'border-[#E8E2EC]'}`}>
                      <div className="absolute top-4 right-4 w-3 h-3 rounded-full border border-slate-300"></div>
                      <div className="w-[33px] h-[38px] bg-gradient-to-br from-[#6F2C99] to-[#3A0353] text-white text-[10px] rounded-[12px] flex items-center justify-center font-bold mb-3">{track.code}</div>
                      <h3 className="text-xs font-bold text-[#111827]">{track.title}</h3>
                      <p className="text-[10px] text-[#5C1D87] mt-0.5">{track.tech}</p>
                      <p className="text-[11px] text-[#6B7280] mt-2 leading-relaxed">{track.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap justify-end items-center gap-4 pt-4">
                <button onClick={() => setCurrentStep(2)} className="font-bold text-sm text-[#5C1D87]">Back</button>
                <button onClick={() => setCurrentStep(4)} className="px-7 py-3.5 bg-gradient-to-r from-[#4C0585] to-[#3A0353] text-white font-bold text-sm rounded-[13px] shadow">Confirm Path →</button>
              </div>
            </div>
          )}

          {/* STEP 4: CV */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h1 className="text-[36px] sm:text-[46px] lg:text-[58px] leading-[1.08] font-extrabold text-[#21062E] tracking-[-0.045em] text-balance">Upload Your CV</h1>
                <p className="text-[#69616D] text-base">Your CV helps us understand your background and prepare a relevant assessment.</p>
              </div>

              <div className="bg-white/88 p-4 rounded-[18px] border border-[#3A0353]/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-[38px] h-[38px] shrink-0 bg-[#3A0353] rounded-[12px] flex items-center justify-center"><img src={shieldWhiteNarrowIcon} alt="" aria-hidden="true" width={18} height={18} /></div>
                  <div><h4 className="text-xs font-bold text-[#111827]">Required for every package</h4><p className="text-[9px] text-[#6B7280]">Your CV must be ready before the interview.</p></div>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-[9px] text-[#5C1D87]">
                  <span className="border-l border-[#E8E2EC] pl-3">PDF or DOCX</span>
                  <span className="border-l border-[#E8E2EC] pl-3">5 MB maximum</span>
                  <button onClick={() => setViewMode('cv-review')} className="px-3 py-1 bg-[#F3E9FA] font-bold rounded-full tracking-[0.72px] underline">PREVIEW CV REVIEW LAYOUT</button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/92 p-7 rounded-[28px] border border-[#3A0353]/10 shadow-sm flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <div><span className="text-[9px] font-bold text-[#8B5DB0] uppercase">01 · ADD YOUR FILE</span><h3 className="text-lg font-normal text-[#111827]">Upload from your device</h3></div>
                      <div className="w-[42px] h-[42px] bg-[#FBF7FE] border border-[#E0D3E7] rounded-[13px] flex items-center justify-center text-xs font-bold text-[#5C1D87]">CV</div>
                    </div>

                    <div onClick={() => setFormData({...formData, cvUploaded: !formData.cvUploaded})} className={`border-2 border-dashed p-8 rounded-[24px] text-center cursor-pointer flex flex-col items-center justify-center ${formData.cvUploaded ? 'border-[#8AC8A7] bg-gradient-to-b from-[#FFFFFF] to-[#F1FBF5]' : 'border-[#BFA4CE] bg-gradient-to-b from-[#FDFBFF] to-[#F6EEFB]'}`}>
                      <div className={`w-16 h-16 rounded-[20px] flex items-center justify-center text-xl mb-3 shadow-lg text-white ${formData.cvUploaded ? 'bg-[#16794A]' : 'bg-[#3A0353]'}`}>
                        {formData.cvUploaded ? '✓' : <img src={uploadWhiteIcon} alt="" aria-hidden="true" width={20} height={20} />}
                      </div>
                      <h4 className="text-base font-normal text-[#111827]">{formData.cvUploaded ? 'CV added successfully' : 'Drop your CV here'}</h4>
                      <p className="text-xs text-[#6B7280] mb-4">{formData.cvUploaded ? 'Click anywhere to replace this file' : 'Drag and drop, or click to browse'}</p>
                      <div className="flex justify-center gap-2">
                        <span className="px-2.5 py-1 bg-white/70 text-[8px] text-[#5C1D87] border rounded-[7px]">PDF</span>
                        <span className="px-2.5 py-1 bg-white/70 text-[8px] text-[#5C1D87] border rounded-[7px]">DOCX</span>
                        <span className="px-2.5 py-1 bg-white/70 text-[8px] text-[#5C1D87] border rounded-[7px]">MAX 5 MB</span>
                      </div>
                    </div>

                    {formData.cvUploaded && (
                      <div className="mt-4 p-3 bg-white border border-[#E8E2EC] rounded-[12px] flex items-center justify-between shadow-xs">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-[#F3E9FA] text-[#5C1D87] rounded-[9px] flex items-center justify-center text-[10px] font-bold">DOC</div>
                          <div><h5 className="text-xs text-[#111827]">InternsHub — Portals & Modules.docx</h5><p className="text-[9px] text-[#6B7280]">0.02 MB · Illustrative local upload</p></div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="px-2.5 py-1 bg-[#EAF8F0] text-[#16794A] text-[9px] font-bold rounded-full">success</span>
                          <button onClick={() => setFormData({...formData, cvUploaded: false})} className="text-xs text-[#5C1D87] underline">Remove</button>
                        </div>
                      </div>
                    )}
                  </div>
                  <div><a href="#parse-fail" className="text-[9px] text-[#6B7280] underline">Preview parse-failure state</a></div>
                </div>

                <div className="bg-white/92 p-7 rounded-[28px] border border-[#3A0353]/10 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <div><span className="text-[9px] font-bold text-[#8B5DB0] uppercase">02 · SMART REVIEW</span><h3 className="text-lg font-normal text-[#111827]">CV profile snapshot</h3></div>
                      <span className={`px-3 py-1 text-[9px] font-bold rounded-full ${formData.cvUploaded ? 'bg-[#EAF8F0] text-[#16794A]' : 'bg-[#F1EEF2] text-[#685F6D]'}`}>{formData.cvUploaded ? 'Parsed' : 'Waiting'}</span>
                    </div>

                    <div className={`flex items-center justify-between px-4 py-3 rounded-[13px] text-[8px] mb-6 ${formData.cvUploaded ? 'bg-[#FAF8FB] text-[#16794A]' : 'bg-[#FAF8FB] text-[#AAA2AD]'}`}>
                      <span>{formData.cvUploaded ? '✓' : '①'} Upload</span><span className={`flex-grow h-[1px] mx-3 ${formData.cvUploaded ? 'bg-[#16794A]' : 'bg-[#E8E2EC]'}`}></span>
                      <span>{formData.cvUploaded ? '✓' : '②'} Parse</span><span className={`flex-grow h-[1px] mx-3 ${formData.cvUploaded ? 'bg-[#16794A]' : 'bg-[#E8E2EC]'}`}></span>
                      <span>{formData.cvUploaded ? '✓' : '③'} Review</span>
                    </div>

                    {formData.cvUploaded ? (
                      <div className="grid grid-cols-2 gap-3">
                        {['SKILLS', 'EDUCATION', 'PROJECTS', 'EXPERIENCE'].map((cat) => (
                          <div key={cat} className="p-4 bg-[#FBF7FE] rounded-[12px] space-y-1">
                            <span className="text-[8px] text-[#8B5DB0] uppercase">{cat}</span>
                            <h5 className="text-xs text-[#111827]">Review extracted {cat.toLowerCase()}</h5>
                            <p className="text-[8px] text-[#16794A] pt-1">Ready to review</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6 text-[#6B7280]">
                        <div className="w-[68px] h-[68px] bg-gradient-to-br from-white to-[#F4EAFA] border border-[#D9C8E3] rounded-[20px] mx-auto flex items-center justify-center mb-3 shadow-md"><img src={uploadPurpleIcon} alt="" aria-hidden="true" width={20} height={20} /></div>
                        <h4 className="text-sm font-normal text-[#111827]">Your profile preview starts here</h4>
                        <p className="text-[11px] text-[#6B7280] max-w-[270px] mx-auto mt-1 leading-relaxed">Skills, education, projects, and experience will be organized for your review.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap justify-end items-center gap-4 pt-4">
                <button onClick={() => setCurrentStep(3)} className="font-bold text-sm text-[#5C1D87]">Back</button>
                <button onClick={() => setCurrentStep(5)} className={`px-7 py-3.5 font-bold text-sm rounded-[13px] shadow flex items-center gap-2 ${formData.cvUploaded ? 'bg-gradient-to-r from-[#4C0585] to-[#3A0353] text-white' : 'bg-[#ECEAED] text-[#9A939E] cursor-not-allowed'}`}>
                  Continue to Payment →
                </button>
              </div>
            </div>
          )}

          {/* STEP 6: Setup */}
          {currentStep === 6 && (
            <div className="space-y-6">
              <div>
                <h1 className="text-[36px] sm:text-[46px] lg:text-[58px] leading-[1.08] font-extrabold text-[#21062E] tracking-[-0.045em] text-balance">Get Ready for Your Interview</h1>
                <p className="text-[#69616D] text-base">Check your setup and review the recording requirements before starting.</p>
              </div>

              <div className="bg-[#FFF7E6] p-4 rounded-[14px] border border-[#9A5700]/20 flex gap-3 text-xs text-[#9A5700]">
                <span aria-hidden="true" className="mt-px flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full border border-current text-[13px] leading-none">i</span>
                <div>
                  <p className="font-bold">Please open InternsHub on your laptop to continue.</p>
                  <p className="text-[11px] mt-0.5">The recorded interview is available on desktop or laptop only.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  { tile: 'CA', name: 'Camera', desc: 'Permission is required to continue' },
                  { tile: 'MI', name: 'Microphone', desc: 'Permission is required to continue' },
                  { tile: 'SC', name: 'Screen sharing', desc: 'Required during the recorded interview' },
                  { tile: 'CO', name: 'Connection', desc: 'A stable connection helps prevent interruption' }
                ].map((item) => (
                  <div key={item.name} className="bg-white p-5 rounded-[20px] border border-[#E8E2EC] relative shadow-xs flex flex-col justify-between h-[190px]">
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <div className="w-[42px] h-[42px] bg-[#F3E9FA] rounded-[12px] flex items-center justify-center text-xs font-bold text-[#5C1D87]">{item.tile}</div>
                        <span className="px-2.5 py-1 bg-[#F1EEF2] text-[#685F6D] text-[9px] font-bold rounded-full">Not checked</span>
                      </div>
                      <h3 className="text-sm font-normal text-[#111827]">{item.name}</h3>
                      <p className="text-[10px] text-[#6B7280] mt-1">{item.desc}</p>
                    </div>
                    <button className="text-xs font-bold text-[#5C1D87] text-left">Run check</button>
                  </div>
                ))}
              </div>

              <div className="bg-white p-6 rounded-[28px] border border-[#3A0353]/10 shadow-sm space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-[52px] h-[52px] shrink-0 bg-[#3A0353] rounded-[12px] flex items-center justify-center"><img src={shieldWhiteIcon} alt="" aria-hidden="true" width={20} height={20} /></div>
                  <div>
                    <h3 className="text-lg font-normal text-[#111827]">Recording & privacy consent</h3>
                    <p className="text-[11px] text-[#5C5C5C] mt-1 leading-relaxed">InternsHub records camera, microphone, and shared screen during the interview. Recordings are deleted 90 days after the final decision; scores and transcripts are retained.</p>
                    <a href="#privacy" className="text-xs text-[#5C1D87] underline block mt-2">Read the Privacy Policy</a>
                  </div>
                </div>
                <div className="border-t border-[#E8E2EC] pt-4 flex items-center gap-3 text-xs text-[#5C5C5C]">
                  <input type="checkbox" id="consent" className="w-4 h-4 rounded" />
                  <label htmlFor="consent">I understand the recording requirements and consent to this demo readiness flow.</label>
                </div>
              </div>

              <div className="bg-white p-5 rounded-[18px] border border-[#3A0353]/10 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                <div className="border-r border-[#E8E2EC] pr-4"><span className="text-[10px] text-[#111827] font-bold block">Resume window</span><span className="text-[9px] text-[#6B7280]">Within one hour</span></div>
                <div className="border-r border-[#E8E2EC] pr-4"><span className="text-[10px] text-[#111827] font-bold block">Resume attempts</span><span className="text-[9px] text-[#6B7280]">Up to three</span></div>
                <div className="border-r border-[#E8E2EC] pr-4"><span className="text-[10px] text-[#111827] font-bold block">Incomplete attempt</span><span className="text-[9px] text-[#6B7280]">Retake after 48 hours, subject to attempt rules</span></div>
                <div><span className="text-[10px] text-[#111827] font-bold block">Attempt limit</span><span className="text-[9px] text-[#6B7280]">Three per track and interview type, then admin review</span></div>
              </div>
              <p className="text-[11px] text-[#6B7280]">Interview duration and question count are intentionally not shown because they remain open business decisions.</p>

              <div className="flex flex-wrap justify-end items-center gap-4 pt-4">
                <button onClick={() => setCurrentStep(5)} className="font-bold text-sm text-[#5C1D87]">Back</button>
                <button onClick={() => setCurrentStep(7)} className="px-7 py-3.5 bg-gradient-to-r from-[#4C0585] to-[#3A0353] text-white font-bold text-sm rounded-[13px] shadow flex items-center gap-2">
                  Start Interview →
                </button>
              </div>
            </div>
          )}

          {/* STEP 7: Result */}
          {currentStep === 7 && (
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
                  <button type="button" className="shrink-0 min-h-[38px] px-[15px] bg-white border border-[#CCB8D8] rounded-[13px] text-[9px] font-bold tracking-[0.09px] text-[#3A0353]">Appeal policy</button>
                </article>
                <article className="bg-white/90 border border-[#3A0353]/8 rounded-[16px] min-h-[92px] px-[18px] py-[17px] flex items-center gap-[13px]">
                  <div className="w-[38px] h-[38px] shrink-0 bg-[#F3E9FA] rounded-[12px] flex items-center justify-center"><img src={lockPurpleSmIcon} alt="" aria-hidden="true" width={17} height={20} /></div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[11px] leading-[16.5px] font-normal text-[#111827]">Your interview privacy</h4>
                    <p className="pt-[5px] text-[9px] leading-[13.5px] text-[#6B7280]">Recordings are deleted 90 days after the final decision; scores and transcripts are retained.</p>
                  </div>
                </article>
              </div>

              <div className="!mt-4">
                <button type="button" onClick={() => setCurrentStep(6)} className="min-h-[50px] px-6 text-[13px] font-bold tracking-[0.13px] text-[#5C1D87]">Back to device check</button>
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
                <div className="bg-white/92 p-7 rounded-[26px] border border-[#3A0353]/10 shadow-sm space-y-5 relative">
                  <div className="absolute top-6 right-6 w-8 h-8 bg-[#3A0353] rounded-lg flex items-center justify-center"><img src={lockWhiteIcon} alt="" aria-hidden="true" width={16} height={16} /></div>
                  <div>
                    <span className="text-[9px] font-bold text-[#8B5DB0] uppercase">SECURE CHECKOUT · DEMO</span>
                    <h3 className="text-[22px] font-normal text-[#111827] mt-1">Choose how you’ll pay</h3>
                    <p className="text-[9px] text-[#6B7280]">All methods remain subject to the final gateway configuration.</p>
                  </div>

                  <div className="bg-[#FFF7E6] p-4 rounded-[14px] border border-[#9A5700]/20 flex gap-3 text-xs text-[#9A5700]">
                    <span aria-hidden="true" className="mt-px flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full border border-current text-[13px] leading-none">i</span>
                    <div><p className="font-bold">Gateway configuration pending</p><p className="text-[11px] mt-0.5">One Egyptian gateway supporting cards, wallets, and Fawry is planned. No gateway has been selected or connected here.</p></div>
                  </div>

                  <div className="space-y-3">
                    <div className="p-4 bg-[#FBF7FE] border-2 border-[#5C1D87] rounded-[15px] flex items-center justify-between shadow-xs">
                      <div className="flex items-center gap-3">
                        <div className="w-[42px] h-[42px] shrink-0 bg-[#3A0353] rounded-[12px] flex items-center justify-center"><img src={cardWhiteIcon} alt="" aria-hidden="true" width={20} height={20} /></div>
                        <div><h4 className="text-xs font-normal text-[#111827]">Debit or credit card</h4><p className="text-[9px] text-[#6B7280]">Demo method · Egyptian pounds</p></div>
                      </div>
                      <div className="w-[22px] h-[22px] bg-[#16794A] text-white rounded-full flex items-center justify-center text-xs">✓</div>
                    </div>
                    <div className="p-4 bg-white border border-[#E8E2EC] rounded-[15px] flex items-center justify-between opacity-75">
                      <div className="flex items-center gap-3">
                        <div className="w-[42px] h-[42px] shrink-0 bg-[#F1EBF4] rounded-[12px] flex items-center justify-center"><img src={walletPurpleIcon} alt="" aria-hidden="true" width={20} height={20} /></div>
                        <div><h4 className="text-xs font-normal text-[#111827]">Mobile wallet</h4><p className="text-[9px] text-[#6B7280]">Availability depends on final gateway</p></div>
                      </div>
                      <div className="w-5 h-5 rounded-full border border-slate-300"></div>
                    </div>
                    <div className="p-4 bg-white border border-[#E8E2EC] rounded-[15px] flex items-center justify-between opacity-75">
                      <div className="flex items-center gap-3">
                        <div className="w-[42px] h-[42px] shrink-0 bg-[#F1EBF4] rounded-[12px] flex items-center justify-center"><img src={receiptPurpleIcon} alt="" aria-hidden="true" width={20} height={20} /></div>
                        <div><h4 className="text-xs font-normal text-[#111827]">Fawry</h4><p className="text-[9px] text-[#6B7280]">Availability depends on final gateway</p></div>
                      </div>
                      <div className="w-5 h-5 rounded-full border border-slate-300"></div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-[#5C1D87] pt-2">
                    <input type="checkbox" id="terms" className="w-4 h-4 rounded" />
                    <label htmlFor="terms">I accept the enrollment terms and acknowledge the <a href="#refund" className="underline font-bold">Refund Policy</a>.</label>
                  </div>

                  <button disabled className="w-full h-[50px] bg-[#ECEAED] text-[#9A939E] font-bold text-xs rounded-[13px] cursor-not-allowed">Pay & Enroll →</button>

                  <div className="text-center space-y-1 pt-2">
                    <div className="flex flex-wrap items-center justify-center gap-1.5 text-[9px] text-[#16794A]"><img src={shieldGreenIcon} alt="" aria-hidden="true" width={14} height={14} /><span className="font-bold">Protected demo checkout</span> — No real payment details are collected or processed</div>
                    <div><a href="#fail" className="text-[9px] text-[#5C1D87] underline">Preview payment failure state</a></div>
                  </div>
                </div>

                <div className="bg-white/92 p-7 rounded-[26px] border border-[#3A0353]/10 shadow-sm space-y-5">
                  <div className="flex justify-between items-start gap-3">
                    <div><span className="text-[9px] font-bold text-[#8B5DB0] uppercase">ORDER SUMMARY</span><h3 className="text-[21px] font-normal text-[#111827] mt-1">Your enrollment</h3></div>
                    <span className="px-3 py-1 bg-[#FFF7E6] text-[#9A5700] text-[9px] font-bold rounded-full">PRICE PENDING</span>
                  </div>

                  <div className="p-5 bg-gradient-to-br from-[#22023C] to-[#4C0585] text-white rounded-[17px] shadow-md flex items-center gap-4">
                    <div className="w-[52px] h-[52px] bg-white/10 border border-white/20 rounded-[16px] flex items-center justify-center text-xl font-extrabold">6</div>
                    <div><span className="text-[8px] text-[#CDBDD7] uppercase">SELECTED PACKAGE</span><h4 className="text-[17px] font-normal">{formData.selectedPackage}</h4><p className="text-[9px] text-[#E5DCE9]">{formData.selectedTrack}</p></div>
                  </div>

                  <div>
                    <span className="text-[8px] text-[#6B7280] uppercase block mb-2">WHAT’S INCLUDED</span>
                    <ul className="space-y-2 text-xs text-[#5C5C5C]">
                      <li>✓ Published courses after payment</li>
                      <li>✓ Practical internship</li>
                      <li>✓ 6 mentorship sessions · proposed</li>
                      <li>✓ Course + internship certificate types</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-[#FAF9FB] border border-[#E8E2EC] rounded-[15px] space-y-3 text-xs">
                    <div className="flex justify-between"><span className="text-slate-600">Package price</span><span className="font-bold text-[#111827]">To be confirmed</span></div>
                    <div className="flex justify-between border-t border-[#E8E2EC] pt-3"><span className="text-slate-600">Approved discount</span><span className="font-bold text-[#111827]">Not supplied</span></div>
                    <div className="flex justify-between border-t border-[#E8E2EC] pt-3"><span className="text-[#3A0353]">Total in EGP</span><span className="font-bold text-[#3A0353]">Pending approved pricing</span></div>
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
                    <div><span className="text-[8px] text-[#8B5DB0] block uppercase">PACKAGE</span><span className="font-normal text-[#111827]">{formData.selectedPackage}</span></div>
                    <div><span className="text-[8px] text-[#8B5DB0] block uppercase">TRACK</span><span className="font-normal text-[#111827]">{formData.selectedTrack}</span></div>
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

      {/* Footer */}
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
