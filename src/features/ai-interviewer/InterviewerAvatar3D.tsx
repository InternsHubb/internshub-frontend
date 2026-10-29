import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { INTERVIEWER_POSTER_URL, InterviewerStage } from './interviewerStage';
import type { AvatarState } from './types';

export type InterviewerAvatar3DProps = {
  state: AvatarState;
  /** The <audio> element playing the question. Its sound drives the lip sync. */
  audioElement?: HTMLAudioElement | null;
  /** True while the question is spoken without an analysable audio element (speechSynthesis). */
  speakingWithoutAudio?: boolean;
  className?: string;
  /** Rendered if WebGL is unavailable or the model fails to load. */
  fallback?: ReactNode;
  onReady?: () => void;
};

function webglAvailable() {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

/**
 * The 3D interviewer in a transparent canvas that fills its parent. Shows the poster (same framing)
 * until the live model has drawn its first frame. Default export so it can be React.lazy-loaded:
 * three.js stays out of the main bundle.
 */
export default function InterviewerAvatar3D({
  state,
  audioElement = null,
  speakingWithoutAudio = false,
  className = '',
  fallback = null,
  onReady,
}: InterviewerAvatar3DProps) {
  const host = useRef<HTMLDivElement | null>(null);
  const stage = useRef<InterviewerStage | null>(null);
  const [supported] = useState(() => typeof document !== 'undefined' && webglAvailable());
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const onReadyRef = useRef(onReady);
  onReadyRef.current = onReady;

  useEffect(() => {
    if (!supported || !host.current) return;
    let s: InterviewerStage;
    try {
      s = new InterviewerStage(host.current, {
        onReady: () => {
          setReady(true);
          onReadyRef.current?.();
        },
        onError: () => setFailed(true),
      });
    } catch {
      setFailed(true);
      return;
    }
    stage.current = s;
    return () => {
      s.dispose();
      stage.current = null;
    };
  }, [supported]);

  useEffect(() => stage.current?.setState(state), [state, ready]);
  useEffect(() => stage.current?.setAudioElement(audioElement), [audioElement, ready]);
  useEffect(() => stage.current?.setSpeakingWithoutAudio(speakingWithoutAudio), [speakingWithoutAudio, ready]);

  if (!supported || failed) return <>{fallback}</>;

  return (
    <div className={`relative h-full w-full overflow-hidden ${className}`}>
      <img
        src={INTERVIEWER_POSTER_URL}
        alt=""
        aria-hidden
        draggable={false}
        className={`pointer-events-none absolute start-1/2 top-0 h-full w-auto max-w-none -translate-x-1/2 select-none transition-opacity duration-500 rtl:translate-x-1/2 ${
          ready ? 'opacity-0' : 'opacity-100'
        }`}
      />
      <div ref={host} className={`absolute inset-0 transition-opacity duration-500 ${ready ? 'opacity-100' : 'opacity-0'}`} />
    </div>
  );
}
