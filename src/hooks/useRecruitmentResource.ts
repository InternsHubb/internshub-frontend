import { useEffect, useState } from 'react';

export type RecruitmentResourceState<T> = {
  data: T | null;
  isLoading: boolean;
  isError: boolean;
};

export function useRecruitmentResource<T>(
  load: () => Promise<T | null>,
): RecruitmentResourceState<T> {
  const [state, setState] = useState<RecruitmentResourceState<T>>({
    data: null,
    isLoading: true,
    isError: false,
  });

  useEffect(() => {
    let isCurrent = true;

    setState({ data: null, isLoading: true, isError: false });

    load()
      .then((data) => {
        if (isCurrent) setState({ data, isLoading: false, isError: false });
      })
      .catch(() => {
        if (isCurrent) setState({ data: null, isLoading: false, isError: true });
      });

    return () => {
      isCurrent = false;
    };
  }, [load]);

  return state;
}
