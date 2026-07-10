"use client";

import { Category } from "@prisma/client";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { toast } from "sonner";

import { TreeNode } from "./TreeNode";
import { buildCategoryTree } from "@/lib/category/buildCategoryTree";
import { generateSlug } from "@/lib/slug/generateSlug";
import { createCategoryAction } from "@/app/actions/category/categoryActions";
import { useRouter } from "next/navigation";


interface Props {
  categories: Category[];
  currentCategoryId?: number | null;
}

export default function CategoryFormTree({
  categories,
  currentCategoryId = null,
}: Props) {
  const [localCategories, setLocalCategories] = useState<Category[]>(categories);
  const tree = buildCategoryTree(localCategories);
  const router = useRouter();
  const [selectedParentId, setSelectedParentId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [expandedIds, setExpandedIds] = useState<number[]>([]); // کنترل باز/بسته بودن

  return (
    <Formik
      initialValues={{
        name: "",
        slug: "",
        status: "ACTIVE" as "ACTIVE" | "INACTIVE",
      }}
      validationSchema={Yup.object({
        name: Yup.string().min(2).required("نام الزامی است"),
        slug: Yup.string().required("Slug الزامی است"),
        status: Yup.mixed<"ACTIVE" | "INACTIVE">()
          .oneOf(["ACTIVE", "INACTIVE"])
          .required(),
      })}
      onSubmit={async (values, { resetForm }) => {
        setLoading(true);

        try {
          const newCategory = await createCategoryAction({
            ...values,
            parentId: selectedParentId,
          });

          setLocalCategories(prev => [...prev, newCategory]);
          resetForm();
          setSelectedParentId(null);
          setExpandedIds([]); // همه زیرشاخه‌ها بسته شوند
          toast.success("دسته‌بندی با موفقیت ایجاد شد");
        } catch (error: unknown) {
          if (error instanceof Error) {
            toast.error(error.message);
          } else {
            toast.error("خطا در ایجاد دسته‌بندی");
          }
        } finally {
          setLoading(false);
        }
      }}
    >
      {({ setFieldValue }) => (
        <Form className="p-6 space-y-6 ">
        
          {/* Name & Slug */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                نام دسته‌بندی
              </label>
              <Field
                name="name"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const name = e.target.value;
                  setFieldValue("name", name);
                  setFieldValue("slug", generateSlug(name));
                }}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700
                           bg-gray-100 dark:bg-gray-800 px-3 py-2
                           focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <ErrorMessage
                name="name"
                component="p"
                className="text-xs text-red-500 mt-1"
              />
            </div>
            
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                وضعیت
              </label>
              <Field
                as="select"
                name="status"
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700
                           bg-gray-100 dark:bg-gray-800 px-3 py-2
                           focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ACTIVE">فعال</option>
                <option value="INACTIVE">غیرفعال</option>
              </Field>
            </div>

            <div className="hidden">
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                Slug
              </label>
              <Field
                name="slug"
                readOnly
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700
                           bg-gray-100 dark:bg-gray-800 px-3 py-2
                           focus:outline-none focus:ring-2 focus:ring-blue-500
                           cursor-not-allowed"
              />
              <ErrorMessage
                name="slug"
                component="p"
                className="text-xs text-red-500 mt-1"
              />
            </div>
          </div>

          {/* Parent & Status */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-2">
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                دسته‌بندی والد
              </label>

              <div className="border border-gray-300 dark:border-gray-700
                              bg-gray-100 dark:bg-gray-800
                              rounded-lg p-3 max-h-64 overflow-y-auto scrollbar-hidden space-y-2">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="radio"
                    checked={selectedParentId === null}
                    onChange={() => setSelectedParentId(null)}
                    className="accent-blue-600"
                  />
                  والد اصلی
                </label>

                {tree.map(cat => (
                  <TreeNode
                    key={cat.id}
                    category={cat}
                    selectedId={selectedParentId}
                    setSelectedId={setSelectedParentId}
                    disabledIds={currentCategoryId ? [currentCategoryId] : []}
                    expandedIds={expandedIds}
                    setExpandedIds={setExpandedIds}
                  />
                ))}
              </div>
            </div>

            
          </div>

          <div className="md:col-span-2 flex justify-start mt-4 gap-4 ">
            <button
              disabled={loading}
              type="submit"
              className="w-full md:w-auto px-6 py-2 rounded-lg font-medium text-white
                         bg-blue-600 hover:bg-blue-700
                         disabled:opacity-50 disabled:cursor-not-allowed
                         transition"
            >
              {loading ? "در حال ثبت..." : "ثبت دسته‌بندی"}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="ml-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl px-6 py-3 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all shadow-md"
            >
              انصراف
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}