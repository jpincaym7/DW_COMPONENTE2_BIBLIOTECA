import { useCallback, useEffect, useMemo, useState } from 'react';
import { PAGE_SIZE } from '@biblioteca/shared';

import { useApi } from './useApi.js';
import { useDebounce } from './useDebounce.js';

const removeEmptyFilters = (filters) =>
  Object.entries(filters).reduce((accumulator, [key, value]) => {
    if (value !== '' && value !== null && value !== undefined) {
      accumulator[key] = value;
    }
    return accumulator;
  }, {});

export const useCrudList = (apiFunction, { initialFilters = {}, limit = PAGE_SIZE } = {}) => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState(initialFilters);

  const debouncedSearch = useDebounce(search);

  const params = useMemo(
    () => ({ page, limit, ...removeEmptyFilters({ ...filters, q: debouncedSearch }) }),
    [page, limit, filters, debouncedSearch]
  );

  const { data, meta, isLoading, error, refetch } = useApi(apiFunction, { params });

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, filters]);

  const updateFilter = useCallback((name, value) => {
    setFilters((current) => ({ ...current, [name]: value }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
    setSearch('');
  }, [initialFilters]);

  return {
    items: data ?? [],
    meta,
    isLoading,
    error,
    page,
    setPage,
    search,
    setSearch,
    filters,
    updateFilter,
    resetFilters,
    refetch
  };
};
