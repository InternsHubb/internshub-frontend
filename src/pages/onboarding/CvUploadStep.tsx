import { useRef, useState, type ChangeEvent, type DragEvent, type KeyboardEvent } from 'react';
import { useTranslation } from 'react-i18next';

import shieldWhiteNarrowIcon from '../../assets/onboarding/shield-white-narrow.svg';
import uploadPurpleIcon from '../../assets/onboarding/upload-purple.svg';
import uploadWhiteIcon from '../../assets/onboarding/upload-white.svg';
import { apiErrorKey } from '@/lib/api/errors';
import type { CvDto } from '@/lib/api/types';
import { CvFileError, isCvParsing, type CvUploadStage } from './useMyCv';

// Step 05 "Upload Your CV". The drop zone opens a real file picker (or takes a dropped file) and
// uploads it through useMyCv; the step shows the CV the backend has and its parse status. Continue
// is available once the backend holds a CV whose parsing hasn't failed.

type CvUploadStepProps = {
  cv: CvDto | null;
  isLoading: boolean;
  loadError: unknown;
  stage: CvUploadStage;
  onRetry: () => void;
  onUpload: (file: File) => Promise<void>;
  onBack: () => void;
  onContinue: () => void;
  onPreviewReview: () => void;
};

type ParseBadge = 'waiting' | 'parsing' | 'parsed' | 'failed';

const ACCEPT = '.pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document';
const BADGE_CLASSES: Record<ParseBadge, string> = {
  waiting: 'bg-[#F1EEF2] text-[#685F6D]',
  parsing: 'bg-[#FFF7E6] text-[#9A5700]',
  parsed: 'bg-[#EAF8F0] text-[#16794A]',
  failed: 'bg-[#FEF0EF] text-[#B42318]',
};

function parseBadge(cv: CvDto | null): ParseBadge {
  if (!cv) return 'waiting';
  if (isCvParsing(cv)) return 'parsing';
  return cv.parseStatus === 'Parsed' ? 'parsed' : 'failed';
}

function formatMegabytes(bytes: number): string {
  return (bytes / (1024 * 1024)).toFixed(2);
}

