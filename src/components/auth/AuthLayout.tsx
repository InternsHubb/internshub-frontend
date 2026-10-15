import type { ReactNode } from 'react';

import defaultBrandImage from '../../assets/auth-brand-image.jpg';

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

export type AuthLayoutProps = {
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

const BRAND_GRADIENT =
  'bg-[linear-gradient(155deg,#22023c_0%,#3a0353_55%,#4c0585_82%,#5a198f_100%)]';

function BrandPanel({
  brand,
  brandImage,
  brandExtra,
}: {
  brand: AuthLayoutBrand;
  brandImage: AuthLayoutBrandImage | null;
  brandExtra?: ReactNode;
}) {
  const highlights = brand.highlights ?? [];

  return (
    <aside
      aria-label="InternsHub brand"
      className={`relative isolate overflow-hidden ${BRAND_GRADIENT}`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-48 -end-40 size-[34rem] rounded-full bg-glow/15"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-20 end-10 size-[20rem] rounded-full bg-glow/10"
      />

      <div className="relative flex h-full flex-col justify-between gap-8 p-5 sm:p-8 lg:gap-10 lg:p-[58px]">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <span
            aria-hidden="true"
            className="grid size-9 place-items-center rounded-xl bg-white text-sm font-bold text-ink-deep"
          >
            ih
          </span>
          <span className="text-xl font-bold text-white lg:text-[25px]">
            InternsHub
          </span>
          <span className="rounded-full border border-white/25 bg-white/10 px-2 py-0.5 text-[10px] font-bold tracking-[0.14em] text-onbrand-bright">
            EDTECH
          </span>
        </div>

        {brandImage ? (
          <div className="mx-auto hidden w-full sm:block sm:w-[92%] lg:w-[90%]">
            <div className="relative">
              <img
                src={brandImage.src}
                alt={brandImage.alt}
                className="h-52 w-full rounded-se-lg rounded-es-lg rounded-ss-[2.5rem] rounded-ee-[2.5rem] object-cover shadow-2xl sm:h-64 lg:aspect-[8/5] lg:h-auto"
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

        <div className="flex flex-col gap-3 lg:gap-4">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent-soft">
            {brand.eyebrow}
          </p>
          <h2 className="max-w-[22ch] whitespace-pre-line text-3xl font-extrabold leading-[1.12] text-white sm:text-4xl lg:text-[42px]">
            {brand.title}
          </h2>
          <p className="hidden max-w-[48ch] text-xs leading-relaxed text-onbrand sm:block sm:text-sm">
            {brand.description}
          </p>
        </div>

        {highlights.length > 0 ? (
          <ul className="hidden flex-wrap items-center text-xs font-medium text-onbrand-soft sm:flex">
            {highlights.map((word, index) => (
              <li key={word} className="flex items-center gap-3">
                {index > 0 ? (
                  <span aria-hidden="true" className="text-onbrand-soft/70">
                    —
                  </span>
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

function HelpRow({ help }: { help: AuthLayoutHelp }) {
  return (
    <div className="mx-auto flex w-full max-w-[430px] flex-wrap items-center justify-between gap-x-4 gap-y-1 pt-6 text-xs">
      <span className="text-muted">{help.text}</span>
      <a
        href={help.href}
        className="rounded-sm font-bold text-brand-link underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
      >
        {help.linkLabel}
      </a>
    </div>
  );
}

export function AuthLayout({
  brand,
  brandImage,
  brandExtra,
  header,
  progress,
  help,
  children,
}: AuthLayoutProps) {
  const resolvedBrandImage =
    brandImage === null
      ? null
      : (brandImage ?? {
          src: defaultBrandImage,
          alt: DEFAULT_BRAND_IMAGE_ALT,
        });

  return (
    <div className="flex min-h-dvh flex-col lg:grid lg:grid-cols-[54fr_46fr]">
      <BrandPanel
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
          <div className="mx-auto flex w-full max-w-[430px] flex-1 flex-col">
            {progress ? <div className="mb-7">{progress}</div> : null}

            {header.eyebrow ? (
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
                {header.eyebrow}
              </p>
            ) : null}

            <h1 className="mt-2 text-[28px] font-extrabold leading-tight text-ink sm:text-[32px] lg:text-[36px]">
              {header.title}
            </h1>

            {header.description ? (
              <p className="mt-2 text-xs leading-relaxed text-muted sm:text-[13px]">
                {header.description}
              </p>
            ) : null}

            <div className="mt-7 flex-1">{children}</div>
          </div>

          {help ? <HelpRow help={help} /> : null}
        </div>
      </main>
    </div>
  );
}

export default AuthLayout;
