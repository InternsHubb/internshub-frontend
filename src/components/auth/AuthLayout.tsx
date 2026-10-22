import type { ReactNode } from 'react';

import defaultBrandImage from '../../assets/auth-brand-image.webp';

export type AuthLayoutBrand = {
  eyebrow: string;
  title: string;
  description: string;
  highlights?: string[];
};

export type AuthLayoutHeader = {
  eyebrow?: string;
  title: string;
  description?: string;
};

export type AuthLayoutHelp = {
  text: string;
  linkLabel: string;
  href: string;
};

export type AuthLayoutBrandImage = {
  src: string;
  alt: string;
};

// Login and Register share this layout; Figma gives them different column split, image shape and
// form width.
export type AuthLayoutVariant = 'login' | 'register';

type VariantStyles = {
  grid: string;
  // Panel padding: Figma puts the logo 34px (login) / 32px (register) from the top.
  panel: string;
  // Figma's brand fill: a diagonal gradient plus an orange glow top-right and a purple glow
  // bottom-left, positioned as a share of the panel so they scale with it.
  background: string;
  // The image + copy column. Figma centres it in the panel; the logo and the bottom labels stay
  // on the panel's padding.
  column: string;
  imageWrap: string;
  image: string;
  heading: string;
  // Login's concentric ring behind the copy; Register has none.
  hasRing: boolean;
  form: string;
};

const VARIANT_STYLES: Record<AuthLayoutVariant, VariantStyles> = {
  login: {
    grid: 'lg:grid-cols-[54fr_46fr]',
    panel: 'lg:pt-[34px] lg:pb-8',
    background:
      'radial-gradient(circle 960px at 88% 14%, rgba(221,111,13,0.22) 0%, rgba(221,111,13,0) 37%), radial-gradient(circle 931px at 12% 82%, rgba(139,93,176,0.42) 0%, rgba(139,93,176,0) 55%), linear-gradient(135.66deg, #22023c 6.17%, #3a0353 62.27%, #4c0585 93.83%)',
    column: 'max-w-[549px]',
    imageWrap: 'lg:mt-[50px]',
    image: 'rounded-ss-[120px] rounded-se-[28px] rounded-es-[28px] rounded-ee-[100px] lg:h-[320px]',
    heading: 'lg:text-[45px]',
    hasRing: true,
    form: 'max-w-[430px]',
  },
  register: {
    grid: 'lg:grid-cols-[48fr_52fr]',
    panel: 'lg:pt-8 lg:pb-[30px]',
    background:
      'radial-gradient(circle 924px at 88% 14%, rgba(221,111,13,0.22) 0%, rgba(221,111,13,0) 42%), radial-gradient(circle 915px at 10% 84%, rgba(139,93,176,0.45) 0%, rgba(139,93,176,0) 64%), linear-gradient(132.29deg, #22023c 6.17%, #3a0353 62.27%, #4c0585 93.83%)',
    column: 'max-w-[481px]',
    imageWrap: 'lg:mt-[38px] lg:mb-[51px]',
    image: 'rounded-ss-[100px] rounded-se-[26px] rounded-es-[26px] rounded-ee-[82px] lg:h-[255px]',
    heading: 'lg:text-[41px]',
    hasRing: false,
    form: 'max-w-[526px]',
  },
};

export type AuthLayoutProps = {
  variant?: AuthLayoutVariant;
  brand: AuthLayoutBrand;
  /**
   * undefined → default project brand image; null → no image;
   * object → custom image. Forgot/OTP screens should pass null.
   */
  brandImage?: AuthLayoutBrandImage | null;
  brandExtra?: ReactNode;
  header: AuthLayoutHeader;
  progress?: ReactNode;
  help?: AuthLayoutHelp;
  children: ReactNode;
};

const DEFAULT_BRAND_IMAGE_ALT =
  'Students collaborating on a tech project';

