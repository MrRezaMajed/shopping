"use client";

import { FormikErrors, FormikTouched } from "formik";
import { ProductFormValues, VariantForm } from "../CreateProductForm";

interface VariantsSectionProps {
  values: ProductFormValues;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  errors: FormikErrors<ProductFormValues>;
  touched: FormikTouched<ProductFormValues>;
}

export default function VariantsSection({
  values,
  setFieldValue,
  errors,
  touched,
}: VariantsSectionProps) {
  const handleVariantChange = (
    index: number,
    field: keyof VariantForm,
    value: string | number
  ) => {
    const newVariants = [...values.variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setFieldValue("variants", newVariants);
  };

  const addVariant = () => {
    const newVariant: VariantForm = { 
      id: `variant_${Date.now()}`, 
      color: "", 
      price: 0, 
      stock: 0 
    };
    setFieldValue("variants", [...values.variants, newVariant]);
  };

  const removeVariant = (index: number) => {
    if (values.variants.length > 1) {
      const variantId = values.variants[index].id;
      const newVariants = values.variants.filter((_, i) => i !== index);
      
      // حذف گارانتی مربوطه
      const newWarranties = { ...values.warranties };
      delete newWarranties[variantId];
      
      setFieldValue("variants", newVariants);
      setFieldValue("warranties", newWarranties);
    }
  };

  const handleWarrantyChange = (
    variantId: string,
    field: string,
    value: string | number
  ) => {
    setFieldValue("warranties", {
      ...values.warranties,
      [variantId]: {
        ...(values.warranties[variantId] || { title: "", periodMonths: 12, description: "" }),
        [field]: value,
      },
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow dark:shadow-gray-900">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          واریانت‌ها و گارانتی‌ها
        </h2>
        <button
          type="button"
          onClick={addVariant}
          className="px-4 py-2 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 
            rounded-lg hover:bg-green-200 dark:hover:bg-green-800 transition-colors"
        >
          + افزودن واریانت
        </button>
      </div>
      
      <div className="space-y-6">
        {values.variants.map((variant, index) => (
          <div key={variant.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200">
                واریانت #{index + 1}
              </h3>
              {values.variants.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeVariant(index)}
                  className="px-3 py-1 bg-red-50 dark:bg-red-900 text-red-600 dark:text-red-300 
                    rounded hover:bg-red-100 dark:hover:bg-red-800 transition-colors"
                >
                  حذف واریانت
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {/* رنگ/مدل */}
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                  رنگ/مدل
                </label>
                <input
                  type="text"
                  value={variant.color}
                  onChange={(e) => handleVariantChange(index, "color", e.target.value)}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2
                    bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="مثال: مشکی، 128GB"
                />
              </div>
              
              {/* قیمت */}
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                  قیمت (تومان) *
                </label>
                <input
                  type="number"
                  value={variant.price}
                  onChange={(e) => handleVariantChange(index, "price", parseInt(e.target.value) || 0)}
                  className={`w-full border rounded px-3 py-2
                    ${errors.variants?.[index]?.price && touched.variants?.[index]?.price 
                      ? 'border-red-500 dark:border-red-400' 
                      : 'border-gray-300 dark:border-gray-600'
                    }
                    bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                  `}
                  min="0"
                />
                {errors.variants?.[index]?.price && touched.variants?.[index]?.price && (
                  <div className="text-red-500 text-sm mt-1">
                    {errors.variants[index]?.price}
                  </div>
                )}
              </div>
              
              {/* موجودی */}
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                  موجودی *
                </label>
                <input
                  type="number"
                  value={variant.stock}
                  onChange={(e) => handleVariantChange(index, "stock", parseInt(e.target.value) || 0)}
                  className={`w-full border rounded px-3 py-2
                    ${errors.variants?.[index]?.stock && touched.variants?.[index]?.stock 
                      ? 'border-red-500 dark:border-red-400' 
                      : 'border-gray-300 dark:border-gray-600'
                    }
                    bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                  `}
                  min="0"
                />
                {errors.variants?.[index]?.stock && touched.variants?.[index]?.stock && (
                  <div className="text-red-500 text-sm mt-1">
                    {errors.variants[index]?.stock}
                  </div>
                )}
              </div>
            </div>

            {/* گارانتی */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <h4 className="font-medium mb-3 text-gray-700 dark:text-gray-300">گارانتی</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-sm text-gray-600 dark:text-gray-400">
                    عنوان گارانتی
                  </label>
                  <input
                    type="text"
                    value={values.warranties[variant.id]?.title || ""}
                    onChange={(e) => handleWarrantyChange(variant.id, "title", e.target.value)}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2
                      bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="مثال: گارانتی 24 ماهه"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm text-gray-600 dark:text-gray-400">
                    مدت گارانتی (ماه)
                  </label>
                  <input
                    type="number"
                    value={values.warranties[variant.id]?.periodMonths || 12}
                    onChange={(e) => handleWarrantyChange(variant.id, "periodMonths", parseInt(e.target.value) || 12)}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2
                      bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    min="0"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block mb-1 text-sm text-gray-600 dark:text-gray-400">
                    توضیحات گارانتی
                  </label>
                  <textarea
                    value={values.warranties[variant.id]?.description || ""}
                    onChange={(e) => handleWarrantyChange(variant.id, "description", e.target.value)}
                    rows={2}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2
                      bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="شرایط گارانتی را توضیح دهید..."
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}