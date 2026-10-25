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
        className="w-full max-w-md bg-white rounded-2xl p-7 shadow-2xl border border-[#f1ecf7] relative animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 end-4 size-6 hover:bg-[#ede6f3] text-[#64748b] flex items-center justify-center transition-colors"
          aria-label="Close modal"
        >
          <X className="size-4" />
        </button>

        {/* Warning Icon (Figma 142:8627 / 142:8797) */}
        <div className="size-14 rounded-2xl bg-[#fffbeb] border border-[#fef3c7] flex items-center justify-center text-[#d97706] mx-auto mb-5 shadow-sm">
          <AlertTriangle className="size-7" />
        </div>

        {/* Header & Text */}
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-[#0f172a] mb-2">
            {late ? 'Late Cancellation' : 'Cancel Session?'}
          </h2>
          <p className="text-sm text-[#475569] leading-relaxed max-w-xs mx-auto">
            {late
              ? 'This session will be cancelled, but it will not be returned to your mentorship balance.'
              : 'This session will be returned to your mentorship balance.'}
          </p>
          <p className="text-xs text-[#94a3b8] mt-2 font-medium">
            {late
              ? 'Late cancellations use the session credit.'
              : 'You can book another available session later.'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <button
            type="button"
            onClick={onConfirm}
            className="w-full py-3 px-4 rounded-xl bg-[#e92126] hover:bg-[#b91c1c] text-white font-semibold text-sm transition-colors shadow-sm"
          >
            Cancel Session
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 px-4 rounded-xl border border-[#e9d5ff] bg-white hover:bg-[#faf7fd] text-[#475569] font-semibold text-sm transition-colors shadow-sm"
          >
            Keep Session
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelSessionModal;
