import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, ClipboardEvent, FormEvent, KeyboardEvent } from "react";
import { C, buttonBg, buttonShadow } from "./tokens";
import { ArrowIcon, ShieldIcon } from "./icons";
import { MockResetError, resendResetCode, verifyResetCode } from "./mockResetApi";

type Lang = "en" | "ar";
const LENGTH = 6;

const texts = {
  en: {
    label: "ACCOUNT RECOVERY",
    title: "Enter your reset code",
    subtitleBefore: "We sent a 6-digit one-time code to ",
    subtitleAfter: ". The code can be used only once.",
    codeLabel: "6-digit reset code",
    digitLabel: (n: number) => `Digit ${n} of 6`,
    verify: "Verify code",
    verifying: "Verifying...",
    resend: "Didn't get a code? Resend",
    resending: "Sending...",
    resent: "A new code has been sent.",
    note: "For your security, each reset code works only once and expires soon.",
    errors: {
      invalid: "This code is incorrect or has expired. Request a new code to continue.",
      incomplete: "Enter the 6-digit code.",
      server: "Something went wrong. Please try again.",
    },
  },
  ar: {
    label: "استعادة الحساب",
    title: "أدخل رمز الاستعادة",
    subtitleBefore: "أرسلنا رمزًا من 6 أرقام لمرة واحدة إلى ",
    subtitleAfter: ". يمكن استخدام الرمز مرة واحدة فقط.",
    codeLabel: "رمز الاستعادة المكوّن من 6 أرقام",
    digitLabel: (n: number) => `الرقم ${n} من 6`,
    verify: "تحقق من الرمز",
    verifying: "جارٍ التحقق...",
    resend: "لم يصلك الرمز؟ أعد الإرسال",
    resending: "جارٍ الإرسال...",
    resent: "تم إرسال رمز جديد.",
    note: "لأمانك، كل رمز استعادة يعمل مرة واحدة فقط وتنتهي صلاحيته قريبًا.",
    errors: {
      invalid: "الرمز غير صحيح أو منتهي الصلاحية. اطلب رمزًا جديدًا للمتابعة.",
      incomplete: "أدخل الرمز المكوّن من 6 أرقام.",
      server: "حدث خطأ ما. حاول مرة أخرى.",
    },
  },
};

type ErrorKind = "invalid" | "incomplete" | "server" | null;

type Props = {
  email: string;
  lang: Lang;
  onVerified: (code: string) => void;
};

