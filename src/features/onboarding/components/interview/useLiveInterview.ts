import { useCallback, useRef, useState } from 'react';

import { BackendError } from '@/backend';
import {
  apiErrorDetail,
  apiErrorKey,
  confirmUpload,
  createUploadUrl,
  getInterview,
  getMyInterviews,
  giveConsent,
  startInterview,
  submitInterviewAnswer,
  uploadToSignedUrl,
} from '@/features/onboarding/services/onboardingService';
import type { InterviewDto, InterviewLevel } from '@/features/onboarding/types/onboarding.types';
import type { OutcomeScreen } from '@/features/onboarding/components/interview/types';

// The backend AI interview behind the Setup step's question screens:
// - Start: an unfinished attempt (InProgress or Interrupted, from GET /api/me/interviews) is
//   resumed with GET /api/interviews/{id}; otherwise POST /api/interviews starts one.
// - Each spoken answer is recorded from the microphone stream the device check opened, uploaded as
//   an Audio file (upload-url → signed PUT → confirm) and sent with POST /api/interviews/{id}/answers.
//   The response carries the next question, or none when the interview has ended.
// - A take that couldn't be sent (e.g. 503 from the answers endpoint) is kept, so the candidate can
//   send it again without re-recording, or discard it and answer again. An upload that was already
//   confirmed is not repeated. After a failure the attempt is read back once: if the backend did
//   save the answer (it moved past that question), the flow continues from the backend state.

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

// A recorded answer on its way to the backend. assetId is set once its upload is confirmed.
type AnswerTake = { orderIndex: number; audio: Blob; assetId: string | null };

// Reads the attempt back after a failed send. Returns it only when the backend has moved past the
// question, i.e. the answer was saved even though the response failed.
async function savedDespiteError(
  interview: InterviewDto,
  orderIndex: number,
  error: unknown
): Promise<InterviewDto | null> {
  if (!(error instanceof BackendError) || error.status === 0 || error.status === 401) return null;
  try {
    const fresh = await getInterview(interview.id);
    const moved = fresh.answeredCount > interview.answeredCount && fresh.currentQuestion?.orderIndex !== orderIndex;
    return moved ? fresh : null;
  } catch {
    return null;
  }
}

