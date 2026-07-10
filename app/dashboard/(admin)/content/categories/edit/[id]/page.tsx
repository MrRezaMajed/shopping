// app/dashboard/content/categories/[id]/edit/page.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import { generateSlug } from "@/lib/slug/generateSlug";
import { buildCategoryTree } from "@/lib/category/buildCategoryTree";
import { TreeNode } from "@/components/dashboard/content/category/TreeNode";

// Server Actions
import { 
  fetchCategoryById, 
  fetchAllCategories,
  updateCategory 
} from "@/app/actions/category/categoryActions";

// Types
interface CategoryData {
  id: number;
  name: string;
  slug: string;
  parentId: number | null;
  status: "ACTIVE" | "INACTIVE";
  parent?: {
    id: number;
    name: string;
  } | null;
}

interface CategoryTree {
  id: number;
  name: string;
  slug: string;
  status: "ACTIVE" | "INACTIVE";
  parentId?: number | null;
  children: CategoryTree[];
}

interface FormValues {
  name: string;
  slug: string;
  parentId: string;
  status: "ACTIVE" | "INACTIVE";
}

const statusOptions = [
  { value: "ACTIVE", label: "فعال" },
  { value: "INACTIVE", label: "غیرفعال" },
];

const schema = Yup.object().shape({
  name: Yup.string()
    .required("نام دسته‌بندی الزامی است")
    .min(2, "نام دسته‌بندی باید حداقل ۲ کاراکتر باشد")
    .max(100, "نام دسته‌بندی نباید بیشتر از ۱۰۰ کاراکتر باشد"),
  parentId: Yup.string().nullable(),
  status: Yup.string()
    .oneOf(["ACTIVE", "INACTIVE"])
    .required("وضعیت الزامی است"),
});

// Skeleton برای فرم
function FormSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="flex flex-col">
        <div className="h-4 bg-gray-300 dark:bg-zinc-700 rounded w-1/3 mb-1"></div>
        <div className="h-10 bg-gray-300 dark:bg-zinc-700 rounded w-full"></div>
      </div>
      
      <div className="flex flex-col">
        <div className="h-4 bg-gray-300 dark:bg-zinc-700 rounded w-1/3 mb-1"></div>
        <div className="h-10 bg-gray-300 dark:bg-zinc-700 rounded w-full"></div>
      </div>
      
      <div className="flex flex-col">
        <div className="h-4 bg-gray-300 dark:bg-zinc-700 rounded w-1/3 mb-1"></div>
        <div className="h-40 bg-gray-300 dark:bg-zinc-700 rounded w-full"></div>
      </div>
      
      <div className="flex flex-col">
        <div className="h-4 bg-gray-300 dark:bg-zinc-700 rounded w-1/3 mb-1"></div>
        <div className="h-10 bg-gray-300 dark:bg-zinc-700 rounded w-full"></div>
      </div>
      
      <div className="flex justify-start gap-3 pt-4">
        <div className="h-10 bg-gray-300 dark:bg-zinc-700 rounded w-32"></div>
        <div className="h-10 bg-gray-300 dark:bg-zinc-700 rounded w-32"></div>
      </div>
    </div>
  );
}

