import { useState, useEffect, useMemo, useCallback } from "react";
import { getCategories, getBrands } from "@/app/actions/crud/crudActions";

export function useDynamicOptions(modelKey: string) {
  const [flatCategories, setFlatCategories] = useState<any[]>([]);
  const [flatBrands, setFlatBrands] = useState<any[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(false);

  const loadDependencies = useCallback(async () => {
    // هوشمندی در واکشی: فقط در صورت نیاز اطلاعات دریافت می‌شوند
    const needsCategories = ["product", "category"].includes(modelKey);
    const needsBrands = ["product", "brand"].includes(modelKey);

    if (!needsCategories && !needsBrands) return;

    try {
      setLoadingOptions(true);
      const promises: Promise<any>[] = [];
      
      if (needsCategories) promises.push(getCategories());
      else promises.push(Promise.resolve([]));

      if (needsBrands) promises.push(getBrands());
      else promises.push(Promise.resolve([]));

      const [categoriesData, brandsData] = await Promise.all(promises);
      
      setFlatCategories(categoriesData || []);
      setFlatBrands(brandsData || []);
    } catch (error) {
      console.error("خطا در همگام‌سازی داده‌های کمکی مدل:", error);
    } finally {
      setLoadingOptions(false);
    }
  }, [modelKey]);

  useEffect(() => {
    loadDependencies();
  }, [loadDependencies]);

  const dynamicOptions = useMemo(() => {
    const formattedCategories = flatCategories.map((cat) => ({
      value: String(cat.id),
      label: cat.name,
      parentId: cat.parentId ? String(cat.parentId) : null,
    }));

    return {
      // استفاده مشترک برای فیلد والد در دسته‌بندی و فیلد دسته‌بندی در محصول
      parentId: formattedCategories,
      categoryId: formattedCategories,
      brandId: [
        { value: "null", label: "بدون برند (متفرقه)" },
        ...flatBrands.map((brand) => ({
          value: String(brand.id),
          label: brand.name,
        })),
      ],
    };
  }, [flatCategories, flatBrands]);

  return {
    flatCategories,
    flatBrands,
    loadingOptions,
    dynamicOptions,
  };
}