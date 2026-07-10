"use client";

import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import * as Yup from "yup";
import { toast } from "sonner";
import { useSearchParams, useRouter } from "next/navigation";
import { 
  FiTrash2, 
  FiList, 
  FiPlus, 
  FiAlertTriangle, 
  FiInfo, 
  FiFilter, 
  FiRefreshCw, 
  FiDatabase, 
  FiX,
  FiHelpCircle,
  FiSearch,
  FiCornerDownLeft,
  FiFolder,
  FiTrendingUp,
  FiBox,
  FiTag
} from "react-icons/fi";
import { motion, AnimatePresence, Variants } from "framer-motion";

import CRUDList from "./ui/CRUDList/CRUDList";
import CRUDEditForm from "./CRUDEditForm";
import StatusToggle from "./ui/DataTable/StatusToggle";
import GenericFilterBar, { FilterField } from "./GenericFilterBar";
import { Button } from "./ui/Button";
import { toPersianNumber } from "@/lib/utils/persianNumbers";

import {
  getItems,
  createItem,
  updateItem,
  deleteItem,
  restoreItem,
  getProductStats,
} from "@/app/actions/crudActions";

export interface CRUDField {
  name: string;
  label: string;
  type?: "text" | "textarea" | "select" | "number" | "checkbox" | "file" | "date" | "tree";
  options?: { value: string; label: string; parentId?: number | string | null }[];
  cellRenderer?: (item: any) => React.ReactNode;

  disabled?: boolean | ((values: any) => boolean);
  compute?: (values: any, initialValues: any) => any;
  deps?: string[];
  trigger?: "change" | "blur";
}

export interface CRUDPageProps {
  model: "banner" | "brand" | "category" | "product";
  modelName: string;
  fields: CRUDField[];
  formFields: CRUDField[];
  filterFields: FilterField[];
  validationSchema: Yup.ObjectSchema<any>;
  enableStatusToggle?: boolean;
  hiddenOnMobile?: string[];
  dynamicOptions?: Record<string, { value: string; label: string; parentId?: number | string | null }[]>;
  filterTranslations?: {
    keys?: Record<string, string>;
    values?: Record<string, string>;
  };
}

export function useCRUD(model: string, modelName: string) {
  const searchParams = useSearchParams();
  
  const initialFilters = useMemo(() => {
    const params: Record<string, any> = {};
    if (searchParams) {
      searchParams.forEach((value, key) => {
        params[key] = value;
      });
    }
    return params;
  }, [searchParams]);

  const [data, setData] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [filters, setFilters] = useState<Record<string, any>>(initialFilters);
  const [showTrash, setShowTrash] = useState(false);

  const refreshList = useCallback(async () => {
    setLoading(true);
    const res = await getItems(model, page, limit, { ...filters, deleted: showTrash });
    if (!res.success) {
      toast.error(res.error || `خطا در دریافت ${modelName}`);
    } else {
      setData(res.data);
      setTotal(res.total);
    }
    setLoading(false);
  }, [model, page, limit, filters, showTrash, modelName]);

  useEffect(() => {
    refreshList();
  }, [refreshList]);

  useEffect(() => {
    const mergedParams: Record<string, any> = { ...initialFilters };

    if (typeof window !== "undefined") {
      const pendingKey = `crud_pending_filters_${model}`;
      const storedJson = sessionStorage.getItem(pendingKey);
      
      if (storedJson) {
        try {
          const parsedFilters = JSON.parse(storedJson);
          if (parsedFilters && typeof parsedFilters === "object") {
            Object.assign(mergedParams, parsedFilters);
          }
        } catch (e) {
          console.error("Failed to parse generic pending filters", e);
        } finally {
          sessionStorage.removeItem(pendingKey);
        }
      }
    }

    setFilters(mergedParams);
  }, [model, initialFilters]);

  useEffect(() => {
    setPage(1);
  }, [showTrash, filters]);

  const deleteItemLocal = (id: number) => {
    setData(prev => prev.filter(item => item.id !== id));
    setTotal(prev => prev - 1);
  };

  return {
    data,
    setData,
    total,
    loading,
    page,
    limit,
    filters,
    showTrash,
    setPage,
    setLimit,
    setFilters,
    setShowTrash,
    refreshList,
    deleteItemLocal,
  };
}

interface SpotlightCardProps {
  children: React.ReactNode;
  glowColor?: string;
}

// از throttle مبتنی بر requestAnimationFrame استفاده می‌کنیم تا رویداد mousemove
// باعث رندرهای اضافی و افت کارایی نشود.
export const SpotlightCard = React.memo(function SpotlightCard({
  children,
  glowColor = "rgba(99, 102, 241, 0.15)",
}: SpotlightCardProps) {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => setCoords({ x, y }));
  }, []);

  useEffect(() => () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative group/card rounded-2xl p-[1px] overflow-hidden bg-slate-200/50 dark:bg-[#1f2235]/50 shadow-sm transition-transform duration-350 hover:-translate-y-1"
    >
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute pointer-events-none -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full blur-2xl z-0"
            style={{
              left: `${coords.x}px`,
              top: `${coords.y}px`,
              background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
            }}
          />
        )}
      </AnimatePresence>
      <div className="relative z-10 bg-white/95 dark:bg-[#0c0d14]/95 p-4 rounded-[15px] flex items-center justify-between">
        {children}
      </div>
    </div>
  );
});

