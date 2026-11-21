import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import type { UseFormRegisterReturn } from "react-hook-form";
import { Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ROUTES } from "@/app/routes";
import { passwordResetError, resetPassword } from "@/features/authentication/services/authService";
import { C, buttonBg, buttonShadow } from "@/features/authentication/components/forgot-password/tokens";
import { ArrowIcon, BackArrowIcon, EyeIcon, EyeOffIcon, ShieldIcon } from "@/features/authentication/components/forgot-password/icons";

type Lang = "en" | "ar";

const PASSWORD_MIN_LENGTH = 8;

const texts = {
  en: {
    label: "ACCOUNT RECOVERY",
    title: "Set a new password",
    subtitle: "Choose a new password for your InternsHub account. We'll check your reset code when you save it.",
    newLabel: "New password",
    newPlaceholder: "Create a new password",
    confirmLabel: "Confirm new password",
    confirmPlaceholder: "Re-enter your new password",
    update: "Update password",
    updating: "Updating...",
    back: "Back to login",
    note: "For your security, your reset code can't be used again after this step.",
    show: "Show password",
    hide: "Hide password",
    doneLabel: "PASSWORD UPDATED",
    doneTitle: "Your password has been reset",
    doneBody: "You can now log in with your new password.",
    goToLogin: "Go to login",
    submitErrors: {
      network: "We couldn't reach the server. Check your connection and try again.",
      tooMany: "Too many attempts. Please wait a few minutes and try again.",
      server: "Something went wrong. Your password was not changed. Please try again.",
      rejected: "We couldn't update your password. Please try again.",
    },
    errors: {
      required: "This field is required.",
      weak: "Use at least 8 characters with an uppercase letter, a lowercase letter, a number and a symbol.",
      mismatch: "Passwords don't match.",
    },
  },
  ar: {
    label: "استعادة الحساب",
    title: "تعيين كلمة مرور جديدة",
    subtitle: "اختر كلمة مرور جديدة لحسابك على InternsHub. سنتحقق من رمز الاستعادة عند الحفظ.",
    newLabel: "كلمة المرور الجديدة",
    newPlaceholder: "أنشئ كلمة مرور جديدة",
    confirmLabel: "تأكيد كلمة المرور الجديدة",
    confirmPlaceholder: "أعد إدخال كلمة المرور الجديدة",
    update: "تحديث كلمة المرور",
    updating: "جارٍ التحديث...",
    back: "العودة لتسجيل الدخول",
    note: "لأمانك، لا يمكن استخدام رمز الاستعادة مرة أخرى بعد هذه الخطوة.",
    show: "إظهار كلمة المرور",
    hide: "إخفاء كلمة المرور",
    doneLabel: "تم تحديث كلمة المرور",
    doneTitle: "تمت إعادة تعيين كلمة المرور",
    doneBody: "يمكنك الآن تسجيل الدخول بكلمة المرور الجديدة.",
    goToLogin: "الذهاب لتسجيل الدخول",
    submitErrors: {
      network: "تعذّر الوصول إلى الخادم. تحقّق من اتصالك وحاول مرة أخرى.",
      tooMany: "محاولات كثيرة. انتظر بضع دقائق ثم حاول مرة أخرى.",
      server: "حدث خطأ ما. لم يتم تغيير كلمة المرور. حاول مرة أخرى.",
      rejected: "تعذّر تحديث كلمة المرور. حاول مرة أخرى.",
    },
    errors: {
      required: "هذا الحقل مطلوب.",
      weak: "استخدم 8 أحرف على الأقل تتضمن حرفًا كبيرًا وحرفًا صغيرًا ورقمًا ورمزًا.",
      mismatch: "كلمتا المرور غير متطابقتين.",
    },
  },
};
type T = typeof texts.en;
type ErrKey = keyof T["errors"];
type SubmitError = keyof T["submitErrors"];

// Same rules as Register, which mirror the backend's ASP.NET Identity password policy.
const schema = z
  .object({
    password: z
      .string()
      .min(1, "required")
      .min(PASSWORD_MIN_LENGTH, "weak")
      .regex(/[A-Z]/, "weak")
      .regex(/[a-z]/, "weak")
      .regex(/\d/, "weak")
      .regex(/[^A-Za-z0-9]/, "weak"),
    confirm: z.string().min(1, "required"),
  })
  .refine((d) => d.password === d.confirm, { path: ["confirm"], message: "mismatch" });
type Form = z.infer<typeof schema>;


function PasswordField({
  id,
  label,
  placeholder,
  error,
  registration,
  t,
}: {
  id: string;
  label: string;
  placeholder: string;
  error: string | null;
  registration: UseFormRegisterReturn;
  t: T;
}) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label htmlFor={id} className="mb-2 mt-5 block text-[12px] font-medium leading-[20px]" style={{ color: C.gray700 }}>
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={show ? "text" : "password"}
          autoComplete="new-password"
          placeholder={placeholder}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className="h-[55px] w-full rounded-[13px] border ps-4 pe-12 text-[12px] outline-none placeholder:text-[#9992A3] focus:border-[#8A48AD] focus:ring-2 focus:ring-purple-100"
          style={{ background: C.fieldBg, borderColor: error ? C.red : C.border }}
          {...registration}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? t.hide : t.show}
          aria-pressed={show}
          className="absolute end-4 top-1/2 -translate-y-1/2 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-300"
          style={{ color: C.gray500 }}
        >
          {show ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </div>
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-[9px] text-[11px] leading-[16px]" style={{ color: C.red }}>
          {error}
        </p>
      )}
    </div>
  );
}

