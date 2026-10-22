import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ROUTES } from "@/constants/routes";
import { requestPasswordReset } from "@/lib/api/auth";
import { passwordResetError } from "@/lib/auth/errorMessages";
import ResetCodeStep from "@/components/auth/forgot-password/ResetCodeStep";
import type { ResetCodeError } from "@/components/auth/forgot-password/ResetCodeStep";
import NewPasswordStep from "@/components/auth/forgot-password/NewPasswordStep";

// ---------- [0] Design tokens (From Figma) ----------
const C = {
  ink: "#26083F",
  purple: "#4B087D",
  gray700: "#37313D",
  gray600: "#777184",
  gray500: "#9992A3",
  border: "#E7E0EB",
  fieldBg: "#FFFFFF",
  noteBg: "#FAF6FC",
  noteBorder: "#F2EAF6",
  gold: "#F4AE45",
  pillBg: "#FFF3E8",
  pillText: "#C45B0A",
  red: "#D92D20",
  redDark: "#B42318",
  green: "#16834A",
};

// Layered gradients recreate the deep plum-to-purple Figma background.
const leftBg = [
  "radial-gradient(ellipse at 100% 0%, rgba(116, 29, 77, 0.72) 0%, transparent 48%)",
  "radial-gradient(ellipse at 5% 70%, rgba(106, 44, 133, 0.68) 0%, transparent 58%)",
  "radial-gradient(ellipse at 95% 100%, rgba(78, 0, 119, 0.92) 0%, transparent 48%)",
  "linear-gradient(145deg, #20052F 0%, #310640 43%, #480568 100%)",
].join(", ");

const rightBg = [
  "radial-gradient(ellipse at 10% 5%, rgba(255,255,255,0.92) 0%, transparent 48%)",
  "linear-gradient(145deg, #FAF8FB 0%, #F5F0F8 55%, #FFFFFF 100%)",
].join(", ");

const buttonBg =
  "linear-gradient(105deg, #500A8A 0%, #400066 52%, #35004E 100%)";
const buttonShadow = "0 9px 20px rgba(54, 0, 79, 0.20)";

// ---------- [1] Validation Rules ----------
const forgotSchema = z.object({
  email: z.string().trim().min(1, "required").email("invalid"),
});
type ForgotForm = z.infer<typeof forgotSchema>;
// idle = Default / Email Required / Invalid Email (Determined from errors)
type Status = "idle" | "submitting" | "success" | "error";
// Which banner text to show when the request fails.
type SubmitError = "network" | "tooMany" | "server";

