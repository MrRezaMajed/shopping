// @/components/ui/CRUDPage/CRUDPage.tsx

"use client";
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { 
  FiTrash2, 
  FiList, 
  FiPlus, 
  FiAlertTriangle, 
  FiInfo, 
  FiDatabase, 
  FiX,
  FiRefreshCw
} from "react-icons/fi";
import { motion, AnimatePresence, Variants } from "framer-motion";
import CRUDList from "@/components/ui/CRUDList/CRUDList";
import StatusToggle from "@/components/ui/DataTable/StatusToggle";
import GenericFilterBar from "@/components/ui/GenericFilterBar/GenericFilterBar";
import { toPersianNumber } from "@/lib/utils/persianNumbers";
import { useCRUD } from "./hooks/useCRUD";
import { CRUDPageProps } from "./types";
import { StatCard } from "./StatCard";
import { SpotlightCard } from "./SpotlightCard";
import { TrashButton } from "./TrashButton";
import { CreateButton } from "./CreateButton";
import { KeyboardHelpLegend } from "./KeyboardHelpLegend";
import { CommandPalette } from "./CommandPalette";
import { ActiveFilters } from "./ActiveFilters";
import { CRUDPageHeader } from "./CRUDPageHeader";
import { NavigationCards } from "./NavigationCards";

import { useNotification } from "@/context/NotificationContext";

import {
  updateItem,
  deleteItem,
  restoreItem,
  getProductStats,
} from "@/app/actions/crud/crudActions";

const pageVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } },
  exit: { opacity: 0, y: -15, transition: { duration: 0.25 } },
};

// تابع کمکی تبدیل هوشمند مدل به پارامتر جمع آدرس (مثلاً product به products)
const getPluralModelParam = (model: string): string => {
  const map: Record<string, string> = {
    category: "categories",
    product: "products",
    brand: "brands",
    banner: "banners",
    post: "posts"
  };
  return map[model] || model;
};

