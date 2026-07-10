"use client";

import { Category, ProductBrand } from "@prisma/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createProduct } from "@/app/actions/product/products";
import { Formik, Form, FormikHelpers } from "formik";
import * as Yup from "yup";
import BasicInfoSection from "./sections/BasicInfoSection";
import VariantsSection from "./sections/VariantsSection";
import ImagesSection from "./sections/ImagesSection";
import AttributesSection from "./sections/AttributesSection";
import SubmitButtons from "./sections/SubmitButtons";

interface CreateProductFormProps {
  categories: Category[];
  brands: ProductBrand[];
}

export interface VariantForm {
  id: string;
  color: string;
  price: number;
  stock: number;
}

export interface WarrantyForm {
  [variantId: string]: {
    title: string;
    periodMonths: number;
    description: string;
  };
}

export interface AttributeForm {
  key: string;
  value: string;
}

export interface ImageForm {
  url: string;
  isMain: boolean;
  file?: File;
}

export interface ProductFormValues {
  title: string;
  description: string;
  categoryId: number | null;
  brandId: number | null;
  status: "ACTIVE" | "INACTIVE";
  variants: VariantForm[];
  warranties: WarrantyForm;
  images: ImageForm[];
  attributes: AttributeForm[];
  imageFiles: File[];
}

const validationSchema = Yup.object({
  title: Yup.string().required("عنوان محصول الزامی است"),
  description: Yup.string().required("توضیحات محصول الزامی است"),
  categoryId: Yup.number().required("دسته‌بندی الزامی است").nullable(),
  brandId: Yup.number().nullable(),
  status: Yup.string().oneOf(["ACTIVE", "INACTIVE"]).required(),
  variants: Yup.array()
    .of(
      Yup.object({
        color: Yup.string(),
        price: Yup.number()
          .required("قیمت الزامی است")
          .min(1, "قیمت باید بیشتر از صفر باشد"),
        stock: Yup.number()
          .required("موجودی الزامی است")
          .min(0, "موجودی نمی‌تواند منفی باشد"),
      })
    )
    .min(1, "حداقل یک واریانت الزامی است"),
  attributes: Yup.array().of(
    Yup.object({
      key: Yup.string(),
      value: Yup.string(),
    })
  ),
});

export default function CreateProductForm({ categories, brands }: CreateProductFormProps) {
  const router = useRouter();

  const initialValues: ProductFormValues = {
    title: "",
    description: "",
    categoryId: null,
    brandId: null,
    status: "ACTIVE",
    variants: [{ id: "1", color: "", price: 0, stock: 0 }],
    warranties: {},
    images: [],
    attributes: [{ key: "", value: "" }],
    imageFiles: [],
  };

  const handleSubmit = async (
    values: ProductFormValues,
    { setSubmitting }: FormikHelpers<ProductFormValues>
  ) => {
    try {
      const formData = new FormData();
      
      // افزودن داده‌های متنی
      formData.append("title", values.title);
      formData.append("description", values.description);
      formData.append("categoryId", values.categoryId?.toString() || "");
      if (values.brandId) {
        formData.append("brandId", values.brandId.toString());
      }
      formData.append("status", values.status);
      formData.append("variants", JSON.stringify(values.variants));
      formData.append("warranties", JSON.stringify(values.warranties));
      formData.append("attributes", JSON.stringify(values.attributes.filter(a => a.key && a.value)));
      
      // افزودن تصاویر
      const uploadedImages = values.images.map((img, index) => ({
        url: img.url || `https://picsum.photos/400/300?random=${index}`,
        isMain: img.isMain
      }));
      formData.append("images", JSON.stringify(uploadedImages));
      
      // افزودن فایل‌ها
      values.imageFiles.forEach((file, index) => {
        formData.append(`imageFile_${index}`, file);
      });

      const result = await createProduct(formData);
      
      if (result.success) {
        toast.success(result.message);
        router.push("/dashboard/content/products");
        router.refresh();
      } else {
        toast.error(result.error || "خطا در ایجاد محصول");
      }
    } catch (error) {
      console.error("Error creating product:", error);
      toast.error("خطا در ایجاد محصول");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ 
        values, 
        errors, 
        touched, 
        handleChange, 
        setFieldValue,
        isSubmitting,
        isValid 
      }) => (
        <Form className="space-y-8">
          {/* اطلاعات اصلی */}
          <BasicInfoSection
            values={values}
            errors={errors}
            touched={touched}
            handleChange={handleChange}
            setFieldValue={setFieldValue}
            categories={categories}
            brands={brands}
          />

          {/* واریانت‌ها و گارانتی‌ها */}
          <VariantsSection
            values={values}
            setFieldValue={setFieldValue}
            errors={errors}
            touched={touched}
          />

          {/* تصاویر محصول */}
          <ImagesSection
            images={values.images}
            imageFiles={values.imageFiles}
            setFieldValue={setFieldValue}
          />

          {/* ویژگی‌های محصول */}
          <AttributesSection
            attributes={values.attributes}
            setFieldValue={setFieldValue}
          />

          {/* دکمه‌های عملیات */}
          <SubmitButtons
            isSubmitting={isSubmitting}
            isValid={isValid}
            hasCategory={!!values.categoryId}
          />
        </Form>
      )}
    </Formik>
  );
}