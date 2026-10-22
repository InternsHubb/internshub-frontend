import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { requestPasswordReset } from "@/lib/api/auth";
import { passwordResetError } from "@/lib/auth/errorMessages";
import { C, buttonBg, buttonShadow } from "./tokens";
import { ArrowIcon, ShieldIcon } from "./icons";

type Lang = "en" | "ar";

// The backend does not document the code's format (ASP.NET Identity's default is a long token, not
// a fixed number of digits), so one field accepts the code exactly as the email shows it.
const MAX_CODE_LENGTH = 1024;
const RESEND_COOLDOWN_SECONDS = 60;

const texts = {
  en: {
    label: "ACCOUNT RECOVERY",
    title: "Enter your reset code",
    subtitleBefore: "If an account matches ",
    subtitleAfter: ", we sent a one-time reset code to that inbox. Copy the code from the email and paste it below.",
    codeLabel: "Reset code",
    codePlaceholder: "Paste the code from your email",
    next: "Continue",
    resend: "Didn't get a code? Resend",
    resending: "Sending...",
    resendIn: (s: number) => `Resend available in ${s}s`,
    resent: "If an account matches, a new code has been sent. Use the newest code.",
    note: "For your security, each reset code works only once and expires soon.",
    errors: {
      invalid: "This code is incorrect or has expired. Request a new code to continue.",
      required: "Enter the reset code from your email.",
      network: "We couldn't reach the server. Check your connection and try again.",
      tooMany: "Too many attempts. Please wait a few minutes and try again.",
      server: "Something went wrong. Please try again.",
    },
  },
  ar: {
    label: "استعادة الحساب",
    title: "أدخل رمز الاستعادة",
    subtitleBefore: "إذا كان هناك حساب مرتبط بـ ",
    subtitleAfter: "، أرسلنا رمز استعادة لمرة واحدة إلى هذا البريد. انسخ الرمز من الرسالة والصقه بالأسفل.",
    codeLabel: "رمز الاستعادة",
    codePlaceholder: "الصق الرمز من بريدك الإلكتروني",
    next: "متابعة",
    resend: "لم يصلك الرمز؟ أعد الإرسال",
    resending: "جارٍ الإرسال...",
    resendIn: (s: number) => `يمكنك إعادة الإرسال بعد ${s} ث`,
    resent: "إذا كان هناك حساب مرتبط، تم إرسال رمز جديد. استخدم أحدث رمز.",
    note: "لأمانك، كل رمز استعادة يعمل مرة واحدة فقط وتنتهي صلاحيته قريبًا.",
    errors: {
      invalid: "الرمز غير صحيح أو منتهي الصلاحية. اطلب رمزًا جديدًا للمتابعة.",
      required: "أدخل رمز الاستعادة من بريدك الإلكتروني.",
      network: "تعذّر الوصول إلى الخادم. تحقّق من اتصالك وحاول مرة أخرى.",
      tooMany: "محاولات كثيرة. انتظر بضع دقائق ثم حاول مرة أخرى.",
      server: "حدث خطأ ما. حاول مرة أخرى.",
    },
  },
};

export type ResetCodeError = keyof typeof texts.en.errors;

type Props = {
  email: string;
  lang: Lang;
  initialCode?: string;
  // Set when the reset call rejected the code and sent the user back here.
  initialError?: ResetCodeError | null;
  onSubmit: (code: string) => void;
};

