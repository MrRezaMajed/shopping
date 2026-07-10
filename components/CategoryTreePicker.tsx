// components/CategoryTreePicker.tsx
"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronDown, FiChevronLeft, FiFolder, FiCheck, FiSearch } from "react-icons/fi";
import { useField } from "formik";

interface CategoryNode {
  id: number;
  name: string;
  parentId: number | null;
  children?: CategoryNode[];
  status?: string;
}

interface CategoryTreePickerProps {
  name: string;
  label?: string;
  categories: CategoryNode[];
  placeholder?: string;
  searchable?: boolean;
  className?: string;
}

// ===== تابع تبدیل داده‌های مسطح به درخت =====
const buildTree = (items: CategoryNode[], parentId: number | null = null): CategoryNode[] => {
  return items
    .filter(item => item.parentId === parentId)
    .map(item => ({
      ...item,
      children: buildTree(items, item.id),
    }));
};

// ===== گره درختی =====
const TreeNode = ({
  node,
  level = 0,
  selectedId,
  onSelect,
  expandedIds,
  toggleExpand,
  searchQuery = "",
}: {
  node: CategoryNode;
  level: number;
  selectedId: number | null;
  onSelect: (id: number) => void;
  expandedIds: Set<number>;
  toggleExpand: (id: number) => void;
  searchQuery?: string;
}) => {
  const hasChildren = node.children && node.children.length > 0;
  const isExpanded = expandedIds.has(node.id);
  const isSelected = selectedId === node.id;

  // اگر جستجو فعال است و نام گره با آن مطابقت ندارد، اما فرزندش مطابقت دارد، نمایش داده شود
  const shouldShow = searchQuery ? node.name.includes(searchQuery) || (node.children && node.children.some(c => c.name.includes(searchQuery))) : true;

  if (!shouldShow) return null;

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2 }}
        className={`
          flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer
          transition-all duration-200
          ${isSelected 
            ? "bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/50" 
            : "hover:bg-slate-50 dark:hover:bg-zinc-800/50 text-slate-700 dark:text-zinc-300 border border-transparent"
          }
          ${node.status === "INACTIVE" ? "opacity-50" : ""}
        `}
        style={{ paddingRight: `${level * 28 + 12}px` }}
        onClick={() => onSelect(node.id)}
      >
        {/* دکمه گسترش */}
        {hasChildren ? (
          <button
            onClick={(e) => { e.stopPropagation(); toggleExpand(node.id); }}
            className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors"
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
        <span className="flex-1 text-sm font-medium">
          {node.name}
          {node.status === "INACTIVE" && (
            <span className="mr-2 text-[10px] text-rose-400 bg-rose-50 dark:bg-rose-950/30 px-2 py-0.5 rounded-full">
              غیرفعال
            </span>
          )}
          {hasChildren && (
            <span className="mr-2 text-[10px] text-slate-400 bg-slate-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full">
              {node.children!.length}
            </span>
          )}
        </span>

        {/* نشانگر انتخاب */}
        {isSelected && (
          <FiCheck className="w-4 h-4 text-indigo-500 flex-shrink-0" />
        )}
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
                selectedId={selectedId}
                onSelect={onSelect}
                expandedIds={expandedIds}
                toggleExpand={toggleExpand}
                searchQuery={searchQuery}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ===== کامپوننت اصلی =====
export default function CategoryTreePicker({
  name,
  label,
  categories,
  placeholder = "انتخاب دسته‌بندی",
  searchable = true,
  className = "",
}: CategoryTreePickerProps) {
  const [field, meta, helpers] = useField(name);
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");

  // ساخت درخت از داده‌های مسطح (اگر داده‌ها از قبل درختی نباشند)
  const treeData = useMemo(() => {
    // اگر داده‌ها از قبل ساختار درختی دارند
    if (categories.length > 0 && 'children' in categories[0]) {
      return categories;
    }
    // در غیر این صورت، از داده‌های مسطح درخت می‌سازیم
    return buildTree(categories);
  }, [categories]);

  // یافتن گره انتخاب شده
  const selectedNode = useMemo(() => {
    const findNode = (nodes: CategoryNode[], id: number): CategoryNode | null => {
      for (const node of nodes) {
        if (node.id === id) return node;
        if (node.children) {
          const found = findNode(node.children, id);
          if (found) return found;
        }
      }
      return null;
    };
    if (field.value) {
      return findNode(treeData, Number(field.value));
    }
    return null;
  }, [treeData, field.value]);

  // مقداردهی اولیه: گره‌های مسیر انتخاب شده را باز کن
  useMemo(() => {
    if (field.value) {
      const findPath = (nodes: CategoryNode[], id: number): number[] => {
        for (const node of nodes) {
          if (node.id === id) return [node.id];
          if (node.children) {
            const path = findPath(node.children, id);
            if (path.length > 0) return [node.id, ...path];
          }
        }
        return [];
      };
      
      const path = findPath(treeData, Number(field.value));
      if (path.length > 0) {
        setExpandedIds(prev => new Set([...prev, ...path]));
      }
    }
  }, [treeData, field.value]);

  const toggleExpand = (id: number) => {
    setExpandedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleSelect = (id: number) => {
    helpers.setValue(id);
    helpers.setTouched(true);
  };

  // فیلتر کردن گره‌ها بر اساس جستجو
  const filterNodes = (nodes: CategoryNode[], query: string): CategoryNode[] => {
    if (!query.trim()) return nodes;
    return nodes
      .map(node => ({
        ...node,
        children: node.children ? filterNodes(node.children, query) : [],
      }))
      .filter(node => 
        node.name.includes(query) || (node.children && node.children.length > 0)
      );
  };

  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return treeData;
    return filterNodes(treeData, searchQuery);
  }, [treeData, searchQuery]);

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wide block">
          {label}
        </label>
      )}
      
      {/* باکس جستجو (اختیاری) */}
      {searchable && (
        <div className="relative">
          <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="جستجو در دسته‌بندی‌ها..."
            className="
              w-full p-2.5 pr-10 rounded-xl text-sm
              border border-slate-200 dark:border-zinc-800
              bg-white/40 dark:bg-zinc-950/20
              focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20
              outline-none transition-all
              placeholder:text-slate-400 dark:placeholder:text-zinc-600
              text-slate-800 dark:text-zinc-100
            "
          />
        </div>
      )}

      {/* درخت */}
      <div className="
        border border-slate-200 dark:border-zinc-800 
        rounded-xl overflow-hidden
        bg-white/40 dark:bg-zinc-950/20
        max-h-72 overflow-y-auto
        divide-y divide-slate-100 dark:divide-zinc-900/60
      ">
        {filteredData.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-400 dark:text-zinc-500">
            {searchQuery ? "هیچ دسته‌بندی با این نام یافت نشد" : "هیچ دسته‌بندی تعریف نشده است"}
          </div>
        ) : (
          filteredData.map((node) => (
            <TreeNode
              key={node.id}
              node={node}
              level={0}
              selectedId={field.value ? Number(field.value) : null}
              onSelect={handleSelect}
              expandedIds={expandedIds}
              toggleExpand={toggleExpand}
              searchQuery={searchQuery}
            />
          ))
        )}
      </div>

      {/* نمایش انتخاب شده */}
      {selectedNode && (
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800/50">
          <FiCheck className="w-4 h-4 text-indigo-500" />
          <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
            انتخاب شده: {selectedNode.name}
          </span>
          {selectedNode.parentId !== null && (
            <span className="text-xs text-indigo-400 dark:text-indigo-500">
              (شاخه: {(() => {
                const findParent = (nodes: CategoryNode[], id: number | null): string => {
                  if (id === null) return "ریشه";
                  for (const node of nodes) {
                    if (node.id === id) return node.name;
                    if (node.children) {
                      const result = findParent(node.children, id);
                      if (result !== "ریشه") return result;
                    }
                  }
                  return "ریشه";
                };
                return findParent(treeData, selectedNode.parentId);
              })()})
            </span>
          )}
        </div>
      )}

      {/* خطا */}
      {meta.touched && meta.error && (
        <p className="text-rose-500 dark:text-rose-400 text-xs font-bold mt-1.5 flex items-center gap-1">
          <span className="w-1 h-1 rounded-full bg-rose-500 shrink-0" />
          {meta.error}
        </p>
      )}
    </div>
  );
}