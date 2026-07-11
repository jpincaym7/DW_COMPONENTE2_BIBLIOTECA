import { useCallback, useEffect, useRef, useState } from 'react';

export const useApi = (apiFunction, { immediate = true, params = null } = {}) => {
  const [data, setData] = useState(null);
  const [meta, setMeta] = useState(null);
  const [isLoading, setIsLoading] = useState(immediate);
  const [error, setError] = useState(null);

  const apiFunctionRef = useRef(apiFunction);
  apiFunctionRef.current = apiFunction;

  const execute = useCallback(async (executionParams) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiFunctionRef.current(executionParams);

      setData(response.data);
      setMeta(response.meta ?? null);

      return response.data;
    } catch (apiError) {
      setError(apiError.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const serializedParams = params ? JSON.stringify(params) : null;

  useEffect(() => {
    if (!immediate) {
      return;
    }

    execute(serializedParams ? JSON.parse(serializedParams) : undefined);
  }, [execute, immediate, serializedParams]);

  const refetch = useCallback(
    () => execute(serializedParams ? JSON.parse(serializedParams) : undefined),
    [execute, serializedParams]
  );

  return { data, meta, isLoading, error, execute, refetch };
};
