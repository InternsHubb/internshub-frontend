import { useEffect, useState } from 'react';

import type {
  AuthLayoutBrand,
  AuthLayoutHeader,
  AuthLayoutHelp,
} from '@/components/auth/AuthLayout';
import AuthLayout from '@/components/auth/AuthLayout';

type Direction = 'ltr' | 'rtl';

type AuthMainCopy = {
  brand: AuthLayoutBrand;
  header: AuthLayoutHeader;
  help: AuthLayoutHelp;
};

const COPY: Record<Direction, AuthMainCopy> = {
  ltr: {
    brand: {
      eyebrow: 'FROM STUDENT TO A TECH CAREER',
      title: 'Welcome back to\nyour next chapter.',
      description:
        'Continue learning, building, and moving closer to the career you want.',
      highlights: ['Skills', 'Experience', 'Career'],
    },
    header: {
      eyebrow: 'WELCOME BACK',
      title: 'Log in to InternsHub',
      description:
        'Use your email and password to continue. Mock content — this demo page performs no authentication.',
    },
    help: {
      text: 'Need help accessing your account?',
      linkLabel: 'Visit Help Center',
      href: '#help-center',
    },
  },
  rtl: {
    brand: {
      eyebrow: 'من الطالب إلى مهنة تقنية',
      title: 'عد إلى فصلك التالي في مسيرتك التقنية.',
      description:
        'واصل التعلّم والبناء وتقترب أكثر من المسار التقني الذي تريد الوصول إليه.',
      highlights: ['مهارات', 'خبرة', 'مسار مهني'],
    },
    header: {
      eyebrow: 'مرحباً بعودتك',
      title: 'سجّل الدخول إلى InternsHub',
      description:
        'استخدم بريدك الإلكتروني وكلمة المرور للمتابعة. محتوى تجريبي — هذه الصفحة لا تنفّذ أي تسجيل دخول.',
    },
    help: {
      text: 'هل تحتاج مساعدة في الوصول إلى حسابك؟',
      linkLabel: 'زيارة مركز المساعدة',
      href: '#help-center',
    },
  },
};

function FloatingCards() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <div className="absolute top-5 end-5 flex items-center gap-3 rounded-2xl bg-white/95 p-3 shadow-xl">
        <span className="grid size-8 place-items-center rounded-lg bg-ink-deep text-xs font-bold text-white">
          02
        </span>
        <p className="text-xs font-bold text-ink">Build real experience</p>
      </div>
      <div className="absolute bottom-5 start-5 flex items-center gap-3 rounded-2xl bg-white/95 p-3 shadow-xl">
        <span className="grid size-8 place-items-center rounded-lg bg-ink-deep text-xs font-bold text-white">
          01
        </span>
        <p className="text-xs font-bold text-ink">Learn with structure</p>
      </div>
    </div>
  );
}

function MockFormSlot() {
  return (
    <section
      aria-label="Mock children slot"
      className="rounded-2xl border border-dashed border-glow/60 bg-surface/70 p-5"
    >
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-glow">
        Mock · children slot
      </p>
      <p className="mt-2 text-xs leading-relaxed text-muted">
        Teammates render their form here (Youssef / Renad / Nora / Gamal). No
        backend, no validation and no real auth live in this layout.
      </p>

      <div
        aria-hidden="true"
        className="mt-4 flex h-[50px] w-full items-center justify-center gap-2 rounded-xl bg-[linear-gradient(90deg,#4c0585_0%,#3a0353_100%)] text-[13px] font-bold text-white"
      >
        Continue
        <span className="inline-block rtl:rotate-180">→</span>
      </div>
      <p className="mt-2 text-[11px] text-muted">
        Reference only — not clickable.
      </p>
    </section>
  );
}

export default function AuthMain() {
  const [direction, setDirection] = useState<Direction>('ltr');
  const copy = COPY[direction];

  useEffect(() => {
    const root = document.documentElement;
    const previousDirection = root.dir;
    const previousLanguage = root.lang;
    root.dir = direction;
    root.lang = direction === 'rtl' ? 'ar' : 'en';

    return () => {
      root.dir = previousDirection;
      root.lang = previousLanguage;
    };
  }, [direction]);

  return (
    <>
      <AuthLayout
        brand={copy.brand}
        brandExtra={<FloatingCards />}
        header={copy.header}
        help={copy.help}
      >
        <MockFormSlot />
      </AuthLayout>

      <button
        type="button"
        aria-pressed={direction === 'rtl'}
        onClick={() =>
          setDirection((current) => (current === 'ltr' ? 'rtl' : 'ltr'))
        }
        className="fixed bottom-4 end-4 z-50 inline-flex min-h-11 items-center rounded-full border border-glow/40 bg-white/95 px-4 text-xs font-bold text-ink shadow-lg hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
      >
        {direction === 'ltr' ? 'Mock: preview RTL' : 'Mock: preview LTR'}
      </button>
    </>
  );
}