interface StatCardProps {
  label: string;
  value?: React.ReactNode;
  loading?: boolean;
  icon: React.ReactNode;
  glowColor: string;
  iconBg: string;
  valueClassName?: string;
}

// کارت آماری یکپارچه — جایگزین شش بلوک JSX تکراری قبلی؛
// هم حجم باندل و هم زمان نگهداری کد را کاهش می‌دهد.
export const StatCard = React.memo(function StatCard({
  label,
  value,
  loading,
  icon,
  glowColor,
  iconBg,
  valueClassName = "text-slate-800 dark:text-white",
}: StatCardProps) {
  return (
    <SpotlightCard glowColor={glowColor}>
      <div className="space-y-1 w-2/3">
        <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold block">{label}</span>
        {loading ? (
          <div className="h-7 w-12 bg-slate-100 dark:bg-[#1b1e30] rounded-md animate-pulse" />
        ) : (
          <span className={`text-xl sm:text-2xl font-black transition-all ${valueClassName}`}>{value}</span>
        )}
      </div>
      <div className={`p-3 rounded-xl group-hover/card:scale-110 transition-transform duration-300 ${iconBg}`}>
        {icon}
      </div>
    </SpotlightCard>
  );
});

export const TrashButton = React.memo(function TrashButton({ showTrash, onClick }: { showTrash: boolean; onClick: () => void }) {
  return (
  <Button
    onClick={onClick}
    variant={showTrash ? "secondary" : "ghost"}
    withRipple
    withGlow={!showTrash}
    iconLeft={showTrash ? <FiList className="h-4 w-4" /> : <FiTrash2 className="h-4 w-4" />}
    className={
      showTrash
        ? "bg-slate-800 text-white hover:bg-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-700/50 rounded-xl px-4 py-2 text-xs font-semibold shadow-md transition-all duration-300"
        : "bg-rose-50/70 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/30 rounded-xl px-4 py-2 text-xs font-semibold hover:bg-rose-100/70 hover:text-rose-700 dark:hover:bg-rose-950/50 dark:hover:text-rose-300 hover:border-rose-200 dark:hover:border-rose-900/50 hover:shadow-[0_0_15px_rgba(244,63,94,0.05)] transition-all duration-300"
    }
  >
    <span className="flex items-center gap-1.5">
      {showTrash ? "بازگشت به لیست اصلی" : "مشاهده سطل زباله"}
      <kbd className="hidden sm:inline-flex items-center justify-center px-1.5 py-0.5 rounded border border-rose-500/30 bg-rose-500/10 text-[9px] font-mono mr-1">T</kbd>
    </span>
  </Button>
  );
});

export const CreateButton = React.memo(function CreateButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
  <Button
    onClick={onClick}
    variant="success"
    withShine
    withGlow
    iconLeft={<FiPlus className="h-4 w-4" />}
    iconRotate={90}
    size="md"
    className="shadow-emerald-500/15 font-semibold rounded-xl px-5"
  >
    <span className="flex items-center gap-1.5">
      {label}
      <kbd className="hidden sm:inline-flex items-center justify-center px-1.5 py-0.5 rounded border border-emerald-500/30 bg-emerald-500/10 text-[9px] font-mono mr-1">C</kbd>
    </span>
  </Button>
  );
});

// ترجمه کلید/مقدار فیلترها یک‌بار در سطح ماژول تعریف می‌شود
// (قبلاً در هر رندر و داخل map() از نو ساخته می‌شد).
const FILTER_KEY_TRANSLATIONS: Record<string, string> = {
  search: "جستجو",
  status: "وضعیت",
  parentId: "والد",
  categoryId: "دسته‌بندی",
  brandId: "برند",
  position: "موقعیت",
};

const FILTER_VALUE_TRANSLATIONS: Record<string, string> = {
  ACTIVE: "فعال",
  INACTIVE: "غیرفعال",
  TOP: "بالا",
  DOWN: "پایین",
  RIGHT: "راست",
};

const pageVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } },
  exit: { opacity: 0, y: -15, transition: { duration: 0.25 } },
};

const formVariants: Variants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 110, damping: 14 } },
  exit: { opacity: 0, scale: 0.98, transition: { duration: 0.25 } },
};