// ---------- [2] Texts (Arabic/English) ----------
const text = {
  en: {
    brand: "InternsHub",
    brandTag: "EDTECH",
    heroLabel: "SECURE ACCOUNT RECOVERY",
    heroTitleLines: ["Get back to building", "your future."],
    heroBody:
      "A simple, privacy-safe recovery flow designed to help you return to your InternsHub journey.",
    cardTitle: "Your account stays protected",
    cardBody: "Reset instructions never reveal whether an account exists.",
    footerWords: ["Secure", "Private", "Simple"],

    label: "ACCOUNT RECOVERY",
    title: "Forgot your password?",
    subtitle:
      "Enter the email address associated with your account and we'll send a one-time reset code to your inbox.",
    emailLabel: "Email address",
    emailPlaceholder: "Enter your email",
    send: "Send reset code",
    sending: "Sending...",
    back: "Back to login",
    securityNote:
      "For your security, the response is the same whether or not the email is registered.",
    trouble: "Still having trouble?",
    help: "Visit Help Center",

    submitErrorTitle: "We couldn't submit your request",
    submitErrorBody:
      "Something went wrong. No email was sent. Please try again.",
    submitErrorNetwork:
      "We couldn't reach the server. Check your connection and try again.",
    submitErrorTooMany:
      "Too many requests. No email was sent. Please wait a few minutes and try again.",

    successLabel: "REQUEST SENT",
    successTitle: "Check your email",
    successBefore: "If an account matches ",
    successAfter:
      ", a one-time reset code will be sent to that inbox. For privacy, we don't confirm whether an address is registered.",
    tryAnother: "Try another email address",
    enterCode: "Enter reset code",

    errors: {
      required: "Email address is required.",
      invalid: "Enter a valid email address.",
    },
  },
  ar: {
    brand: "InternsHub",
    brandTag: "EDTECH",
    heroLabel: "استعادة آمنة للحساب",
    heroTitleLines: ["ارجع وكمّل بناء", "مستقبلك."],
    heroBody:
      "خطوات استعادة بسيطة تحافظ على خصوصيتك، لتعود إلى رحلتك على InternsHub.",
    cardTitle: "حسابك محمي",
    cardBody: "تعليمات إعادة التعيين لا تكشف أبدًا إن كان الحساب موجودًا.",
    footerWords: ["آمن", "خاص", "بسيط"],

    label: "استعادة الحساب",
    title: "نسيت كلمة المرور؟",
    subtitle:
      "اكتب البريد الإلكتروني المرتبط بحسابك وسنرسل رمز إعادة تعيين لمرة واحدة إلى بريدك.",
    emailLabel: "البريد الإلكتروني",
    emailPlaceholder: "أدخل بريدك الإلكتروني",
    send: "إرسال رمز الاستعادة",
    sending: "جارٍ الإرسال...",
    back: "العودة لتسجيل الدخول",
    securityNote: "لأمانك، الرد واحد سواء كان البريد مسجلًا أو لا.",
    trouble: "ما زلت تواجه مشكلة؟",
    help: "زيارة مركز المساعدة",

    submitErrorTitle: "لم نتمكن من إرسال طلبك",
    submitErrorBody: "حدث خطأ ما. لم يتم إرسال أي بريد. حاول مرة أخرى.",
    submitErrorNetwork:
      "تعذّر الوصول إلى الخادم. تحقّق من اتصالك وحاول مرة أخرى.",
    submitErrorTooMany:
      "طلبات كثيرة. لم يتم إرسال أي بريد. انتظر بضع دقائق ثم حاول مرة أخرى.",

    successLabel: "تم إرسال الطلب",
    successTitle: "تحقق من بريدك الإلكتروني",
    successBefore: "إذا كان هناك حساب مرتبط بـ ",
    successAfter:
      "، سيصل رمز إعادة تعيين لمرة واحدة إلى هذا البريد. حفاظًا على الخصوصية، لا نؤكد ما إذا كان البريد مسجلًا.",
    tryAnother: "جرّب بريدًا إلكترونيًا آخر",
    enterCode: "إدخال رمز الاستعادة",

    errors: {
      required: "البريد الإلكتروني مطلوب.",
      invalid: "أدخل بريدًا إلكترونيًا صحيحًا.",
    },
  },
};
type Text = typeof text.en;

