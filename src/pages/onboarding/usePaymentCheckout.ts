import { useCallback, useEffect, useRef, useState } from 'react';

import { apiErrorKey } from '@/lib/api/errors';
import { checkoutEnrollment, getMyInvoices } from '@/lib/api/packages';
import type { EnrollmentDto, InvoiceDto } from '@/lib/api/types';

// Paymob checkout for the onboarding Payment step, using only what the backend exposes:
// 1. POST /api/enrollments/{id}/checkout returns { invoiceId, redirectUrl }.
// 2. The browser goes to Paymob's hosted page (card or wallet details are entered there, never here).
// 3. Paymob reports the result to the backend's webhook; the frontend has no status endpoint for a
//    single invoice, so on return it polls GET /api/me/invoices until that invoice settles.
// A redirect back is never treated as success: only an invoice the backend marks Paid is.

const PENDING_KEY = 'internshub_pending_checkout';
const POLL_MS = 3000;
const MAX_POLLS = 40;

type PendingCheckout = { invoiceId: string; enrollmentId: string };

export type PaymentState =
  | { kind: 'idle' }
  | { kind: 'starting' }
  | { kind: 'redirecting' }
  | { kind: 'verifying' }
  | { kind: 'paid'; invoice: InvoiceDto | null }
  | { kind: 'failed'; invoice: InvoiceDto }
  | { kind: 'review'; invoice: InvoiceDto }
  | { kind: 'pending' }
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

type Options = { enrollment: EnrollmentDto | null; onPaid: () => void };

export function usePaymentCheckout({ enrollment, onPaid }: Options) {
  const [state, setState] = useState<PaymentState>(() => (readPending() ? { kind: 'verifying' } : { kind: 'idle' }));
  const [attempt, setAttempt] = useState(0);
  const onPaidRef = useRef(onPaid);
  useEffect(() => {
    onPaidRef.current = onPaid;
  }, [onPaid]);

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
          return;
        }
        if (invoice?.status === 'Failed' || invoice?.status === 'Cancelled') {
          writePending(null);
          setState({ kind: 'failed', invoice });
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
      if (polls >= MAX_POLLS) setState({ kind: 'pending' });
      else timer = window.setTimeout(check, POLL_MS);
    };

    setState({ kind: 'verifying' });
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
    try {
      const { invoiceId, redirectUrl } = await checkoutEnrollment(enrollment.id);
      if (!isSafeRedirect(redirectUrl)) {
        setState({ kind: 'error', messageKey: 'onboarding.payment.errors.badRedirect' });
        return;
      }
      writePending({ invoiceId, enrollmentId: enrollment.id });
      setState({ kind: 'redirecting' });
      window.location.assign(redirectUrl);
    } catch (error) {
      setState({ kind: 'error', messageKey: apiErrorKey(error) });
    }
  }, [enrollment]);

  // "Check again" after the polling window ran out with the invoice still Pending.
  const checkAgain = useCallback(() => setAttempt((value) => value + 1), []);

  // Leaves a failed or abandoned checkout so the learner can start a new one.
  const reset = useCallback(() => {
    writePending(null);
    setState({ kind: 'idle' });
  }, []);

  return { state, startCheckout, checkAgain, reset };
}
