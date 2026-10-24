import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface CancelSessionModalProps {
  isOpen: boolean;
  isLate?: boolean;
  isLateCancellation?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const CancelSessionModal: React.FC<CancelSessionModalProps> = ({
  isOpen,
  isLate = false,
  isLateCancellation,
  onClose,
  onConfirm,
}) => {
  const late = isLateCancellation !== undefined ? isLateCancellation : isLate;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-[24px] p-7 shadow-2xl border border-[#f1ecf7] dark:border-purple-900/40 relative animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 size-8 rounded-full bg-[#f4f0f8] dark:bg-purple-950/40 hover:bg-[#ede6f3] text-[#64748b] dark:text-slate-300 flex items-center justify-center transition-colors"
          aria-label="Close modal"
        >
          <X className="size-4" />
        </button>

        {/* Warning Icon (Figma 142:8627 / 142:8797) */}
        <div className="size-14 rounded-2xl bg-[#fffbeb] dark:bg-amber-950/40 border border-[#fef3c7] dark:border-amber-900/50 flex items-center justify-center text-[#d97706] mx-auto mb-5 shadow-sm">
          <AlertTriangle className="size-7" />
        </div>

        {/* Header & Text */}
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-[#0f172a] dark:text-white mb-2">
            {late ? 'Late Cancellation' : 'Cancel Session?'}
          </h2>
          <p className="text-sm text-[#475569] dark:text-slate-300 leading-relaxed max-w-xs mx-auto">
            {late
              ? 'This session will be cancelled, but it will not be returned to your mentorship balance.'
              : 'This session will be returned to your mentorship balance.'}
          </p>
          <p className="text-xs text-[#94a3b8] dark:text-slate-400 mt-2 font-medium">
            {late
              ? 'Late cancellations use the session credit.'
              : 'You can book another available session later.'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          <button
            type="button"
            onClick={onConfirm}
            className="w-full py-3 px-4 rounded-xl bg-[#dc2626] hover:bg-[#b91c1c] text-white font-semibold text-sm transition-colors shadow-sm"
          >
            Cancel Session
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 px-4 rounded-xl border border-[#e9d5ff] dark:border-purple-900/60 bg-white dark:bg-slate-900 hover:bg-[#faf7fd] text-[#475569] dark:text-slate-200 font-semibold text-sm transition-colors shadow-sm"
          >
            Keep Session
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelSessionModal;
