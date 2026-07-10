// components/CategoryTreeList.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronDown, FiEdit, FiTrash2, FiPlus, FiFolder } from "react-icons/fi";
import { Button } from "./ui/Button";
import { toPersianNumber } from "@/lib/utils/persianNumbers";

interface CategoryNode {
  id: number;
  name: string;
  slug: string;
  status: "ACTIVE" | "INACTIVE";
  parentId: number | null;
  children?: CategoryNode[];
  createdAt: string;
  updatedAt: string;
  softDeletedAt: string | null;
  _count?: { children: number };
}

interface CategoryTreeListProps {
  data: CategoryNode[];
  loading?: boolean;
  onEdit?: (item: CategoryNode) => void;
  onDelete?: (item: CategoryNode) => void;
  onRestore?: (item: CategoryNode) => void;
  onAddChild?: (parent: CategoryNode) => void;
  showTrash?: boolean;
}

// ===== تابع مطمئن برای ساخت درخت از داده‌های مسطح =====
const buildTree = (items: CategoryNode[], parentId: number | null = null): CategoryNode[] => {
  // ابتدا مواردی که parentId دارند را فیلتر می‌کنیم
  const children = items.filter(item => item.parentId === parentId);
  
  // اگر هیچ فرزندی نبود، آرایه خالی برگردان
  if (children.length === 0) return [];

  // برای هر فرزند، بازگشتی فرزندان آن را پیدا می‌کنیم
  return children.map(item => ({
    ...item,
    children: buildTree(items, item.id),
  }));
};

