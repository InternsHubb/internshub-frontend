import { useEffect, useState, type DependencyList } from 'react';

type EmployerResourceState<T> = {
  data: T | null;
  loading: boolean;
  error: boolean;
};

export function useEmployerResource<T>(load: () => Promise<T>, deps: DependencyList) {
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<EmployerResourceState<T>>({
    data: null,
    loading: true,
    error: false,
  });

  useEffect(() => {
    let active = true;
    setState({ data: null, loading: true, error: false });

    load()
      .then((data) => {
        if (active) setState({ data, loading: false, error: false });
      })
      .catch(() => {
        if (active) setState({ data: null, loading: false, error: true });
      });

    return () => {
      active = false;
    };
  }, [...deps, attempt]);

  return {
    ...state,
    reload: () => setAttempt((value) => value + 1),
  };
}
