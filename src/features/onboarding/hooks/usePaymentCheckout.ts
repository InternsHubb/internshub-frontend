import { useCallback, useEffect, useRef, useState } from 'react';

import { apiErrorKey, checkoutEnrollment, getMyInvoices } from '@/features/onboarding/services/onboardingService';
import type { EnrollmentDto, InvoiceDto } from '@/features/onboarding/types/onboarding.types';

// Paymob checkout for the onboarding Payment step, using only what the backend exposes:
// 1. POST /api/enrollments/{id}/checkout returns { invoiceId, redirectUrl }.
// 2. The browser goes to Paymob's hosted page in a separate popup window or new tab.
// 3. Paymob reports the result to the backend's webhook; the frontend polls GET /api/me/invoices
//    until that invoice settles.
// 4. When the invoice is Paid, the popup window is closed automatically and onboarding continues.

const PENDING_KEY = 'internshub_pending_checkout';
const POLL_MS = 3000;
const MAX_POLLS = 40;

type PendingCheckout = { invoiceId: string; enrollmentId: string };

export type PaymentState =
  | { kind: 'idle' }
  | { kind: 'starting' }
  | { kind: 'redirecting' }
  | { kind: 'verifying'; redirectUrl?: string }
  | { kind: 'paid'; invoice: InvoiceDto | null }
  | { kind: 'failed'; invoice: InvoiceDto }
  | { kind: 'review'; invoice: InvoiceDto }
  | { kind: 'pending'; redirectUrl?: string }
  | { kind: 'error'; messageKey: string };

// sessionStorage can be unavailable (private mode, blocked storage); the flow then simply can't
// resume a checkout after the redirect, which the Payment step reports as an ordinary state.
function readPending(): PendingCheckout | null {
  try {
    const raw = window.sessionStorage.getItem(PENDING_KEY);
    const value: unknown = raw ? JSON.parse(raw) : null;
    if (value && typeof value === 'object' && 'invoiceId' in value && 'enrollmentId' in value) {
      const { invoiceId, enrollmentId } = value as Record<string, unknown>;
      if (typeof invoiceId === 'string' && typeof enrollmentId === 'string') return { invoiceId, enrollmentId };
    }
  } catch {
    // Unreadable or malformed: treated as no pending checkout.
  }
  return null;
}

function writePending(value: PendingCheckout | null): void {
  try {
    if (value) window.sessionStorage.setItem(PENDING_KEY, JSON.stringify(value));
    else window.sessionStorage.removeItem(PENDING_KEY);
  } catch {
    // See readPending.
  }
}

// True when the page was opened on the way back from Paymob, so onboarding can reopen Payment.
export function hasPendingCheckout(): boolean {
  return readPending() !== null;
}

