// شِمای اعتبارسنجی تودرتوی فیلدها (Yup Validation Schema)

import * as Yup from "yup";

export const productValidationSchema = Yup.object().shape({
  title: Yup.string()
    .required("وارد کردن نام محصول الزامی است")
    .min(2, "نام محصول باید حداقل ۲ کاراکتر باشد"),
  slug: Yup.string()
    .nullable()
    .transform((curr, orig) => (orig === "" ? null : curr)),
  status: Yup.string()
    .oneOf(["ACTIVE", "INACTIVE"], "وضعیت نامعتبر است")
    .required("انتخاب وضعیت الزامی است"),
  categoryId: Yup.number()
    .required("انتخاب دسته‌بندی الزامی است")
    .nullable()
    .transform((value, originalValue) => {
      if (originalValue === "" || originalValue === "null" || originalValue === undefined) {
        return null;
      }
      return Number(value);
    }),
  brandId: Yup.number()
    .nullable()
    .transform((value, originalValue) => {
      if (originalValue === "" || originalValue === "null" || originalValue === undefined) {
        return null;
      }
      return Number(value);
    }),
  description: Yup.string()
    .required("وارد کردن توضیحات و مشخصات فنی محصول الزامی است"),
  
  images: Yup.array().of(
    Yup.object().shape({
      url: Yup.string().nullable(),
      isMain: Yup.boolean().nullable(),
      file: Yup.mixed().nullable(),
    })
  ).nullable(),

  attributes: Yup.array().of(
    Yup.object().shape({
      key: Yup.string().required("عنوان ویژگی الزامی است"),
      value: Yup.string().required("مقدار ویژگی الزامی است"),
    })
  ).nullable(),

  variants: Yup.array().of(
    Yup.object().shape({
      color: Yup.string().nullable(),
      price: Yup.string().required("قیمت واریانت الزامی است"),
      stock: Yup.string().required("موجودی واریانت الزامی است"),
      warranty: Yup.object().shape({
        title: Yup.string().nullable(),
        periodMonths: Yup.number().nullable(),
        description: Yup.string().nullable(),
      }).nullable(),
    })
  ).min(1, "حداقل وارد کردن یک تنوع برای محصول الزامی است"),
});