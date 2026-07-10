// app/dashboard/categories/constants/validation.ts
import * as Yup from "yup";

export const categoryValidationSchema = Yup.object().shape({
  name: Yup.string()
    .required("وارد کردن نام دسته‌بندی الزامی است")
    .min(2, "نام دسته‌بندی باید حداقل ۲ کاراکتر باشد"),
  slug: Yup.string().required("نامک (Slug) الزامی است"),
  status: Yup.string()
    .oneOf(["ACTIVE", "INACTIVE"], "وضعیت نامعتبر است")
    .required("انتخاب وضعیت الزامی است"),
  parentId: Yup.number()
    .nullable()
    .transform((value, originalValue) => {
      if (originalValue === "" || originalValue === "null" || originalValue === undefined) {
        return null;
      }
      return Number(value);
    }),
});