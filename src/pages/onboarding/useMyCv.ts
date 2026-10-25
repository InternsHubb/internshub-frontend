import { useCallback, useEffect, useState } from 'react';

import { useApiResource } from '@/hooks/useApiResource';
import { ApiError } from '@/lib/api/client';
import { confirmUpload, createUploadUrl, uploadToSignedUrl } from '@/lib/api/files';
import { getMyCv, submitCv } from '@/lib/api/profile';
import type { CvDto } from '@/lib/api/types';

// The learner's CV for the onboarding CV step. Uploading runs the backend's file flow:
// POST /api/files/upload-url → PUT the bytes to the signed URL → POST /api/files/{id}/confirm →
// POST /api/me/cv with that asset id → GET /api/me/cv. Parsing is asynchronous, so a Pending or
// Processing CV is re-read until it settles.

export const CV_MAX_BYTES = 5 * 1024 * 1024;
const PARSE_POLL_MS = 5000;

// Browsers sometimes leave `type` empty for .docx, so the extension decides the MIME type.
const CV_TYPES: Readonly<Record<string, string>> = {
  pdf: 'application/pdf',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
};

export type CvUploadStage = 'idle' | 'uploading' | 'confirming' | 'submitting';

export class CvFileError extends Error {
  readonly messageKey: string;
  constructor(messageKey: string) {
    super(messageKey);
    this.messageKey = messageKey;
  }
}

export function cvMimeType(file: File): string | null {
  const extension = file.name.split('.').pop()?.toLowerCase() ?? '';
  return CV_TYPES[extension] ?? null;
}

// Returns the reason a file can't be used, or null when it can.
export function cvFileProblem(file: File): string | null {
  if (!cvMimeType(file)) return 'onboarding.cv.errors.type';
  if (file.size === 0) return 'onboarding.cv.errors.empty';
  if (file.size > CV_MAX_BYTES) return 'onboarding.cv.errors.size';
  return null;
}

// No CV yet is answered with 404; that is an empty state, not an error.
async function loadCv(): Promise<CvDto | null> {
  try {
    return await getMyCv();
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

export function isCvParsing(cv: CvDto | null): boolean {
  return cv?.parseStatus === 'Pending' || cv?.parseStatus === 'Processing';
}

export function useMyCv() {
  const { data, isLoading, error, reload } = useApiResource(loadCv);
  // Set after an upload or a status re-read; until then the loaded CV is shown.
  const [latest, setLatest] = useState<CvDto | null | undefined>(undefined);
  const [stage, setStage] = useState<CvUploadStage>('idle');
  const cv = latest === undefined ? data : latest;

  useEffect(() => {
    if (!isCvParsing(cv)) return undefined;
    const id = window.setTimeout(() => {
      loadCv().then(setLatest).catch(() => { /* keep the last status; the next render retries */ });
    }, PARSE_POLL_MS);
    return () => window.clearTimeout(id);
  }, [cv]);

  const upload = useCallback(async (file: File): Promise<void> => {
    const problem = cvFileProblem(file);
    const mimeType = cvMimeType(file);
    if (problem || !mimeType) throw new CvFileError(problem ?? 'onboarding.cv.errors.type');
    try {
      setStage('uploading');
      const target = await createUploadUrl({ kind: 'Document', mimeType, sizeBytes: file.size });
      await uploadToSignedUrl(target, file).catch((error: unknown) => {
        // The storage service's status codes aren't the API's, so only "offline" keeps its meaning.
        if (error instanceof ApiError && error.status === 0) throw error;
        throw new CvFileError('onboarding.cv.errors.upload');
      });
      setStage('confirming');
      await confirmUpload(target.assetId);
      setStage('submitting');
      await submitCv(target.assetId);
      setLatest(await loadCv());
    } finally {
      setStage('idle');
    }
  }, []);

  const retry = useCallback(() => {
    setLatest(undefined);
    reload();
  }, [reload]);

  return { cv: cv ?? null, isLoading: isLoading && latest === undefined, error: latest === undefined ? error : null, retry, upload, stage };
}
