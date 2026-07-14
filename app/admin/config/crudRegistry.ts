// app/config/crudRegistry.ts
import * as Yup from "yup";
import { FilterField } from "@/components/GenericFilterBar";
import type { CRUDField } from "@/components/ui/CRUDPage/types";
import { ModelKey } from "@/app/actions/crud/types";

export interface ModelConfig {
  modelName: string;
  fields: CRUDField[];
  formFields: CRUDField[];
  filterFields: FilterField[];
  validationSchema: Yup.AnyObjectSchema;
  dependsOn?: string[]; 
  enableStatusToggle?: boolean;
}

export const crudRegistry: Record<ModelKey, ModelConfig> = {
  brand: {
    modelName: "برند",
    enableStatusToggle: true,
    dependsOn: [],
    validationSchema: Yup.object().shape({
      name: Yup.string().required("وارد کردن نام برند الزامی است"),
      status: Yup.string().oneOf(["ACTIVE", "INACTIVE"]).required(),
    }),
    fields: [
      { name: "name", label: "نام برند" },
      { name: "status", label: "وضعیت" },
    ],
    formFields: [
      { name: "name", label: "نام برند تجاری", type: "text" },
      {
        name: "status",
        label: "وضعیت",
        type: "select",
        options: [
          { value: "ACTIVE", label: "فعال" },
          { value: "INACTIVE", label: "غیرفعال" },
        ],
      },
    ],
    filterFields: [
      { key: "search", label: "جستجو", type: "search", placeholder: "جستجو در نام برند..." },
    ],
  },

  category: {
    modelName: "دسته‌بندی",
    enableStatusToggle: true,
    dependsOn: ["category"],
    validationSchema: Yup.object().shape({
      name: Yup.string().required("وارد کردن نام دسته‌بندی الزامی است"),
      parentId: Yup.number().nullable(),
      status: Yup.string().oneOf(["ACTIVE", "INACTIVE"]).required(),
    }),
    fields: [
      { name: "name", label: "نام دسته‌بندی" },
      { name: "parentId", label: "دسته‌بندی والد", type: "select" },
      { name: "status", label: "وضعیت" },
    ],
    formFields: [
      { name: "name", label: "نام دسته‌بندی", type: "text" },
      { name: "parentId", label: "دسته‌بندی والد (در صورت وجود)", type: "tree" },
      {
        name: "status",
        label: "وضعیت",
        type: "select",
        options: [
          { value: "ACTIVE", label: "فعال" },
          { value: "INACTIVE", label: "غیرفعال" },
        ],
      },
    ],
    filterFields: [
      { key: "search", label: "جستجو", type: "search", placeholder: "جستجو در نام دسته‌بندی..." },
    ],
  },

  coupon: {
    modelName: "کد تخفیف",
    enableStatusToggle: true,
    dependsOn: [],
    validationSchema: Yup.object().shape({
      code: Yup.string().required("وارد کردن کد تخفیف الزامی است"),
      discountType: Yup.string().oneOf(["PERCENTAGE", "FIXED"]).required("نوع تخفیف الزامی است"),
      discountValue: Yup.number().typeError("مقدار باید عدد باشد").required("وارد کردن مقدار تخفیف الزامی است"),
      startAt: Yup.date().required("تاریخ شروع الزامی است"),
      endAt: Yup.date().required("تاریخ انقضا الزامی است"),
      status: Yup.string().oneOf(["ACTIVE", "INACTIVE"]).required(),
    }),
    fields: [
      { name: "code", label: "کد تخفیف" },
      { name: "discountType", label: "نوع تخفیف" },
      { name: "discountValue", label: "مقدار تخفیف" },
      { name: "status", label: "وضعیت" },
    ],
    formFields: [
      { name: "code", label: "کد تخفیف", type: "text" },
      {
        name: "discountType",
        label: "نوع تخفیف",
        type: "select",
        options: [
          { value: "PERCENTAGE", label: "درصدی" },
          { value: "FIXED", label: "مبلغ ثابت" },
        ],
      },
      { name: "discountValue", label: "مقدار یا درصد تخفیف", type: "number" },
      { name: "startAt", label: "تاریخ شروع", type: "date" },
      { name: "endAt", label: "تاریخ انقضا", type: "date" },
      {
        name: "status",
        label: "وضعیت نمایش",
        type: "select",
        options: [
          { value: "ACTIVE", label: "فعال" },
          { value: "INACTIVE", label: "غیرفعال" },
        ],
      },
    ],
    filterFields: [
      { key: "search", label: "جستجو", type: "search", placeholder: "جستجوی کد تخفیف..." },
    ],
  },

  post: {
    modelName: "نوشته و مقاله",
    enableStatusToggle: true,
    dependsOn: [],
    validationSchema: Yup.object().shape({
      title: Yup.string().required("وارد کردن عنوان مقاله الزامی است"),
      content: Yup.string().required("وارد کردن محتوای مقاله الزامی است"),
      status: Yup.string().oneOf(["ACTIVE", "INACTIVE"]).required(),
    }),
    fields: [
      { name: "title", label: "عنوان مقاله" },
      { name: "status", label: "وضعیت" },
    ],
    formFields: [
      { name: "title", label: "عنوان مقاله", type: "text" },
      { name: "content", label: "متن و محتوای اصلی", type: "textarea" },
      {
        name: "status",
        label: "وضعیت انتشار",
        type: "select",
        options: [
          { value: "ACTIVE", label: "منتشر شده" },
          { value: "INACTIVE", label: "پیش‌نویس" },
        ],
      },
    ],
    filterFields: [
      { key: "search", label: "جستجو", type: "search", placeholder: "جستجو در عنوان مقالات..." },
    ],
  },

  bankAccount: {
    modelName: "حساب بانکی",
    enableStatusToggle: true,
    dependsOn: [],
    validationSchema: Yup.object().shape({
      bankName: Yup.string().required("نام بانک الزامی است"),
      cardNumber: Yup.string().length(16, "شماره کارت باید ۱۶ رقم باشد").required("شماره کارت الزامی است"),
      ownerName: Yup.string().required("نام صاحب حساب الزامی است"),
      status: Yup.string().oneOf(["ACTIVE", "INACTIVE"]).required(),
    }),
    fields: [
      { name: "bankName", label: "نام بانک" },
      { name: "cardNumber", label: "شماره کارت" },
      { name: "ownerName", label: "صاحب حساب" },
      { name: "status", label: "وضعیت" },
    ],
    formFields: [
      { name: "bankName", label: "نام بانک", type: "text" },
      { name: "cardNumber", label: "شماره کارت ۱۶ رقمی", type: "text" },
      { name: "ownerName", label: "نام و نام خانوادگی صاحب حساب", type: "text" },
      {
        name: "status",
        label: "وضعیت فعال بودن",
        type: "select",
        options: [
          { value: "ACTIVE", label: "فعال جهت دریافت وجه" },
          { value: "INACTIVE", label: "غیرفعال" },
        ],
      },
    ],
    filterFields: [
      { key: "search", label: "جستجو", type: "search", placeholder: "جستجو در نام صاحب حساب..." },
    ],
  },

  shippingMethod: {
    modelName: "روش ارسال کالا",
    enableStatusToggle: true,
    dependsOn: [],
    validationSchema: Yup.object().shape({
      name: Yup.string().required("نام روش ارسال الزامی است"),
      cost: Yup.number().typeError("هزینه باید عدد باشد").required("هزینه ارسال الزامی است"),
      status: Yup.string().oneOf(["ACTIVE", "INACTIVE"]).required(),
    }),
    fields: [
      { name: "name", label: "نام روش" },
      { name: "cost", label: "هزینه ارسال" },
      { name: "status", label: "وضعیت" },
    ],
    formFields: [
      { name: "name", label: "نام روش ارسال", type: "text" },
      { name: "cost", label: "هزینه ارسال (تومان)", type: "number" },
      { name: "estimatedTime", label: "زمان تقریبی تحویل (مثال: ۲ تا ۴ روز)", type: "text" },
      {
        name: "status",
        label: "وضعیت روش ارسال",
        type: "select",
        options: [
          { value: "ACTIVE", label: "فعال" },
          { value: "INACTIVE", label: "غیرفعال" },
        ],
      },
    ],
    filterFields: [
      { key: "search", label: "جستجو", type: "search", placeholder: "جستجوی روش ارسال..." },
    ],
  },

  banner: {
    modelName: "بنر تبلیغاتی",
    enableStatusToggle: true,
    dependsOn: [],
    validationSchema: Yup.object().shape({
      title: Yup.string().required("وارد کردن عنوان بنر الزامی است"),
      image: Yup.string().required("آپلود تصویر بنر الزامی است"),
      position: Yup.string().oneOf(["RIGHT", "TOP", "DOWN"]).required("انتخاب موقعیت الزامی است"),
      status: Yup.string().oneOf(["ACTIVE", "INACTIVE"]).required(),
    }),
    fields: [
      { name: "title", label: "عنوان بنر" },
      { name: "image", label: "تصویر بنر", type: "file" },
      { name: "position", label: "موقعیت نمایش" },
      { name: "status", label: "وضعیت" },
    ],
    formFields: [
      { name: "title", label: "عنوان یا نام بنر", type: "text" },
      { name: "image", label: "تصویر بنر", type: "file" },
      { name: "url", label: "لینک هدایت بنر (URL)", type: "text" },
      {
        name: "position",
        label: "موقعیت بنر",
        type: "select",
        options: [
          { value: "RIGHT", label: "سمت راست" },
          { value: "TOP", label: "بالای صفحه" },
          { value: "DOWN", label: "پایین صفحه" },
        ],
      },
      {
        name: "status",
        label: "وضعیت نمایش بنر",
        type: "select",
        options: [
          { value: "ACTIVE", label: "فعال" },
          { value: "INACTIVE", label: "غیرفعال" },
        ],
      },
    ],
    filterFields: [
      { key: "search", label: "جستجو", type: "search", placeholder: "جستجو در عنوان بنر..." },
    ],
  },

  product: {
    modelName: "محصول کالا",
    enableStatusToggle: true,
    dependsOn: ["brand", "category"],
    validationSchema: Yup.object().shape({
      title: Yup.string().required("عنوان محصول الزامی است"),
      description: Yup.string().required("توضیحات محصول الزامی است"),
      categoryId: Yup.number().required("انتخاب دسته‌بندی الزامی است"),
      brandId: Yup.number().nullable(),
      status: Yup.string().oneOf(["ACTIVE", "INACTIVE"]).required(),
    }),
    fields: [
      { name: "title", label: "نام محصول" },
      { name: "categoryId", label: "دسته‌بندی", type: "select" },
      { name: "status", label: "وضعیت" },
    ],
    formFields: [
      { name: "title", label: "نام اصلی محصول", type: "text" },
      { name: "slug", label: "آدرس یونیک (Slug) - اختیاری", type: "text" },
      { name: "description", label: "توضیحات کامل محصول", type: "textarea" },
      { name: "categoryId", label: "انتخاب دسته‌بندی والد", type: "tree" },
      { name: "brandId", label: "انتخاب برند تجاری", type: "select" },
      { name: "images", label: "گالری تصاویر", type: "images" },
      { name: "attributes", label: "ویژگی‌های فنی کالا", type: "attributes" },
      { name: "variants", label: "تنوع‌ها و قیمت‌گذاری", type: "variants" },
      {
        name: "status",
        label: "وضعیت فعال بودن محصول",
        type: "select",
        options: [
          { value: "ACTIVE", label: "فعال و قابل خرید" },
          { value: "INACTIVE", label: "غیرفعال" },
        ],
      },
    ],
    filterFields: [
      { key: "search", label: "جستجو", type: "search", placeholder: "جستجو در نام محصولات..." },
    ],
  },
};