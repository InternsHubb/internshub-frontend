import { useEffect, useState, type DependencyList } from 'react';
import { BackendError } from '@/backend';

export type ResourceState<T> = {
  data: T | null;
  isLoading: boolean;
  error: BackendError | null;
  reload: () => void;
};

export function useResource<T>(
  load: (signal: AbortSignal) => Promise<T>,
  deps: DependencyList = []
): ResourceState<T> {
  const [attempt, setAttempt] = useState(0);
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<BackendError | null>(null);

  useEffect(() => {
    let active = true;
    const controller = new AbortController();

    setIsLoading(true);
    setError(null);

    load(controller.signal)
      .then((result) => {
        if (active) {
          setData(result);
          setIsLoading(false);
          setError(null);
        }
      })
      .catch((err) => {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        if (active) {
          const backendError =
            err instanceof BackendError
              ? err
              : new BackendError(0, null, err instanceof Error ? err.message : 'Unknown error');
          setError(backendError);
          setIsLoading(false);
        }
      });

    return () => {
      active = false;
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, attempt]);

  return {
    data,
    isLoading,
    error,
    reload: () => setAttempt((value) => value + 1),
  };
}