export default function CRUDPage({
  model,
  modelName,
  fields,
  filterFields,
  enableStatusToggle = false,
  hiddenOnMobile = [],
  dynamicOptions = {},
  filterTranslations,
}: Omit<CRUDPageProps, "formFields" | "validationSchema">) {
  
  const router = useRouter();
  const { confirm, addNotification } = useNotification();
  const pluralModel = useMemo(() => getPluralModelParam(model), [model]);

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

  const [showPalette, setShowPalette] = useState(false);
  const [paletteQuery, setPaletteQuery] = useState("");
  const [paletteIndex, setPaletteIndex] = useState(0);
  const paletteInputRef = useRef<HTMLInputElement>(null);
  const [productStats, setProductStats] = useState({ total: 0, outOfStock: 0, lowStock: 0 });

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

  // روت داینامیک جدید برای ایجاد مورد جدید
  const handleCreate = useCallback(() => {
    router.push(`/panel/${pluralModel}/create`);
  }, [router, pluralModel]);

  // روت داینامیک جدید برای ویرایش
  const handleEdit = useCallback((item: any) => {
    router.push(`/panel/${pluralModel}/edit/${item.id}`);
  }, [router, pluralModel]);

  const handleToggleStatus = useCallback(
    async (item: any) => {
      const oldStatus = item.status;
      const newStatus = oldStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";

      setData((prev) =>
        prev.map((d) => (d.id === item.id ? { ...d, status: newStatus } : d))
      );

      const res = await updateItem(model, item.id, { status: newStatus });
      if (!res.success) {
        addNotification({
          type: "error",
          title: "خطا در تغییر وضعیت",
          message: res.error || "خطا در تغییر وضعیت رخ داد.",
          duration: 4000,
        });
        setData((prev) =>
          prev.map((d) => (d.id === item.id ? { ...d, status: oldStatus } : d))
        );
        return;
      }
      addNotification({
        type: "success",
        title: "بروزرسانی موفق",
        message: "وضعیت با موفقیت تغییر کرد.",
        duration: 4000,
      });

      const hasActiveFilter = Object.values(filters).some(v => v !== undefined && v !== "");
      if (hasActiveFilter) refreshList();
    },
    [model, filters, refreshList, setData, addNotification]
  );

  const handleDelete = useCallback(
    async (item: any, permanent = false) => {
      const res = await deleteItem(model, item.id, permanent);
      if (!res.success) {
        addNotification({
          type: "error",
          title: "خطا در حذف اطلاعات",
          message: res.error || "حذف رخ داد.",
          duration: 4500,
        });
        return;
      }
      addNotification({
        type: "success",
        title: "حذف موفق",
        message: permanent ? `${modelName} به طور دائمی حذف شد` : `${modelName} با موفقیت حذف شد`,
        duration: 4000,
      });
      deleteItemLocal(item.id);
      refreshList();
    },
    [model, modelName, deleteItemLocal, refreshList, addNotification]
  );

  const handleRestore = useCallback(
    async (item: any) => {
      const res = await restoreItem(model, item.id);
      if (!res.success) {
        addNotification({
          type: "error",
          title: "خطا در بازیابی",
          message: res.error || "بازیابی رخ داد.",
          duration: 4500,
        });
        return;
      }
      addNotification({
        type: "success",
        title: "بازیابی موفق",
        message: "رکورد با موفقیت بازیابی شد.",
        duration: 4000,
      });
      deleteItemLocal(item.id);
      refreshList();
    },
    [model, deleteItemLocal, refreshList, addNotification]
  );

  const showDeleteConfirm = async (item: any, permanent = false) => {
    const isConfirmed = await confirm({
      title: permanent ? "حذف دائمی رکورد" : "انتقال به زباله‌دان",
      message: `آیا از حذف "${item.title || item.name || "این آیتم"}" ${permanent ? "به طور دائمی" : ""} اطمینان دارید؟`,
      confirmText: "بله، حذف شود",
      cancelText: "انصراف",
      type: "error",
    });

    if (isConfirmed) {
      await handleDelete(item, permanent);
    }
  };

  const columns = useMemo(
    () =>
      fields.map((field) => ({
        key: field.name,
        label: field.label,
        render: (item: any) => {
          if (field.cellRenderer) return field.cellRenderer(item, refreshList);
          
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
    [fields, showTrash, enableStatusToggle, handleToggleStatus, dynamicOptions, refreshList]
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
        label: "بروزرسانی لیست",
        shortcut: "R",
        icon: <FiRefreshCw className="h-4 w-4" />,
        action: () => {
          refreshList();
          setShowPalette(false);
        }
      },
      {
        id: "trash",
        label: showTrash ? "بازگشت به لیست اصلی" : "مشاهده سطل زباله",
        shortcut: "T",
        icon: <FiTrash2 className="h-4 w-4" />,
        action: () => {
          handleTrashToggle();
          setShowPalette(false);
        }
      },
      {
        id: "clear_filters",
        label: "پاکسازی کامل فیلترها",
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

      if (key === "c" && !showTrash) {
        e.preventDefault();
        handleCreate();
      }
      if (key === "r") {
        e.preventDefault();
        refreshList();
      }
      if (key === "t") {
        e.preventDefault();
        handleTrashToggle();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [showTrash, refreshList, handleTrashToggle, showPalette, filteredCommands, paletteIndex, handleCreate]);

  useEffect(() => {
    if (showPalette) {
      setTimeout(() => paletteInputRef.current?.focus(), 50);
    }
  }, [showPalette]);

  const categoriesCount = dynamicOptions?.categoryId?.length || 0;
  const brandsCount = dynamicOptions?.brandId?.length ? dynamicOptions.brandId.length - 1 : 0;

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none -z-10" />

      <div 
        className="absolute top-10 right-[15%] w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-indigo-500/10 dark:bg-indigo-600/5 blur-[120px] pointer-events-none -z-10 animate-pulse"
        style={{ animationDuration: "8s" }}
      />
      <div 
        className="absolute bottom-10 left-[15%] w-80 h-80 sm:w-[450px] sm:h-[450px] rounded-full bg-purple-500/10 dark:bg-[#7c3aed]/5 blur-[140px] pointer-events-none -z-10 animate-pulse"
        style={{ animationDuration: "10s" }}
      />

      <div className="relative w-full mx-auto p-4 md:p-6 lg:p-8 z-10 transition-all duration-500 max-w-[1400px]">
        <AnimatePresence mode="wait">
          <motion.div
            key="list"
            variants={pageVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-6"
          >
            <CRUDPageHeader
              modelName={modelName}
              loading={loading}
              showTrash={showTrash}
              onRefresh={refreshList}
            >
              <TrashButton showTrash={showTrash} onClick={handleTrashToggle} />
              {!showTrash && <CreateButton onClick={handleCreate} label={`ایجاد ${modelName} جدید`} />}
            </CRUDPageHeader>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {model === "product" ? (
                <>
                  <StatCard
                    label="کل محصولات فعال"
                    value={toPersianNumber(productStats.total)}
                    loading={loading}
                    glowColor="rgba(59, 130, 246, 0.15)"
                    iconBg="bg-blue-500/5 dark:bg-blue-500/10 text-blue-500"
                    icon={<FiDatabase className="h-5 w-5" />}
                  />
                  <StatCard
                    label="کالاهای ناموجود"
                    value={toPersianNumber(productStats.outOfStock)}
                    loading={loading}
                    glowColor="rgba(239, 68, 68, 0.15)"
                    iconBg="bg-rose-500/5 dark:bg-rose-500/10 text-rose-500"
                    icon={<FiAlertTriangle className="h-5 w-5" />}
                    valueClassName="text-rose-600 dark:text-rose-400"
                  />
                  <StatCard
                    label="رو به اتمام (کمتر از ۴ عدد)"
                    value={toPersianNumber(productStats.lowStock)}
                    loading={loading}
                    glowColor="rgba(245, 158, 11, 0.15)"
                    iconBg="bg-amber-500/5 dark:bg-amber-500/10 text-amber-500"
                    icon={<FiInfo className="h-5 w-5" />}
                    valueClassName="text-amber-500"
                  />
                </>
              ) : (
                <>
                  <StatCard
                    label="تعداد رکوردهای منطبق"
                    value={toPersianNumber(total)}
                    loading={loading}
                    glowColor="rgba(99, 102, 241, 0.15)"
                    iconBg="bg-indigo-500/5 dark:bg-indigo-500/10 text-indigo-500"
                    icon={<FiDatabase className="h-5 w-5" />}
                  />
                  <StatCard
                    label="نمایش در این صفحه"
                    value={toPersianNumber(data.length)}
                    loading={loading}
                    glowColor="rgba(16, 185, 129, 0.15)"
                    iconBg="bg-emerald-500/5 dark:bg-emerald-500/10 text-emerald-500"
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

            <div className="w-full">
              <GenericFilterBar fields={enrichedFilterFields} filters={filters} onChange={setFilters} />
            </div>

            <ActiveFilters
              filters={filters}
              filterFields={enrichedFilterFields}
              onRemove={handleRemoveFilter}
              onClearAll={handleClearAllFilters}
              filterTranslations={filterTranslations}
            />

            {showTrash && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2.5 p-4 rounded-2xl bg-amber-500/5 dark:bg-amber-400/5 border border-amber-500/10 text-amber-600 dark:text-amber-450 text-xs sm:text-sm"
              >
                <FiInfo className="h-4 w-4 shrink-0" />
                <span>شما در بخش زباله‌دان هستید. می‌توانید اطلاعات قدیمی را بازیابی یا به طور دائمی حذف کنید.</span>
              </motion.div>
            )}

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

            {model === "product" && (
              <NavigationCards
                categoriesCount={categoriesCount}
                brandsCount={brandsCount}
                lowStockCount={productStats.lowStock}
              />
            )}
          </motion.div>
        </AnimatePresence>

        <KeyboardHelpLegend />

        <AnimatePresence>
          <CommandPalette
            isOpen={showPalette}
            onClose={() => setShowPalette(false)}
            query={paletteQuery}
            onQueryChange={setPaletteQuery}
            filteredCommands={filteredCommands}
            selectedIndex={paletteIndex}
            onSelectedIndexChange={setPaletteIndex}
            inputRef={paletteInputRef}
          />
        </AnimatePresence>
      </div>
    </div>
  );
}