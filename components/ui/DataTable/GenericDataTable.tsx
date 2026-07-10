"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { toPersianNumber } from "@/lib/utils/persianNumbers";
import Pagination from "./Pagination";
import TableSkeleton from "./TableSkeleton";
import StatusToggle from "./StatusToggle";
import ActionButtons from "./ActionButtons";
import { ColumnDef } from "./types";
import { useSort } from "./useSort";
import { getRowIndex } from "./utils";

const LIMIT_OPTIONS = [5, 10, 20, 50];

interface BaseRow {
  id: number | string;
}

interface DesignSystemTableProps<T extends BaseRow> {
  title: string;
  columns: ColumnDef<T>[];
  data: T[];
  total: number;
  page: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  loading?: boolean;

  createButton?: string;
  createPath?: string;

  enableRowSelection?: boolean;
  onBulkDelete?: (ids: T["id"][]) => Promise<void>;
  onBulkStatusToggle?: (ids: T["id"][]) => Promise<void>;

  onStatusToggle?: (id: T["id"]) => Promise<void>;
  statusAccessor?: string | ((row: T) => boolean);
  statusColumnId?: string;
  togglingIds?: T["id"][];

  editPath?: (id: T["id"]) => string;
  onDelete?: (id: T["id"]) => Promise<void>;
  hasActions?: boolean;

  emptyMessage?: string;
}