export function useLiveInterview() {
  const [interview, setInterview] = useState<InterviewDto | null>(null);
  const [status, setStatus] = useState<LiveInterviewStatus>('idle');
  // Failures from the backend (start, upload, send) and from the recorder are kept apart: the
  // first is shown as a send/start error, the second as a microphone problem.
  const [errorKey, setErrorKey] = useState<string | null>(null);
  // The backend's own message for that failure, shown instead of the generic text when present.
  const [errorDetail, setErrorDetail] = useState<string | null>(null);
  const [recordingErrorKey, setRecordingErrorKey] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [pendingAnswer, setPendingAnswer] = useState<AnswerTake | null>(null);
  const recorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);

  const starting = useRef(false);

  // The candidate ticked the recording consent before reaching the questions; it is recorded
  // (idempotent on the backend) before the attempt starts. Called once per click (Device Check's
  // Continue, Try again); a second call while one is running is ignored.
  const start = useCallback(async () => {
    if (starting.current) return;
    starting.current = true;
    setStatus('starting');
    setErrorKey(null);
    setErrorDetail(null);
    setPendingAnswer(null);
    try {
      await giveConsent('InterviewRecording');
      const unfinished = (await getMyInterviews()).find((item) => RESUMABLE.has(item.status));
      setInterview(unfinished ? await getInterview(unfinished.id) : await startInterview());
      setStatus('ready');
    } catch (error) {
      if (import.meta.env.DEV && error instanceof BackendError) {
        console.warn('[interview] start failed', error.status, error.payload);
      }
      setErrorKey(apiErrorKey(error));
      setErrorDetail(apiErrorDetail(error));
      setStatus('error');
    } finally {
      starting.current = false;
    }
  }, []);

  const startRecording = useCallback((stream: MediaStream | null) => {
    const type = recordingType();
    if (!stream || !type) {
      setRecordingErrorKey('onboarding.interview.live.errors.recordingUnsupported');
      return;
    }
    chunks.current = [];
    // The constructor and start() throw if the stream's tracks have ended or the format is refused.
    let next: MediaRecorder;
    try {
      next = new MediaRecorder(stream, { mimeType: type });
      next.ondataavailable = (event) => {
        if (event.data.size > 0) chunks.current.push(event.data);
      };
      next.onerror = () => {
        if (recorder.current !== next) return;
        recorder.current = null;
        setIsRecording(false);
        setRecordingErrorKey('onboarding.interview.live.errors.recordingFailed');
      };
      next.start();
    } catch {
      setRecordingErrorKey('onboarding.interview.live.errors.recordingFailed');
      return;
    }
    recorder.current = next;
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

  // Uploads the take (unless already confirmed) and sends it. On failure the take is kept as the
  // pending answer, with the confirmed asset id so a resend skips the upload.
  const sendTake = useCallback(
    async (take: AnswerTake): Promise<InterviewDto | null> => {
      if (!interview) return null;
      setStatus('submitting');
      setErrorKey(null);
      setErrorDetail(null);
      let assetId = take.assetId;
      try {
        if (!assetId) {
          const mimeType = baseMimeType(take.audio.type);
          const target = await createUploadUrl({ kind: 'Audio', mimeType, sizeBytes: take.audio.size });
          await uploadToSignedUrl(target, take.audio).catch((error: unknown) => {
            if (error instanceof BackendError && error.status === 0) throw error;
            throw new BackendError(500, { code: 'UPLOAD_FAILED', detail: 'Audio upload failed' }, 'Audio upload failed');
          });
          await confirmUpload(target.assetId);
          assetId = target.assetId;
        }
        const next = await submitInterviewAnswer(interview.id, { orderIndex: take.orderIndex, audioAssetId: assetId });
        setPendingAnswer(null);
        setInterview(next);
        setStatus('ready');
        return next;
      } catch (error) {
        const saved = await savedDespiteError(interview, take.orderIndex, error);
        if (saved) {
          setPendingAnswer(null);
          setInterview(saved);
          setStatus('ready');
          return saved;
        }
        setPendingAnswer({ ...take, assetId });
        setErrorKey(apiErrorKey(error));
        setErrorDetail(apiErrorDetail(error));
        setStatus('ready');
        return null;
      }
    },
    [interview]
  );

  const submitAnswer = useCallback(async (): Promise<InterviewDto | null> => {
    const question = interview?.currentQuestion;
    if (!interview || !question) return null;
    const audio = await stopRecording();
    if (!audio || audio.size === 0) {
      setRecordingErrorKey('onboarding.interview.live.errors.emptyRecording');
      return null;
    }
    return sendTake({ orderIndex: question.orderIndex, audio, assetId: null });
  }, [interview, sendTake, stopRecording]);

  // Sends the kept take again, without recording a new one.
  const resendAnswer = useCallback(
    async (): Promise<InterviewDto | null> => (pendingAnswer ? sendTake(pendingAnswer) : null),
    [pendingAnswer, sendTake]
  );

  // Drops the kept take; the question screen then records a new answer.
  const discardPendingAnswer = useCallback(() => {
    setPendingAnswer(null);
    setErrorKey(null);
    setErrorDetail(null);
  }, []);

  // A recorder problem holds recording until the candidate chooses to try again.
  const clearRecordingError = useCallback(() => setRecordingErrorKey(null), []);

  return {
    interview,
    status,
    errorKey,
    errorDetail,
    recordingErrorKey,
    isRecording,
    hasPendingAnswer: pendingAnswer !== null,
    start,
    startRecording,
    cancelRecording,
    submitAnswer,
    resendAnswer,
    discardPendingAnswer,
    clearRecordingError,
  };
}

export type LiveInterview = ReturnType<typeof useLiveInterview>;
