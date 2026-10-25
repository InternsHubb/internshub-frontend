import { useCallback, useRef, useState } from 'react';

import { ApiError } from '@/lib/api/client';
import { apiErrorKey } from '@/lib/api/errors';
import { confirmUpload, createUploadUrl, uploadToSignedUrl } from '@/lib/api/files';
import { getInterview, getMyInterviews, startInterview, submitInterviewAnswer } from '@/lib/api/interviews';
import { giveConsent } from '@/lib/api/me';
import type { InterviewDto, InterviewLevel } from '@/lib/api/types';
import type { OutcomeScreen } from './types';

// The backend AI interview behind the Setup step's question screens:
// - Start: an unfinished attempt (InProgress or Interrupted, from GET /api/me/interviews) is
//   resumed with GET /api/interviews/{id}; otherwise POST /api/interviews starts one.
// - Each spoken answer is recorded from the microphone stream the device check opened, uploaded as
//   an Audio file (upload-url → signed PUT → confirm) and sent with POST /api/interviews/{id}/answers.
//   The response carries the next question, or none when the interview has ended.

const RESUMABLE = new Set<InterviewDto['status']>(['InProgress', 'Interrupted']);
// MediaRecorder formats in order of preference; the first one the browser supports is used.
const RECORDING_TYPES = ['audio/webm;codecs=opus', 'audio/webm', 'audio/ogg;codecs=opus', 'audio/mp4'];

export type LiveInterviewStatus = 'idle' | 'starting' | 'ready' | 'submitting' | 'error';

function recordingType(): string | undefined {
  if (typeof MediaRecorder === 'undefined') return undefined;
  return RECORDING_TYPES.find((type) => MediaRecorder.isTypeSupported(type));
}

// "audio/webm;codecs=opus" → "audio/webm": the files API takes a plain MIME type.
function baseMimeType(type: string): string {
  return type.split(';')[0].trim() || 'audio/webm';
}

// Where the interview's end leads on the Result step.
export function outcomeFor(interview: InterviewDto): OutcomeScreen {
  switch (interview.status) {
    case 'Interrupted':
      return 'resume';
    case 'Abandoned':
      return 'cannot-resume';
    case 'Completed':
    case 'AutoConfirmed':
    case 'Reviewed':
      if (interview.type === 'Orientation') return 'orientation';
      return interview.result?.level ? 'result' : 'under-review';
    default:
      return 'under-review';
  }
}

// Key under onboarding.interview.levels.
export function levelKey(level: InterviewLevel): string {
  return { NotReady: 'notReady', Junior: 'junior', Mid: 'mid', Advanced: 'advanced' }[level];
}

export function useLiveInterview() {
  const [interview, setInterview] = useState<InterviewDto | null>(null);
  const [status, setStatus] = useState<LiveInterviewStatus>('idle');
  const [errorKey, setErrorKey] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const recorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);

  const starting = useRef(false);

  // The candidate ticked the recording consent before reaching the questions; it is recorded
  // (idempotent on the backend) before the attempt starts. One start at a time, so a repeated
  // effect can't create two attempts.
  const start = useCallback(async () => {
    if (starting.current) return;
    starting.current = true;
    setStatus('starting');
    setErrorKey(null);
    try {
      await giveConsent('InterviewRecording');
      const unfinished = (await getMyInterviews()).find((item) => RESUMABLE.has(item.status));
      setInterview(unfinished ? await getInterview(unfinished.id) : await startInterview());
      setStatus('ready');
    } catch (error) {
      setErrorKey(apiErrorKey(error));
      setStatus('error');
    } finally {
      starting.current = false;
    }
  }, []);

  const startRecording = useCallback((stream: MediaStream | null) => {
    const type = recordingType();
    if (!stream || !type) {
      setErrorKey('onboarding.interview.live.errors.recordingUnsupported');
      return;
    }
    chunks.current = [];
    const next = new MediaRecorder(stream, { mimeType: type });
    next.ondataavailable = (event) => {
      if (event.data.size > 0) chunks.current.push(event.data);
    };
    next.start();
    recorder.current = next;
    // A send error stays on screen while the candidate answers again.
    setIsRecording(true);
  }, []);

  // Resolves with the recorded audio once the recorder has flushed its last chunk.
  const stopRecording = useCallback(
    () =>
      new Promise<Blob | null>((resolve) => {
        const current = recorder.current;
        recorder.current = null;
        setIsRecording(false);
        if (!current || current.state === 'inactive') {
          resolve(null);
          return;
        }
        current.onstop = () => resolve(new Blob(chunks.current, { type: current.mimeType }));
        current.stop();
      }),
    []
  );

  // Discards a recording without sending it (e.g. the interview paused or the learner left).
  const cancelRecording = useCallback(() => {
    void stopRecording();
  }, [stopRecording]);

  const submitAnswer = useCallback(async (): Promise<InterviewDto | null> => {
    const question = interview?.currentQuestion;
    if (!interview || !question) return null;
    const audio = await stopRecording();
    if (!audio || audio.size === 0) {
      setErrorKey('onboarding.interview.live.errors.emptyRecording');
      return null;
    }
    setStatus('submitting');
    setErrorKey(null);
    try {
      const mimeType = baseMimeType(audio.type);
      const target = await createUploadUrl({ kind: 'Audio', mimeType, sizeBytes: audio.size });
      await uploadToSignedUrl(target, audio).catch((error: unknown) => {
        if (error instanceof ApiError && error.status === 0) throw error;
        throw new ApiError(500, null, 'Audio upload failed');
      });
      await confirmUpload(target.assetId);
      const next = await submitInterviewAnswer(interview.id, { orderIndex: question.orderIndex, audioAssetId: target.assetId });
      setInterview(next);
      setStatus('ready');
      return next;
    } catch (error) {
      setErrorKey(apiErrorKey(error));
      setStatus('ready');
      return null;
    }
  }, [interview, stopRecording]);

  return { interview, status, errorKey, isRecording, start, startRecording, cancelRecording, submitAnswer };
}

export type LiveInterview = ReturnType<typeof useLiveInterview>;
