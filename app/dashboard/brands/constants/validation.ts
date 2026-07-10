// app/dashboard/brands/constants/validation.ts
import * as Yup from "yup";

export const brandValidationSchema = Yup.object().shape({
  name: Yup.string().required("نام برند الزامی است"),
  slug: Yup.string().required("نامک (Slug) الزامی است"),
  status: Yup.string()
    .oneOf(["ACTIVE", "INACTIVE"], "وضعیت نامعتبر است")
    .required("انتخاب وضعیت الزامی است"),
});