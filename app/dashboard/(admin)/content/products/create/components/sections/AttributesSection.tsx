"use client";

import { AttributeForm } from "../CreateProductForm";

interface AttributesSectionProps {
  attributes: AttributeForm[];
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
}

export default function AttributesSection({
  attributes,
  setFieldValue,
}: AttributesSectionProps) {
  const handleAttributeChange = (
    index: number,
    field: keyof AttributeForm,
    value: string
  ) => {
    const newAttributes = [...attributes];
    newAttributes[index] = { ...newAttributes[index], [field]: value };
    setFieldValue("attributes", newAttributes);
  };

  const addAttribute = () => {
    setFieldValue("attributes", [...attributes, { key: "", value: "" }]);
  };

  const removeAttribute = (index: number) => {
    if (attributes.length > 1) {
      const newAttributes = attributes.filter((_, i) => i !== index);
      setFieldValue("attributes", newAttributes);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow dark:shadow-gray-900">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          ویژگی‌های محصول
        </h2>
        <button
          type="button"
          onClick={addAttribute}
          className="px-4 py-2 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 
            rounded-lg hover:bg-green-200 dark:hover:bg-green-800 transition-colors"
        >
          + افزودن ویژگی
        </button>
      </div>
      
      <div className="space-y-3">
        {attributes.map((attr, index) => (
          <div key={index} className="flex gap-3 items-center">
            <div className="flex-1">
              <input
                type="text"
                placeholder="عنوان ویژگی"
                value={attr.key}
                onChange={(e) => handleAttributeChange(index, "key", e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2
                  bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
            <div className="flex-1">
              <input
                type="text"
                placeholder="مقدار"
                value={attr.value}
                onChange={(e) => handleAttributeChange(index, "value", e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2
                  bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
            {attributes.length > 1 && (
              <button
                type="button"
                onClick={() => removeAttribute(index)}
                className="px-3 py-2 bg-red-50 dark:bg-red-900 text-red-600 dark:text-red-300 
                  rounded hover:bg-red-100 dark:hover:bg-red-800"
              >
                حذف
              </button>
            )}
          </div>
        ))}
        <p className="text-sm text-gray-500 dark:text-gray-400">
          مثال: پردازنده → Core i7 | رم → 16GB
        </p>
      </div>
    </div>
  );
}