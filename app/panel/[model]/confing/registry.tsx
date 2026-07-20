// @/components/ui/CRUDPage/confing/registry.ts (یا مسیر مشابه شما)

import * as Yup from "yup";
import { CRUDField } from "@/components/ui/CRUDPage/types";
import { FilterField } from "@/components/ui/GenericFilterBar/types";

// ایمپورت مدل‌های تفکیک‌شده
import { productConfig } from "./models/product.config";
import { categoryConfig } from "./models/category.config";
import { brandConfig } from "./models/brand.config";
import { bannerConfig } from "./models/banner.config";
import { postConfig } from "./models/post.config"; // اضافه شدن کانفیگ جدید پست

export interface ModelRegistryConfig {
  modelKey: "product" | "category" | "brand" | "banner" | "post"; // اضافه شدن post
  modelName: string;
  enableStatusToggle: boolean;
  hiddenOnMobile: string[];
  validationSchema: Yup.AnyObjectSchema;
  filterTranslations?: {
    keys?: Record<string, string>;
    values?: Record<string, string>;
  };
  getFields: (deps: { flatCategories: any[]; flatBrands: any[] }) => CRUDField[];
  formFields: CRUDField[];
  filterFields: FilterField[];
}

export const modelRegistry: Record<string, ModelRegistryConfig> = {
  products: productConfig,
  categories: categoryConfig,
  brands: brandConfig,
  banners: bannerConfig,
  posts: postConfig, // رجیستر شدن پست‌ها
};