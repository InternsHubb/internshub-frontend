import { Fragment, useState } from "react";

export default function OnboardingFlow() {
  const [currentStep, setCurrentStep] = useState(1);
  const [viewMode, setViewMode] = useState<"onboarding" | "cv-review">(
    "onboarding",
  );
  const [resultState, setResultState] = useState<
    "assigned" | "pending" | "incomplete"
  >("assigned");
  const [formData, setFormData] = useState({
    selectedPackage: "6 Months",
    selectedTrack: "Frontend Development",
    cvUploaded: false,
    selectedMentor: "Amina M.",
  });

  const stepsMeta = [
    { num: "01", title: "Account" },
    { num: "02", title: "Verify" },
    { num: "03", title: "Profile" },
    { num: "04", title: "Path" },
    { num: "05", title: "CV" },
    { num: "06", title: "Payment" },
    { num: "07", title: "Result" },
    { num: "08", title: "Setup" },
    { num: "09", title: "Squad" },
    { num: "10", title: "Mentorship" },
  ];

  // CV Review Screen View
  if (viewMode === "cv-review") {
    return (
      <div className="min-h-screen flex flex-col justify-between bg-[#F8F6FA] text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
        <header className="sticky top-0 z-50 flex items-center justify-between px-[72px] h-[72px] bg-white/92 border-b border-[#E8E2EC]">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-[38px] h-[38px] bg-gradient-to-br from-[#5C1D87] to-[#3A0353] rounded-[13px_13px_13px_4px] flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-sm">ih</span>
              </div>
              <span className="font-bold text-xl text-[#111827]">
                InternsHub
              </span>
              <span className="bg-[#F7F0FB] text-[#5C1D87] text-[10px] font-bold px-2.5 py-1 rounded-full">
                EDTECH
              </span>
            </div>
            <span className="text-[9px] font-normal tracking-[1.08px] text-[#6B7280] pl-2 border-l border-[#E8E2EC]">
              CV REVIEW
            </span>
          </div>
          <button
            onClick={() => setViewMode("onboarding")}
            className="px-4 py-2 bg-white border border-[#E8E2EC] text-[#5C1D87] text-xs font-normal rounded-[10px] hover:bg-slate-50"
          >
            Exit preview
          </button>
        </header>

        <main className="flex-grow flex justify-center px-4 py-12">
          <div className="w-[1146px] space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
              <div className="space-y-3">
                <span className="inline-block px-3 py-1 bg-[#FFF7E6] text-[#9A5700] text-[9px] font-bold rounded-full tracking-[0.72px]">
                  ILLUSTRATIVE EXTRACTION PREVIEW
                </span>
                <h1 className="text-[47px] font-extrabold text-[#21062E] tracking-[-2.115px]">
                  Review your information
                </h1>
                <p className="text-xs text-[#6B7280]">
                  Check the information extracted from your CV and correct
                  anything that needs attention.
                </p>
              </div>
              <div className="bg-white p-3.5 border border-[#E8E2EC] rounded-[15px] shadow-sm flex items-center gap-3 w-[300px]">
                <div className="w-9 h-9 bg-[#F3E9FA] text-[#5C1D87] rounded-[9px] flex items-center justify-center text-xs font-bold">
                  PDF
                </div>
                <div className="flex-grow">
                  <h4 className="text-[10px] text-[#111827]">sample-cv.pdf</h4>
                  <p className="text-[8px] text-[#6B7280]">
                    Illustrative file · not user data
                  </p>
                </div>
                <span className="px-2.5 py-1 bg-[#EAF8F0] text-[#16794A] text-[9px] font-bold rounded-full">
                  Parsed
                </span>
              </div>
            </div>

            <div className="bg-[#FBF7FE] p-4 rounded-[14px] border border-[#4C0585]/10 flex items-start gap-3">
              <div className="w-[22px] h-[22px] rounded-full border border-[#3A0353] flex items-center justify-center text-[#3A0353] text-xs font-serif italic">
                i
              </div>
              <div className="text-xs text-[#3A0353]">
                <p className="font-bold">Sample content only</p>
                <p className="text-[11px] mt-0.5">
                  The information below demonstrates the review experience. It
                  is not presented as data from a real user.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
              <div className="bg-white p-3 border border-[#E8E2EC] rounded-[18px] shadow-sm space-y-1">
                {[
                  { id: "01", title: "Personal information", active: true },
                  { id: "02", title: "Education", active: false },
                  { id: "03", title: "Skills", active: false },
                  { id: "04", title: "Projects", active: false },
                  { id: "05", title: "Experience", active: false },
                ].map((nav) => (
                  <div
                    key={nav.id}
                    className={`flex items-center gap-3 p-3 rounded-[10px] text-xs ${nav.active ? "bg-[#F3E9FA] text-[#3A0353] font-bold" : "text-[#6B7280]"}`}
                  >
                    <span
                      className={`w-6 h-6 rounded-[8px] flex items-center justify-center text-[8px] ${nav.active ? "bg-[#3A0353] text-white" : "bg-[#F2EEF4]"}`}
                    >
                      {nav.id}
                    </span>
                    <span>{nav.title}</span>
                  </div>
                ))}
              </div>

              <div className="md:col-span-3 space-y-4">
                <div className="bg-white p-6 border border-[#3A0353]/10 rounded-[19px] shadow-xs space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] text-[#DD6F0D]">01</span>
                      <h3 className="text-[15px] font-normal text-[#111827]">
                        Personal information
                      </h3>
                    </div>
                    <button className="px-3 py-1 bg-white border border-[#DACDE1] text-[#5C1D87] text-[8px] font-bold rounded-[9px]">
                      Edit
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="p-3.5 bg-[#FAF8FB] rounded-[11px]">
                      <span className="text-[7px] text-[#8B5DB0] tracking-[0.7px] uppercase block">
                        FULL NAME
                      </span>
                      <p className="text-[10px] text-[#111827] mt-1">
                        Sample Student
                      </p>
                    </div>
                    <div className="p-3.5 bg-[#FAF8FB] rounded-[11px]">
                      <span className="text-[7px] text-[#8B5DB0] tracking-[0.7px] uppercase block">
                        EMAIL
                      </span>
                      <p className="text-[10px] text-[#111827] mt-1">
                        sample@example.com
                      </p>
                    </div>
                    <div className="p-3.5 bg-[#FAF8FB] rounded-[11px]">
                      <span className="text-[7px] text-[#8B5DB0] tracking-[0.7px] uppercase block">
                        PHONE
                      </span>
                      <p className="text-[10px] text-[#111827] mt-1">
                        +20 ••• ••• 4821
                      </p>
                    </div>
                    <div className="p-3.5 bg-[#FAF8FB] rounded-[11px]">
                      <span className="text-[7px] text-[#8B5DB0] tracking-[0.7px] uppercase block">
                        LOCATION
                      </span>
                      <p className="text-[10px] text-[#111827] mt-1">
                        Not extracted
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 border border-[#3A0353]/10 rounded-[19px] shadow-xs space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] text-[#DD6F0D]">02</span>
                      <h3 className="text-[15px] font-normal text-[#111827]">
                        Education
                      </h3>
                    </div>
                    <button className="px-3 py-1 bg-white border border-[#DACDE1] text-[#5C1D87] text-[8px] font-bold rounded-[9px]">
                      Edit
                    </button>
                  </div>
                  <div className="p-3.5 bg-[#FAF9FB] border border-[#E8E2EC] rounded-[12px] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-[38px] h-[38px] bg-[#3A0353] text-white rounded-[11px] flex items-center justify-center text-[8px]">
                        ED
                      </div>
                      <div>
                        <h4 className="text-[10px] text-[#111827]">
                          Sample degree title
                        </h4>
                        <p className="text-[8px] text-[#6B7280]">
                          Sample institution · Graduation year unavailable
                        </p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-[#FFF7E6] text-[#9A5700] text-[9px] font-bold rounded-full">
                      REVIEW NEEDED
                    </span>
                  </div>
                </div>

                <div className="bg-white p-6 border border-[#3A0353]/10 rounded-[19px] shadow-xs space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] text-[#DD6F0D]">03</span>
                      <h3 className="text-[15px] font-normal text-[#111827]">
                        Skills
                      </h3>
                    </div>
                    <button className="px-3 py-1 bg-white border border-[#DACDE1] text-[#5C1D87] text-[8px] font-bold rounded-[9px]">
                      Edit
                    </button>
                  </div>
                  <div className="flex gap-2">
                    {["React", "JavaScript", "HTML", "CSS"].map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1.5 bg-[#F3E9FA] text-[#5C1D87] text-[8px] rounded-[8px]"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-6 border border-[#3A0353]/10 rounded-[19px] shadow-xs space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] text-[#DD6F0D]">04</span>
                      <h3 className="text-[15px] font-normal text-[#111827]">
                        Projects
                      </h3>
                    </div>
                    <button className="px-3 py-1 bg-white border border-[#DACDE1] text-[#5C1D87] text-[8px] font-bold rounded-[9px]">
                      Edit
                    </button>
                  </div>
                  <div className="p-3.5 bg-[#FAF9FB] border border-[#E8E2EC] rounded-[12px] flex items-center gap-3">
                    <div className="w-[38px] h-[38px] bg-[#3A0353] text-white rounded-[11px] flex items-center justify-center text-[8px]">
                      PR
                    </div>
                    <div>
                      <h4 className="text-[10px] text-[#111827]">
                        Illustrative portfolio project
                      </h4>
                      <p className="text-[8px] text-[#6B7280]">
                        Project description will use extracted CV content
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 border border-[#3A0353]/10 rounded-[19px] shadow-xs space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] text-[#DD6F0D]">05</span>
                      <h3 className="text-[15px] font-normal text-[#111827]">
                        Experience
                      </h3>
                    </div>
                    <button className="px-3 py-1 bg-white border border-[#DACDE1] text-[#5C1D87] text-[8px] font-bold rounded-[9px]">
                      Add manually
                    </button>
                  </div>
                  <div className="p-3.5 bg-[#FAF9FB] rounded-[12px] flex items-center gap-3">
                    <span className="text-slate-500">⬆</span>
                    <div>
                      <h4 className="text-[10px] text-[#111827]">
                        No experience information extracted
                      </h4>
                      <p className="text-[8px] text-[#6B7280]">
                        You can add it manually or continue if this section does
                        not apply.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-[#E8E2EC]">
              <button className="px-6 py-3 bg-white border border-[#CCB8D8] text-[#3A0353] font-bold text-xs rounded-[13px]">
                Re-upload CV
              </button>
              <button
                onClick={() => setViewMode("onboarding")}
                className="px-7 py-3 bg-gradient-to-r from-[#4C0585] to-[#3A0353] text-white font-bold text-xs rounded-[13px] shadow"
              >
                Confirm and continue →
              </button>
            </div>
          </div>
        </main>

        <footer className="flex flex-row items-center justify-between px-[72px] h-[130px] bg-gradient-to-tr from-[#22023C] via-[#22023C] to-[#8B5DB0]/30 text-white">
          <div className="flex items-center gap-3">
            <div className="w-[38px] h-[38px] bg-gradient-to-br from-[#5C1D87] to-[#3A0353] rounded-[13px_13px_13px_4px] flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-sm">ih</span>
            </div>
            <span className="font-bold text-xl">InternsHub</span>
            <span className="text-[11px] text-[#D7C8DF] pl-3 border-l border-white/20">
              From Student to a Tech Career.
            </span>
          </div>
          <span className="text-[9px] text-[#9F8DAC]">
            Modern Onboarding v6.0 · Interactive product demo
          </span>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#F8F6FA] text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-[72px] h-[72px] bg-white/82 border-b border-[#3A0353]/10 shadow-[0_1px_0_rgba(58,3,83,0.04)] backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <div className="w-[38px] h-[38px] bg-gradient-to-br from-[#5C1D87] to-[#3A0353] shadow-[0_8px_18px_rgba(58,3,83,0.2)] rounded-[13px_13px_13px_4px] flex items-center justify-center relative">
            <span className="text-white font-bold text-sm tracking-[-1.12px]">
              ih
            </span>
          </div>
          <span className="font-bold text-xl text-[#111827]">InternsHub</span>
          <span className="bg-[#F7F0FB] text-[#5C1D87] text-[10px] font-bold px-2.5 py-1 rounded-full tracking-[1.6px]">
            EDTECH
          </span>
        </div>

        <div className="flex items-center gap-6">
          <span className="text-xs text-[#6B7280]">Demo onboarding</span>
          <button className="text-[#5C1D87] font-bold text-[13px] hover:underline">
            Need help?
          </button>
        </div>
      </header>

      {/* Progress Navigation Bar */}
      <div className="w-full flex justify-center pt-4 px-4">
        <div className="w-[1120px] h-[85.6px] bg-white/86 border border-[#3A0353]/10 shadow-[0_8px_28px_rgba(34,2,60,0.06)] backdrop-blur-md rounded-[20px] flex items-center justify-between px-8 relative">
          {stepsMeta.map((s, index) => {
            const stepNumber = index + 1;
            const isCompleted = stepNumber < currentStep;
            const isCurrent = stepNumber === currentStep;

            return (
              <Fragment key={s.num}>
                <button
                  onClick={() => setCurrentStep(stepNumber)}
                  className="flex flex-col items-center gap-1.5 focus:outline-none transition group z-10"
                >
                  <div
                    className={`w-[34px] h-[34px] rounded-full flex items-center justify-center text-[10px] font-bold transition ${
                      isCompleted
                        ? "bg-[#8B5DB0] text-white"
                        : isCurrent
                          ? "bg-gradient-to-br from-[#5C1D87] to-[#3A0353] text-white shadow-[0_0_0_5px_#F2E8F8,0_8px_16px_rgba(58,3,83,0.18)]"
                          : "bg-white border border-[#E6DFE9] text-[#AAA2AD]"
                    }`}
                  >
                    {isCompleted ? "✓" : s.num}
                  </div>
                  <span
                    className={`text-[10px] tracking-[0.1px] ${isCurrent ? "text-[#3A0353] font-bold" : "text-[#AAA2AD]"}`}
                  >
                    {s.title}
                  </span>
                </button>

                {index < stepsMeta.length - 1 && (
                  <div
                    className={`flex-grow h-[2px] mx-2 transition-colors ${
                      stepNumber < currentStep ? "bg-[#8B5DB0]" : "bg-[#E8E2EC]"
                    }`}
                  />
                )}
              </Fragment>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-grow flex justify-center px-4 py-8">
        <div className="w-[1240px]">
          <div className="inline-flex items-center px-3 py-1.5 bg-[#FFF3E8] rounded-[9px] mb-3">
            <span className="text-[11px] font-bold text-[#DD6F0D] tracking-[1.32px]">
              STEP {String(currentStep).padStart(2, "0")} · INTERNSHUB
              ONBOARDING
            </span>
          </div>

          {/* STEP 1: Account */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h1 className="text-[58px] font-extrabold text-[#21062E] tracking-[-2.61px]">
                Create Your Account
              </h1>
              <p className="text-[#69616D] text-base">
                Get started with your technical journey at InternsHub.
              </p>
              <div className="bg-white/92 p-8 rounded-[28px] border border-[#3A0353]/10 max-w-lg space-y-4">
                <div>
                  <label className="block text-xs text-[#34303A] mb-1 font-semibold">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    className="w-full h-[52px] px-4 rounded-[10px] border border-[#D9D1DD] bg-[#FAF9FB] text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#34303A] mb-1 font-semibold">
                    Password
                  </label>
                  <input
                    type="password"
                    placeholder="At least 8 characters"
                    className="w-full h-[52px] px-4 rounded-[10px] border border-[#D9D1DD] bg-[#FAF9FB] text-sm outline-none"
                  />
                </div>
                <button
                  onClick={() => setCurrentStep(2)}
                  className="w-full h-[50px] bg-gradient-to-r from-[#4C0585] to-[#3A0353] text-white font-bold rounded-[13px]"
                >
                  Create Account & Continue →
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Verify */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h1 className="text-[58px] font-extrabold text-[#21062E] tracking-[-2.61px]">
                Verify Your Account
              </h1>
              <p className="text-[#69616D] text-base">
                Confirm your email, phone number and National ID to secure your
                account.
              </p>

              <div className="bg-[#FFFFFF] p-4 rounded-[14px] border border-[#4C0585]/10 flex items-start gap-3 mb-6 shadow-sm">
                <div className="w-[22px] h-[22px] rounded-full border border-[#3A0353] flex items-center justify-center text-[#3A0353] text-xs font-serif italic">
                  i
                </div>
                <div className="text-xs text-[#3A0353]">
                  <p className="font-bold">
                    All three verifications are required, in order
                  </p>
                  <p className="text-[11px] mt-0.5">
                    Google sign-in does not bypass email, phone and National ID
                    verification before payment or AI interview.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="bg-white/92 p-6 rounded-[28px] border border-[#3A0353]/10 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-[42px] h-[42px] bg-[#F3E9FA] rounded-[12px] flex items-center justify-center text-[#5C1D87]">
                        🛡️
                      </div>
                      <span className="px-2.5 py-1 bg-[#F1EEF2] text-[#685F6D] text-[9px] font-bold rounded-full">
                        Pending
                      </span>
                    </div>
                    <h3 className="text-base font-normal text-[#111827]">
                      Email verification
                    </h3>
                    <p className="text-[11px] text-[#6B7280] mb-4">
                      Code sent to m***@gmail.com
                    </p>
                    <p className="text-[11px] text-[#111827] mb-3">
                      Enter the 6-digit code we sent to your email address, then
                      tap Verify Email.
                    </p>
                    <div className="flex gap-1.5 mb-5">
                      {[...Array(6)].map((_, i) => (
                        <input
                          key={i}
                          type="text"
                          maxLength={1}
                          className="w-10 h-[52px] text-center border border-[#D9D1DD] rounded-[10px] text-base font-bold bg-[#FAF9FB] outline-none"
                        />
                      ))}
                    </div>
                    <div className="mb-6">
                      <a
                        href="#resend"
                        className="text-xs text-[#5C1D87] underline"
                      >
                        Resend code · 00:24
                      </a>
                    </div>
                  </div>
                  <div>
                    <button className="w-full h-[50px] bg-gradient-to-r from-[#4C0585] to-[#3A0353] text-white font-bold text-xs rounded-[13px] mb-3">
                      Verify Email
                    </button>
                    <p className="text-[10px] text-[#6B7280]">
                      Demo only. No real message is sent or verified.
                    </p>
                  </div>
                </div>

                <div className="bg-white/92 p-6 rounded-[28px] border border-[#3A0353]/10 shadow-sm opacity-70 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-[42px] h-[42px] bg-[#F3E9FA] rounded-[12px] flex items-center justify-center text-[#5C1D87]">
                        🔒
                      </div>
                      <span className="px-2.5 py-1 bg-[#F1EEF2] text-[#685F6D] text-[9px] font-bold rounded-full">
                        Pending
                      </span>
                    </div>
                    <h3 className="text-base font-normal text-[#111827]">
                      Phone verification
                    </h3>
                    <p className="text-[11px] text-[#6B7280] mb-4">
                      Code will be sent to +20 ••• ••• 4821
                    </p>
                    <p className="text-[11px] text-[#111827] mb-3">
                      Enter the 6-digit code we send by SMS to your phone.
                      Available after your email is verified.
                    </p>
                    <div className="flex gap-1.5 mb-5">
                      {[...Array(6)].map((_, i) => (
                        <input
                          key={i}
                          type="text"
                          maxLength={1}
                          disabled
                          className="w-10 h-[52px] text-center border border-[#D9D1DD] rounded-[10px] text-base bg-[#FAF9FB] outline-none"
                        />
                      ))}
                    </div>
                    <div className="mb-6">
                      <a
                        href="#resend"
                        className="text-xs text-[#5C1D87] underline"
                      >
                        Resend code
                      </a>
                    </div>
                  </div>
                  <div>
                    <button
                      disabled
                      className="w-full h-[50px] bg-[#ECEAED] text-[#9A939E] font-bold text-xs rounded-[13px] mb-3"
                    >
                      Verify Phone
                    </button>
                    <p className="text-[10px] text-[#6B7280]">
                      Demo only. No real message is sent or verified.
                    </p>
                  </div>
                </div>

                <div className="bg-white/92 p-6 rounded-[28px] border border-[#3A0353]/10 shadow-sm opacity-70 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-[42px] h-[42px] bg-[#F3E9FA] rounded-[12px] flex items-center justify-center text-[#5C1D87]">
                        🪪
                      </div>
                      <span className="px-2.5 py-1 bg-[#F1EEF2] text-[#685F6D] text-[9px] font-bold rounded-full">
                        Pending
                      </span>
                    </div>
                    <h3 className="text-base font-normal text-[#111827]">
                      National ID verification
                    </h3>
                    <p className="text-[11px] text-[#6B7280] mb-4">
                      Egyptian National ID · 14 digits
                    </p>
                    <p className="text-[11px] text-[#111827] mb-3">
                      Enter your 14-digit National ID number to verify your
                      identity. Available after your phone is verified.
                    </p>
                    <input
                      type="text"
                      disabled
                      placeholder="Enter 14-digit National ID"
                      className="w-full h-[52px] px-4 border border-[#D9D1DD] rounded-[10px] text-xs bg-[#FAF9FB] mb-5 outline-none"
                    />
                  </div>
                  <div>
                    <button
                      disabled
                      className="w-full h-[50px] bg-[#ECEAED] text-[#9A939E] font-bold text-xs rounded-[13px] mb-3"
                    >
                      Verify National ID
                    </button>
                    <p className="text-[10px] text-[#6B7280]">
                      Demo only. No real message is sent or verified.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end items-center gap-4 pt-6">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="font-bold text-sm text-[#5C1D87]"
                >
                  Back
                </button>
                <button
                  onClick={() => setCurrentStep(3)}
                  className="px-7 py-3.5 bg-gradient-to-r from-[#4C0585] to-[#3A0353] text-white font-bold text-sm rounded-[13px] shadow"
                >
                  Continue to Profile →
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Profile */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h1 className="text-[58px] font-extrabold text-[#21062E] tracking-[-2.61px]">
                  Let’s Get to Know You
                </h1>
                <p className="text-[#69616D] text-base mt-2">
                  Add the essential details needed to set up your InternsHub
                  account.
                </p>
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
                      Two essentials.
                      <br />
                      One clear start.
                    </h4>
                  </div>
                </div>

                <div className="md:col-span-2 p-8 space-y-6 bg-white flex flex-col justify-between">
                  <div className="space-y-5">
                    <div className="flex items-center justify-between border-b border-[#E8E2EC] pb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#3A0353] text-white rounded-[12px] flex items-center justify-center">
                          🛡️
                        </div>
                        <div>
                          <span className="text-[9px] font-bold text-[#8B5DB0] uppercase tracking-[0.9px]">
                            ACCOUNT ESSENTIALS
                          </span>
                          <h3 className="text-[18px] font-normal text-[#111827]">
                            Your basic information
                          </h3>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-[#F3E9FA] text-[#5C1D87] text-[9px] font-bold rounded-full tracking-[0.72px]">
                        2 REQUIRED
                      </span>
                    </div>

                    <div className="bg-[#FFF7E6] p-4 rounded-[14px] border border-[#9A5700]/20 flex gap-3 text-xs text-[#9A5700]">
                      <span>ℹ️</span>
                      <div>
                        <p className="font-bold">Age requirement</p>
                        <p className="text-[11px] mt-0.5">
                          You must be 18 or older to join InternsHub.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] text-[#34303A] mb-1 font-medium">
                          Full name
                        </label>
                        <input
                          type="text"
                          placeholder="Enter your full name"
                          className="w-full h-[52px] px-4 rounded-[12px] border border-[#E3DCE6] bg-[#FAF9FB] text-xs outline-none placeholder:text-slate-400"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-[#34303A] mb-1 font-medium">
                          Date of birth
                        </label>
                        <div className="relative flex items-center">
                          <input
                            type="text"
                            placeholder="Enter your birthday"
                            className="w-full h-[52px] px-4 rounded-[12px] border border-[#E3DCE6] bg-[#FAF9FB] text-xs outline-none placeholder:text-slate-400"
                          />
                          <span className="absolute right-4 text-[#4A2A5E]">
                            📅
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-[#6B7280] text-[11px] pt-1">
                      <span>🔒</span>
                      <p>
                        Your date of birth is saved once and cannot be changed
                        later.
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end items-center gap-4 pt-4 border-t border-[#E8E2EC]">
                    <button
                      onClick={() => setCurrentStep(2)}
                      className="font-bold text-sm text-[#5C1D87]"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => setCurrentStep(4)}
                      className="px-7 py-3.5 bg-[#ECEAED] text-[#9A939E] font-bold text-sm rounded-[13px] flex items-center gap-2 cursor-not-allowed"
                    >
                      Save & Continue →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Path */}
          {currentStep === 4 && (
            <div className="space-y-8">
              <div>
                <h1 className="text-[58px] font-extrabold text-[#21062E] tracking-[-2.61px]">
                  Choose Your Path to a Tech Career
                </h1>
                <p className="text-[#69616D] text-base">
                  Choose the program duration and technology track that match
                  your goals.
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <span className="text-[#DD6F0D] font-bold text-xs">01</span>
                    <h2 className="text-xl font-normal text-[#111827]">
                      Select your package
                    </h2>
                  </div>
                  <span className="px-3 py-1 bg-[#FFF7E6] text-[#9A5700] text-[9px] font-bold rounded-full">
                    PRICING PENDING
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="bg-white p-7 rounded-[24px] border border-[#3A0353]/10 shadow-sm flex flex-col justify-between">
                    <div>
                      <span className="text-[9px] font-bold text-[#8B5DB0] uppercase">
                        INTERNSHIP FOCUS
                      </span>
                      <h3 className="text-[28px] font-normal text-[#111827] mt-1 mb-2">
                        3 Months
                      </h3>
                      <div className="flex items-end gap-1 mb-6">
                        <span className="text-xs font-bold text-slate-500">
                          EGP
                        </span>
                        <span className="text-[28px] font-bold text-[#3A0353]">
                          3,000
                        </span>
                        <span className="text-[11px] text-slate-400">
                          / package
                        </span>
                      </div>
                      <ul className="space-y-3 text-xs text-[#5C5C5C] mb-6">
                        <li>✓ Practical internship</li>
                        <li>✓ 3 mentorship sessions · proposed</li>
                        <li>✓ Internship certificate</li>
                        <li>✓ Courses not included</li>
                      </ul>
                    </div>
                    <button
                      onClick={() =>
                        setFormData({
                          ...formData,
                          selectedPackage: "3 Months",
                        })
                      }
                      className="w-full h-[50px] rounded-[13px] border border-[#CCB8D8] text-[#3A0353] font-bold text-xs bg-white"
                    >
                      Choose 3 Months
                    </button>
                  </div>

                  <div className="bg-white p-7 rounded-[24px] border border-[#3A0353]/10 relative flex flex-col justify-between shadow-md">
                    <div className="absolute top-0 left-0 right-0 h-[5px] bg-gradient-to-r from-[#8B5DB0] to-[#5C1D87] rounded-t-[24px]"></div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[9px] font-bold text-[#8B5DB0] uppercase">
                          BALANCED PATHWAY
                        </span>
                        <span className="px-2.5 py-1 bg-[#F3E9FA] text-[#5C1D87] text-[9px] font-bold rounded-full">
                          POPULAR PATH
                        </span>
                      </div>
                      <h3 className="text-[28px] font-normal text-[#111827] mb-2">
                        6 Months
                      </h3>
                      <div className="flex items-end gap-1 mb-6">
                        <span className="text-xs font-bold text-slate-500">
                          EGP
                        </span>
                        <span className="text-[28px] font-bold text-[#3A0353]">
                          5,500
                        </span>
                        <span className="text-[11px] text-slate-400">
                          / package
                        </span>
                      </div>
                      <ul className="space-y-3 text-xs text-[#5C5C5C] mb-6">
                        <li>✓ Published courses after payment</li>
                        <li>✓ Practical internship</li>
                        <li>✓ 6 mentorship sessions · proposed</li>
                        <li>✓ Course + internship certificate types</li>
                      </ul>
                    </div>
                    <button
                      onClick={() =>
                        setFormData({
                          ...formData,
                          selectedPackage: "6 Months",
                        })
                      }
                      className="w-full h-[50px] rounded-[13px] border border-[#CCB8D8] text-[#3A0353] font-bold text-xs bg-white"
                    >
                      Choose 6 Months
                    </button>
                  </div>

                  <div className="bg-white p-7 rounded-[24px] border border-[#3A0353]/10 shadow-sm flex flex-col justify-between">
                    <div>
                      <span className="text-[9px] font-bold text-[#8B5DB0] uppercase">
                        COMPLETE LEARNING PATH
                      </span>
                      <h3 className="text-[28px] font-normal text-[#111827] mt-1 mb-2">
                        12 Months
                      </h3>
                      <div className="flex items-end gap-1 mb-6">
                        <span className="text-xs font-bold text-slate-500">
                          EGP
                        </span>
                        <span className="text-[28px] font-bold text-[#3A0353]">
                          9,500
                        </span>
                        <span className="text-[11px] text-slate-400">
                          / package
                        </span>
                      </div>
                      <ul className="space-y-3 text-xs text-[#5C5C5C] mb-6">
                        <li>✓ 6-month unified Learning Path</li>
                        <li>✓ Mentorship from payment</li>
                        <li>✓ Advisory Orientation interview</li>
                        <li>✓ Squad stage follows learning stage</li>
                      </ul>
                    </div>
                    <button
                      onClick={() =>
                        setFormData({
                          ...formData,
                          selectedPackage: "12 Months",
                        })
                      }
                      className="w-full h-[50px] rounded-[13px] border border-[#CCB8D8] text-[#3A0353] font-bold text-xs bg-white"
                    >
                      Choose 12 Months
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <span className="text-[#DD6F0D] font-bold text-xs">02</span>
                    <h2 className="text-xl font-normal text-[#111827]">
                      Choose your technology track
                    </h2>
                  </div>
                  <span className="text-[11px] text-[#6B7280]">
                    Catalog managed by InternsHub
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {[
                    {
                      code: "FE",
                      title: "Frontend Development",
                      tech: "React",
                      desc: "Build polished, accessible web products.",
                    },
                    {
                      code: "BE",
                      title: "Backend Development",
                      tech: "ASP.NET / Node.js",
                      desc: "Design reliable APIs and services.",
                    },
                    {
                      code: "MB",
                      title: "Mobile Development",
                      tech: "Flutter",
                      desc: "Create cross-platform mobile experiences.",
                    },
                    {
                      code: "DE",
                      title: "Data Engineering",
                      tech: "Data Engineering",
                      desc: "Shape dependable data pipelines.",
                    },
                  ].map((track) => (
                    <div
                      key={track.code}
                      onClick={() =>
                        setFormData({ ...formData, selectedTrack: track.title })
                      }
                      className={`p-5 bg-white border rounded-[20px] cursor-pointer transition relative shadow-sm ${formData.selectedTrack === track.title ? "border-[#5C1D87] shadow-md" : "border-[#E8E2EC]"}`}
                    >
                      <div className="absolute top-4 right-4 w-3 h-3 rounded-full border border-slate-300"></div>
                      <div className="w-[33px] h-[38px] bg-gradient-to-br from-[#6F2C99] to-[#3A0353] text-white text-[10px] rounded-[12px] flex items-center justify-center font-bold mb-3">
                        {track.code}
                      </div>
                      <h3 className="text-xs font-bold text-[#111827]">
                        {track.title}
                      </h3>
                      <p className="text-[10px] text-[#5C1D87] mt-0.5">
                        {track.tech}
                      </p>
                      <p className="text-[11px] text-[#6B7280] mt-2 leading-relaxed">
                        {track.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end items-center gap-4 pt-4 border-t border-[#E8E2EC]">
                <button
                  onClick={() => setCurrentStep(3)}
                  className="font-bold text-sm text-[#5C1D87]"
                >
                  Back
                </button>
                <button
                  onClick={() => setCurrentStep(5)}
                  className="px-7 py-3.5 bg-gradient-to-r from-[#4C0585] to-[#3A0353] text-white font-bold text-sm rounded-[13px] shadow"
                >
                  Confirm Path →
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: CV */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div>
                <h1 className="text-[58px] font-extrabold text-[#21062E] tracking-[-2.61px]">
                  Upload Your CV
                </h1>
                <p className="text-[#69616D] text-base">
                  Your CV helps us understand your background and prepare a
                  relevant assessment.
                </p>
              </div>

              <div className="bg-white/88 p-4 rounded-[18px] border border-[#3A0353]/10 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-[38px] h-[38px] bg-[#3A0353] text-white rounded-[12px] flex items-center justify-center">
                    🛡️
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#111827]">
                      Required for every package
                    </h4>
                    <p className="text-[9px] text-[#6B7280]">
                      Your CV must be ready before the interview.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-[9px] text-[#5C1D87]">
                  <span className="border-l border-[#E8E2EC] pl-3">
                    PDF or DOCX
                  </span>
                  <span className="border-l border-[#E8E2EC] pl-3">
                    5 MB maximum
                  </span>
                  <button
                    onClick={() => setViewMode("cv-review")}
                    className="px-3 py-1 bg-[#F3E9FA] font-bold rounded-full tracking-[0.72px] underline"
                  >
                    PREVIEW CV REVIEW LAYOUT
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/92 p-7 rounded-[28px] border border-[#3A0353]/10 shadow-sm flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <div>
                        <span className="text-[9px] font-bold text-[#8B5DB0] uppercase">
                          01 · ADD YOUR FILE
                        </span>
                        <h3 className="text-lg font-normal text-[#111827]">
                          Upload from your device
                        </h3>
                      </div>
                      <div className="w-[42px] h-[42px] bg-[#FBF7FE] border border-[#E0D3E7] rounded-[13px] flex items-center justify-center text-xs font-bold text-[#5C1D87]">
                        CV
                      </div>
                    </div>

                    <div
                      onClick={() =>
                        setFormData({
                          ...formData,
                          cvUploaded: !formData.cvUploaded,
                        })
                      }
                      className={`border-2 border-dashed p-8 rounded-[24px] text-center cursor-pointer flex flex-col items-center justify-center ${formData.cvUploaded ? "border-[#8AC8A7] bg-gradient-to-b from-[#FFFFFF] to-[#F1FBF5]" : "border-[#BFA4CE] bg-gradient-to-b from-[#FDFBFF] to-[#F6EEFB]"}`}
                    >
                      <div
                        className={`w-16 h-16 rounded-[20px] flex items-center justify-center text-xl mb-3 shadow-lg text-white ${formData.cvUploaded ? "bg-[#16794A]" : "bg-[#3A0353]"}`}
                      >
                        {formData.cvUploaded ? "✓" : "⬆"}
                      </div>
                      <h4 className="text-base font-normal text-[#111827]">
                        {formData.cvUploaded
                          ? "CV added successfully"
                          : "Drop your CV here"}
                      </h4>
                      <p className="text-xs text-[#6B7280] mb-4">
                        {formData.cvUploaded
                          ? "Click anywhere to replace this file"
                          : "Drag and drop, or click to browse"}
                      </p>
                      <div className="flex justify-center gap-2">
                        <span className="px-2.5 py-1 bg-white/70 text-[8px] text-[#5C1D87] border rounded-[7px]">
                          PDF
                        </span>
                        <span className="px-2.5 py-1 bg-white/70 text-[8px] text-[#5C1D87] border rounded-[7px]">
                          DOCX
                        </span>
                        <span className="px-2.5 py-1 bg-white/70 text-[8px] text-[#5C1D87] border rounded-[7px]">
                          MAX 5 MB
                        </span>
                      </div>
                    </div>

                    {formData.cvUploaded && (
                      <div className="mt-4 p-3 bg-white border border-[#E8E2EC] rounded-[12px] flex items-center justify-between shadow-xs">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-[#F3E9FA] text-[#5C1D87] rounded-[9px] flex items-center justify-center text-[10px] font-bold">
                            DOC
                          </div>
                          <div>
                            <h5 className="text-xs text-[#111827]">
                              InternsHub — Portals & Modules.docx
                            </h5>
                            <p className="text-[9px] text-[#6B7280]">
                              0.02 MB · Illustrative local upload
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="px-2.5 py-1 bg-[#EAF8F0] text-[#16794A] text-[9px] font-bold rounded-full">
                            success
                          </span>
                          <button
                            onClick={() =>
                              setFormData({ ...formData, cvUploaded: false })
                            }
                            className="text-xs text-[#5C1D87] underline"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  <div>
                    <a
                      href="#parse-fail"
                      className="text-[9px] text-[#6B7280] underline"
                    >
                      Preview parse-failure state
                    </a>
                  </div>
                </div>

                <div className="bg-white/92 p-7 rounded-[28px] border border-[#3A0353]/10 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <span className="text-[9px] font-bold text-[#8B5DB0] uppercase">
                          02 · SMART REVIEW
                        </span>
                        <h3 className="text-lg font-normal text-[#111827]">
                          CV profile snapshot
                        </h3>
                      </div>
                      <span
                        className={`px-3 py-1 text-[9px] font-bold rounded-full ${formData.cvUploaded ? "bg-[#EAF8F0] text-[#16794A]" : "bg-[#F1EEF2] text-[#685F6D]"}`}
                      >
                        {formData.cvUploaded ? "Parsed" : "Waiting"}
                      </span>
                    </div>

                    <div
                      className={`flex items-center justify-between px-4 py-3 rounded-[13px] text-[8px] mb-6 ${formData.cvUploaded ? "bg-[#FAF8FB] text-[#16794A]" : "bg-[#FAF8FB] text-[#AAA2AD]"}`}
                    >
                      <span>{formData.cvUploaded ? "✓" : "①"} Upload</span>
                      <span
                        className={`flex-grow h-[1px] mx-3 ${formData.cvUploaded ? "bg-[#16794A]" : "bg-[#E8E2EC]"}`}
                      ></span>
                      <span>{formData.cvUploaded ? "✓" : "②"} Parse</span>
                      <span
                        className={`flex-grow h-[1px] mx-3 ${formData.cvUploaded ? "bg-[#16794A]" : "bg-[#E8E2EC]"}`}
                      ></span>
                      <span>{formData.cvUploaded ? "✓" : "③"} Review</span>
                    </div>

                    {formData.cvUploaded ? (
                      <div className="grid grid-cols-2 gap-3">
                        {["SKILLS", "EDUCATION", "PROJECTS", "EXPERIENCE"].map(
                          (cat) => (
                            <div
                              key={cat}
                              className="p-4 bg-[#FBF7FE] rounded-[12px] space-y-1"
                            >
                              <span className="text-[8px] text-[#8B5DB0] uppercase">
                                {cat}
                              </span>
                              <h5 className="text-xs text-[#111827]">
                                Review extracted {cat.toLowerCase()}
                              </h5>
                              <p className="text-[8px] text-[#16794A] pt-1">
                                Ready to review
                              </p>
                            </div>
                          ),
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-6 text-[#6B7280]">
                        <div className="w-[68px] h-[68px] bg-gradient-to-br from-white to-[#F4EAFA] border border-[#D9C8E3] rounded-[20px] mx-auto flex items-center justify-center text-xl mb-3 shadow-md">
                          📄
                        </div>
                        <h4 className="text-sm font-normal text-[#111827]">
                          Your profile preview starts here
                        </h4>
                        <p className="text-[11px] text-[#6B7280] max-w-[270px] mx-auto mt-1 leading-relaxed">
                          Skills, education, projects, and experience will be
                          organized for your review.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end items-center gap-4 pt-4 border-t border-[#E8E2EC]">
                <button
                  onClick={() => setCurrentStep(4)}
                  className="font-bold text-sm text-[#5C1D87]"
                >
                  Back
                </button>
                <button
                  onClick={() => setCurrentStep(6)}
                  className={`px-7 py-3.5 font-bold text-sm rounded-[13px] shadow flex items-center gap-2 ${formData.cvUploaded ? "bg-gradient-to-r from-[#4C0585] to-[#3A0353] text-white" : "bg-[#ECEAED] text-[#9A939E] cursor-not-allowed"}`}
                >
                  Continue to Interview →
                </button>
              </div>
            </div>
          )}

          {/* STEP 6: Setup */}
          {currentStep === 6 && (
            <div className="space-y-6">
              <div>
                <h1 className="text-[58px] font-extrabold text-[#21062E] tracking-[-2.61px]">
                  Get Ready for Your Interview
                </h1>
                <p className="text-[#69616D] text-base">
                  Check your setup and review the recording requirements before
                  starting.
                </p>
              </div>

              <div className="bg-[#FFF7E6] p-4 rounded-[14px] border border-[#9A5700]/20 flex gap-3 text-xs text-[#9A5700]">
                <span>ℹ️</span>
                <div>
                  <p className="font-bold">
                    Please open InternsHub on your laptop to continue.
                  </p>
                  <p className="text-[11px] mt-0.5">
                    The recorded interview is available on desktop or laptop
                    only.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  {
                    tile: "CA",
                    name: "Camera",
                    desc: "Permission is required to continue",
                  },
                  {
                    tile: "MI",
                    name: "Microphone",
                    desc: "Permission is required to continue",
                  },
                  {
                    tile: "SC",
                    name: "Screen sharing",
                    desc: "Required during the recorded interview",
                  },
                  {
                    tile: "CO",
                    name: "Connection",
                    desc: "A stable connection helps prevent interruption",
                  },
                ].map((item) => (
                  <div
                    key={item.name}
                    className="bg-white p-5 rounded-[20px] border border-[#E8E2EC] relative shadow-xs flex flex-col justify-between h-[190px]"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <div className="w-[42px] h-[42px] bg-[#F3E9FA] rounded-[12px] flex items-center justify-center text-xs font-bold text-[#5C1D87]">
                          {item.tile}
                        </div>
                        <span className="px-2.5 py-1 bg-[#F1EEF2] text-[#685F6D] text-[9px] font-bold rounded-full">
                          Not checked
                        </span>
                      </div>
                      <h3 className="text-sm font-normal text-[#111827]">
                        {item.name}
                      </h3>
                      <p className="text-[10px] text-[#6B7280] mt-1">
                        {item.desc}
                      </p>
                    </div>
                    <button className="text-xs font-bold text-[#5C1D87] text-left">
                      Run check
                    </button>
                  </div>
                ))}
              </div>

              <div className="bg-white p-6 rounded-[28px] border border-[#3A0353]/10 shadow-sm space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-[52px] h-[52px] bg-[#3A0353] text-white rounded-[12px] flex items-center justify-center text-xl">
                    🛡️
                  </div>
                  <div>
                    <h3 className="text-lg font-normal text-[#111827]">
                      Recording & privacy consent
                    </h3>
                    <p className="text-[11px] text-[#5C5C5C] mt-1 leading-relaxed">
                      InternsHub records camera, microphone, and shared screen
                      during the interview. Recordings are deleted 90 days after
                      the final decision; scores and transcripts are retained.
                    </p>
                    <a
                      href="#privacy"
                      className="text-xs text-[#5C1D87] underline block mt-2"
                    >
                      Read the Privacy Policy
                    </a>
                  </div>
                </div>
                <div className="border-t border-[#E8E2EC] pt-4 flex items-center gap-3 text-xs text-[#5C5C5C]">
                  <input
                    type="checkbox"
                    id="consent"
                    className="w-4 h-4 rounded"
                  />
                  <label htmlFor="consent">
                    I understand the recording requirements and consent to this
                    demo readiness flow.
                  </label>
                </div>
              </div>

              <div className="flex justify-end items-center gap-4 pt-4 border-t border-[#E8E2EC]">
                <button
                  onClick={() => setCurrentStep(5)}
                  className="font-bold text-sm text-[#5C1D87]"
                >
                  Back
                </button>
                <button
                  onClick={() => setCurrentStep(7)}
                  className="px-7 py-3.5 bg-gradient-to-r from-[#4C0585] to-[#3A0353] text-white font-bold text-sm rounded-[13px] shadow flex items-center gap-2"
                >
                  Start Interview →
                </button>
              </div>
            </div>
          )}

          {/* STEP 7: Result */}
          {currentStep === 7 && (
            <div className="space-y-6">
              <div>
                <h1 className="text-[58px] font-extrabold text-[#21062E] tracking-[-2.61px]">
                  Your Assessment Results
                </h1>
                <p className="text-[#69616D] text-base">
                  A clear, supportive view of your interview outcome and next
                  steps.
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setResultState("assigned")}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition ${resultState === "assigned" ? "bg-[#3A0353] text-white" : "bg-white text-[#6B7280] border border-[#E8E2EC]"}`}
                >
                  Level assigned
                </button>
                <button
                  onClick={() => setResultState("pending")}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition ${resultState === "pending" ? "bg-[#3A0353] text-white" : "bg-white text-[#6B7280] border border-[#E8E2EC]"}`}
                >
                  Pending review
                </button>
                <button
                  onClick={() => setResultState("incomplete")}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition ${resultState === "incomplete" ? "bg-[#3A0353] text-white" : "bg-white text-[#6B7280] border border-[#E8E2EC]"}`}
                >
                  Incomplete
                </button>
              </div>

              <div className="bg-gradient-to-br from-[#22023C] via-[#22023C] to-[#400B63] text-white rounded-[34px] shadow-2xl p-10 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="absolute -left-20 top-1/2 -translate-y-1/2 w-[380px] h-[260px] border border-white/10 rounded-[157px] pointer-events-none flex items-center justify-center">
                  <div className="w-[280px] h-[180px] border border-white/10 rounded-[120px] flex items-center justify-center">
                    <div className="w-[105px] h-[105px] bg-white transform -rotate-8 rounded-[36px_36px_36px_10px] shadow-2xl flex items-center justify-center text-[#4C0585] text-3xl font-bold">
                      ✓
                    </div>
                  </div>
                </div>

                <div className="md:ml-[320px] space-y-4 flex-grow">
                  <span className="px-3 py-1 bg-[#EAF8F0] text-[#16794A] text-[9px] font-bold rounded-full tracking-[0.72px]">
                    TECHNICAL INTERVIEW
                  </span>

                  <h2 className="text-[34px] font-extrabold leading-tight tracking-tight">
                    Recommended level: [Assessment output]
                  </h2>

                  <p className="text-xs text-[#D9CCE1]">
                    Your level will appear here after the assessment and review
                    process completes.
                  </p>

                  <div className="pt-2">
                    <button
                      onClick={() => setCurrentStep(8)}
                      className="px-7 py-3 bg-white text-[#3A0353] font-bold text-xs rounded-[13px] shadow flex items-center gap-2"
                    >
                      Continue to Payment →
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end items-center gap-4 pt-6 border-t border-[#E8E2EC]">
                <button
                  onClick={() => setCurrentStep(6)}
                  className="font-bold text-sm text-[#5C1D87]"
                >
                  Back
                </button>
                <button
                  onClick={() => setCurrentStep(8)}
                  className="px-7 py-3.5 bg-gradient-to-r from-[#4C0585] to-[#3A0353] text-white font-bold text-sm rounded-[13px] shadow flex items-center gap-2"
                >
                  Continue to Payment →
                </button>
              </div>
            </div>
          )}

          {/* STEP 8: Payment */}
          {currentStep === 8 && (
            <div className="space-y-6">
              <div>
                <h1 className="text-[58px] font-extrabold text-[#21062E] tracking-[-2.61px]">
                  Complete Your Enrollment
                </h1>
                <p className="text-[#69616D] text-base">
                  Review your selected package and securely complete your
                  enrollment.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                <div className="bg-white/92 p-7 rounded-[26px] border border-[#3A0353]/10 shadow-sm space-y-5 relative">
                  <div className="absolute top-6 right-6 w-8 h-8 bg-[#3A0353] text-white rounded-lg flex items-center justify-center text-xs">
                    🔒
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-[#8B5DB0] uppercase">
                      SECURE CHECKOUT · DEMO
                    </span>
                    <h3 className="text-[22px] font-normal text-[#111827] mt-1">
                      Choose how you’ll pay
                    </h3>
                  </div>

                  <button
                    disabled
                    className="w-full h-[50px] bg-[#ECEAED] text-[#9A939E] font-bold text-xs rounded-[13px] cursor-not-allowed"
                  >
                    Pay & Enroll →
                  </button>
                </div>

                <div className="bg-white/92 p-7 rounded-[26px] border border-[#3A0353]/10 shadow-sm space-y-5">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-[9px] font-bold text-[#8B5DB0] uppercase">
                        ORDER SUMMARY
                      </span>
                      <h3 className="text-[21px] font-normal text-[#111827] mt-1">
                        Your enrollment
                      </h3>
                    </div>
                    <span className="px-3 py-1 bg-[#FFF7E6] text-[#9A5700] text-[9px] font-bold rounded-full">
                      PRICE PENDING
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end items-center gap-4 pt-6 border-t border-[#E8E2EC]">
                <button
                  onClick={() => setCurrentStep(7)}
                  className="font-bold text-sm text-[#5C1D87]"
                >
                  Back
                </button>
                <button
                  onClick={() => setCurrentStep(9)}
                  className="px-7 py-3.5 bg-gradient-to-r from-[#4C0585] to-[#3A0353] text-white font-bold text-sm rounded-[13px] shadow flex items-center gap-2"
                >
                  Preview Waiting Stage →
                </button>
              </div>
            </div>
          )}

          {/* STEP 9: Squad */}
          {currentStep === 9 && (
            <div className="space-y-6">
              <div>
                <h1 className="text-[58px] font-extrabold text-[#21062E] tracking-[-2.61px]">
                  Your Journey Is About to Begin
                </h1>
                <p className="text-[#69616D] text-base">
                  Your enrollment is confirmed. We’re preparing the next stage
                  of your journey.
                </p>
              </div>

              <div className="flex justify-end items-center gap-4 pt-6 border-t border-[#E8E2EC]">
                <button
                  onClick={() => setCurrentStep(8)}
                  className="font-bold text-sm text-[#5C1D87]"
                >
                  Back
                </button>
                <button
                  onClick={() => setCurrentStep(10)}
                  className="px-7 py-3.5 bg-gradient-to-r from-[#4C0585] to-[#3A0353] text-white font-bold text-sm rounded-[13px] shadow flex items-center gap-2"
                >
                  Explore Mentorship →
                </button>
              </div>
            </div>
          )}

          {/* STEP 10: Mentorship */}
          {currentStep === 10 && (
            <div className="space-y-6">
              <div>
                <h1 className="text-[58px] font-extrabold text-[#21062E] tracking-[-2.61px]">
                  Learn from People
                  <br />
                  Who’ve Been There
                </h1>
                <p className="text-[#69616D] text-base mt-2">
                  Book a session with a mentor who understands your technology
                  track.
                </p>
              </div>

              <div className="flex justify-end items-center gap-4 pt-6 border-t border-[#E8E2EC]">
                <button
                  onClick={() => setCurrentStep(9)}
                  className="font-bold text-sm text-[#5C1D87]"
                >
                  Back
                </button>
                <button
                  disabled
                  className="px-7 py-3.5 bg-[#ECEAED] text-[#9A939E] font-bold text-sm rounded-[13px] flex items-center gap-2 cursor-not-allowed"
                >
                  Confirm Booking →
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="flex flex-row items-center justify-between px-[72px] h-[130px] bg-gradient-to-tr from-[#22023C] via-[#22023C] to-[#8B5DB0]/30 text-white">
        <div className="flex items-center gap-3">
          <div className="w-[38px] h-[38px] bg-gradient-to-br from-[#5C1D87] to-[#3A0353] rounded-[13px_13px_13px_4px] flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-sm">ih</span>
          </div>
          <span className="font-bold text-xl">InternsHub</span>
          <span className="text-[11px] text-[#D7C8DF] pl-3 border-l border-white/20">
            From Student to a Tech Career.
          </span>
        </div>
        <span className="text-[9px] text-[#9F8DAC]">
          Modern Onboarding v6.0 · Interactive product demo
        </span>
      </footer>
    </div>
  );
}