// ---------- [3] Icons ----------
const ShieldIcon = ({
  size = 16,
  color = "currentColor",
}: {
  size?: number;
  color?: string;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    aria-hidden="true"
  >
    <path
      d="M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6l7-3z"
      strokeLinejoin="round"
    />
    <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const ArrowIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    className="rtl:rotate-180"
    aria-hidden="true"
  >
    <path
      d="M5 12h14M13 6l6 6-6 6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
const BackArrowIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    className="rtl:rotate-180"
    aria-hidden="true"
  >
    <path
      d="M19 12H5M11 6l-6 6 6 6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
const AlertIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className="mt-[2px] shrink-0"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v6M12 16v1" strokeLinecap="round" />
  </svg>
);

// ---------- [4] Left (brand) panel ----------
function BrandPanel({ t }: { t: Text }) {
  return (
    <aside
      className="relative hidden flex-col justify-between overflow-hidden px-14 py-12 text-white lg:flex"
      style={{ background: leftBg }}
    >
      {/* decorative rings */}
      <div className="pointer-events-none absolute start-[45%] top-[33%] h-[496px] w-[496px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 rtl:translate-x-1/2" />
      <div className="pointer-events-none absolute start-[45%] top-[33%] h-[374px] w-[374px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 rtl:translate-x-1/2" />
      <div className="pointer-events-none absolute start-[80%] top-[69%] h-[586px] w-[586px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 bg-white/5 rtl:translate-x-1/2" />

      {/* logo */}
      <div className="relative flex items-center gap-3">
        <span
          className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-[16px] font-extrabold leading-[20px]"
          style={{ color: C.purple }}
        >
          ih
        </span>
        <span
          className="text-[24px] font-bold leading-[32px]"
          style={{ letterSpacing: "-1px" }}
        >
          {t.brand}
        </span>
        <span
          className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold leading-[16px]"
          style={{ letterSpacing: "1px" }}
        >
          {t.brandTag}
        </span>
      </div>

      {/* illustration */}
      <div
        className="relative mx-auto h-[293px] w-[504px] max-w-full"
        dir="ltr"
      >
        {/* envelope */}
        <div
          className="absolute left-0 top-0 h-[232px] w-[336px] rounded-[24px]"
          style={{
            transform: "rotate(-4deg)",
            background: "linear-gradient(160deg, #FFFFFF 0%, #F1EAFB 100%)",
            boxShadow: "0 24px 48px rgba(20, 0, 40, 0.35)",
          }}
        >
          <svg
            className="absolute inset-0"
            width="336"
            height="232"
            viewBox="0 0 336 232"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M16 16 L168 124 L320 16"
              stroke="#E4D9F4"
              strokeWidth="2"
            />
            <path
              d="M16 216 L130 124 M320 216 L206 124"
              stroke="#EEE6F8"
              strokeWidth="2"
            />
          </svg>
          <div className="absolute left-[49px] top-[37px] h-[10px] w-[222px] rounded-full bg-[#E2D6F3]" />
          <div className="absolute left-[49px] top-[59px] h-[10px] w-[222px] rounded-full bg-[#E9DFF6]" />
          <div className="absolute left-[49px] top-[81px] h-[10px] w-[140px] rounded-full bg-[#EEE7F8]" />
          <div
            className="absolute left-[132px] top-[120px] flex h-[72px] w-[72px] items-center justify-center rounded-[20px] border-2 border-white/70"
            style={{
              background: "linear-gradient(160deg, #6D28D9 0%, #4A0E8A 100%)",
              boxShadow: "0 10px 20px rgba(74, 14, 138, 0.4)",
            }}
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fff"
              strokeWidth="2"
              aria-hidden="true"
            >
              <rect x="5" y="11" width="14" height="9" rx="2" />
              <path d="M8 11V8a4 4 0 018 0v3" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* floating card */}
        <div
          className="absolute left-[172px] top-[227px] flex h-[66px] w-[332px] items-center gap-3 rounded-[20px] border border-white/60 px-5"
          style={{
            background: "rgba(248, 244, 253, 0.95)",
            boxShadow: "0 16px 32px rgba(20, 0, 40, 0.3)",
          }}
        >
          <ShieldIcon size={20} color={C.green} />
          <div>
            <p
              className="text-[13px] font-semibold leading-[18px]"
              style={{ color: "#1F2937" }}
            >
              {t.cardTitle}
            </p>
            <p
              className="text-[11px] leading-[16px]"
              style={{ color: C.gray500 }}
            >
              {t.cardBody}
            </p>
          </div>
        </div>
      </div>

      {/* hero copy */}
      <div className="relative">
        <p
          className="mb-4 text-[12px] font-semibold leading-[16px]"
          style={{ color: C.gold, letterSpacing: "2px" }}
        >
          {t.heroLabel}
        </p>
        <h2 className="text-[44px] font-extrabold leading-[1.08] tracking-[-2px]">
          {t.heroTitleLines[0]}
          <br />
          {t.heroTitleLines[1]}
        </h2>
        <p className="mt-4 max-w-[620px] text-[14px] leading-[20px] text-white/75">
          {t.heroBody}
        </p>

        <div className="mt-[56px] flex items-center gap-4 text-[12px] leading-[16px] text-white/70">
          {t.footerWords.map((w, i) => (
            <span key={w} className="flex items-center gap-4">
              {w}
              {i < t.footerWords.length - 1 && (
                <span className="h-px w-10 bg-white/30" />
              )}
            </span>
          ))}
        </div>
      </div>
    </aside>
  );
}

