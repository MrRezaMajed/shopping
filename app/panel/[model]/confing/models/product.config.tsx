import * as Yup from "yup";
import { CRUDField } from "@/components/ui/CRUDPage/types";

// کامپوننت‌های اختصاصی محصولات
import { ProductImageCell } from "@/components/products/ProductImageCell";
import { ProductPriceCell } from "@/components/products/ProductPriceCell";
import { ProductStockCell } from "@/components/products/ProductStockCell";
import { ProductCategoryCell } from "@/components/products/ProductCategoryCell";
import { ProductBrandCell } from "@/components/products/ProductBrandCell";

// متدهای کمکی سئو و تلفظ کلاینت
import { generateSlug } from "@/lib/slug/generateSlug";
import { localSlugify } from "@/app/dashboard/products/utils/slugify";

export const productConfig = {
  modelKey: "product" as const,
  modelName: "محصول",
  enableStatusToggle: true,
  hiddenOnMobile: ["brandId", "createdAt"],
  validationSchema: Yup.object().shape({
    title: Yup.string().required("نام محصول الزامی است").min(2),
    slug: Yup.string().nullable(),
    status: Yup.string().required("انتخاب وضعیت الزامی است"),
    
    // فیلد دسته‌بندی با هندلر مقدار رشته‌ای null
    categoryId: Yup.number()
      .required("انتخاب دسته‌بندی الزامی است")
      .nullable()
      .transform((value, originalValue) => {
        if (originalValue === "" || originalValue === "null" || originalValue === undefined) {
          return null;
        }
        return Number(value);
      }),
      
    // فیلد برند با هندلر مقدار رشته‌ای null
    brandId: Yup.number()
      .nullable()
      .transform((value, originalValue) => {
        if (originalValue === "" || originalValue === "null" || originalValue === undefined) {
          return null;
        }
        return Number(value);
      }),
      
    description: Yup.string().required("توضیحات محصول الزامی است"),
    variants: Yup.array().min(1, "حداقل یک تنوع نیاز است"),
  }),
  getFields: ({ 
    flatCategories, 
    flatBrands 
  }: { 
    flatCategories: any[]; 
    flatBrands: any[];
  }): CRUDField[] => [
    {
      name: "imageUrl",
      label: "تصویر",
      cellRenderer: (item: any) => <ProductImageCell imageUrl={item.imageUrl} title={item.title} />,
    },
    { name: "title", label: "نام محصول" },
    {
      name: "price",
      label: "قیمت (تومان)",
      // دریافت کاملاً خودکار و زنده تابع onRefresh (به عنوان آرگومان دوم متد سلول رندر از کامپوننت پایه)
      cellRenderer: (item: any, onRefresh?: any) => (
        <ProductPriceCell 
          productId={item.id}
          minPrice={item.minPrice} 
          maxPrice={item.maxPrice} 
          variants={item.variants || []}
          onRefresh={onRefresh}
        />
      ),
    },
    {
      name: "stock",
      label: "موجودی انبار",
      cellRenderer: (item: any) => <ProductStockCell stock={item.stock} />,
    },
    {
      name: "categoryId",
      label: "دسته‌بندی",
      cellRenderer: (item: any) => <ProductCategoryCell categoryId={item.categoryId} flatCategories={flatCategories} />,
    },
    {
      name: "brandId",
      label: "برند",
      cellRenderer: (item: any) => <ProductBrandCell brandId={item.brandId} flatBrands={flatBrands} />,
    },
    { name: "status", label: "وضعیت" },
  ],
  formFields: [
    { name: "title", label: "نام محصول", type: "text" },
    {
      name: "slug",
      label: "نامک یکتا (سئو)",
      type: "text",
      disabled: true,
      deps: ["title"],
      trigger: "blur",
      compute: (values: any, initialValues: any) => {
        if (!values.title) return "";
        if (localSlugify(values.title) === values.slug?.split("-").slice(0, -1).join("-")) return values.slug;
        return generateSlug(values.title);
      },
    },
    {
      name: "status",
      label: "وضعیت نمایش کالا",
      type: "select",
      options: [
        { value: "ACTIVE", label: "فعال (نمایش عمومی)" },
        { value: "INACTIVE", label: "غیرفعال (پیش‌نویس)" },
      ],
    },
    { name: "brandId", label: "برند کالا", type: "select" },
    { name: "categoryId", label: "دسته‌بندی", type: "tree" },
    { name: "description", label: "توضیحات", type: "textarea" },
    { name: "images", label: "گالری تصاویر", type: "images" },
    { name: "attributes", label: "ویژگی‌های فنی", type: "attributes" },
    { name: "variants", label: "تنوع‌ها و گارانتی‌ها", type: "variants" },
  ],
  filterFields: [
    { key: "search", type: "search", placeholder: "جستجو در نام محصول..." },
    { key: "categoryId", type: "select", placeholder: "همه دسته‌بندی‌ها", options: [] },
    { key: "brandId", type: "select", placeholder: "همه برندها", options: [] },
  ],
};