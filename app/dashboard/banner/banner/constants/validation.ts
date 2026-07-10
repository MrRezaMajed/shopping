// app/dashboard/banners/constants/validation.ts
import * as Yup from "yup";

export const bannerValidationSchema = Yup.object().shape({
  title: Yup.string()
    .required("وارد کردن عنوان بنر الزامی است")
    .min(2, "عنوان بنر باید حداقل ۲ کاراکتر باشد"),
  image: Yup.string().required("بارگذاری تصویر بنر الزامی است"),
  status: Yup.string()
    .oneOf(["ACTIVE", "INACTIVE"], "وضعیت نامعتبر است")
    .required("انتخاب وضعیت الزامی است"),
  url: Yup.string()
    .required("وارد کردن آدرس لینک الزامی است"),
  position: Yup.string()
    .oneOf(["TOP", "DOWN", "RIGHT"], "موقعیت نامعتبر است")
    .required("انتخاب موقعیت الزامی است"),
});