// ---------- [5] Success screen ----------
function SuccessView({
  email,
  t,
  onRetry,
  onEnterCode,
}: {
  email: string;
  t: Text;
  onRetry: () => void;
  onEnterCode: () => void;
}) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  // As soon as the screen appears, move the focus to the title (keyboard + screen reader)
  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <div className="text-center">
      <div
        className="mx-auto flex h-[136px] w-[136px] items-center justify-center rounded-[40px] bg-white"
        style={{
          boxShadow: "0 8px 24px rgba(21, 128, 61, 0.15)",
          border: "1px solid #DCF2E4",
        }}
      >
        <div
          className="flex h-[104px] w-[104px] items-center justify-center rounded-[28px]"
          style={{
            background: "linear-gradient(160deg, #22A559 0%, #15803D 100%)",
            boxShadow: "0 10px 20px rgba(21, 128, 61, 0.3)",
          }}
        >
          <svg
            width="44"
            height="44"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#fff"
            strokeWidth="2.5"
            aria-hidden="true"
          >
            <path
              d="M5 12.5l4.5 4.5L19 7.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      <p
        className="mx-auto mt-3 inline-block rounded-full px-3 py-1 text-[11px] font-bold leading-[16px]"
        style={{ background: "#E6F6EC", color: C.green, letterSpacing: "1px" }}
      >
        {t.successLabel}
      </p>

      <h1
        ref={headingRef}
        tabIndex={-1}
        className="mt-4 text-[40px] font-extrabold leading-[48px] outline-none"
        style={{ color: C.ink, letterSpacing: "-1px" }}
      >
        {t.successTitle}
      </h1>

      <p
        className="mx-auto mt-4 max-w-[520px] text-[14px] leading-[24px]"
        style={{ color: C.gray600 }}
      >
        {t.successBefore}
        <span className="font-medium text-gray-900" dir="ltr">
          {email}
        </span>
        {t.successAfter}
      </p>
      <button
        type="button"
        onClick={onEnterCode}
        className="mx-auto mt-[88px] flex h-14 w-[252px] items-center justify-center gap-2 rounded-xl text-[14px] font-semibold text-white focus:outline-none focus-visible:ring-4 focus-visible:ring-purple-300"
        style={{ background: buttonBg, boxShadow: buttonShadow }}
      >
        {t.enterCode}
        <ArrowIcon />
      </button>
      <button
        type="button"
        onClick={onRetry}
        className="mt-4 text-[12px] leading-[16px] underline underline-offset-2"
        style={{ color: C.purple }}
      >
        {t.tryAnother}
      </button>
    </div>
  );
}

