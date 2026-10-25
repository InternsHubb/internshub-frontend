import { useEffect, useState, type DependencyList } from 'react';
import { ApiError } from '@/lib/api/client';

export type ApiResourceResult<T> = {
  data: T | null;
  isLoading: boolean;
  error: ApiError | null;
  reload: () => void;
};

export function useApiResource<T>(
  load: (signal: AbortSignal) => Promise<T>,
  deps: DependencyList = []
): ApiResourceResult<T> {
  const [attempt, setAttempt] = useState(0);
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<ApiError | null>(null);

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
        if (err instanceof DOMException && err.name === 'AbortError') {
          return;
        }
        if (active) {
          const apiError =
            err instanceof ApiError
              ? err
              : new ApiError(0, null, err instanceof Error ? err.message : 'Unknown error');
          setError(apiError);
          setIsLoading(false);
        }
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, [...deps, attempt]);

  return {
    data,
    isLoading,
    error,
    reload: () => setAttempt((value) => value + 1),
  };
}
