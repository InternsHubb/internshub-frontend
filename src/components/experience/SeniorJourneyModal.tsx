import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import type { SeniorProfile } from '@/types/senior';
import { SeniorJourneyView } from './SeniorJourneyView';

interface SeniorJourneyModalProps {
  senior: SeniorProfile | null;
  isOpen: boolean;
  onClose: () => void;
}

export const SeniorJourneyModal: React.FC<SeniorJourneyModalProps> = ({
  senior,
  isOpen,
  onClose,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Close on Escape key and manage body overflow
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Focus close button initially for accessibility
    setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 50);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen || !senior) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={`senior-dialog-title-${senior.id}`}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-8"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className="fixed inset-0 bg-[#160628]/70 backdrop-blur-md transition-opacity animate-in fade-in duration-300"
      />

      {/* Modal Dialog Content */}
      <div
        ref={modalRef}
        className="relative z-10 w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-white rounded-[28px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35)] border border-purple-100 p-5 sm:p-8 md:p-10 animate-in zoom-in-95 duration-200 scrollbar-thin scrollbar-thumb-purple-200"
      >
        {/* Floating Close Button */}
        <button
          ref={closeButtonRef}
          onClick={onClose}
          aria-label="Close story preview"
          className="sticky top-0 float-right rtl:float-left -mt-2 -mr-2 rtl:-mr-0 rtl:-ml-2 z-20 size-10 rounded-full bg-slate-100 hover:bg-purple-100 text-slate-700 hover:text-[#5a198f] flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5a198f] shadow-sm"
        >
          <X className="size-5" />
        </button>

        {/* Hidden screen-reader heading for ARIA */}
        <h2 id={`senior-dialog-title-${senior.id}`} className="sr-only">
          Career Journey of {senior.name}
        </h2>

        {/* Complete Journey Content */}
        <SeniorJourneyView
          senior={senior}
          showBackNavigation={true}
          onBack={onClose}
          isModal={true}
        />
      </div>
    </div>
  );
};

