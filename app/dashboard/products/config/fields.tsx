// فایل پیکربندی فیلدها و کانتکست‌های فرم

import React from "react";
import { FilterField } from "@/components/ui/GenericFilterBar/types";
import type { CRUDField } from "@/components/ui/CRUDPage/types";
import { generateSlug } from "@/lib/slug/generateSlug";
import { EnrichedProduct } from "../types";
import { localSlugify } from "../utils/slugify";
import { ProductImageCell } from "../components/ProductImageCell";
import { ProductPriceCell } from "../components/ProductPriceCell";
import { ProductStockCell } from "../components/ProductStockCell";
import { ProductCategoryCell } from "../components/ProductCategoryCell";
import { ProductBrandCell } from "../components/ProductBrandCell";

export const getTableFields = (
  flatCategories: any[],
  flatBrands: any[]
): CRUDField<EnrichedProduct>[] => [
  {
    name: "imageUrl",
    label: "تصویر",
    cellRenderer: (item) => (
      <ProductImageCell imageUrl={item.imageUrl} title={item.title} />
    ),
  },
  {
    name: "title",
    label: "نام محصول",
  },
  {
    name: "price",
    label: "قیمت پایه (تومان)",
    cellRenderer: (item) => (
      <ProductPriceCell minPrice={item.minPrice} maxPrice={item.maxPrice} />
    ),
  },
  {
    name: "stock",
    label: "مجموع موجودی انبار",
    cellRenderer: (item) => <ProductStockCell stock={item.stock} />,
  },
  {
    name: "categoryId",
    label: "دسته‌بندی",
    cellRenderer: (item) => (
      <ProductCategoryCell
        categoryId={item.categoryId}
        flatCategories={flatCategories}
      />
    ),
  },
  {
    name: "brandId",
    label: "برند",
    cellRenderer: (item) => (
      <ProductBrandCell brandId={item.brandId} flatBrands={flatBrands} />
    ),
  },
  {
    name: "status",
    label: "وضعیت",
  },
];

export const formFields: CRUDField<EnrichedProduct>[] = [
  {
    name: "title",
    label: "نام محصول (مثال: گوشی موبایل اپل مدل iPhone 15 Pro Max)",
    type: "text",
  },
  {
    name: "slug",
    label: "نامک یکتای کالا (غیرقابل ویرایش - بر اساس الگوی آدرس‌دهی سئو تولید می‌شود)",
    type: "text",
    disabled: true,
    deps: ["title"],
    trigger: "blur",
    compute: (values, initialValues) => {
      if (!values.title) return "";

      const baseSlugCheck = localSlugify(values.title);

      const slugParts = values.slug ? values.slug.split("-") : [];
      slugParts.pop();
      const existingBaseSlug = slugParts.join("-");

      if (existingBaseSlug === baseSlugCheck) {
        return values.slug;
      }

      return generateSlug(values.title);
    },
  },
  {
    name: "status",
    label: "وضعیت نمایش کالا در وب‌سایت",
    type: "select",
    options: [
      { value: "ACTIVE", label: "فعال (نمایش عمومی)" },
      { value: "INACTIVE", label: "غیرفعال (پیش‌نویس)" },
    ],
  },
  {
    name: "brandId",
    label: "انتخاب برند تجاری کالا",
    type: "select",
  },
  {
    name: "categoryId",
    label: "انتخاب دسته‌بندی سطح کالا",
    type: "tree",
  },
  {
    name: "description",
    label: "توضیحات کلی، مزایا و نقد و بررسی محصول",
    type: "textarea",
  },
  {
    name: "images",
    label: "گالری تصاویر کالا",
    type: "images",
  },
  {
    name: "attributes",
    label: "مشخصات فنی کالا",
    type: "attributes",
  },
  {
    name: "variants",
    label: "تنوع‌ها و گارانتی‌ها",
    type: "variants",
  },
];

export const filterFields: FilterField[] = [
  {
    key: "search",
    label: "جستجو",
    type: "search",
    placeholder: "جستجو در نام محصول...",
  },
  {
    key: "categoryId",
    label: "دسته‌بندی",
    type: "select",
    placeholder: "همه دسته‌بندی‌ها",
  },
  {
    key: "brandId",
    label: "برند",
    type: "select",
    placeholder: "همه برندها",
  },
];