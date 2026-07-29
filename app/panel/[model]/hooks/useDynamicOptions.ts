// @/hooks/useDynamicOptions.ts

import { useState, useEffect, useMemo, useCallback } from "react";
// ایمپورت کردن متد جدید getProducts
import { getCategories, getBrands, getPostCategories, getProducts } from "@/app/actions/crud/crudActions";

export function useDynamicOptions(modelKey: string) {
  const [flatCategories, setFlatCategories] = useState<any[]>([]);
  const [flatPostCategories, setFlatPostCategories] = useState<any[]>([]);
  const [flatBrands, setFlatBrands] = useState<any[]>([]);
  const [flatProducts, setFlatProducts] = useState<any[]>([]); // استیت ذخیره محصولات فعال
  const [loadingOptions, setLoadingOptions] = useState(false);

  const loadDependencies = useCallback(async () => {
    const needsCategories = ["product", "category"].includes(modelKey);
    const needsPostCategories = ["post", "postCategory"].includes(modelKey);
    const needsBrands = ["product", "brand"].includes(modelKey);
    const needsProducts = ["productFAQ"].includes(modelKey); // شرط لود کالاها برای مدل سوالات متداول

    if (!needsCategories && !needsBrands && !needsPostCategories && !needsProducts) return;

    try {
      setLoadingOptions(true);
      const promises: Promise<any>[] = [];
      
      if (needsCategories) promises.push(getCategories());
      else promises.push(Promise.resolve([]));

      if (needsBrands) promises.push(getBrands());
      else promises.push(Promise.resolve([]));

      if (needsPostCategories) promises.push(getPostCategories());
      else promises.push(Promise.resolve([]));

      if (needsProducts) promises.push(getProducts()); // اضافه کردن پرومیس لود کالاها
      else promises.push(Promise.resolve([]));

      const [categoriesData, brandsData, postCategoriesData, productsData] = await Promise.all(promises);
      
      setFlatCategories(categoriesData || []);
      setFlatBrands(brandsData || []);
      setFlatPostCategories(postCategoriesData || []);
      setFlatProducts(productsData || []); // ذخیره‌سازی داده‌های محصولات لود شده
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

    const formattedPostCategories = flatPostCategories.map((cat) => ({
      value: String(cat.id),
      label: cat.name,
      parentId: cat.parentId ? String(cat.parentId) : null,
    }));

    return {
      // سوئیچ هوشمند گزینه‌ها بین دسته‌بندی محصولات و دسته‌بندی وبلاگ به همراه گزینه پیش‌فرض اصلی (بدون والد)
      parentId: modelKey === "postCategory" 
        ? [  ...formattedPostCategories ] 
        : [ ...formattedCategories ],

        categoryId: modelKey === "post" 
          ? [ ...formattedPostCategories ]
          : [ ...formattedCategories ],
      brandId: [
        { value: "null", label: "بدون برند (متفرقه)" },
        ...flatBrands.map((brand) => ({
          value: String(brand.id),
          label: brand.name,
        })),
      ],
      // 👈 فرمت‌دهی خودکار فیلد انتخابی محصولات به همراه گزینه پیش‌فرض «سوال عمومی کل سایت»
      productId: [
        { value: "null", label: "بدون محصول (سوال عمومی کل سایت)" },
        ...flatProducts.map((product) => ({
          value: String(product.id),
          label: product.title,
        })),
      ],
    };
  }, [flatCategories, flatBrands, flatPostCategories, flatProducts, modelKey]); // اضافه شدن flatProducts به آرایه وابستگی‌ها

  return {
    flatCategories,
    flatBrands,
    flatProducts, // خروجی لیست کالاها در صورت نیاز
    loadingOptions,
    dynamicOptions,
  };
}