export default function ResetCodeStep({ email, lang, onVerified }: Props) {
  const t = texts[lang];
  const [digits, setDigits] = useState<string[]>(Array<string>(LENGTH).fill(""));
  const [error, setError] = useState<ErrorKind>(null);
  const [busy, setBusy] = useState<"idle" | "verifying" | "resending">("idle");
  const [resent, setResent] = useState(false);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  // أول ما الشاشة تظهر، الـ focus على أول مربع
  useEffect(() => {
    inputs.current[0]?.focus();
  }, []);

  const boxesInvalid = error === "invalid" || error === "incomplete";

  // بيملّي المربعات من مكان معيّن (للكتابة العادية وللّصق)
  const fill = (start: number, chars: string) => {
    setDigits((prev) => {
      const next = [...prev];
      chars.split("").forEach((ch, k) => {
        if (start + k < LENGTH) next[start + k] = ch;
      });
      return next;
    });
    setError(null);
    setResent(false);
    inputs.current[Math.min(start + chars.length, LENGTH - 1)]?.focus();
  };

  const handleChange = (i: number, e: ChangeEvent<HTMLInputElement>) => {
    const clean = e.target.value.replace(/\D/g, ""); // أرقام بس
    if (!clean) {
      setDigits((prev) => prev.map((d, k) => (k === i ? "" : d)));
      setError(null);
      return;
    }
    // أكتر من رقم = autofill من الموبايل. رقم واحد = كتابة عادية.
    fill(i, clean.length > 1 ? clean : clean.slice(-1));
  };

  const handleKeyDown = (i: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) {
      e.preventDefault();
      setDigits((prev) => prev.map((d, k) => (k === i - 1 ? "" : d)));
      inputs.current[i - 1]?.focus();
    } else if (e.key === "ArrowLeft" && i > 0) {
      inputs.current[i - 1]?.focus();
    } else if (e.key === "ArrowRight" && i < LENGTH - 1) {
      inputs.current[i + 1]?.focus();
    }
  };

  const handlePaste = (i: number, e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, LENGTH);
    if (!pasted) return;
    fill(pasted.length === LENGTH ? 0 : i, pasted);
  };

  const handleVerify = async (e: FormEvent) => {
    e.preventDefault();
    const code = digits.join("");
    if (code.length < LENGTH) {
      setError("incomplete");
      return;
    }
    setBusy("verifying");
    try {
      await verifyResetCode(email, code);
      onVerified(code);
    } catch (err) {
      setError(err instanceof MockResetError && err.code === "invalid_code" ? "invalid" : "server");
      setBusy("idle");
    }
  };

  const handleResend = async () => {
    setBusy("resending");
    try {
      await resendResetCode(email);
      setDigits(Array<string>(LENGTH).fill(""));
      setError(null);
      setResent(true);
      inputs.current[0]?.focus();
    } catch {
      setError("server");
    } finally {
      setBusy("idle");
    }
  };

  return (
    <form onSubmit={handleVerify} noValidate>
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
        <span dir="ltr" className="font-medium" style={{ color: C.gray700 }}>{email}</span>
        {t.subtitleAfter}
      </p>

      <p id="code-label" className="mb-3 mt-8 text-[12px] font-medium leading-[20px]" style={{ color: C.gray700 }}>
        {t.codeLabel}
      </p>

      {/* الأرقام دايماً من الشمال لليمين حتى في العربي */}
      <div role="group" aria-labelledby="code-label" dir="ltr" className="grid grid-cols-6 gap-2 sm:gap-3">
        {digits.map((d, i) => (
          <input
            key={i}
            ref={(el) => {
              inputs.current[i] = el;
            }}
            value={d}
            inputMode="numeric"
            autoComplete={i === 0 ? "one-time-code" : "off"}
            aria-label={t.digitLabel(i + 1)}
            aria-invalid={boxesInvalid}
            aria-describedby={error ? "code-error" : undefined}
            onChange={(e) => handleChange(i, e)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={(e) => handlePaste(i, e)}
            onFocus={(e) => e.target.select()}
            className={`h-[62px] w-full min-w-0 rounded-[13px] border text-center text-[24px] font-bold outline-none focus:ring-2 ${
              boxesInvalid ? "focus:ring-red-100" : "focus:border-[#8A48AD] focus:ring-purple-100"
            }`}
            style={{
              background: boxesInvalid ? "#FFF5F5" : C.fieldBg,
              borderColor: boxesInvalid ? C.red : C.border,
              color: C.ink,
            }}
          />
        ))}
      </div>

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
        disabled={busy !== "idle"}
        className="mt-4 flex h-[51px] w-full items-center justify-center gap-2 rounded-[13px] text-[13px] font-semibold text-white focus:outline-none focus-visible:ring-4 focus-visible:ring-purple-300 disabled:cursor-not-allowed disabled:opacity-60"
        style={{ background: buttonBg, boxShadow: buttonShadow }}
      >
        {busy === "verifying" ? t.verifying : t.verify}
        {busy !== "verifying" && <ArrowIcon />}
      </button>

      <div className="mt-4 text-center">
        <button
          type="button"
          onClick={handleResend}
          disabled={busy !== "idle"}
          className="text-[12px] leading-[16px] hover:underline disabled:opacity-60"
          style={{ color: C.purple }}
        >
          {busy === "resending" ? t.resending : t.resend}
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