// هوک سفارشی مدیریت وضعیت‌های CRUD (Custom Hook)

import { useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams } from "next/navigation";

import { getItems } from "@/app/actions/crud/crudActions";
// ۱. ایمپورت سیستم نوتیفیکیشن اختصاصی
import { useNotification } from "@/context/NotificationContext";

export function useCRUD(model: string, modelName: string) {
  const searchParams = useSearchParams();
  
  // ۲. دریافت متد ارسال پیام از کانتکست
  const { addNotification } = useNotification();
  
  const initialFilters = useMemo(() => {
    const params: Record<string, any> = {};
    if (searchParams) {
      searchParams.forEach((value, key) => {
        params[key] = value;
      });
    }
    return params;
  }, [searchParams]);

  const [data, setData] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [filters, setFilters] = useState<Record<string, any>>(initialFilters);
  const [showTrash, setShowTrash] = useState(false);

  const refreshList = useCallback(async () => {
    setLoading(true);
    const res = await getItems(model, page, limit, { ...filters, deleted: showTrash });
    
    if (!res.success) {
      // ۳. جایگزینی toast قدیمی با سیستم نوتیفیکیشن جدید
      addNotification({
        type: "error",
        title: "خطا در دریافت اطلاعات",
        message: res.error || `خطا در واکشی اطلاعات ${modelName} رخ داد.`,
        duration: 3000,
      });
    } else {
      setData(res.data);
      setTotal(res.total);
    }
    setLoading(false);
  }, [model, page, limit, filters, showTrash, modelName, addNotification]); // اضافه شدن addNotification به آرایه وابستگی‌ها

  useEffect(() => {
    refreshList();
  }, [refreshList]);

  useEffect(() => {
    const mergedParams: Record<string, any> = { ...initialFilters };

    if (typeof window !== "undefined") {
      const pendingKey = `crud_pending_filters_${model}`;
      const storedJson = sessionStorage.getItem(pendingKey);
      
      if (storedJson) {
        try {
          const parsedFilters = JSON.parse(storedJson);
          if (parsedFilters && typeof parsedFilters === "object") {
            Object.assign(mergedParams, parsedFilters);
          }
        } catch (e) {
          console.error("Failed to parse generic pending filters", e);
        } finally {
          sessionStorage.removeItem(pendingKey);
        }
      }
    }

    setFilters(mergedParams);
  }, [model, initialFilters]);

  useEffect(() => {
    setPage(1);
  }, [showTrash, filters, setPage]);

  const deleteItemLocal = (id: number) => {
    setData(prev => prev.filter(item => item.id !== id));
    setTotal(prev => prev - 1);
  };

  return {
    data,
    setData,
    total,
    loading,
    page,
    limit,
    filters,
    showTrash,
    setPage,
    setLimit,
    setFilters,
    setShowTrash,
    refreshList,
    deleteItemLocal,
  };
}