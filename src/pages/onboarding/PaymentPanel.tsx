import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import cardWhiteIcon from '../../assets/onboarding/card-white.svg';
import lockWhiteIcon from '../../assets/onboarding/lock-white.svg';
import receiptPurpleIcon from '../../assets/onboarding/receipt-purple.svg';
import shieldGreenIcon from '../../assets/onboarding/shield-green.svg';
import walletPurpleIcon from '../../assets/onboarding/wallet-purple.svg';
import type { EnrollmentDto } from '@/lib/api/types';
import { PolicyConsent } from './PolicyConsent';
import type { PaymentState } from './usePaymentCheckout';

// The Payment step's checkout card. The payment method is chosen on Paymob's hosted page (the
// checkout API takes no method), so the methods are listed for information only. Pay & Enroll needs
// a PendingPayment enrollment and accepted terms; the result shown always comes from the backend.

type PaymentPanelProps = {
  enrollment: EnrollmentDto | null;
  isTermsAccepted: boolean;
  state: PaymentState;
  onPay: () => void;
  onCheckAgain: () => void;
  onReset: () => void;
  onContinue: () => void;
};

const NOTICE = 'p-4 rounded-[14px] text-xs space-y-2';
const PRIMARY_BUTTON = 'w-full h-[50px] bg-gradient-to-r from-[#4C0585] to-[#3A0353] rtl:bg-gradient-to-l text-white font-bold text-xs rounded-[13px] shadow';
const DISABLED_BUTTON = 'w-full h-[50px] bg-[#ECEAED] text-[#9A939E] font-bold text-xs rounded-[13px] cursor-not-allowed';
const TEXT_BUTTON = 'underline font-bold';

function formatAmount(amount: number, currency: string, language: string): string {
  return new Intl.NumberFormat(language, { style: 'currency', currency }).format(Number(amount));
}

