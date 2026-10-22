import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import type { UseFormRegisterReturn } from "react-hook-form";
import { Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ROUTES } from "@/constants/routes";
import { C, buttonBg, buttonShadow } from "./tokens";
import { ArrowIcon, BackArrowIcon, EyeIcon, EyeOffIcon, ShieldIcon } from "./icons";
import { resetPassword } from "./mockResetApi";

type Lang = "en" | "ar";

const texts = {
  en: {
    label: "ACCOUNT RECOVERY",
    title: "Set a new password",
    subtitle: "Choose a new password for your InternsHub account. Your reset code has been verified.",
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
    serverError: "Something went wrong. Please try again.",
    errors: {
      required: "This field is required.",
      tooShort: "Use at least 8 characters.",
      mismatch: "Passwords don't match.",
    },
  },
  ar: {
    label: "استعادة الحساب",
    title: "تعيين كلمة مرور جديدة",
    subtitle: "اختر كلمة مرور جديدة لحسابك على InternsHub. تم التحقق من رمز الاستعادة.",
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
    serverError: "حدث خطأ ما. حاول مرة أخرى.",
    errors: {
      required: "هذا الحقل مطلوب.",
      tooShort: "استخدم 8 أحرف على الأقل.",
      mismatch: "كلمتا المرور غير متطابقتين.",
    },
  },
};
type T = typeof texts.en;
type ErrKey = keyof T["errors"];


const schema = z
  .object({
    password: z.string().min(1, "required").min(8, "tooShort"),
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

type Props = {
  email: string;
  code: string;
  lang: Lang;
  onDone: () => void;
};

export default function NewPasswordStep({ email, code, lang, onDone }: Props) {
  const t = texts[lang];
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Form>({ resolver: zodResolver(schema) });

  const onSubmit = async ({ password }: Form) => {
    setStatus("submitting");
    try {
      await resetPassword(email, code, password);
      onDone();
    } catch {
      setStatus("error");
    }
  };

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
          {t.serverError}
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