// Only an https page may be opened as the payment page.
function isSafeRedirect(url: string): boolean {
  try {
    return new URL(url).protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Opens a checkout window immediately during the user's click gesture.
 * Tries a centered popup first; if the browser's popup blocker suppresses it,
 * falls back to a standard new tab (target="_blank"), which modern browsers allow.
 */
export function openCheckoutWindow(): Window | null {
  const width = 600;
  const height = 750;
  const left = Math.max(0, Math.round(window.screenX + (window.outerWidth - width) / 2));
  const top = Math.max(0, Math.round(window.screenY + (window.outerHeight - height) / 2));

  let win: Window | null = null;
  // 1. Try popup window with dimensions using '_blank'
  try {
    win = window.open(
      'about:blank',
      '_blank',
      `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`
    );
  } catch {
    win = null;
  }

  // 2. If popup with features was blocked, fall back to standard new tab
  if (!win || win.closed) {
    try {
      win = window.open('about:blank', '_blank');
    } catch {
      win = null;
    }
  }

  // 3. Inject splash screen while waiting for the checkout URL
  if (win && !win.closed) {
    try {
      win.document.title = 'Paymob Payment';
      win.document.body.innerHTML = `
        <div style="font-family:system-ui,-apple-system,sans-serif;display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;margin:0;background:#FAF8FC;color:#3A0353;text-align:center;padding:24px;box-sizing:border-box;">
          <div style="width:44px;height:44px;border:3px solid #E8E2EC;border-top-color:#4C0585;border-radius:50%;animation:s 0.8s linear infinite;margin-bottom:18px;"></div>
          <h2 style="margin:0 0 8px;font-size:18px;font-weight:700;color:#111827;">Connecting to Secure Payment</h2>
          <p style="margin:0;font-size:13px;color:#6B7280;line-height:1.4;">Opening Paymob gateway. Please wait a moment…</p>
          <style>@keyframes s{to{transform:rotate(360deg)}}</style>
        </div>
      `;
    } catch {
      // document access may be restricted
    }
  }

  return win;
}

type Options = { enrollment: EnrollmentDto | null; onPaid: () => void };

export function usePaymentCheckout({ enrollment, onPaid }: Options) {
  const [state, setState] = useState<PaymentState>(() => (readPending() ? { kind: 'verifying' } : { kind: 'idle' }));
  const [attempt, setAttempt] = useState(0);
  const popupRef = useRef<Window | null>(null);
  const onPaidRef = useRef(onPaid);
  useEffect(() => {
    onPaidRef.current = onPaid;
  }, [onPaid]);

  // When returning focus to the window, check invoice status immediately
  useEffect(() => {
    const handleFocus = () => {
      const pending = readPending();
      if (pending) {
        setAttempt((v) => v + 1);
      }
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  // Polls the invoice list while a checkout started from this browser is unresolved.
  useEffect(() => {
    const pending = readPending();
    if (!pending) return undefined;
    let active = true;
    let polls = 0;
    let timer = 0;

    const check = async () => {
      polls += 1;
      try {
        const invoice = (await getMyInvoices()).find((item) => item.id === pending.invoiceId);
        if (!active) return;
        if (invoice?.status === 'Paid') {
          writePending(null);
          setState({ kind: 'paid', invoice });
          onPaidRef.current();

          // After showing "Approved", automatically close the Paymob window
          window.setTimeout(() => {
            try {
              if (popupRef.current && !popupRef.current.closed) {
                popupRef.current.close();
              }
            } catch {
              // Ignore any cross-origin restrictions
            }
          }, 1500);

          return;
        }
        if (invoice?.status === 'Failed' || invoice?.status === 'Cancelled') {
          writePending(null);
          setState({ kind: 'failed', invoice });

          window.setTimeout(() => {
            try {
              if (popupRef.current && !popupRef.current.closed) {
                popupRef.current.close();
              }
            } catch {
              // Ignore
            }
          }, 2000);

          return;
        }
        if (invoice?.status === 'RequiresReview') {
          writePending(null);
          setState({ kind: 'review', invoice });
          return;
        }
      } catch {
        // A failed poll is retried like a pending result.
      }
      if (!active) return;
      if (polls >= MAX_POLLS) setState((prev) => (prev.kind === 'verifying' ? { kind: 'pending', redirectUrl: prev.redirectUrl } : { kind: 'pending' }));
      else timer = window.setTimeout(check, POLL_MS);
    };

    setState((prev) => (prev.kind === 'verifying' ? prev : { kind: 'verifying' }));
    void check();
    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [attempt]);

  const startCheckout = useCallback(async () => {
    if (!enrollment || enrollment.status !== 'PendingPayment') {
      setState({ kind: 'error', messageKey: 'onboarding.payment.errors.noEnrollment' });
      return;
    }
    setState({ kind: 'starting' });

    // Open popup immediately on click to prevent browser popup blockers
    const popup = openCheckoutWindow();
    popupRef.current = popup;

    try {
      const { invoiceId, redirectUrl } = await checkoutEnrollment(enrollment.id);
      if (!isSafeRedirect(redirectUrl)) {
        if (popup && !popup.closed) popup.close();
        setState({ kind: 'error', messageKey: 'onboarding.payment.errors.badRedirect' });
        return;
      }
      writePending({ invoiceId, enrollmentId: enrollment.id });
      setState({ kind: 'verifying', redirectUrl });

      let navigated = false;
      if (popup && !popup.closed) {
        try {
          popup.location.replace(redirectUrl);
          popup.focus();
          navigated = true;
        } catch {
          try {
            popup.location.href = redirectUrl;
            popup.focus();
            navigated = true;
          } catch {
            navigated = false;
          }
        }
      }

      // If initial window was closed or failed to navigate, attempt opening in a fresh new tab
      if (!navigated) {
        try {
          const fallbackWin = window.open(redirectUrl, '_blank');
          if (fallbackWin) {
            popupRef.current = fallbackWin;
            navigated = true;
          }
        } catch {
          navigated = false;
        }
      }

      // DO NOT navigate the main window (window.location.assign is deliberately NOT used).
      // The main window stays on InternsHub with active polling and provides a manual fallback link if needed.

      setAttempt((v) => v + 1);
    } catch (error) {
      if (popup && !popup.closed) popup.close();
      setState({ kind: 'error', messageKey: apiErrorKey(error) });
    }
  }, [enrollment]);

  // "Check again" after the polling window ran out with the invoice still Pending.
  const checkAgain = useCallback(() => setAttempt((value) => value + 1), []);

  // Leaves a failed or abandoned checkout so the learner can start a new one.
  const reset = useCallback(() => {
    try {
      if (popupRef.current && !popupRef.current.closed) {
        popupRef.current.close();
      }
    } catch {
      // ignore
    }
    writePending(null);
    setState({ kind: 'idle' });
  }, []);

  return { state, startCheckout, checkAgain, reset };
}