function BrandPanel({
  styles,
  brand,
  brandImage,
  brandExtra,
}: {
  styles: VariantStyles;
  brand: AuthLayoutBrand;
  brandImage: AuthLayoutBrandImage | null;
  brandExtra?: ReactNode;
}) {
  const highlights = brand.highlights ?? [];

  return (
    <aside
      aria-label="InternsHub brand"
      className="relative isolate overflow-hidden"
      style={{ background: styles.background }}
    >
      <div className={`relative flex h-full flex-col gap-8 p-5 sm:p-8 lg:gap-0 lg:px-12 ${styles.panel}`}>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <span
            aria-hidden="true"
            className="grid size-[38px] place-items-center rounded-[13px] rounded-es-[4px] bg-white text-sm font-bold tracking-[-0.08em] text-ink-deep shadow-[0_10px_12px_rgba(0,0,0,0.18)]"
          >
            ih
          </span>
          <span dir="ltr" className="text-xl font-bold text-white">
            Interns<span className="text-[#d7b8e9]">Hub</span>
          </span>
          <span className="rounded-full border border-white/25 bg-white/10 px-2 py-0.5 text-[10px] font-bold tracking-[0.14em] text-onbrand-bright">
            EDTECH
          </span>
        </div>

        <div className={`relative isolate flex w-full flex-col gap-8 lg:mx-auto lg:gap-0 ${styles.column}`}>
          {styles.hasRing ? (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute start-[407px] top-[348px] -z-10 hidden size-[360px] rounded-full border border-white/10 shadow-[0_0_0_54px_rgba(255,255,255,0.02),0_0_0_108px_rgba(255,255,255,0.02)] lg:block"
            />
          ) : null}

          {brandImage ? (
            <div className={`hidden w-full sm:block ${styles.imageWrap}`}>
              <div className="relative">
                <img
                  src={brandImage.src}
                  alt={brandImage.alt}
                  className={`h-52 w-full -rotate-1 border border-white/25 object-cover shadow-[0_28px_65px_rgba(0,0,0,0.25)] sm:h-64 ${styles.image}`}
                />
                {brandExtra ? (
                  <div className="absolute inset-0 hidden lg:block">
                    {brandExtra}
                  </div>
                ) : null}
              </div>
            </div>
          ) : brandExtra ? (
            <div className="hidden lg:block">{brandExtra}</div>
          ) : null}

          <div className="flex flex-col gap-3 lg:mt-8 lg:gap-3.5">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent-soft">
              {brand.eyebrow}
            </p>
            <h2 className={`max-w-[22ch] whitespace-pre-line text-3xl font-extrabold leading-[1.08] tracking-[-0.045em] text-white sm:text-4xl ${styles.heading}`}>
              {brand.title}
            </h2>
            <p className="hidden max-w-[48ch] text-xs leading-relaxed text-onbrand sm:block sm:text-sm">
              {brand.description}
            </p>
          </div>
        </div>

        {highlights.length > 0 ? (
          <ul className="mt-auto hidden flex-wrap items-center gap-[11px] lg:pt-8 text-[11px] tracking-[0.08em] text-onbrand-soft sm:flex">
            {highlights.map((word, index) => (
              <li key={word} className="flex items-center gap-[11px]">
                {index > 0 ? (
                  <span aria-hidden="true" className="h-px w-[34px] bg-white/20" />
                ) : null}
                {word}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </aside>
  );
}

function HelpRow({ help, width }: { help: AuthLayoutHelp; width: string }) {
  return (
    <div className={`mx-auto mt-[18px] flex w-full ${width} flex-wrap items-center justify-between gap-x-4 gap-y-1 border-t border-[#e8e2ec] pt-[18px] text-[11px]`}>
      <span className="text-muted">{help.text}</span>
      <a
        href={help.href}
        className="rounded-sm text-brand-link underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
      >
        {help.linkLabel}
      </a>
    </div>
  );
}

export function AuthLayout({
  variant = 'login',
  brand,
  brandImage,
  brandExtra,
  header,
  progress,
  help,
  children,
}: AuthLayoutProps) {
  const styles = VARIANT_STYLES[variant];
  const resolvedBrandImage =
    brandImage === null
      ? null
      : (brandImage ?? {
          src: defaultBrandImage,
          alt: DEFAULT_BRAND_IMAGE_ALT,
        });

  return (
    <div className={`flex min-h-dvh flex-col lg:grid ${styles.grid}`}>
      <BrandPanel
        styles={styles}
        brand={brand}
        brandImage={resolvedBrandImage}
        brandExtra={brandExtra}
      />

      <main className="relative isolate flex flex-1 flex-col overflow-hidden bg-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-28 end-0 size-[22rem] rounded-full bg-glow/20 blur-3xl"
        />

        <div className="relative flex flex-1 flex-col px-5 pt-8 pb-6 sm:px-10 lg:px-[59px] lg:pt-[38px] lg:pb-8">
          <div className={`mx-auto flex w-full ${styles.form} flex-1 flex-col justify-center`}>
            {progress ? <div className="mb-7">{progress}</div> : null}

            {header.eyebrow ? (
              <p className="self-start rounded-lg bg-[#fff3e8] px-2.5 py-[7px] text-[10px] font-bold uppercase tracking-[0.14em] text-accent">
                {header.eyebrow}
              </p>
            ) : null}

            <h1 className="mt-3 text-[28px] font-extrabold leading-[1.15] tracking-[-0.035em] text-ink sm:text-[32px] lg:text-[34px]">
              {header.title}
            </h1>

            {header.description ? (
              <p className="mt-2 text-xs leading-relaxed text-muted">
                {header.description}
              </p>
            ) : null}

            <div className="mt-[26px]">{children}</div>
          </div>

          {help ? <HelpRow help={help} width={styles.form} /> : null}
        </div>
      </main>
    </div>
  );
}

export default AuthLayout;