export default function EditCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const categoryId = Number(params.id);

  const [categoryData, setCategoryData] = useState<CategoryData | null>(null);
  const [allCategories, setAllCategories] = useState<CategoryTree[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // برای Tree View
  const [selectedParentId, setSelectedParentId] = useState<number | null>(null);
  const [expandedIds, setExpandedIds] = useState<number[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);
        
        // دریافت اطلاعات دسته‌بندی
        const category = await fetchCategoryById(categoryId);
        if (!category) {
          throw new Error("دسته‌بندی پیدا نشد");
        }
        setCategoryData(category);
        setSelectedParentId(category.parentId);
        
        // دریافت تمام دسته‌بندی‌ها برای درخت
        const categories = await fetchAllCategories(categoryId);
        const categoryTree = buildCategoryTree(categories);
        setAllCategories(categoryTree);
        
        // باز کردن والدهای مربوطه در درخت
        const parentIds: number[] = [];
        let currentParentId = category.parentId;
        while (currentParentId) {
          parentIds.push(currentParentId);
          const parent = categories.find(c => c.id === currentParentId);
          currentParentId = parent?.parentId || null;
        }
        setExpandedIds(parentIds);
        
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : "خطای ناشناخته در دریافت اطلاعات";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    }
    
    if (categoryId && !isNaN(categoryId)) {
      loadData();
    } else {
      setError("شناسه دسته‌بندی نامعتبر است");
      setLoading(false);
    }
  }, [categoryId]);

  // تابع برای تولید اسلاگ از نام
  const generateSlugFromName = useCallback((name: string): string => {
    if (!name || name.trim().length < 2) return "";
    return generateSlug(name);
  }, []);

  const handleSubmit = async (
    values: FormValues,
    { setSubmitting }: FormikHelpers<FormValues>
  ) => {
    try {
      setSubmitting(true);
      
      const result = await updateCategory({
        id: categoryId,
        name: values.name,
        slug: generateSlugFromName(values.name), // همیشه اسلاگ را از نام تولید کن
        parentId: selectedParentId,
        status: values.status,
      });

      if (result.success) {
        toast.success("دسته‌بندی با موفقیت بروزرسانی شد.");
        router.push("/dashboard/content/categories");
        router.refresh();
      } else {
        toast.error(result.error || "خطا در بروزرسانی دسته‌بندی");
      }
    } catch (err) {
      console.error("Submit error:", err);
      toast.error("خطا در بروزرسانی دسته‌بندی");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = "w-full p-2.5 border rounded-lg bg-white text-gray-900 dark:text-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors";
  const labelClass = "block mb-2 font-medium text-gray-700 dark:text-gray-300";
  const errorClass = "text-red-500 text-sm mt-1";
  const buttonClass = "px-6 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 dark:bg-gray-950 rounded-xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">ویرایش دسته‌بندی</h1>
          <div className="h-10 bg-gray-300 dark:bg-zinc-700 rounded w-24"></div>
        </div>
        <FormSkeleton />
      </div>
    );
  }

  if (error || !categoryData) {
    return (
      <div className="p-6">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-600 dark:text-red-400">{error || "دسته‌بندی پیدا نشد"}</p>
          <Link 
            href="/dashboard/content/categories" 
            className="mt-4 inline-block text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
          >
            بازگشت به لیست دسته‌بندی‌ها
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-200 dark:bg-gray-950 rounded-xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">ویرایش دسته‌بندی</h1>
          
        </div>
        <div className="flex gap-2">
          <Link 
            href="/dashboard/content/categories" 
            className="flex items-center gap-2 bg-gray-400 dark:bg-gray-800 text-gray-900 dark:text-gray-300 px-4 py-2.5 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
          >
            <span>←</span>
            بازگشت
          </Link>
        </div>
      </div>

      <Formik<FormValues>
        enableReinitialize
        initialValues={{
          name: categoryData.name,
          slug: categoryData.slug,
          parentId: categoryData.parentId?.toString() || "",
          status: categoryData.status,
        }}
        validationSchema={schema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, values, setFieldValue, handleChange }) => (
          <Form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* نام دسته‌بندی */}
              <div className="md:col-span-1">
                <label htmlFor="name" className={labelClass}>
                  نام دسته‌بندی *
                </label>
                <Field 
                  id="name"
                  name="name" 
                  className={inputClass}
                  placeholder="مثال: لباس مردانه"
                  dir="auto"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    handleChange(e);
                    // تولید خودکار اسلاگ از نام
                    const newSlug = generateSlugFromName(e.target.value);
                    setFieldValue("slug", newSlug);
                  }}
                />
                <ErrorMessage name="name" component="p" className={errorClass} />
              </div>
              
              {/* وضعیت */}
              <div className="md:col-span-1">
                <label htmlFor="status" className={labelClass}>
                  وضعیت *
                </label>
                <Field
                  as="select"
                  id="status"
                  name="status"
                  className={inputClass}
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Field>
                <ErrorMessage name="status" component="p" className={errorClass} />
              </div>

              {/* نمایش اسلاگ فقط برای مشاهده */}
              <div className="md:col-span-2 hidden">
                <label className={labelClass}>
                  اسلاگ (تولید خودکار)
                </label>
                <div className="flex items-center gap-2 p-2.5 border rounded-lg bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                  <span className="font-mono text-sm text-gray-700 dark:text-gray-300 flex-1">
                    {values.slug || generateSlugFromName(values.name) || "اسلاگ تولید خواهد شد..."}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      // کپی کردن اسلاگ به کلیپ‌بورد
                      const slugToCopy = values.slug || generateSlugFromName(values.name);
                      if (slugToCopy) {
                        navigator.clipboard.writeText(slugToCopy);
                        toast.success("اسلاگ کپی شد");
                      }
                    }}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                    title="کپی اسلاگ"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  اسلاگ به صورت خودکار از نام تولید می‌شود و برای SEO استفاده می‌شود.
                </p>
              </div>

              {/* دسته‌بندی والد - Tree View */}
              <div className="md:col-span-1">
                <label className={labelClass}>
                  دسته‌بندی والد
                  <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">
                    (انتخاب کنید یا خالی بگذارید)
                  </span>
                </label>
                
                <div className="scrollbar-hidden border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 rounded-lg p-4 max-h-80 overflow-y-auto">
                  {/* گزینه "بدون والد" */}
                  <div className="mb-3 pb-3 border-b border-gray-300 dark:border-gray-700">
                    <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 p-2 rounded">
                      <input
                        type="radio"
                        name="parentId"
                        checked={selectedParentId === null}
                        onChange={() => setSelectedParentId(null)}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-gray-700 dark:text-gray-300">
                        <span className="font-medium">بدون والد</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 mr-2"> (دسته‌بندی اصلی)</span>
                      </span>
                    </label>
                  </div>

                  {/* Tree View */}
                  <div className="space-y-1">
                    {allCategories.map(category => (
                      <TreeNode
                        key={category.id}
                        category={category}
                        selectedId={selectedParentId}
                        setSelectedId={setSelectedParentId}
                        disabledIds={[categoryData.id]} // غیرفعال کردن خود دسته‌بندی
                        expandedIds={expandedIds}
                        setExpandedIds={setExpandedIds}
                      />
                    ))}
                  </div>

                  {/* نمایش والد فعلی */}
                  {categoryData.parent && (
                    <div className="mt-4 pt-4 border-t border-gray-300 dark:border-gray-700">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-medium">والد فعلی:</span>
                        <span className="mr-2 font-medium text-blue-600 dark:text-blue-400">
                          {categoryData.parent.name}
                        </span>
                        
                      </p>
                    </div>
                  )}
                </div>
                
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  برای انتخاب دسته‌بندی والد، روی آن کلیک کنید.
                  <span className="block mt-1 text-red-500">
                    ⚠️ نمی‌توانید خود دسته‌بندی یا زیردسته‌های آن را به عنوان والد انتخاب کنید.
                  </span>
                </p>
              </div>

            </div>


            {/* دکمه‌های اقدام */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`${buttonClass} bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2`}
              >
                {isSubmitting ? (
                  <>
                    <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    در حال بروزرسانی...
                  </>
                ) : (
                  "بروزرسانی تغییرات"
                )}
              </button>
              
              <button
                type="button"
                onClick={() => router.back()}
                className={`${buttonClass} bg-gray-400 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700`}
              >
                انصراف
              </button>
              
              <button
                type="button"
                onClick={() => {
                  // بازنشانی فرم
                  setFieldValue("name", categoryData.name);
                  setFieldValue("slug", categoryData.slug);
                  setSelectedParentId(categoryData.parentId);
                  setFieldValue("status", categoryData.status);
                  toast.info("فرم به حالت اولیه بازنشانی شد");
                }}
                className={`${buttonClass} bg-yellow-600 hover:bg-yellow-700 text-white`}
              >
                بازنشانی
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}