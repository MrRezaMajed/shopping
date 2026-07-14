// config/modelConfigs.ts
import * as Yup from "yup";
import { CRUDField } from "@/components/ui/CRUDPage/types";
import { FilterField } from "@/components/GenericFilterBar";

// ============================================================
//  تابع کمکی برای تولید Validation Schema بر اساس فیلدهای فرم
// ============================================================
export function generateValidationSchema(fields: CRUDField[]): Yup.ObjectSchema<any> {
  const shape: Record<string, Yup.AnySchema> = {};
  fields.forEach((field) => {
    let schema: Yup.AnySchema;
    switch (field.type) {
      case "number":
        schema = Yup.number();
        break;
      case "checkbox":
        schema = Yup.boolean();
        break;
      case "date":
        schema = Yup.date();
        break;
      default:
        schema = Yup.string();
    }
    // اگر فیلد required باشد، schema را required می‌کنیم
    // (می‌توانید پراپ required را به CRUDField اضافه کنید)
    if (field.required) {
      schema = schema.required(`${field.label} الزامی است`);
    }
    shape[field.name] = schema;
  });
  return Yup.object().shape(shape);
}

// ============================================================
//  کانفیگ مدل‌ها
// ============================================================
export interface ModelConfig {
  model: "banner" | "brand" | "category" | "product" | "coupon" | "post" | "bankAccount" | "shippingMethod";
  modelName: string;
  fields: CRUDField[];
  formFields: CRUDField[];
  filterFields: FilterField[];
  validationSchema: Yup.ObjectSchema<any>;
  enableStatusToggle?: boolean;
  hiddenOnMobile?: string[];
  filterTranslations?: {
    keys?: Record<string, string>;
    values?: Record<string, string>;
  };
}

// کانفیگ مدل بنر
const bannerConfig: ModelConfig = {
  model: "banner",
  modelName: "بنر",
  fields: [
    { name: "id", label: "شناسه" },
    { name: "title", label: "عنوان" },
    { name: "image", label: "تصویر", type: "file" },
    { name: "url", label: "لینک" },
    { name: "position", label: "موقعیت" },
    { name: "status", label: "وضعیت" },
  ],
  formFields: [
    { name: "title", label: "عنوان", type: "text", required: true },
    { name: "image", label: "تصویر", type: "file", required: true },
    { name: "url", label: "لینک", type: "text", required: true },
    {
      name: "position",
      label: "موقعیت",
      type: "select",
      options: [
        { value: "TOP", label: "بالا" },
        { value: "DOWN", label: "پایین" },
        { value: "RIGHT", label: "راست" },
      ],
      required: true,
    },
  ],
  filterFields: [
    { key: "search", label: "جستجو", type: "text", placeholder: "جستجوی عنوان..." },
    {
      key: "position",
      label: "موقعیت",
      type: "select",
      options: [
        { value: "", label: "همه" },
        { value: "TOP", label: "بالا" },
        { value: "DOWN", label: "پایین" },
        { value: "RIGHT", label: "راست" },
      ],
    },
    {
      key: "status",
      label: "وضعیت",
      type: "select",
      options: [
        { value: "", label: "همه" },
        { value: "ACTIVE", label: "فعال" },
        { value: "INACTIVE", label: "غیرفعال" },
      ],
    },
  ],
  validationSchema: Yup.object({
    title: Yup.string().required("عنوان الزامی است"),
    image: Yup.string().required("تصویر الزامی است"),
    url: Yup.string().url("لینک معتبر نیست").required("لینک الزامی است"),
    position: Yup.string().required("موقعیت الزامی است"),
  }),
  enableStatusToggle: true,
  filterTranslations: {
    keys: { status: "وضعیت", position: "موقعیت" },
    values: { ACTIVE: "فعال", INACTIVE: "غیرفعال", TOP: "بالا", DOWN: "پایین", RIGHT: "راست" },
  },
};

// کانفیگ مدل برند
const brandConfig: ModelConfig = {
  model: "brand",
  modelName: "برند",
  fields: [
    { name: "id", label: "شناسه" },
    { name: "name", label: "نام برند" },
    { name: "slug", label: "اسلاگ" },
    { name: "status", label: "وضعیت" },
  ],
  formFields: [
    { name: "name", label: "نام برند", type: "text", required: true },
  ],
  filterFields: [
    { key: "search", label: "جستجو", type: "text", placeholder: "جستجوی نام برند..." },
    {
      key: "status",
      label: "وضعیت",
      type: "select",
      options: [
        { value: "", label: "همه" },
        { value: "ACTIVE", label: "فعال" },
        { value: "INACTIVE", label: "غیرفعال" },
      ],
    },
  ],
  validationSchema: Yup.object({
    name: Yup.string().required("نام برند الزامی است"),
  }),
  enableStatusToggle: true,
  filterTranslations: {
    keys: { status: "وضعیت" },
    values: { ACTIVE: "فعال", INACTIVE: "غیرفعال" },
  },
};

