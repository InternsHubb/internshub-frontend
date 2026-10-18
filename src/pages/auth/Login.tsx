import { useState } from 'react';

import LoginLayout from '@/components/auth/LoginLayout';

function EyeIcon({ hidden }: { hidden: boolean }) {
  return hidden ? (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="size-5"
    >
      <path
        d="M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.9 5.2A10.8 10.8 0 0112 5c5 0 8.5 4.5 9.5 7-.4 1-1.3 2.3-2.6 3.5M6.2 6.2C3.9 7.7 2.7 9.8 2.5 12c.5 1.2 1.6 3.1 3.6 4.6A10.1 10.1 0 0012 19c1 0 2-.2 2.9-.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ) : (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="size-5"
    >
      <path
        d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7z"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="2.5" />
    </svg>
  );
}

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <LoginLayout>
      <form
        className="flex flex-col gap-5"
        onSubmit={(event) => event.preventDefault()}
      >
        <div>
          <label
            htmlFor="login-email"
            className="mb-2 block text-xs font-semibold text-label"
          >
            Email address
          </label>
          <input
            id="login-email"
            name="email"
            type="email"
            autoComplete="username"
            placeholder="you@example.com"
            required
            className="h-12 w-full rounded-xl border border-[#e7e0eb] bg-white px-4 text-sm text-ink outline-none transition placeholder:text-[#9992a3] focus:border-[#8a48ad] focus:ring-4 focus:ring-purple-100"
          />
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between gap-3">
            <label
              htmlFor="login-password"
              className="block text-xs font-semibold text-label"
            >
              Password
            </label>
            <a
              href="/forgot-password"
              className="rounded-sm text-xs font-semibold text-brand-link underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
            >
              Forgot password?
            </a>
          </div>

          <div className="relative">
            <input
              id="login-password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="Enter your password"
              required
              className="h-12 w-full rounded-xl border border-[#e7e0eb] bg-white px-4 pe-12 text-sm text-ink outline-none transition placeholder:text-[#9992a3] focus:border-[#8a48ad] focus:ring-4 focus:ring-purple-100"
            />
            <button
              type="button"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              aria-pressed={showPassword}
              onClick={() => setShowPassword((visible) => !visible)}
              className="absolute inset-y-0 end-0 inline-flex min-w-11 items-center justify-center rounded-e-xl text-muted hover:text-ink focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-brand-primary"
            >
              <EyeIcon hidden={showPassword} />
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <label className="inline-flex min-h-11 cursor-pointer items-center gap-2 text-xs text-label">
            <input
              type="checkbox"
              name="remember"
              className="size-4 rounded border-[#cfc5d8] accent-brand"
            />
            Remember me
          </label>
        </div>

        <button
          type="submit"
          className="mt-1 inline-flex min-h-[50px] w-full items-center justify-center gap-2 rounded-xl bg-[linear-gradient(105deg,#500a8a_0%,#400066_52%,#35004e_100%)] px-5 text-sm font-bold text-white shadow-[0_9px_20px_rgba(54,0,79,0.2)] transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
        >
          Log in
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="size-4 rtl:rotate-180"
          >
            <path
              d="M5 12h14m-6-6 6 6-6 6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <p className="pt-1 text-center text-xs text-muted">
          New to InternsHub?{' '}
          <a
            href="/register"
            className="rounded-sm font-bold text-brand-link underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
          >
            Create an account
          </a>
        </p>
      </form>
    </LoginLayout>
  );
}
