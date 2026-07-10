// هوک دریافت همزمان گزینه‌های دسته‌بندی و برندها (Custom Hook)

import { useState, useEffect, useCallback, useMemo } from "react";
import { getCategories, getBrands } from "@/app/actions/crud/crudActions";

export function useProductOptions() {
  const [flatCategories, setFlatCategories] = useState<any[]>([]);
  const [flatBrands, setFlatBrands] = useState<any[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  const loadBaseOptions = useCallback(async () => {
    try {
      setLoadingOptions(true);
      const [categoriesData, brandsData] = await Promise.all([
        getCategories(),
        getBrands(),
      ]);
      setFlatCategories(categoriesData);
      setFlatBrands(brandsData);
    } catch (error) {
      console.error("خطا در دریافت گزینه‌های کمکی محصول:", error);
    } finally {
      setLoadingOptions(false);
    }
  }, []);

  useEffect(() => {
    loadBaseOptions();
  }, [loadBaseOptions]);

  const dynamicOptions = useMemo(() => {
    return {
      categoryId: flatCategories.map((cat) => ({
        value: String(cat.id),
        label: cat.name,
        parentId: cat.parentId ? String(cat.parentId) : null,
      })),
      brandId: [
        { value: "null", label: "بدون برند (مانند کتاب و محصولات متفرقه)" },
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