// ---------- [6] Page ----------
export default function ForgotPassword() {
  const isRtl = document.documentElement.dir === "rtl";
  const lang = isRtl ? "ar" : "en";
  const t = text[lang];

  const [status, setStatus] = useState<Status>("idle");
  const [submitError, setSubmitError] = useState<SubmitError>("server");

  const {
    register,
    handleSubmit,
    getValues,
    reset,
    formState: { errors },
  } = useForm<ForgotForm>({ resolver: zodResolver(forgotSchema) });
  const navigate = useNavigate();
  const [step, setStep] = useState<"email" | "code" | "newPassword">("email");
  const [sentEmail, setSentEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [codeError, setCodeError] = useState<ResetCodeError | null>(null);

  // POST /api/auth/forgotPassword. The backend answers the same way for registered and unknown
  // emails, so success only means the request was accepted.
  const onSubmit = async ({ email }: ForgotForm) => {
    setStatus("submitting");
    try {
      await requestPasswordReset(email);
      setSentEmail(email);
      setStatus("success");
    } catch (error) {
      const kind = passwordResetError(error);
      setSubmitError(kind === "network" || kind === "tooMany" ? kind : "server");
      setStatus("error");
    }
  };

  // The code is only checked by POST /api/auth/resetPassword, so a rejected code returns here.
  const handleInvalidCode = () => {
    setResetCode("");
    setCodeError("invalid");
    setStep("code");
  };

  const tryAnother = () => {
    reset({ email: "" });
    setStatus("idle");
  };

  const errorMessage = errors.email
    ? t.errors[errors.email.message as "required" | "invalid"]
    : null;

  return (
    <main
      className="grid min-h-screen bg-white lg:grid-cols-[54fr_46fr]"
      style={{
        fontFamily: isRtl
          ? "'Cairo', 'Plus Jakarta Sans', sans-serif"
          : "'Plus Jakarta Sans', 'Inter', system-ui, sans-serif",
      }}
    >
      <BrandPanel t={t} />

      <section
        className="flex min-h-screen flex-col px-6 py-8 sm:px-10 lg:px-[60px] xl:px-[72px]"
        style={{ background: rightBg }}
      >
        {/* mobile logo  */}
        <div className="mb-8 flex items-center gap-3 lg:hidden">
          <span
            className="flex h-10 w-10 items-center justify-center rounded-[10px] text-[14px] font-extrabold text-white"
            style={{ background: C.purple }}
          >
            ih
          </span>
          <span className="text-[20px] font-bold" style={{ color: C.ink }}>
            {t.brand}
          </span>
        </div>

        <div className="mx-auto flex w-full max-w-[520px] flex-1 flex-col">
          <div className="flex flex-1 items-center">
            <div className="w-full">
              {step === "code" ? (
                <ResetCodeStep
                  email={sentEmail}
                  lang={lang}
                  initialCode={resetCode}
                  initialError={codeError}
                  onSubmit={(code) => {
                    setResetCode(code);
                    setCodeError(null);
                    setStep("newPassword");
                  }}
                />
              ) : step === "newPassword" ? (
                <NewPasswordStep
                  email={sentEmail}
                  code={resetCode}
                  lang={lang}
                  onInvalidCode={handleInvalidCode}
                  onDone={() => navigate(ROUTES.login, { replace: true })}
                />
              ) : status === "success" ? (
                <SuccessView
                  email={getValues("email")}
                  t={t}
                  onRetry={tryAnother}
                  onEnterCode={() => setStep("code")}
                />
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                  <p
                    className="inline-block rounded-[9px] px-[11px] py-[5px] text-[10px] font-bold leading-[15px] tracking-[1px]"
                    style={{
                      background: C.pillBg,
                      color: C.pillText,
                      letterSpacing: "1px",
                    }}
                  >
                    {t.label}
                  </p>
                  <h1
                    className="mt-4 text-[36px] font-extrabold leading-[1.2] tracking-[-1.5px]"
                    style={{ color: C.ink }}
                  >
                    {t.title}
                  </h1>
                  <p
                    className="mt-3 text-[12px] leading-[20px]"
                    style={{ color: C.gray600 }}
                  >
                    {t.subtitle}
                  </p>

                  {/* Submission error banner */}
                  {status === "error" && (
                    <div
                      role="alert"
                      className="mt-6 flex gap-3 rounded-xl border p-4"
                      style={{
                        background: "#FEF2F2",
                        borderColor: "#FECACA",
                        color: C.redDark,
                      }}
                    >
                      <AlertIcon />
                      <div>
                        <p className="text-[14px] font-semibold leading-[20px]">
                          {t.submitErrorTitle}
                        </p>
                        <p className="text-[12px] leading-[16px]">
                          {submitError === "network"
                            ? t.submitErrorNetwork
                            : submitError === "tooMany"
                              ? t.submitErrorTooMany
                              : t.submitErrorBody}
                        </p>
                      </div>
                    </div>
                  )}

                  <label
                    htmlFor="email"
                    className="mb-2 mt-8 block text-[12px] font-medium leading-[20px]"
                    style={{ color: C.gray700 }}
                  >
                    {t.emailLabel}
                  </label>
                  <input
                    id="email"
                    type="email"
                    dir="ltr"
                    autoComplete="email"
                    placeholder={t.emailPlaceholder}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    className="h-[55px] w-full rounded-[13px] border px-4 text-[12px] outline-none placeholder:text-[#9992A3] focus:border-[#8A48AD] focus:ring-2 focus:ring-purple-100 rtl:text-right"
                    style={{
                      background: C.fieldBg,
                      borderColor: C.border,
                      boxShadow: "none",
                    }}
                    {...register("email")}
                  />
                  {errorMessage && (
                    <p
                      id="email-error"
                      role="alert"
                      className="mt-[9px] text-[11px] leading-[16px]"
                      style={{ color: C.red }}
                    >
                      {errorMessage}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="mt-4 flex h-[51px] w-full items-center justify-center gap-2 rounded-[13px] text-[13px] font-semibold text-white focus:outline-none focus-visible:ring-4 focus-visible:ring-purple-300 disabled:cursor-not-allowed disabled:opacity-60"
                    style={{ background: buttonBg, boxShadow: buttonShadow }}
                  >
                    {status === "submitting" ? t.sending : t.send}
                    {status !== "submitting" && <ArrowIcon />}
                  </button>

                  <div className="mt-6 text-center">
                    <Link
                      to={ROUTES.login}
                      className="inline-flex items-center gap-2 text-[12px] leading-[16px] hover:underline"
                      style={{ color: C.gray600 }}
                    >
                      <BackArrowIcon />
                      {t.back}
                    </Link>
                  </div>

                  <div
                    className="mt-6 flex items-center gap-3 rounded-xl border px-4 py-4"
                    style={{ background: C.noteBg, borderColor: C.noteBorder }}
                  >
                    <span style={{ color: C.purple }}>
                      <ShieldIcon size={18} />
                    </span>
                    <p
                      className="text-[12px] leading-[16px]"
                      style={{ color: C.gray600 }}
                    >
                      {t.securityNote}
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>

          <footer
            className="flex items-center justify-between border-t pb-6 pt-4 text-[12px] leading-[16px]"
            style={{ borderColor: "#EEEAF5" }}
          >
            <span style={{ color: C.gray500 }}>{t.trouble}</span>
            <a
              href="/help"
              className="font-medium hover:underline"
              style={{ color: C.purple }}
            >
              {t.help}
            </a>
          </footer>
        </div>
      </section>
    </main>
  );
}