export function PaymentPanel({ enrollment, isTermsAccepted, state, onPay, onCheckAgain, onReset, onContinue }: PaymentPanelProps) {
  const { t, i18n } = useTranslation();
  const isPaid = state.kind === 'paid' || enrollment?.status === 'Active';
  const isBusy = state.kind === 'starting' || state.kind === 'redirecting' || state.kind === 'verifying';
  const canPay = !isPaid && !isBusy && enrollment?.status === 'PendingPayment' && isTermsAccepted
    && (state.kind === 'idle' || state.kind === 'error');

  const onContinueRef = useRef(onContinue);
  useEffect(() => {
    onContinueRef.current = onContinue;
  }, [onContinue]);

  useEffect(() => {
    if (!isPaid) return undefined;
    const timer = window.setTimeout(() => {
      onContinueRef.current();
    }, 2000);
    return () => window.clearTimeout(timer);
  }, [isPaid]);

  const status = (() => {
    if (isPaid) {
      const invoice = state.kind === 'paid' ? state.invoice : null;
      return (
        <div role="status" className={`${NOTICE} bg-[#EAF8F0] text-[#16794A] border border-[#16794A]/20`}>
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-[#16794A] text-white flex items-center justify-center text-xs font-bold shrink-0">✓</span>
            <p className="font-bold text-sm">{t('onboarding.payment.paid.title')}</p>
          </div>
          {invoice && <p>{t('onboarding.payment.paid.amount', { amount: formatAmount(invoice.amount, invoice.currency, i18n.language) })}</p>}
          <div className="pt-2 mt-2 border-t border-[#16794A]/20 flex items-center justify-between text-[11px]">
            <span className="font-medium text-[#16794A]">{t('onboarding.payment.paid.autoContinuing')}</span>
            <span className="inline-block size-3.5 animate-spin rounded-full border-2 border-[#16794A] border-t-transparent" />
          </div>
        </div>
      );
    }
    switch (state.kind) {
      case 'verifying':
        return <p role="status" className={`${NOTICE} bg-[#FBF7FE] text-[#5C1D87]`}>{t('onboarding.payment.verifying')}</p>;
      case 'redirecting':
        return <p role="status" className={`${NOTICE} bg-[#FBF7FE] text-[#5C1D87]`}>{t('onboarding.payment.redirecting')}</p>;
      case 'pending':
        return (
          <div role="status" className={`${NOTICE} bg-[#FFF7E6] text-[#9A5700]`}>
            <p className="font-bold">{t('onboarding.payment.pending.title')}</p>
            <p>{t('onboarding.payment.pending.body')}</p>
            <div className="flex flex-wrap gap-4">
              <button type="button" onClick={onCheckAgain} className={TEXT_BUTTON}>{t('onboarding.payment.pending.checkAgain')}</button>
              <button type="button" onClick={onReset} className={TEXT_BUTTON}>{t('onboarding.payment.startOver')}</button>
            </div>
          </div>
        );
      case 'failed':
        return (
          <div role="alert" className={`${NOTICE} bg-[#FEF0EF] text-[#B42318]`}>
            <p className="font-bold">{t(`onboarding.payment.failed.${state.invoice.status === 'Cancelled' ? 'cancelled' : 'failed'}`)}</p>
            <p>{t('onboarding.payment.failed.body')}</p>
            <button type="button" onClick={onReset} className={TEXT_BUTTON}>{t('onboarding.payment.tryAgain')}</button>
          </div>
        );
      case 'review':
        return (
          <div role="status" className={`${NOTICE} bg-[#FFF7E6] text-[#9A5700]`}>
            <p className="font-bold">{t('onboarding.payment.review.title')}</p>
            <p>{t('onboarding.payment.review.body')}</p>
          </div>
        );
      case 'error':
        return <p role="alert" className={`${NOTICE} bg-[#FEF0EF] text-[#B42318]`}>{t(state.messageKey)}</p>;
      default:
        return null;
    }
  })();

  const payLabel = state.kind === 'starting' || state.kind === 'redirecting'
    ? t('onboarding.payment.opening')
    : t('onboarding.payment.pay');

  return (
    <div className="bg-white/92 p-7 rounded-[26px] border border-[#3A0353]/10 shadow-sm space-y-5 relative">
      <div className="absolute top-6 end-6 w-8 h-8 bg-[#3A0353] rounded-lg flex items-center justify-center"><img src={lockWhiteIcon} alt="" aria-hidden="true" width={16} height={16} /></div>
      <div>
        <span className="text-[9px] font-bold text-[#8B5DB0] uppercase">{t('onboarding.payment.eyebrow')}</span>
        <h3 className="text-[22px] font-normal text-[#111827] mt-1">{t('onboarding.payment.title')}</h3>
        <p className="text-[9px] text-[#6B7280]">{t('onboarding.payment.subtitle')}</p>
      </div>

      <div className="bg-[#FFF7E6] p-4 rounded-[14px] border border-[#9A5700]/20 flex gap-3 text-xs text-[#9A5700]">
        <span aria-hidden="true" className="mt-px flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full border border-current text-[13px] leading-none">i</span>
        <div><p className="font-bold">{t('onboarding.payment.gatewayTitle')}</p><p className="text-[11px] mt-0.5">{t('onboarding.payment.gatewayBody')}</p></div>
      </div>

      <ul className="space-y-3">
        <li className="p-4 bg-[#FBF7FE] border border-[#E8E2EC] rounded-[15px] flex items-center gap-3">
          <div className="w-[42px] h-[42px] shrink-0 bg-[#3A0353] rounded-[12px] flex items-center justify-center"><img src={cardWhiteIcon} alt="" aria-hidden="true" width={20} height={20} /></div>
          <div><h4 className="text-xs font-normal text-[#111827]">{t('onboarding.payment.methods.card')}</h4><p className="text-[9px] text-[#6B7280]">{t('onboarding.payment.methods.onPaymob')}</p></div>
        </li>
        <li className="p-4 bg-white border border-[#E8E2EC] rounded-[15px] flex items-center gap-3">
          <div className="w-[42px] h-[42px] shrink-0 bg-[#F1EBF4] rounded-[12px] flex items-center justify-center"><img src={walletPurpleIcon} alt="" aria-hidden="true" width={20} height={20} /></div>
          <div><h4 className="text-xs font-normal text-[#111827]">{t('onboarding.payment.methods.wallet')}</h4><p className="text-[9px] text-[#6B7280]">{t('onboarding.payment.methods.onPaymob')}</p></div>
        </li>
        <li className="p-4 bg-white border border-[#E8E2EC] rounded-[15px] flex items-center gap-3 opacity-75">
          <div className="w-[42px] h-[42px] shrink-0 bg-[#F1EBF4] rounded-[12px] flex items-center justify-center"><img src={receiptPurpleIcon} alt="" aria-hidden="true" width={20} height={20} /></div>
          <div><h4 className="text-xs font-normal text-[#111827]">{t('onboarding.payment.methods.fawry')}</h4><p className="text-[9px] text-[#6B7280]">{t('onboarding.payment.methods.fawryNote')}</p></div>
        </li>
      </ul>

      {!isPaid && <PolicyConsent />}

      {status}

      {isPaid ? (
        <button
          type="button"
          onClick={() => onContinueRef.current()}
          className={`${PRIMARY_BUTTON} flex items-center justify-center gap-2`}
        >
          <span>{t('onboarding.payment.continue')}</span>
          <span aria-hidden="true" className="inline-block rtl:-scale-x-100">→</span>
        </button>
      ) : (
        <button
          type="button"
          onClick={() => { if (canPay) onPay(); }}
          aria-disabled={!canPay}
          aria-busy={isBusy || undefined}
          className={canPay ? PRIMARY_BUTTON : DISABLED_BUTTON}
        >
          {payLabel}
        </button>
      )}
      {!isPaid && !isTermsAccepted && <p className="text-[11px] text-[#6B7280] text-center">{t('onboarding.payment.acceptFirst')}</p>}

      <div className="text-center pt-2">
        <div className="flex flex-wrap items-center justify-center gap-1.5 text-[9px] text-[#16794A]"><img src={shieldGreenIcon} alt="" aria-hidden="true" width={14} height={14} /><span className="font-bold">{t('onboarding.payment.secureTitle')}</span> — {t('onboarding.payment.secureBody')}</div>
      </div>
    </div>
  );
}
