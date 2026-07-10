// app/dashboard/categories/hooks/useCategoryOptions.ts
import { useState, useEffect, useMemo, useCallback } from "react";
import { getCategories } from "@/app/actions/crud/crudActions";

export function useCategoryOptions() {
  const [flatCategories, setFlatCategories] = useState<any[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  const loadCategoryOptions = useCallback(async () => {
    try {
      setLoadingOptions(true);
      const data = await getCategories();
      setFlatCategories(data);
    } catch (error) {
      console.error("خطا در بارگذاری گزینه‌های دسته‌بندی:", error);
    } finally {
      setLoadingOptions(false);
    }
  }, []);

  useEffect(() => {
    loadCategoryOptions();
  }, [loadCategoryOptions]);

  const dynamicOptions = useMemo(() => {
    return {
      parentId: flatCategories.map((cat) => ({
        value: String(cat.id),
        label: cat.name,
        parentId: cat.parentId ? String(cat.parentId) : null,
      })),
    };
  }, [flatCategories]);

  return {
    dynamicOptions,
    loadingOptions,
    refetch: loadCategoryOptions,
  };
}