export default function ResetCodeStep({ email, lang, initialCode = "", initialError = null, onSubmit }: Props) {
  const t = texts[lang];
  const [code, setCode] = useState(initialCode);
  const [error, setError] = useState<ResetCodeError | null>(initialError);
  const [isResending, setIsResending] = useState(false);
  const [resent, setResent] = useState(false);
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN_SECONDS);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // A code was just requested on the previous screen, so resend starts on cooldown.
  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setTimeout(() => setCooldown((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [cooldown]);

  const codeInvalid = error === "invalid" || error === "required";

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    // Codes copied from an email often carry spaces or line breaks.
    setCode(e.target.value.replace(/\s/g, "").slice(0, MAX_CODE_LENGTH));
    setError(null);
    setResent(false);
  };

  const handleNext = (e: FormEvent) => {
    e.preventDefault();
    if (!code) {
      setError("required");
      inputRef.current?.focus();
      return;
    }
    onSubmit(code);
  };

  const handleResend = async () => {
    setIsResending(true);
    try {
      await requestPasswordReset(email);
      setCode("");
      setError(null);
      setResent(true);
      setCooldown(RESEND_COOLDOWN_SECONDS);
      inputRef.current?.focus();
    } catch (err) {
      const kind = passwordResetError(err);
      setError(kind === "network" || kind === "tooMany" ? kind : "server");
    } finally {
      setIsResending(false);
    }
  };

  const resendLabel = isResending ? t.resending : cooldown > 0 ? t.resendIn(cooldown) : t.resend;

  return (
    <form onSubmit={handleNext} noValidate>
      <p
        className="inline-block rounded-[9px] px-[11px] py-[5px] text-[10px] font-bold leading-[15px]"
        style={{ background: C.pillBg, color: C.pillText, letterSpacing: "1px" }}
      >
        {t.label}
      </p>
      <h1 className="mt-4 text-[36px] font-extrabold leading-[1.2] tracking-[-1.5px]" style={{ color: C.ink }}>
        {t.title}
      </h1>
      <p className="mt-3 text-[12px] leading-[20px]" style={{ color: C.gray600 }}>
        {t.subtitleBefore}
        <span dir="ltr" className="font-medium break-all" style={{ color: C.gray700 }}>{email}</span>
        {t.subtitleAfter}
      </p>

      <label htmlFor="reset-code" className="mb-2 mt-8 block text-[12px] font-medium leading-[20px]" style={{ color: C.gray700 }}>
        {t.codeLabel}
      </label>
      <input
        ref={inputRef}
        id="reset-code"
        name="reset-code"
        type="text"
        dir="ltr"
        value={code}
        autoComplete="one-time-code"
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck={false}
        placeholder={t.codePlaceholder}
        aria-invalid={codeInvalid}
        aria-describedby={error ? "code-error" : undefined}
        onChange={handleChange}
        className={`h-[55px] w-full rounded-[13px] border px-4 font-mono text-[13px] outline-none placeholder:font-sans placeholder:text-[#9992A3] focus:ring-2 rtl:text-right ${
          codeInvalid ? "focus:ring-red-100" : "focus:border-[#8A48AD] focus:ring-purple-100"
        }`}
        style={{
          background: codeInvalid ? "#FFF5F5" : C.fieldBg,
          borderColor: codeInvalid ? C.red : C.border,
          color: C.ink,
        }}
      />

      {error && (
        <p id="code-error" role="alert" className="mt-[9px] text-[11px] leading-[16px]" style={{ color: C.red }}>
          {t.errors[error]}
        </p>
      )}
      {resent && !error && (
        <p role="status" className="mt-[9px] text-[11px] leading-[16px]" style={{ color: C.green }}>
          {t.resent}
        </p>
      )}

      <button
        type="submit"
        disabled={isResending}
        className="mt-4 flex h-[51px] w-full items-center justify-center gap-2 rounded-[13px] text-[13px] font-semibold text-white focus:outline-none focus-visible:ring-4 focus-visible:ring-purple-300 disabled:cursor-not-allowed disabled:opacity-60"
        style={{ background: buttonBg, boxShadow: buttonShadow }}
      >
        {t.next}
        <ArrowIcon />
      </button>

      <div className="mt-4 text-center">
        <button
          type="button"
          onClick={handleResend}
          disabled={isResending || cooldown > 0}
          className="text-[12px] leading-[16px] hover:underline disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:no-underline"
          style={{ color: C.purple }}
        >
          {resendLabel}
        </button>
      </div>

      <div
        className="mt-6 flex items-center gap-3 rounded-xl border px-4 py-4"
        style={{ background: C.noteBg, borderColor: C.noteBorder }}
      >
        <span style={{ color: C.purple }}><ShieldIcon /></span>
        <p className="text-[12px] leading-[16px]" style={{ color: C.gray600 }}>{t.note}</p>
      </div>
    </form>
  );
}
