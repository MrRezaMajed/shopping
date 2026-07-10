"use client";

import React, { useState, useEffect } from "react";
import CRUDEditForm from "@/components/CRUDEditForm";
import CRUDList from "@/components/CRUDList";
import GenericFilterBar from "@/components/GenericFilterBar";
import { toast } from "sonner";

interface Column<T> {
  key: keyof T;
  label: string;
  render?: (item: T) => React.ReactNode;
}

interface Field<T> {
  name: keyof T;
  label: string;
  type?: string;
  options?: { value: any; label: string }[];
}

interface GenericCRUDProps<T> {
  title: string;
  idKey?: keyof T;
  columns: (data: T[], setData: (d: T[]) => void, refreshData: () => void) => Column<T>[];
  fields: Field<T>[];
  initialValues: T;
  getItems: (filters: any) => Promise<{ data: T[]; total: number }>;
  createItem: (item: T) => Promise<{ success: boolean; error?: string }>;
  updateItem: (id: any, item: T) => Promise<{ success: boolean; error?: string }>;
  deleteItem: (id: any) => Promise<{ success: boolean; error?: string }>;
  validationSchema: any;
}

export default function GenericCRUD<T extends { id: any }>({
  title,
  idKey = "id",
  columns,
  fields,
  initialValues,
  getItems,
  createItem,
  updateItem,
  deleteItem,
  validationSchema,
}: GenericCRUDProps<T>) {
  const [mode, setMode] = useState<"list" | "create" | "edit">("list");
  const [editingItem, setEditingItem] = useState<T | null>(null);
  const [data, setData] = useState<T[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<any>({});

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getItems({ ...filters, page, limit });
      setData(res.data);
      setTotal(res.total);
    } catch (e) {
      toast.error("خطا در بارگذاری داده‌ها");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [page, limit, filters]);

  const handleDelete = async (item: T) => {
    const res = await deleteItem(item[idKey]);
    if (res.success) {
      toast.success("حذف با موفقیت انجام شد");
      fetchData();
    } else {
      toast.error(res.error || "خطا در حذف");
    }
  };

  const handleEdit = (item: T) => {
    setEditingItem(item);
    setMode("edit");
  };

  const handleFormSubmit = async (values: T) => {
    let res;
    if (mode === "edit" && editingItem) {
      res = await updateItem(editingItem[idKey], values);
    } else {
      res = await createItem(values);
    }

    if (res.success) {
      toast.success(mode === "edit" ? "ویرایش انجام شد" : "ایجاد شد");
      setMode("list");
      setEditingItem(null);
      fetchData();
    } else {
      toast.error(res.error || "خطا در ذخیره اطلاعات");
    }
  };

  const cols = columns(data, setData, fetchData);

  return (
    <div className="min-h-screen p-6 dark:bg-gray-950">
      {mode === "list" && (
        <>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold dark:text-gray-100">{title}</h1>
            <button
              className="px-5 py-2.5 rounded-xl bg-blue-600 text-white"
              onClick={() => setMode("create")}
            >
              ایجاد جدید
            </button>
          </div>

          <GenericFilterBar filters={filters} onChange={setFilters} fields={fields} />

          <CRUDList
            columns={cols}
            data={data}
            total={total}
            page={page}
            limit={limit}
            loading={loading}
            onPageChange={setPage}
            onLimitChange={setLimit}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </>
      )}

      {(mode === "create" || mode === "edit") && (
        <CRUDEditForm
          title={mode === "create" ? `ایجاد ${title}` : `ویرایش ${title}`}
          initialValues={editingItem || initialValues}
          validationSchema={validationSchema}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setMode("list");
            setEditingItem(null);
          }}
          fields={fields}
        />
      )}
    </div>
  );
}
