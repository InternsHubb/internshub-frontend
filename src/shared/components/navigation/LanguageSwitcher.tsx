import { Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/shared/utils/cn';

export interface LanguageSwitcherProps {
  variant?: 'pill' | 'subtle';
  className?: string;
}

/**
 * Reusable EN / AR language toggle.
 * Calls `i18n.changeLanguage()`, which updates `html[lang]`, `html[dir]`,
 * and persisted language preference via `src/i18n/index.ts`.
 */
export function LanguageSwitcher({ variant = 'pill', className }: LanguageSwitcherProps) {
  const { i18n } = useTranslation();
  const isArabic = i18n.resolvedLanguage?.startsWith('ar') || i18n.language?.startsWith('ar');
  const nextLanguage = isArabic ? 'en' : 'ar';
  const label = isArabic ? 'English' : 'العربية';
  const ariaLabel = isArabic ? 'Switch language to English' : 'التبديل إلى اللغة العربية';

  return (
    <button
      type="button"
      onClick={() => void i18n.changeLanguage(nextLanguage)}
      aria-label={ariaLabel}
      className={cn(
        'inline-flex shrink-0 cursor-pointer items-center justify-center gap-1.5 font-semibold transition-colors outline-none',
        'focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2',
        variant === 'pill'
          ? 'h-12 rounded-full border border-border-subtle bg-surface px-4 text-sm text-ink shadow-[var(--shadow-card)] hover:bg-lilac/35'
          : 'h-9 rounded-full border border-border-subtle bg-white/90 px-3 text-xs text-ink-deep shadow-xs hover:bg-surface',
        className,
      )}
    >
      <Globe className="size-4 shrink-0 text-brand-primary" aria-hidden="true" />
      <span dir={nextLanguage === 'ar' ? 'rtl' : 'ltr'}>{label}</span>
    </button>
  );
}

export default LanguageSwitcher;
