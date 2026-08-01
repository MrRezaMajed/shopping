import * as Yup from "yup";
import { CRUDField } from "@/components/ui/CRUDPage/types";
import { FilterField } from "@/components/ui/GenericFilterBar/types";

// ایمپورت مدل‌های تفکیک‌شده
import { productConfig } from "./models/product.config";
import { categoryConfig } from "./models/category.config";
import { brandConfig } from "./models/brand.config";
import { bannerConfig } from "./models/banner.config";
import { postConfig } from "./models/post.config";
import { userConfig } from "./models/user.config";
import { postCategoryConfig } from "./models/postCategory.config";
import { postCommentConfig } from "./models/postComment.config";
import { productFAQConfig } from "./models/productFAQ.config";
import { pageConfig } from "./models/page.config";

export interface ModelRegistryConfig {
  // 👈 اضافه شدن "navigationMenu" به کلیدهای معتبر مدل
  modelKey: "product" | "category" | "brand" | "banner" | "post" | "user" | "postCategory" | "page"; 
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

  disableCreate?: boolean;
  disableEdit?: boolean;
  
  // 👈 فیلد جدید جهت کنترل الگوهای تک‌رکوردی (مانند تنظیمات یا منو)
  isSingleton?: boolean; 
}

export const modelRegistry: Record<string, ModelRegistryConfig> = {
  products: productConfig,
  categories: categoryConfig,
  brands: brandConfig,
  banners: bannerConfig,
  posts: postConfig,
  users: userConfig,
  postCategories: postCategoryConfig,
  postComments: postCommentConfig,
  productFAQs: productFAQConfig,
  pages: pageConfig, // 👈 ۳. کلید جدول صفحات
  page: pageConfig,  // 👈 جهت پشتیبانی مفرد
};