// ===== گره درختی =====
const TreeNode = ({
  node,
  level = 0,
  onEdit,
  onDelete,
  onRestore,
  onAddChild,
  showTrash,
}: {
  node: CategoryNode;
  level?: number;
  onEdit?: (item: CategoryNode) => void;
  onDelete?: (item: CategoryNode) => void;
  onRestore?: (item: CategoryNode) => void;
  onAddChild?: (parent: CategoryNode) => void;
  showTrash?: boolean;
}) => {
  const [isExpanded, setIsExpanded] = useState(true); // پیش‌فرض باز
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2 }}
        className={`
          group flex items-center gap-2 px-3 py-2.5 rounded-xl
          hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20
          transition-all duration-200
          border border-transparent hover:border-indigo-100 dark:hover:border-indigo-900/30
          ${node.status === "INACTIVE" ? "opacity-60" : ""}
        `}
        style={{ paddingRight: `${level * 28 + 12}px` }}
      >
        {/* دکمه گسترش */}
        {hasChildren ? (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors"
          >
            <motion.div
              animate={{ rotate: isExpanded ? 0 : -90 }}
              transition={{ duration: 0.2 }}
            >
              <FiChevronDown className="w-4 h-4 text-slate-400" />
            </motion.div>
          </button>
        ) : (
          <div className="w-6" /> // فضای خالی برای هم‌ترازی
        )}

        {/* آیکون پوشه */}
        <div className="flex-shrink-0">
          <FiFolder className={`w-4 h-4 ${hasChildren ? "text-amber-400" : "text-slate-400"}`} />
        </div>

        {/* نام */}
        <span className="flex-1 text-sm font-medium text-slate-700 dark:text-zinc-300">
          {node.name}
          {showTrash && node.softDeletedAt && (
            <span className="mr-2 text-[10px] text-rose-400 bg-rose-50 dark:bg-rose-950/30 px-2 py-0.5 rounded-full">
              حذف شده
            </span>
          )}
          {hasChildren && (
            <span className="mr-2 text-[10px] text-slate-400 bg-slate-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full">
              {toPersianNumber(node.children!.length)} زیرمجموعه
            </span>
          )}
        </span>

        {/* وضعیت */}
        <span className={`
          text-[10px] font-semibold px-2.5 py-1 rounded-full
          ${node.status === "ACTIVE"
            ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400"
            : "bg-rose-50 text-rose-600 dark:bg-rose-950/30 dark:text-rose-400"
          }
        `}>
          {node.status === "ACTIVE" ? "فعال" : "غیرفعال"}
        </span>

        {/* عملیات */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {!showTrash && onAddChild && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onAddChild(node)}
              title="افزودن زیرمجموعه"
              className="h-8 w-8 p-0 rounded-lg text-indigo-500 hover:bg-indigo-100 dark:hover:bg-indigo-950/30"
            >
              <FiPlus className="w-3.5 h-3.5" />
            </Button>
          )}
          {!showTrash && onEdit && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(node)}
              title="ویرایش"
              className="h-8 w-8 p-0 rounded-lg text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-950/30"
            >
              <FiEdit className="w-3.5 h-3.5" />
            </Button>
          )}
          {showTrash && onRestore && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRestore(node)}
              title="بازگردانی"
              className="h-8 w-8 p-0 rounded-lg text-emerald-500 hover:bg-emerald-100 dark:hover:bg-emerald-950/30"
            >
              <FiEdit className="w-3.5 h-3.5" />
            </Button>
          )}
          {onDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(node)}
              title={showTrash ? "حذف دائمی" : "حذف"}
              className="h-8 w-8 p-0 rounded-lg text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-950/30"
            >
              <FiTrash2 className="w-3.5 h-3.5" />
            </Button>
          )}
        </div>
      </motion.div>

      {/* فرزندان */}
      <AnimatePresence>
        {isExpanded && hasChildren && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {node.children!.map((child) => (
              <TreeNode
                key={child.id}
                node={child}
                level={level + 1}
                onEdit={onEdit}
                onDelete={onDelete}
                onRestore={onRestore}
                onAddChild={onAddChild}
                showTrash={showTrash}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ===== کامپوننت اصلی =====
export default function CategoryTreeList({
  data,
  loading = false,
  onEdit,
  onDelete,
  onRestore,
  onAddChild,
  showTrash = false,
}: CategoryTreeListProps) {
  // دیباگ: داده‌های دریافتی را چاپ کن
  console.log("CategoryTreeList - Raw data:", data);

  // ساخت درخت از داده‌های مسطح
  const treeData = useMemo(() => {
    const result = buildTree(data);
    console.log("CategoryTreeList - Tree data:", result);
    return result;
  }, [data]);

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-pulse space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-slate-100 dark:bg-zinc-900 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <FiFolder className="text-5xl text-slate-300 dark:text-zinc-700 mb-4" />
        <p className="text-slate-500 dark:text-zinc-400 font-medium">
          {showTrash ? "هیچ دسته‌بندی حذف شده‌ای وجود ندارد" : "هیچ دسته‌بندی تعریف نشده است"}
        </p>
        {!showTrash && (
          <p className="text-sm text-slate-400 dark:text-zinc-500 mt-1">
            برای شروع، اولین دسته‌بندی را ایجاد کنید.
          </p>
        )}
      </div>
    );
  }

  if (treeData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <FiFolder className="text-5xl text-slate-300 dark:text-zinc-700 mb-4" />
        <p className="text-slate-500 dark:text-zinc-400 font-medium">
          هیچ دسته‌بندی ریشه‌ای (بدون والد) وجود ندارد
        </p>
        <p className="text-sm text-slate-400 dark:text-zinc-500 mt-1">
          حداقل یک دسته‌بندی با parentId = null ایجاد کنید.
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* هدر */}
      <div className="grid grid-cols-12 gap-2 px-4 py-3 text-xs font-semibold text-slate-400 dark:text-zinc-500 border-b border-slate-100 dark:border-zinc-900/60">
        <div className="col-span-6">نام دسته‌بندی</div>
        <div className="col-span-3 text-center">وضعیت</div>
        <div className="col-span-3 text-center">عملیات</div>
      </div>

      {/* لیست گره‌ها */}
      <div className="divide-y divide-slate-100 dark:divide-zinc-900/40">
        {treeData.map((node) => (
          <TreeNode
            key={node.id}
            node={node}
            level={0}
            onEdit={onEdit}
            onDelete={onDelete}
            onRestore={onRestore}
            onAddChild={onAddChild}
            showTrash={showTrash}
          />
        ))}
      </div>
    </div>
  );
}