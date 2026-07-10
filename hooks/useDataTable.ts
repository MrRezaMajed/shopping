"use client";
import { useState, useEffect, useCallback } from "react";

export function useDataTable<T, F extends Record<string, any>>(
  fetcher: (page: number, limit: number, filters: F) => Promise<{ data: T[]; total: number }>,
  initialFilters: F,
  initialLimit = 5
) {
  const [data, setData] = useState<T[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(initialLimit);
  const [filters, setFilters] = useState<F>(initialFilters);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetcher(page, limit, filters);

      setData(res.data);
      setTotal(res.total);

      // 🧠 اگر صفحه خالی شد ولی کل دیتا هنوز وجود دارد → برو صفحه قبل
      const totalPages = Math.max(1, Math.ceil(res.total / limit));
      if (page > totalPages) {
        setPage(totalPages);
      }
    } finally {
      setLoading(false);
    }
  }, [page, limit, filters, fetcher]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const updateFilters = (newFilters: F) => {
    setFilters(newFilters);
    setPage(1);
  };

  return {
    data,
    total,
    page,
    limit,
    filters,
    loading,
    setPage,
    setLimit,
    setFilters: updateFilters,
    refetch: fetchData, // ✅ برای استفاده بعد از delete / toggle
  };
}
