"use client";

import { Category, ProductBrand } from "@prisma/client";
import { FormikErrors, FormikTouched } from "formik";
import CategoryTree from "@/components/dashboard/content/category/CategoryTree";
import { ProductFormValues } from "../CreateProductForm";

interface BasicInfoSectionProps {
  values: ProductFormValues;
  errors: FormikErrors<ProductFormValues>;
  touched: FormikTouched<ProductFormValues>;
  handleChange: (e: React.ChangeEvent<any>) => void;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  categories: Category[];
  brands: ProductBrand[];
}

export default function BasicInfoSection({
  values,
  errors,
  touched,
  handleChange,
  setFieldValue,
  categories,
  brands,
}: BasicInfoSectionProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow dark:shadow-gray-900">
      <h2 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-200">
        اطلاعات اصلی
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* عنوان محصول */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            عنوان محصول *
          </label>
          <input
            type="text"
            name="title"
            value={values.title}
            onChange={handleChange}
            className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 
              ${errors.title && touched.title 
                ? 'border-red-500 dark:border-red-400' 
                : 'border-gray-300 dark:border-gray-600'
              }
              bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
            `}
            placeholder="مثال: لپ‌تاپ اپل مک‌بوک پرو"
          />
          {errors.title && touched.title && (
            <div className="text-red-500 text-sm mt-1">{errors.title}</div>
          )}
        </div>
        
        {/* برند */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            برند
          </label>
          <select
            name="brandId"
            value={values.brandId || ""}
            onChange={handleChange}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 
              focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
              bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="">بدون برند</option>
            {brands.map(brand => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </select>
        </div>

        {/* دسته‌بندی */}
        <div className="md:col-span-1">
          <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            دسته‌بندی *
          </label>
          <CategoryTree
            categories={categories}
            selectedParentId={values.categoryId}
            onParentSelect={(id) => setFieldValue("categoryId", id)}
            label=""
            required={true}
            darkMode={true}
          />
          {errors.categoryId && touched.categoryId && (
            <div className="text-red-500 text-sm mt-1">{errors.categoryId}</div>
          )}
        </div>
        
        {/* وضعیت */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            وضعیت
          </label>
          <select
            name="status"
            value={values.status}
            onChange={handleChange}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 
              focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
              bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="ACTIVE">فعال</option>
            <option value="INACTIVE">غیرفعال</option>
          </select>
        </div>

        {/* توضیحات */}
        <div className="md:col-span-2">
          <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            توضیحات محصول *
          </label>
          <textarea
            name="description"
            value={values.description}
            onChange={handleChange}
            rows={6}
            className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
              ${errors.description && touched.description 
                ? 'border-red-500 dark:border-red-400' 
                : 'border-gray-300 dark:border-gray-600'
              }
              bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
            `}
            placeholder="توضیحات کامل محصول را وارد کنید..."
          />
          {errors.description && touched.description && (
            <div className="text-red-500 text-sm mt-1">{errors.description}</div>
          )}
        </div>
      </div>
    </div>
  );
}