export default function CRUDPage({
  model,
  modelName,
  fields,
  formFields,
  filterFields,
  validationSchema,
  enableStatusToggle = false,
  hiddenOnMobile = [],
  dynamicOptions = {},
  filterTranslations,
}: CRUDPageProps) {
  const router = useRouter();
  const {
    data,
    setData,
    total,
    loading,
    page,
    limit,
    filters,
    showTrash,
    setPage,
    setLimit,
    setFilters,
    setShowTrash,
    refreshList,
    deleteItemLocal,
  } = useCRUD(model, modelName);

  const [mode, setMode] = useState<"list" | "create" | "edit">("list");
  const [editingItem, setEditingItem] = useState<any>(null);

  const [showPalette, setShowPalette] = useState(false);
  const [paletteQuery, setPaletteQuery] = useState("");
  const [paletteIndex, setPaletteIndex] = useState(0);
  const paletteInputRef = useRef<HTMLInputElement>(null);

  const [productStats, setProductStats] = useState({ total: 0, outOfStock: 0, lowStock: 0 });

  const activeFilters = useMemo(() => {
    return Object.entries(filters).filter(
      ([_, value]) => value !== undefined && value !== "" && value !== null
    );
  }, [filters]);

  const enrichedFormFields = useMemo(() => {
    return formFields.map((field) => {
      if ((field.type === "select" || field.type === "tree") && dynamicOptions[field.name]) {
        return {
          ...field,
          options: dynamicOptions[field.name],
        };
      }
      return field;
    });
  }, [formFields, dynamicOptions]);

  const enrichedFilterFields = useMemo(() => {
    return filterFields.map((field) => {
      if (field.type === "select" && field.key && dynamicOptions[field.key]) {
        return {
          ...field,
          options: dynamicOptions[field.key],
        };
      }
      return field;
    });
  }, [filterFields, dynamicOptions]);

  const handleFetchProductStats = useCallback(async () => {
    if (model !== "product") return;
    const res = await getProductStats();
    if (res.success) {
      setProductStats({
        total: res.total,
        outOfStock: res.outOfStock,
        lowStock: res.lowStock,
      });
    }
  }, [model]);

  useEffect(() => {
    handleFetchProductStats();
  }, [handleFetchProductStats, data]);

  const handleRemoveFilter = useCallback((key: string) => {
    setFilters((prev) => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
  }, [setFilters]);

  const handleClearAllFilters = useCallback(() => {
    setFilters({});
  }, [setFilters]);

  const handleTrashToggle = useCallback(() => {
    setShowTrash(prev => !prev);
    setPage(1);
  }, [setShowTrash, setPage]);

  const handleCreate = useCallback(() => setMode("create"), []);
  const handleCancelForm = useCallback(() => {
    setMode("list");
    setEditingItem(null);
  }, []);

  const handleToggleStatus = useCallback(
    async (item: any) => {
      const oldStatus = item.status;
      const newStatus = oldStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";

      setData((prev) =>
        prev.map((d) => (d.id === item.id ? { ...d, status: newStatus } : d))
      );

      const res = await updateItem(model, item.id, { status: newStatus });
      if (!res.success) {
        toast.error(res.error || "خطا در تغییر وضعیت");
        setData((prev) =>
          prev.map((d) => (d.id === item.id ? { ...d, status: oldStatus } : d))
        );
        return;
      }
      toast.success("وضعیت با موفقیت تغییر کرد");

      const hasActiveFilter = Object.values(filters).some(v => v !== undefined && v !== "");
      if (hasActiveFilter) refreshList();
    },
    [model, filters, refreshList, setData]
  );

  const handleDelete = useCallback(
    async (item: any, permanent = false) => {
      const res = await deleteItem(model, item.id, permanent);
      if (!res.success) {
        toast.error(res.error);
        return;
      }
      toast.success(permanent ? `${modelName} به طور دائمی حذف شد` : `${modelName} حذف شد`);
      deleteItemLocal(item.id);
      refreshList();
    },
    [model, modelName, deleteItemLocal, refreshList]
  );

  const handleRestore = useCallback(
    async (item: any) => {
      const res = await restoreItem(model, item.id);
      if (!res.success) {
        toast.error(res.error);
        return;
      }
      toast.success("رکورد با موفقیت بازیابی شد");
      deleteItemLocal(item.id);
      refreshList();
    },
    [model, deleteItemLocal, refreshList]
  );

  const showDeleteConfirm = (item: any, permanent = false) => {
    toast.custom(
      (t) => (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="
            bg-white/95 dark:bg-[#0c0d14]/95
            backdrop-blur-xl
            border border-slate-200/80 dark:border-[#1f2235]/60
            shadow-[0_20px_50px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)]
            rounded-[22px] p-6 w-[350px] text-right overflow-hidden relative
          "
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/10 dark:bg-rose-500/5 rounded-full blur-2xl pointer-events-none -z-10" />

          <div className="flex gap-3.5 items-start mb-4">
            <div className="p-3 bg-rose-50 dark:bg-rose-950/30 rounded-xl text-rose-500">
              <FiAlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-100">
                {permanent ? "حذف دائمی رکورد" : "انتقال به زباله‌دان"}
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                این اقدام ممکن است غیرقابل بازگشت باشد.
              </p>
            </div>
          </div>

          <p className="text-[13px] leading-relaxed mb-5 text-slate-600 dark:text-slate-350">
            آیا از حذف {" "}
            <span className="text-rose-600 dark:text-rose-400 font-bold bg-rose-50 dark:bg-rose-950/20 px-1.5 py-0.5 rounded-md">
              {item.title || item.name || "این آیتم"}
            </span> {" "}
            {permanent ? "به طور دائمی" : ""} اطمینان دارید؟
          </p>

          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              onClick={() => toast.dismiss(t)}
              size="sm"
              className="
                border border-slate-200 dark:border-[#1f2235]/60 
                bg-slate-50 hover:bg-slate-100 dark:bg-[#121420] dark:hover:bg-[#1b1e30]
                text-slate-600 dark:text-slate-300 rounded-xl text-xs font-semibold px-4
              "
            >
              انصراف
            </Button>

            <Button
              variant="danger"
              size="sm"
              withShine
              withRipple
              onClick={async () => {
                toast.dismiss(t);
                await handleDelete(item, permanent);
              }}
              className="shadow-rose-500/15 rounded-xl text-xs font-semibold px-4"
            >
              بله، حذف شود
            </Button>
          </div>
        </motion.div>
      ),
      { duration: Infinity, position: "top-center" }
    );
  };

  const handleEdit = useCallback((item: any) => {
    setEditingItem(item);
    setMode("edit");
  }, []);

  const handleSubmit = useCallback(
    async (values: any) => {
      const res =
        mode === "edit" && editingItem
          ? await updateItem(model, editingItem.id, values)
          : await createItem(model, values);

      if (!res.success) {
        toast.error(res.error);
      } else {
        toast.success(mode === "edit" ? `${modelName} ویرایش شد` : `${modelName} ایجاد شد`);
        setMode("list");
        setEditingItem(null);
        refreshList();
      }
    },
    [mode, editingItem, model, modelName, refreshList]
  );

  const columns = useMemo(
    () =>
      fields.map((field) => ({
        key: field.name,
        label: field.label,
        render: (item: any) => {
          if (field.cellRenderer) return field.cellRenderer(item);
          
          if (!showTrash && field.name === "status" && enableStatusToggle) {
            return (
              <StatusToggle
                checked={item.status === "ACTIVE"}
                onChange={() => handleToggleStatus(item)}
                size="sm"
              />
            );
          }

          const value = item[field.name];

          if ((field.name === "parentId" || field.name === "parent") && dynamicOptions["parentId"]) {
            if (!value || value === "null") {
              return (
                <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
                  اصلی
                </span>
              );
            }
            const parentOpt = dynamicOptions["parentId"].find(opt => String(opt.value) === String(value));
            return (
              <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
                {parentOpt ? parentOpt.label : `شناسه ${value}`}
              </span>
            );
          }

          if (field.type === "date") return value ? new Date(value).toLocaleDateString("fa-IR") : "-";
          if (field.type === "checkbox") return value ? "بله" : "خیر";
          if (field.type === "file" && value) {
            return <img src={value} className="w-24 h-12 object-cover rounded-lg border border-slate-100 dark:border-[#1f2235]/60" alt="preview" />;
          }
          return String(value ?? "-");
        },
      })),
    [fields, showTrash, enableStatusToggle, handleToggleStatus, dynamicOptions]
  );

  const commandItems = useMemo(() => {
    return [
      {
        id: "create",
        label: `ایجاد ${modelName} جدید`,
        shortcut: "C",
        icon: <FiPlus className="h-4 w-4" />,
        action: () => {
          handleCreate();
          setShowPalette(false);
        }
      },
      {
        id: "refresh",
        label: "بروزرسانی و همگام‌سازی لیست با سرور",
        shortcut: "R",
        icon: <FiRefreshCw className="h-4 w-4" />,
        action: () => {
          refreshList();
          setShowPalette(false);
        }
      },
      {
        id: "trash",
        label: showTrash ? "بازگشت به لیست اصلی اطلاعات" : "ورود به بخش زباله‌دان / موارد حذف شده",
        shortcut: "T",
        icon: <FiTrash2 className="h-4 w-4" />,
        action: () => {
          handleTrashToggle();
          setShowPalette(false);
        }
      },
      {
        id: "clear_filters",
        label: "پاکسازی کامل فیلترها و کلمات جستجو شده",
        shortcut: "Del",
        icon: <FiX className="h-4 w-4" />,
        action: () => {
          handleClearAllFilters();
          setShowPalette(false);
        }
      }
    ];
  }, [modelName, showTrash, handleTrashToggle, handleClearAllFilters, refreshList, handleCreate]);

  const filteredCommands = useMemo(() => {
    return commandItems.filter(item => 
      item.label.toLowerCase().includes(paletteQuery.toLowerCase())
    );
  }, [commandItems, paletteQuery]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      
      if ((e.ctrlKey || e.metaKey) && key === "k") {
        e.preventDefault();
        setShowPalette(prev => !prev);
        setPaletteQuery("");
        setPaletteIndex(0);
        return;
      }

      if (showPalette) {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          setPaletteIndex(prev => (prev + 1) % filteredCommands.length);
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          setPaletteIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length);
        } else if (e.key === "Enter") {
          e.preventDefault();
          if (filteredCommands[paletteIndex]) {
            filteredCommands[paletteIndex].action();
          }
        } else if (e.key === "Escape") {
          e.preventDefault();
          setShowPalette(false);
        }
        return;
      }

      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" || 
        target.tagName === "TEXTAREA" || 
        target.isContentEditable
      ) {
        return;
      }

      if (key === "c" && mode === "list" && !showTrash) {
        e.preventDefault();
        handleCreate();
      }
      if (key === "r" && mode === "list") {
        e.preventDefault();
        refreshList();
      }
      if (key === "t" && mode === "list") {
        e.preventDefault();
        handleTrashToggle();
      }
      if (e.key === "Escape" && mode !== "list") {
        e.preventDefault();
        handleCancelForm();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mode, showTrash, refreshList, handleTrashToggle, showPalette, filteredCommands, paletteIndex, handleCreate, handleCancelForm]);

  useEffect(() => {
    if (showPalette) {
      setTimeout(() => paletteInputRef.current?.focus(), 50);
    }
  }, [showPalette]);

  const categoriesCount = dynamicOptions?.categoryId?.length || 0;
  const brandsCount = dynamicOptions?.brandId?.length ? dynamicOptions.brandId.length - 1 : 0;

  const actionCards = useMemo(() => [
    {
      title: "دسته‌بندی‌ها",
      subtitle: "مدیریت دسته‌بندی محصولات",
      link: "/dashboard/content/categories",
      icon: <FiFolder className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />,
      iconBg: "bg-indigo-500/10 dark:bg-indigo-500/15 border border-indigo-500/20 dark:border-indigo-500/20",
      badge: categoriesCount > 0 ? `${toPersianNumber(categoriesCount)} دسته‌بندی فعال` : "بدون دسته‌بندی",
      badgeClass: "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-100/20 dark:border-indigo-500/10"
    },
    {
      title: "برندها",
      subtitle: "مدیریت برندهای محصولات",
      link: "/dashboard/content/product-brands",
      icon: <FiTag className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />,
      iconBg: "bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/20 dark:border-emerald-500/20",
      badge: brandsCount > 0 ? `${toPersianNumber(brandsCount)} برند ثبت شده` : "بدون برند",
      badgeClass: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-100/20 dark:border-emerald-500/10"
    },
    {
      title: "آمار فروش",
      subtitle: "گزارش‌های فروش محصولات",
      link: "/dashboard",
      icon: <FiTrendingUp className="h-5 w-5 text-purple-500 dark:text-purple-400" />,
      iconBg: "bg-purple-500/10 dark:bg-purple-500/15 border border-purple-500/20 dark:border-purple-500/20",
      badge: "بروزرسانی ۲۴ ساعت گذشته",
      badgeClass: "bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border border-purple-100/20 dark:border-purple-500/10"
    },
    {
      title: "موجودی انبار",
      subtitle: "مدیریت موجودی محصولات",
      link: "/dashboard/content/products",
      icon: <FiBox className="h-5 w-5 text-amber-500 dark:text-amber-400" />,
      iconBg: "bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/20 dark:border-amber-500/20",
      badge: productStats.lowStock > 0 ? `${toPersianNumber(productStats.lowStock)} کالا نیاز به شارژ` : "موجودی انبار پایدار",
      badgeClass: productStats.lowStock > 0 
        ? "bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-100/20 dark:border-rose-500/10 animate-pulse" 
        : "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-100/20 dark:border-emerald-500/10"
    }
  ], [categoriesCount, brandsCount, productStats.lowStock]);

  return (
    <div className="min-h-screen relative overflow-hidden">
      
      {/* هاله‌های نوری شناور پس‌زمینه (بلور ملایم) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none -z-10" />

      <div 
        className="absolute top-10 right-[15%] w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-indigo-500/10 dark:bg-indigo-600/5 blur-[120px] pointer-events-none -z-10 animate-pulse"
        style={{ animationDuration: "8s" }}
      />
      <div 
        className="absolute bottom-10 left-[15%] w-80 h-80 sm:w-[450px] sm:h-[450px] rounded-full bg-purple-500/10 dark:bg-[#7c3aed]/5 blur-[140px] pointer-events-none -z-10 animate-pulse"
        style={{ animationDuration: "10s" }}
      />

      <div className={`relative w-full mx-auto p-4 md:p-6 lg:p-8 z-10 transition-all duration-500 ${
        mode === "list" ? "max-w-[1400px]" : "max-w-full"
      }`}>
        <AnimatePresence mode="wait">
          {mode === "list" && (
            <motion.div
              key="list"
              variants={pageVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-6"
            >
              {/* هدر صفحه */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2 border-b border-slate-100/80 dark:border-[#1f2235]/40">
                <div className="space-y-1.5 text-right">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="hidden sm:flex items-center justify-center h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-[0_4px_20px_rgba(99,102,241,0.35)] shrink-0">
                      <FiDatabase className="h-4.5 w-4.5" />
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-slate-600 dark:from-white dark:via-slate-200 dark:to-slate-400 bg-clip-text text-transparent">
                      مدیریت {modelName}
                    </h1>
                    
                    <button
                      onClick={refreshList}
                      disabled={loading}
                      title="به‌روزرسانی همزمان اطلاعات (R)"
                      aria-label="به‌روزرسانی لیست"
                      className="p-2 rounded-xl border border-slate-200/60 dark:border-[#1f2235]/50 bg-white/50 dark:bg-[#121420]/40 hover:bg-slate-100 dark:hover:bg-[#1b1e30] transition-all duration-300 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 flex items-center gap-1 disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50"
                    >
                      <FiRefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin text-indigo-500" : ""}`} />
                      <kbd className="hidden sm:inline-flex items-center justify-center px-1 py-0.5 rounded border border-slate-200 dark:border-[#1f2235] bg-slate-50 dark:bg-[#121420] text-[8px] font-mono">R</kbd>
                    </button>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-500 leading-relaxed font-medium">
                    {showTrash 
                      ? `سطل زباله / بازگردانی یا حذف نهایی رکوردهای ${modelName}` 
                      : `ایجاد، ویرایش، حذف و کنترل تمام اطلاعات مربوط به ${modelName}`}
                  </p>
                </div>
                
                <div className="flex gap-3 flex-wrap items-center">
                  <TrashButton showTrash={showTrash} onClick={handleTrashToggle} />
                  {!showTrash && <CreateButton onClick={handleCreate} label={`ایجاد ${modelName} جدید`} />}
                </div>
              </div>

              {/* کارت‌های آماری بالایی */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {model === "product" ? (
                  <>
                    <StatCard
                      label="کل محصولات فعال"
                      value={toPersianNumber(productStats.total)}
                      loading={loading}
                      glowColor="rgba(59, 130, 246, 0.15)"
                      iconBg="bg-blue-500/5 dark:bg-blue-500/10 text-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.05)]"
                      icon={<FiDatabase className="h-5 w-5" />}
                    />
                    <StatCard
                      label="کالاهای ناموجود"
                      value={toPersianNumber(productStats.outOfStock)}
                      loading={loading}
                      glowColor="rgba(239, 68, 68, 0.15)"
                      iconBg="bg-rose-500/5 dark:bg-rose-500/10 text-rose-500 shadow-[0_0_15px_rgba(239,68,68,0.05)]"
                      icon={<FiAlertTriangle className="h-5 w-5" />}
                      valueClassName="text-rose-600 dark:text-rose-400"
                    />
                    <StatCard
                      label="رو به اتمام (کمتر از ۴ عدد)"
                      value={toPersianNumber(productStats.lowStock)}
                      loading={loading}
                      glowColor="rgba(245, 158, 11, 0.15)"
                      iconBg="bg-amber-500/5 dark:bg-amber-500/10 text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.05)]"
                      icon={<FiInfo className="h-5 w-5" />}
                      valueClassName="text-amber-500 dark:text-amber-450"
                    />
                  </>
                ) : (
                  <>
                    <StatCard
                      label="تعداد رکوردهای منطبق"
                      value={toPersianNumber(total)}
                      loading={loading}
                      glowColor="rgba(99, 102, 241, 0.15)"
                      iconBg="bg-indigo-500/5 dark:bg-indigo-500/10 text-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.05)]"
                      icon={<FiDatabase className="h-5 w-5" />}
                    />
                    <StatCard
                      label="نمایش در این صفحه"
                      value={toPersianNumber(data.length)}
                      loading={loading}
                      glowColor="rgba(16, 185, 129, 0.15)"
                      iconBg="bg-emerald-500/5 dark:bg-emerald-500/10 text-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.05)]"
                      icon={<FiList className="h-5 w-5" />}
                    />

                    <SpotlightCard glowColor="rgba(245, 158, 11, 0.15)">
                      <div className="space-y-1 w-2/3">
                        <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold block">مخزن اطلاعاتی فعال</span>
                        <span className="pt-1 text-base sm:text-lg font-bold text-slate-700 dark:text-slate-200 block truncate">
                          {showTrash ? "بخش سطل زباله" : "مخزن اصلی فعال"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="relative flex h-3.5 w-3.5">
                          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${showTrash ? "bg-amber-400" : "bg-emerald-400"}`}></span>
                          <span className={`relative inline-flex rounded-full h-3.5 w-3.5 ${showTrash ? "bg-amber-500" : "bg-emerald-500"}`}></span>
                        </span>
                      </div>
                    </SpotlightCard>
                  </>
                )}
              </div>

              {/* نوار فیلتر */}
              <div className="w-full">
                <GenericFilterBar fields={enrichedFilterFields} filters={filters} onChange={setFilters} />
              </div>

              {/* تگ‌های فیلترهای فعال */}
              <AnimatePresence>
                {activeFilters.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, y: -10 }}
                    animate={{ opacity: 1, height: "auto", y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="flex flex-wrap items-center gap-2 p-3.5 rounded-2xl bg-slate-100/40 dark:bg-[#121420]/40 border border-slate-200/60 dark:border-[#1f2235]/60 text-xs text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1 font-bold text-slate-700 dark:text-slate-300">
                        <FiFilter className="h-3.5 w-3.5" />
                        فیلترهای فعال:
                      </span>
                      
                      {activeFilters.map(([key, value]) => {
                        const filterField = enrichedFilterFields.find((f) => f.key === key);
                        const displayKey = filterTranslations?.keys?.[key] || FILTER_KEY_TRANSLATIONS[key] || filterField?.placeholder || filterField?.label || key;
                        let displayValue = filterTranslations?.values?.[String(value)] || FILTER_VALUE_TRANSLATIONS[String(value)] || String(value);

                        if (filterField?.options) {
                          const option = filterField.options.find((opt) => String(opt.value) === String(value));
                          if (option) {
                            displayValue = option.label;
                          }
                        }

                        return (
                          <div 
                            key={key}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white dark:bg-[#0c0d14] border border-slate-200 dark:border-[#1f2235] shadow-sm text-xs font-semibold"
                          >
                            <span>{displayKey}: {displayValue}</span>
                            <button
                              onClick={() => handleRemoveFilter(key)}
                              className="p-0.5 rounded-md hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400 transition-colors"
                              title="حذف فیلتر"
                            >
                              <FiX className="h-3 w-3" />
                            </button>
                          </div>
                        );
                      })}

                      <button
                        onClick={handleClearAllFilters}
                        className="mr-auto text-rose-500 hover:text-rose-600 dark:text-rose-400 dark:hover:text-rose-300 font-extrabold transition-colors hover:underline text-xs"
                      >
                        پاکسازی همه فیلترها
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* اعلان بخش سطل زباله */}
              {showTrash && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2.5 p-4 rounded-2xl bg-amber-500/5 dark:bg-amber-400/5 border border-amber-500/10 dark:border-amber-400/10 text-amber-600 dark:text-amber-450 text-xs sm:text-sm leading-relaxed"
                >
                  <FiInfo className="h-4 w-4 shrink-0" />
                  <span>شما در بخش زباله‌دان هستید. می‌توانید اطلاعات قدیمی را برای بازیابی به لیست اصلی "بازیابی" کرده یا آن‌ها را برای همیشه حذف کنید.</span>
                </motion.div>
              )}

              {/* لیست نهایی داده‌ها */}
              <div className="[&_thead_th]:text-center [&_thead_th]:justify-center [&_thead_th_div]:justify-center [&_tbody_td]:text-right">
                <CRUDList
                  columns={columns}
                  data={data}
                  total={total}
                  page={page}
                  limit={limit}
                  loading={loading}
                  onPageChange={setPage}
                  onLimitChange={setLimit}
                  onEdit={!showTrash ? handleEdit : undefined}
                  onDelete={(item) => showDeleteConfirm(item, false)}
                  onRestore={showTrash ? handleRestore : undefined}
                  onPermanentDelete={showTrash ? (item) => showDeleteConfirm(item, true) : undefined}
                  hiddenOnMobile={hiddenOnMobile}
                />
              </div>

              {/* کارت‌های ناوبری پایینی مخصوص دارک‌مود */}
              {model === "product" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8 pt-8 border-t border-slate-200/50 dark:border-[#1f2235]/60">
                  {actionCards.map((card, idx) => (
                    <div
                      key={idx}
                      onClick={() => router.push(card.link)}
                      className="
                        relative group/card cursor-pointer rounded-2xl p-5 overflow-hidden 
                        bg-white/60 dark:bg-[#121420]/40 
                        backdrop-blur-xl
                        border border-slate-200/50 dark:border-[#1f2235]/50 
                        hover:border-indigo-500/30 dark:hover:border-indigo-500/40
                        shadow-[0_4px_25px_rgba(0,0,0,0.01)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.2)]
                        hover:shadow-[0_12px_40px_rgba(0,0,0,0.03)] dark:hover:shadow-[0_12px_45px_rgba(0,0,0,0.4)]
                        transition-all duration-350 hover:-translate-y-1 flex items-center justify-between
                      "
                    >
                      <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none opacity-0 group-hover/card:opacity-100 transition-opacity duration-300" />

                      <div className="space-y-1 text-right">
                        <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-200 group-hover/card:text-indigo-600 dark:group-hover/card:text-indigo-400 transition-colors">
                          {card.title}
                        </h3>
                        <p className="text-[11px] text-slate-400 dark:text-slate-450 leading-relaxed font-semibold">
                          {card.subtitle}
                        </p>
                        {card.badge && (
                          <span className={`inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-lg text-[9px] font-bold border ${card.badgeClass}`}>
                            {card.badge}
                          </span>
                        )}
                      </div>

                      <div className={`p-3.5 rounded-2xl ${card.iconBg} group-hover/card:scale-105 transition-all duration-300 flex items-center justify-center shrink-0`}>
                        {card.icon}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* فرم ایجاد / ویرایش */}
          {(mode === "create" || mode === "edit") && (
            <motion.div
              key="form"
              variants={formVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full"
            >
              <CRUDEditForm
                mode={mode}
                key={editingItem?.id ?? "create"}
                title={mode === "create" ? `ایجاد ${modelName} جدید` : `ویرایش اطلاعات ${modelName}`}
                initialValues={editingItem ?? undefined}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
                onCancel={handleCancelForm}
                fields={enrichedFormFields}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* پنل راهنمای میانبرها */}
        <div className="fixed bottom-6 left-6 z-50 group/legend">
          <div className="relative">
            <div className="
              absolute bottom-0 left-0 p-4 w-60 rounded-2xl
              bg-white/95 dark:bg-[#0c0d14]/95 backdrop-blur-xl
              border border-slate-200 dark:border-[#1f2235]/80
              shadow-2xl transition-all duration-300 origin-bottom-left
              opacity-0 translate-y-4 pointer-events-none scale-90
              group-hover/legend:opacity-100 group-hover/legend:translate-y-0 group-hover/legend:pointer-events-auto group-hover/legend:scale-100
              text-right space-y-3
            ">
              <h4 className="text-xs font-extrabold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-[#1f2235]/50 pb-2 flex items-center justify-between">
                <span>میانبرهای کیبورد</span>
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping" />
              </h4>
              <ul className="text-[11px] text-slate-500 dark:text-slate-400 space-y-2 font-medium">
                <li className="flex justify-between items-center">
                  <span>ایجاد مورد جدید</span>
                  <kbd className="px-1.5 py-0.5 rounded border border-slate-200/60 bg-slate-50 dark:bg-[#121420] font-mono text-[9px] font-bold">C</kbd>
                </li>
                <li className="flex justify-between items-center">
                  <span>همگام‌سازی و بروزرسانی</span>
                  <kbd className="px-1.5 py-0.5 rounded border border-slate-200/60 bg-slate-50 dark:bg-[#121420] font-mono text-[9px] font-bold">R</kbd>
                </li>
                <li className="flex justify-between items-center">
                  <span>سوئیچ سطل زباله</span>
                  <kbd className="px-1.5 py-0.5 rounded border border-slate-200/60 bg-slate-50 dark:bg-[#121420] font-mono text-[9px] font-bold">T</kbd>
                </li>
                <li className="flex justify-between items-center">
                  <span>بستن فرم / انصراف</span>
                  <kbd className="px-1.5 py-0.5 rounded border border-slate-200/60 bg-slate-50 dark:bg-[#121420] font-mono text-[9px] font-bold">Esc</kbd>
                </li>
                <li className="flex justify-between items-center text-indigo-500">
                  <span>جستجوی پیشرفته</span>
                  <kbd className="px-1.5 py-0.5 rounded border border-indigo-200 dark:border-indigo-950 bg-indigo-50 dark:bg-indigo-950/20 font-mono text-[9px] font-bold">Ctrl+K</kbd>
                </li>
              </ul>
            </div>
            
            <button
              aria-label="نمایش راهنمای میانبرهای کیبورد"
              className="
              p-3 rounded-full shadow-lg
              bg-white dark:bg-[#0c0d14] text-slate-400 dark:text-slate-500
              hover:text-slate-700 dark:hover:text-slate-300
              border border-slate-200 dark:border-[#1f2235]/80
              backdrop-blur-sm transition-all duration-300 hover:scale-105 active:scale-95
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50
            ">
              <FiHelpCircle className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* جعبه میانبرهای پیشرفته کلاینت */}
        <AnimatePresence>
          {showPalette && (
            <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowPalette(false)}
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.97, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97, y: -10 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className="
                  relative w-full max-w-[550px] mx-4 rounded-2xl overflow-hidden text-right
                  bg-white/95 dark:bg-[#0c0d14]/95 backdrop-blur-xl
                  border border-slate-200 dark:border-[#1f2235]
                  shadow-[0_24px_60px_rgba(0,0,0,0.15)] dark:shadow-[0_24px_60px_rgba(0,0,0,0.5)]
                  z-10
                "
              >
                <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100 dark:border-[#1f2235]/50">
                  <FiSearch className="h-4.5 w-4.5 text-slate-400 dark:text-slate-500 shrink-0" />
                  <input
                    ref={paletteInputRef}
                    type="text"
                    aria-label="جستجوی دستورات"
                    value={paletteQuery}
                    onChange={(e) => {
                      setPaletteQuery(e.target.value);
                      setPaletteIndex(0);
                    }}
                    placeholder="عملیات یا میانبری را جستجو کنید..."
                    className="
                      w-full bg-transparent border-none outline-none text-sm
                      text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600
                      focus:ring-0
                    "
                  />
                  <kbd className="hidden sm:inline-flex items-center justify-center px-1.5 py-0.5 rounded border border-slate-200 dark:border-[#1f2235] bg-slate-50 dark:bg-[#121420] text-[9px] font-mono text-slate-400">Esc</kbd>
                </div>

                <div className="p-2 max-h-[300px] overflow-y-auto space-y-1">
                  {filteredCommands.length === 0 ? (
                    <div className="text-center py-8 text-xs text-slate-400 dark:text-slate-600 font-semibold">
                      دستوری با این عنوان یافت نشد
                    </div>
                  ) : (
                    filteredCommands.map((item, idx) => {
                      const isSelected = paletteIndex === idx;
                      return (
                        <div
                          key={item.id}
                          onClick={item.action}
                          onMouseEnter={() => setPaletteIndex(idx)}
                          className={`
                            flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-200
                            ${isSelected 
                              ? "bg-indigo-500/10 dark:bg-indigo-400/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 dark:border-indigo-400/20" 
                              : "text-slate-600 dark:text-slate-400 border border-transparent hover:bg-slate-50 dark:hover:bg-[#1b1e30]/50"
                            }
                          `}
                        >
                          <div className="flex items-center gap-3">
                            <span className={isSelected ? "text-indigo-500" : "text-slate-400"}>
                              {item.icon}
                            </span>
                            <span className="text-xs sm:text-sm font-semibold">{item.label}</span>
                          </div>
                          
                          <div className="flex items-center gap-1.5">
                            {isSelected && (
                              <span className="text-[10px] text-indigo-400 dark:text-indigo-500 flex items-center gap-0.5 font-bold">
                                <FiCornerDownLeft className="h-3 w-3" />
                                اجرا
                              </span>
                            )}
                            <kbd className={`
                              px-1.5 py-0.5 rounded text-[9px] font-mono font-bold
                              ${isSelected 
                                ? "border border-indigo-300 dark:border-indigo-800 bg-indigo-500/5 text-indigo-500" 
                                : "border border-slate-200 dark:border-[#1f2235] bg-slate-50 dark:bg-[#121420] text-slate-400"
                              }
                            `}>
                              {item.shortcut}
                            </kbd>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                <div className="px-4 py-2 bg-slate-50/50 dark:bg-[#121420]/20 border-t border-slate-100 dark:border-[#1f2235]/50 flex justify-between items-center text-[10px] text-slate-400 dark:text-slate-550 font-bold">
                  <span>برای حرکت از جهت‌نماها و برای انتخاب از Enter استفاده کنید</span>
                  <span>CMD+K</span>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}