export function CvUploadStep({ cv, isLoading, loadError, stage, onRetry, onUpload, onBack, onContinue, onPreviewReview }: CvUploadStepProps) {
  const { t, i18n } = useTranslation();
  const input = useRef<HTMLInputElement>(null);
  const [errorKey, setErrorKey] = useState<string | null>(null);
  // Name and size of a file uploaded on this visit; the backend's CV record doesn't include them.
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const isBusy = stage !== 'idle';
  const hasCv = cv !== null;
  const badge = parseBadge(cv);
  const canContinue = hasCv && badge !== 'failed' && !isBusy;

  const send = async (file: File) => {
    setErrorKey(null);
    try {
      await onUpload(file);
      setUploadedFile({ name: file.name, size: file.size });
    } catch (error) {
      setErrorKey(error instanceof CvFileError ? error.messageKey : apiErrorKey(error));
    }
  };

  const openPicker = () => { if (!isBusy) input.current?.click(); };
  const handlePicked = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    // Cleared so picking the same file again still fires a change.
    event.target.value = '';
    if (file) void send(file);
  };
  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files[0];
    if (file && !isBusy) void send(file);
  };
  const handleKey = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openPicker();
    }
  };

  const zoneTitle = isBusy ? t(`onboarding.cv.stage.${stage}`) : hasCv ? t('onboarding.cv.zone.added') : t('onboarding.cv.zone.empty');
  const zoneHint = isBusy ? t('onboarding.cv.zone.wait') : hasCv ? t('onboarding.cv.zone.replace') : t('onboarding.cv.zone.browse');
  const uploadedAt = cv ? new Intl.DateTimeFormat(i18n.language, { dateStyle: 'medium' }).format(new Date(cv.uploadedAt)) : '';
  const isSuccessZone = hasCv && !isBusy && badge !== 'failed';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[36px] sm:text-[46px] lg:text-[58px] leading-[1.08] font-extrabold text-[#21062E] tracking-[-0.045em] text-balance">Upload Your CV</h1>
        <p className="text-[#69616D] text-base">Your CV helps us understand your background and prepare a relevant assessment.</p>
      </div>

      <div className="bg-white/88 p-4 rounded-[18px] border border-[#3A0353]/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-[38px] h-[38px] shrink-0 bg-[#3A0353] rounded-[12px] flex items-center justify-center"><img src={shieldWhiteNarrowIcon} alt="" aria-hidden="true" width={18} height={18} /></div>
          <div><h4 className="text-xs font-bold text-[#111827]">Required for every package</h4><p className="text-[9px] text-[#6B7280]">Your CV must be ready before the interview.</p></div>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-[9px] text-[#5C1D87]">
          <span className="border-l border-[#E8E2EC] pl-3">PDF or DOCX</span>
          <span className="border-l border-[#E8E2EC] pl-3">5 MB maximum</span>
          <button type="button" disabled={isBusy} onClick={onPreviewReview} className="px-3 py-1 bg-[#F3E9FA] font-bold rounded-full underline disabled:opacity-50">{t('onboarding.cvReview.open')}</button>
        </div>
      </div>

      {isLoading && <p role="status" className="text-xs text-[#6B7280]">{t('onboarding.cv.loading')}</p>}
      {Boolean(loadError) && !isLoading && (
        <div role="alert" className="bg-[#FEF0EF] p-4 rounded-[14px] text-xs text-[#B42318] flex flex-wrap items-center gap-3">
          <span>{t(apiErrorKey(loadError))}</span>
          <button type="button" onClick={onRetry} className="underline font-bold">{t('onboarding.cv.retry')}</button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/92 p-7 rounded-[28px] border border-[#3A0353]/10 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex justify-between items-center mb-6">
              <div><span className="text-[9px] font-bold text-[#8B5DB0] uppercase">01 · ADD YOUR FILE</span><h3 className="text-lg font-normal text-[#111827]">Upload from your device</h3></div>
              <div className="w-[42px] h-[42px] bg-[#FBF7FE] border border-[#E0D3E7] rounded-[13px] flex items-center justify-center text-xs font-bold text-[#5C1D87]">CV</div>
            </div>

            <input ref={input} type="file" accept={ACCEPT} className="sr-only" tabIndex={-1} aria-hidden="true" onChange={handlePicked} />
            <div
              role="button"
              tabIndex={isBusy ? -1 : 0}
              aria-disabled={isBusy || undefined}
              aria-busy={isBusy || undefined}
              aria-label={`${zoneTitle}. ${zoneHint}`}
              onClick={openPicker}
              onKeyDown={handleKey}
              onDragOver={(event) => { event.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`border-2 border-dashed p-8 rounded-[24px] text-center flex flex-col items-center justify-center outline-none focus-visible:ring-2 focus-visible:ring-[#5C1D87] ${isBusy ? 'cursor-wait' : 'cursor-pointer'} ${isSuccessZone ? 'border-[#8AC8A7] bg-gradient-to-b from-[#FFFFFF] to-[#F1FBF5]' : 'border-[#BFA4CE] bg-gradient-to-b from-[#FDFBFF] to-[#F6EEFB]'} ${isDragging ? 'border-[#5C1D87]' : ''}`}
            >
              <div className={`w-16 h-16 rounded-[20px] flex items-center justify-center text-xl mb-3 shadow-lg text-white ${isSuccessZone ? 'bg-[#16794A]' : 'bg-[#3A0353]'}`}>
                {isBusy
                  ? <span className="size-6 animate-spin rounded-full border-2 border-white border-t-transparent" aria-hidden="true" />
                  : isSuccessZone ? '✓' : <img src={uploadWhiteIcon} alt="" aria-hidden="true" width={20} height={20} />}
              </div>
              <h4 className="text-base font-normal text-[#111827]">{zoneTitle}</h4>
              <p className="text-xs text-[#6B7280] mb-4">{zoneHint}</p>
              <div className="flex justify-center gap-2">
                <span className="px-2.5 py-1 bg-white/70 text-[8px] text-[#5C1D87] border rounded-[7px]">PDF</span>
                <span className="px-2.5 py-1 bg-white/70 text-[8px] text-[#5C1D87] border rounded-[7px]">DOCX</span>
                <span className="px-2.5 py-1 bg-white/70 text-[8px] text-[#5C1D87] border rounded-[7px]">MAX 5 MB</span>
              </div>
            </div>

            {errorKey && <p role="alert" className="mt-3 text-[11px] text-[#B42318]">{t(errorKey)}</p>}

            {cv && (
              <div className="mt-4 p-3 bg-white border border-[#E8E2EC] rounded-[12px] flex items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 shrink-0 bg-[#F3E9FA] text-[#5C1D87] rounded-[9px] flex items-center justify-center text-[10px] font-bold">DOC</div>
                  <div className="min-w-0">
                    <h5 className="text-xs text-[#111827] truncate" dir="auto">{uploadedFile?.name ?? t('onboarding.cv.file.saved')}</h5>
                    <p className="text-[9px] text-[#6B7280]">
                      {uploadedFile ? t('onboarding.cv.file.size', { value: formatMegabytes(uploadedFile.size) }) : t('onboarding.cv.file.uploadedOn', { date: uploadedAt })}
                    </p>
                  </div>
                </div>
                {cv.downloadUrl && (
                  <a href={cv.downloadUrl} target="_blank" rel="noopener noreferrer" className="shrink-0 text-xs text-[#5C1D87] underline">{t('onboarding.cv.file.view')}</a>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white/92 p-7 rounded-[28px] border border-[#3A0353]/10 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <div><span className="text-[9px] font-bold text-[#8B5DB0] uppercase">02 · SMART REVIEW</span><h3 className="text-lg font-normal text-[#111827]">CV profile snapshot</h3></div>
              <span role="status" className={`px-3 py-1 text-[9px] font-bold rounded-full ${BADGE_CLASSES[badge]}`}>{t(`onboarding.cv.badge.${badge}`)}</span>
            </div>

            <div className={`flex items-center justify-between px-4 py-3 rounded-[13px] text-[8px] mb-6 bg-[#FAF8FB] ${hasCv ? 'text-[#16794A]' : 'text-[#AAA2AD]'}`}>
              <span>{hasCv ? '✓' : '①'} Upload</span><span className={`flex-grow h-[1px] mx-3 ${hasCv ? 'bg-[#16794A]' : 'bg-[#E8E2EC]'}`}></span>
              <span>{badge === 'parsed' ? '✓' : '②'} Parse</span><span className={`flex-grow h-[1px] mx-3 ${badge === 'parsed' ? 'bg-[#16794A]' : 'bg-[#E8E2EC]'}`}></span>
              <span>{badge === 'parsed' ? '✓' : '③'} Review</span>
            </div>

            {badge === 'parsed' && (
              <div className="space-y-3">
                {cv?.parsedSummary && <p className="text-[11px] text-[#5C5C5C] leading-relaxed" dir="auto">{cv.parsedSummary}</p>}
                <div className="grid grid-cols-2 gap-3">
                  {['skills', 'education', 'experience'].map((cat) => (
                    <button type="button" onClick={onPreviewReview} key={cat} className="p-4 bg-[#FBF7FE] rounded-[12px] text-start text-xs text-[#5c1d87] underline">
                      {t(`onboarding.cvReview.${cat}`)}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {badge === 'parsing' && <p className="text-center py-6 text-[11px] text-[#6B7280]">{t('onboarding.cv.parsing')}</p>}
            {badge === 'failed' && <p role="alert" className="text-center py-6 text-[11px] text-[#B42318]">{t('onboarding.cv.parseFailed')}</p>}
            {badge === 'waiting' && (
              <div className="text-center py-6 text-[#6B7280]">
                <div className="w-[68px] h-[68px] bg-gradient-to-br from-white to-[#F4EAFA] border border-[#D9C8E3] rounded-[20px] mx-auto flex items-center justify-center mb-3 shadow-md"><img src={uploadPurpleIcon} alt="" aria-hidden="true" width={20} height={20} /></div>
                <h4 className="text-sm font-normal text-[#111827]">Your profile preview starts here</h4>
                <p className="text-[11px] text-[#6B7280] max-w-[270px] mx-auto mt-1 leading-relaxed">Skills, education, projects, and experience will be organized for your review.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap justify-end items-center gap-4 pt-4">
        <button onClick={onBack} disabled={isBusy} className="font-bold text-sm text-[#5C1D87] disabled:text-[#9A939E]">Back</button>
        <button
          onClick={() => { if (canContinue) onContinue(); }}
          aria-disabled={!canContinue}
          className={`px-7 py-3.5 font-bold text-sm rounded-[13px] shadow flex items-center gap-2 ${canContinue ? 'bg-gradient-to-r from-[#4C0585] to-[#3A0353] text-white' : 'bg-[#ECEAED] text-[#9A939E] cursor-not-allowed'}`}
        >
          Continue to Payment →
        </button>
      </div>
    </div>
  );
}