// کانفیگ مدل دسته‌بندی
const categoryConfig: ModelConfig = {
  model: "category",
  modelName: "دسته‌بندی",
  fields: [
    { name: "id", label: "شناسه" },
    { name: "name", label: "نام دسته" },
    { name: "slug", label: "اسلاگ" },
    { name: "parentId", label: "والد" },
    { name: "status", label: "وضعیت" },
  ],
  formFields: [
    { name: "name", label: "نام دسته", type: "text", required: true },
    {
      name: "parentId",
      label: "والد",
      type: "tree",
      options: [], // در زمان اجرا پر می‌شود
    },
  ],
  filterFields: [
    { key: "search", label: "جستجو", type: "text", placeholder: "جستجوی نام دسته..." },
    {
      key: "status",
      label: "وضعیت",
      type: "select",
      options: [
        { value: "", label: "همه" },
        { value: "ACTIVE", label: "فعال" },
        { value: "INACTIVE", label: "غیرفعال" },
      ],
    },
  ],
  validationSchema: Yup.object({
    name: Yup.string().required("نام دسته الزامی است"),
    parentId: Yup.number().nullable(),
  }),
  enableStatusToggle: true,
  filterTranslations: {
    keys: { status: "وضعیت", parentId: "والد" },
    values: { ACTIVE: "فعال", INACTIVE: "غیرفعال" },
  },
};

// کانفیگ مدل محصول
const productConfig: ModelConfig = {
  model: "product",
  modelName: "محصول",
  fields: [
    { name: "id", label: "شناسه" },
    { name: "title", label: "عنوان" },
    { name: "categoryId", label: "دسته" },
    { name: "brandId", label: "برند" },
    { name: "price", label: "قیمت" },
    { name: "stock", label: "موجودی" },
    { name: "status", label: "وضعیت" },
  ],
  formFields: [
    { name: "title", label: "عنوان", type: "text", required: true },
    { name: "description", label: "توضیحات", type: "textarea" },
    {
      name: "categoryId",
      label: "دسته‌بندی",
      type: "select",
      options: [], // در زمان اجرا پر می‌شود
      required: true,
    },
    {
      name: "brandId",
      label: "برند",
      type: "select",
      options: [], // در زمان اجرا پر می‌شود
    },
    // سایر فیلدهای مرتبط با محصول (variants, images, attributes) را می‌توانید اضافه کنید
  ],
  filterFields: [
    { key: "search", label: "جستجو", type: "text", placeholder: "جستجوی عنوان محصول..." },
    {
      key: "categoryId",
      label: "دسته‌بندی",
      type: "select",
      options: [], // در زمان اجرا پر می‌شود
    },
    {
      key: "brandId",
      label: "برند",
      type: "select",
      options: [], // در زمان اجرا پر می‌شود
    },
    {
      key: "status",
      label: "وضعیت",
      type: "select",
      options: [
        { value: "", label: "همه" },
        { value: "ACTIVE", label: "فعال" },
        { value: "INACTIVE", label: "غیرفعال" },
      ],
    },
  ],
  validationSchema: Yup.object({
    title: Yup.string().required("عنوان الزامی است"),
    categoryId: Yup.number().required("دسته‌بندی الزامی است"),
    brandId: Yup.number().nullable(),
  }),
  enableStatusToggle: true,
  hiddenOnMobile: ["brandId", "stock"],
  filterTranslations: {
    keys: { status: "وضعیت", categoryId: "دسته‌بندی", brandId: "برند" },
    values: { ACTIVE: "فعال", INACTIVE: "غیرفعال" },
  },
};

// نگاشت نام مدل به کانفیگ
const configMap: Record<string, ModelConfig> = {
  banner: bannerConfig,
  brand: brandConfig,
  category: categoryConfig,
  product: productConfig,
  // در صورت نیاز مدل‌های دیگر را اضافه کنید
};

// تابع دریافت کانفیگ بر اساس نام مدل
export function getModelConfig(model: string): ModelConfig {
  const config = configMap[model];
  if (!config) {
    throw new Error(`مدل "${model}" پشتیبانی نمی‌شود`);
  }
  return config;
}

// تابع دریافت لیست مدل‌های پشتیبانی شده (برای ناوبری)
export function getSupportedModels() {
  return Object.keys(configMap);
}