function DoneView({ t, onDone }: { t: T; onDone: () => void }) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <div className="text-center">
      <p
        className="mx-auto inline-block rounded-full px-3 py-1 text-[11px] font-bold leading-[16px]"
        style={{ background: "#E6F6EC", color: C.green, letterSpacing: "1px" }}
      >
        {t.doneLabel}
      </p>
      <h1
        ref={headingRef}
        tabIndex={-1}
        className="mt-4 text-[36px] font-extrabold leading-[1.2] tracking-[-1.5px] outline-none"
        style={{ color: C.ink }}
      >
        {t.doneTitle}
      </h1>
      <p className="mt-3 text-[13px] leading-[22px]" style={{ color: C.gray600 }}>{t.doneBody}</p>
      <button
        type="button"
        onClick={onDone}
        className="mx-auto mt-8 flex h-[51px] w-full max-w-[280px] items-center justify-center gap-2 rounded-[13px] text-[13px] font-semibold text-white focus:outline-none focus-visible:ring-4 focus-visible:ring-purple-300"
        style={{ background: buttonBg, boxShadow: buttonShadow }}
      >
        {t.goToLogin}
        <ArrowIcon />
      </button>
    </div>
  );
}

type Props = {
  email: string;
  code: string;
  lang: Lang;
  // The backend rejected the code (wrong, expired, or already used).
  onInvalidCode: () => void;
  onDone: () => void;
};

export default function NewPasswordStep({ email, code, lang, onInvalidCode, onDone }: Props) {
  const t = texts[lang];
  const [status, setStatus] = useState<"idle" | "submitting" | "error" | "done">("idle");
  const [submitError, setSubmitError] = useState<SubmitError>("server");
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Form>({ resolver: zodResolver(schema) });

  const onSubmit = async ({ password }: Form) => {
    setStatus("submitting");
    try {
      await resetPassword(email, code, password);
      setStatus("done");
    } catch (error) {
      const kind = passwordResetError(error);
      if (kind === "invalidCode") {
        onInvalidCode();
        return;
      }
      if (kind === "weakPassword") {
        setError("password", { message: "weak" });
        setStatus("idle");
        return;
      }
      setSubmitError(kind);
      setStatus("error");
    }
  };

  if (status === "done") return <DoneView t={t} onDone={onDone} />;

  const msg = (key?: string) => (key ? t.errors[key as ErrKey] : null);

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <p
        className="inline-block rounded-[9px] px-[11px] py-[5px] text-[10px] font-bold leading-[15px]"
        style={{ background: C.pillBg, color: C.pillText, letterSpacing: "1px" }}
      >
        {t.label}
      </p>
      <h1
        ref={headingRef}
        tabIndex={-1}
        className="mt-4 text-[36px] font-extrabold leading-[1.2] tracking-[-1.5px] outline-none"
        style={{ color: C.ink }}
      >
        {t.title}
      </h1>
      <p className="mt-3 text-[12px] leading-[20px]" style={{ color: C.gray600 }}>{t.subtitle}</p>

      {status === "error" && (
        <p role="alert" className="mt-6 rounded-xl border p-4 text-[12px]" style={{ background: "#FEF2F2", borderColor: "#FECACA", color: C.redDark }}>
          {t.submitErrors[submitError]}
        </p>
      )}

      <PasswordField
        id="new-password"
        label={t.newLabel}
        placeholder={t.newPlaceholder}
        error={msg(errors.password?.message)}
        registration={register("password")}
        t={t}
      />
      <PasswordField
        id="confirm-password"
        label={t.confirmLabel}
        placeholder={t.confirmPlaceholder}
        error={msg(errors.confirm?.message)}
        registration={register("confirm")}
        t={t}
      />

      <button
        type="submit"
        disabled={status === "submitting"}
        aria-busy={status === "submitting"}
        className="mt-6 flex h-[51px] w-full items-center justify-center gap-2 rounded-[13px] text-[13px] font-semibold text-white focus:outline-none focus-visible:ring-4 focus-visible:ring-purple-300 disabled:cursor-not-allowed disabled:opacity-60"
        style={{ background: buttonBg, boxShadow: buttonShadow }}
      >
        {status === "submitting" ? t.updating : t.update}
        {status !== "submitting" && <ArrowIcon />}
      </button>

      <div className="mt-6 text-center">
        <Link to={ROUTES.login} className="inline-flex items-center gap-2 text-[12px] leading-[16px] hover:underline" style={{ color: C.purple }}>
          <BackArrowIcon />
          {t.back}
        </Link>
      </div>

      <div className="mt-6 flex items-center gap-3 rounded-xl border px-4 py-4" style={{ background: C.noteBg, borderColor: C.noteBorder }}>
        <span style={{ color: C.purple }}><ShieldIcon /></span>
        <p className="text-[12px] leading-[16px]" style={{ color: C.gray600 }}>{t.note}</p>
      </div>
    </form>
  );
}
