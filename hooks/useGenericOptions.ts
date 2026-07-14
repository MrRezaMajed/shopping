import { useState, useEffect } from "react";
import { getCategories, getBrands } from "@/app/actions/crud/crudActions";

export function useGenericOptions(dependsOn: string[] = []) {
  const [dynamicOptions, setDynamicOptions] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(dependsOn.length > 0);

  useEffect(() => {
    if (!dependsOn || dependsOn.length === 0) {
      setLoading(false);
      return;
    }

    async function load() {
      try {
        setLoading(true);

        const promises: Promise<any>[] = [];
        const keys: string[] = [];

        if (dependsOn.includes("category")) {
          promises.push(getCategories());
          keys.push("categoryId");
        }
        if (dependsOn.includes("brand")) {
          promises.push(getBrands());
          keys.push("brandId");
        }

        const results = await Promise.all(promises);
        const formatted: Record<string, any> = {};

        keys.forEach((key, index) => {
          const rawData = results[index] || [];
          if (key === "categoryId") {
            // ساختار درختی برای فیلدهای tree دسته‌بندی
            formatted.parentId = rawData.map((cat: any) => ({
              value: String(cat.id),
              label: cat.name,
              parentId: cat.parentId ? String(cat.parentId) : null,
            }));
            // همچنین برای فیلدهای معمولی سلکتور دسته‌بندی
            formatted.categoryId = formatted.parentId;
          } else if (key === "brandId") {
            formatted.brandId = [
              { value: "null", label: "بدون برند" },
              ...rawData.map((b: any) => ({ value: String(b.id), label: b.name })),
            ];
          }
        });

        setDynamicOptions(formatted);
      } catch (error) {
        console.error("خطا در همگام‌سازی گزینه‌های فرم جنریک:", error);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [JSON.stringify(dependsOn)]);

  return { dynamicOptions, loading };
}