export function GenericDataTable<T extends BaseRow>({
  title,
  columns,
  data,
  total,
  page,
  limit,
  onPageChange,
  onLimitChange,
  createButton,
  createPath,
  enableRowSelection = false,
  onBulkDelete,
  onBulkStatusToggle,
  onStatusToggle,
  statusAccessor = "status",
  statusColumnId = "status",
  togglingIds = [],
  editPath,
  onDelete,
  hasActions = true,
  emptyMessage = "داده‌ای یافت نشد!",
  loading = false,
}: DesignSystemTableProps<T>) {
  const { sortedData, sortConfig, setSortConfig } = useSort(data);
  const totalPages = Math.ceil(total / limit);

  const [selectedIds, setSelectedIds] = useState<T["id"][]>([]);
  const selectAllRef = useRef<HTMLInputElement>(null);

  const isAllSelected =
    selectedIds.length > 0 && selectedIds.length === sortedData.length;
  const isIndeterminate =
    selectedIds.length > 0 && selectedIds.length < sortedData.length;

  useEffect(() => {
    if (selectAllRef.current) selectAllRef.current.indeterminate = isIndeterminate;
  }, [isIndeterminate]);

  const getStatusValue = (row: T): boolean => {
    if (typeof statusAccessor === "function") return statusAccessor(row);
    const value = statusAccessor
      .split(".")
      .reduce((acc: any, key) => acc?.[key], row);
    if (typeof value === "boolean") return value;
    if (typeof value === "number") return value === 1;
    if (typeof value === "string")
      return ["ACTIVE", "TRUE", "1"].includes(value.toUpperCase());
    return false;
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{title}</h1>
        {createPath && createButton && (
          <Link
            href={createPath}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white transition-colors"
          >
            {createButton} جدید
          </Link>
        )}
      </div>

      {/* Bulk Actions */}
      {enableRowSelection && selectedIds.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 rounded-xl bg-blue-50 dark:bg-gray-800 border border-blue-200 dark:border-gray-700">
          <span className="text-sm text-blue-700 dark:text-blue-300">
            {toPersianNumber(selectedIds.length.toString())} مورد انتخاب شده
          </span>
          <div className="flex gap-2">
            {onBulkStatusToggle && (
              <button
                onClick={async () => {
                  await onBulkStatusToggle(selectedIds);
                  setSelectedIds([]);
                }}
                className="px-3 py-1 rounded-md text-sm bg-gray-600 hover:bg-gray-700 text-white"
              >
                تغییر وضعیت
              </button>
            )}
            {onBulkDelete && (
              <button
                onClick={async () => {
                  await onBulkDelete(selectedIds);
                  setSelectedIds([]);
                }}
                className="px-3 py-1 rounded-md text-sm bg-red-600 hover:bg-red-700 text-white"
              >
                حذف گروهی
              </button>
            )}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-800">
              <tr>
                {enableRowSelection && (
                  <th className="px-4 py-3 text-center">
                    <input
                      ref={selectAllRef}
                      type="checkbox"
                      checked={isAllSelected}
                      onChange={(e) =>
                        setSelectedIds(
                          e.target.checked ? sortedData.map((r) => r.id) : []
                        )
                      }
                      className="accent-blue-600"
                    />
                  </th>
                )}
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600 dark:text-gray-300">
                  #
                </th>
                {columns.map((col) => (
                  <th
                    key={col.id}
                    onClick={() =>
                      col.sortable &&
                      setSortConfig((prev) =>
                        prev?.key === col.id
                          ? { key: col.id, direction: prev.direction === "asc" ? "desc" : "asc" }
                          : { key: col.id, direction: "asc" }
                      )
                    }
                    className={`px-4 py-3 text-sm font-semibold select-none text-gray-700 dark:text-gray-300 ${
                      col.sortable ? "cursor-pointer hover:text-blue-600 dark:hover:text-blue-400" : ""
                    } ${col.hideOnMobile ? "hidden sm:table-cell" : ""}`}
                  >
                    {col.header}
                    {sortConfig?.key === col.id && (sortConfig.direction === "asc" ? " ↑" : " ↓")}
                  </th>
                ))}
                {hasActions && (editPath || onDelete) && (
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600 dark:text-gray-300">
                    عملیات
                  </th>
                )}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {data.length === 0 && !loading ? (
                <tr>
                  <td colSpan={100} className="py-20 text-center text-gray-400 dark:text-gray-500">
                    {emptyMessage}
                  </td>
                </tr>
              ) : loading ? (
                <TableSkeleton rows={limit} columnsCount={columns.length + (hasActions ? 2 : 1) + (enableRowSelection ? 1 : 0)} />
              ) : (
                sortedData.map((row, i) => (
                  <tr
                    key={row.id}
                    className={`transition-colors ${
                      i % 2 === 0
                        ? "bg-gray-50 dark:bg-gray-800"
                        : "bg-white dark:bg-gray-900"
                    } hover:bg-blue-50 dark:hover:bg-blue-900`}
                  >
                    {enableRowSelection && (
                      <td className="px-4 py-3 text-center">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(row.id)}
                          onChange={(e) =>
                            setSelectedIds((prev) =>
                              e.target.checked ? [...prev, row.id] : prev.filter((id) => id !== row.id)
                            )
                          }
                          className="accent-blue-600"
                        />
                      </td>
                    )}
                    <td className="px-4 py-3 text-center text-sm text-gray-700 dark:text-gray-300">
                      {toPersianNumber(getRowIndex(page, limit, i).toString())}
                    </td>
                    {columns.map((col) => (
                      <td key={col.id} className={`px-4 py-3 text-sm text-gray-700 dark:text-gray-300 ${col.hideOnMobile ? "hidden sm:table-cell" : ""}`}>
                        {col.id === statusColumnId && onStatusToggle ? (
                          <StatusToggle
                            checked={getStatusValue(row)}
                            loading={togglingIds.includes(row.id)}
                            onChange={() => onStatusToggle(row.id)}
                            size="sm"
                          />
                        ) : col.cell ? (
                          col.cell(row)
                        ) : col.accessor ? (
                          String((row as any)[col.accessor] ?? "-")
                        ) : (
                          "-"
                        )}
                      </td>
                    ))}
                    {hasActions && (editPath || onDelete) && (
                      <td className="px-4 py-3 text-center">
                        <div className="flex justify-center gap-2">
                          {editPath && (
                            <Link href={editPath(row.id)} className="px-3 py-1 rounded text-sm bg-blue-600 hover:bg-blue-700 text-white transition-colors">
                              ویرایش
                            </Link>
                          )}
                          {onDelete && <ActionButtons item={row} onDelete={() => onDelete(row.id)} size="sm" />}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      {!loading && total > 0 && (
        <div className="flex justify-between items-center text-sm text-gray-700 dark:text-gray-300">
          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <span className="hidden sm:inline">نمایش</span>
            <span className="sm:hidden">نمایش:</span>
            <select
              value={limit}
              onChange={(e) => onLimitChange(Number(e.target.value))}
              className="py-0.5 sm:py-1 rounded-md sm:rounded-lg border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
            >
              {LIMIT_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {toPersianNumber(opt.toString())}
                </option>
              ))}
            </select>
            <span className="hidden sm:inline">از {toPersianNumber(total.toString())} آیتم</span>
            <span className="sm:hidden">/ {toPersianNumber(total.toString())}</span>
          </div>
          {totalPages > 1 && <Pagination currentPage={page} totalPages={totalPages} onPageChange={onPageChange} />}
        </div>
      )}
    </div>
  );
}
