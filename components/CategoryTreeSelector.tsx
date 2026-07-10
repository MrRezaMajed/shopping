"use client";

import { useState, useMemo, useEffect } from "react";
import { useFormikContext } from "formik";
import { 
  FiChevronDown, 
  FiChevronUp, 
  FiFolderPlus, 
  FiFolderMinus, 
  FiFileText, 
  FiSearch, 
  FiX 
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

interface FlatCategory {
  value: string;
  label: string;
  parentId?: number | string | null;
}

interface TreeSelectorProps {
  name: string;
  options: FlatCategory[];
  currentId?: number | string | null;
}

interface TreeNode {
  id: string;
  name: string;
  parentId: string | null;
  children: TreeNode[];
}

export default function CategoryTreeSelector({ name, options }: TreeSelectorProps) {
  const { values, setFieldValue } = useFormikContext<any>();
  const selectedValue = values[name];
  
  const [searchQuery, setSearchQuery] = useState("");

  const treeData = useMemo(() => {
    const buildTree = (parentId: string | null = null): TreeNode[] => {
      return options
        .filter((opt) => {
          const optParent = opt.parentId === undefined ? null : String(opt.parentId);
          const targetParent = parentId === null ? null : String(parentId);
          return optParent === targetParent || (parentId === null && (!opt.parentId || opt.parentId === "null"));
        })
        .map((opt) => ({
          id: String(opt.value),
          name: opt.label,
          parentId: opt.parentId ? String(opt.parentId) : null,
          children: buildTree(String(opt.value)),
        }));
    };
    return buildTree(null);
  }, [options]);

  const filteredTreeData = useMemo(() => {
    if (!searchQuery) return treeData;

    const filterNodes = (nodes: TreeNode[]): TreeNode[] => {
      return nodes
        .map((node) => {
          const childrenMatched = filterNodes(node.children);
          const selfMatched = node.name.toLowerCase().includes(searchQuery.toLowerCase());
          
          if (selfMatched || childrenMatched.length > 0) {
            return {
              ...node,
              children: childrenMatched,
            };
          }
          return null;
        })
        .filter(Boolean) as TreeNode[];
    };

    return filterNodes(treeData);
  }, [treeData, searchQuery]);

  const selectedPath = useMemo(() => {
    if (!selectedValue) return [];
    const selectedStr = String(selectedValue);

    const findPath = (nodes: TreeNode[], targetId: string, currentPath: string[] = []): string[] | null => {
      for (const node of nodes) {
        const newPath = [...currentPath, node.name];
        if (node.id === targetId) {
          return newPath;
        }
        const found = findPath(node.children, targetId, newPath);
        if (found) return found;
      }
      return null;
    };

    return findPath(treeData, selectedStr) || [];
  }, [treeData, selectedValue]);

  return (
    <div className="space-y-3 w-full">
      <style dangerouslySetInnerHTML={{__html: `
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />

      <div className="
        w-full p-4 rounded-2xl border border-slate-200 dark:border-[#1f2235]/60
        bg-white/40 dark:bg-[#121420]/25 text-right space-y-4 max-h-[450px] overflow-y-auto no-scrollbar
      ">
        <div className="relative flex items-center bg-slate-50 dark:bg-[#121420]/50 rounded-xl px-3 py-2 border border-slate-100 dark:border-[#1f2235]/50 focus-within:border-indigo-500/50 focus-within:ring-2 focus-within:ring-indigo-500/10 transition-all">
          <FiSearch className="text-slate-400 dark:text-slate-500 w-4 h-4 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="جستجوی سریع دسته‌بندی..."
            className="w-full bg-transparent border-none outline-none text-xs text-slate-700 dark:text-slate-300 pr-2 focus:ring-0 placeholder-slate-400 dark:placeholder-slate-600 font-semibold"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="text-slate-400 hover:text-rose-500 transition-colors"
            >
              <FiX className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <AnimatePresence>
          {selectedPath.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="flex flex-wrap items-center gap-1 p-2 bg-indigo-500/5 dark:bg-indigo-500/10 border border-indigo-500/10 rounded-xl text-[11px] font-bold text-indigo-600 dark:text-indigo-400"
            >
              <span>مسیر فعال:</span>
              {selectedPath.map((name, i) => (
                <span key={i} className="flex items-center gap-1">
                  {i > 0 && <span className="text-slate-300 dark:text-[#1f2235]">➔</span>}
                  <span className="bg-white/60 dark:bg-[#121420]/40 px-1.5 py-0.5 rounded border border-slate-100 dark:border-[#1f2235]">
                    {name}
                  </span>
                </span>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center gap-3 pb-3 border-b border-slate-150 dark:border-[#1f2235]/40 w-full">
          <input
            type="radio"
            id="parent-null"
            name={name}
            checked={selectedValue === null || selectedValue === "" || selectedValue === 0}
            onChange={() => setFieldValue(name, null)}
            className="w-4 h-4 text-indigo-500 border-slate-200 dark:border-[#1f2235] focus:ring-indigo-500 cursor-pointer"
          />
          <label htmlFor="parent-null" className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 cursor-pointer select-none">
            بدون والد <span className="text-slate-400 dark:text-slate-500 font-medium">(دسته‌بندی اصلی)</span>
          </label>
        </div>

        <div className="space-y-1 w-full">
          {filteredTreeData.length === 0 ? (
            <div className="text-center py-6 text-xs text-slate-400 dark:text-slate-550 font-semibold">
              موردی منطبق با جستجو یافت نشد
            </div>
          ) : (
            filteredTreeData.map((node) => (
              <TreeItem
                key={node.id}
                node={node}
                level={1}
                name={name}
                searchQuery={searchQuery}
                selectedValue={selectedValue}
                onSelect={(id) => setFieldValue(name, id)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

interface TreeItemProps {
  node: TreeNode;
  level: number;
  name: string;
  selectedValue: any;
  searchQuery: string;
  onSelect: (id: number) => void;
}

function TreeItem({ node, level, name, selectedValue, searchQuery, onSelect }: TreeItemProps) {
  const hasActiveChild = useMemo(() => {
    if (!selectedValue) return false;
    const selectedStr = String(selectedValue);

    const checkDescendants = (n: TreeNode): boolean => {
      if (n.id === selectedStr) return true;
      return n.children.some(checkDescendants);
    };

    return node.children.some(checkDescendants);
  }, [node.children, selectedValue]);

  const [isOpen, setIsOpen] = useState(hasActiveChild);

  useEffect(() => {
    if (searchQuery) {
      setIsOpen(true);
    } else {
      setIsOpen(hasActiveChild);
    }
  }, [searchQuery, hasActiveChild]);

  const hasChildren = node.children.length > 0;
  const isChecked = String(selectedValue) === node.id;

  const getLevelBadgeClass = (lvl: number) => {
    switch (lvl) {
      case 1:
        return "bg-blue-50/70 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 border border-blue-200/20";
      case 2:
        return "bg-emerald-50/70 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200/20";
      case 3:
        return "bg-purple-50/70 dark:bg-purple-950/20 text-purple-600 dark:text-purple-400 border border-purple-200/20";
      default:
        return "bg-amber-50/70 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border border-amber-200/20";
    }
  };

  return (
    <div className="space-y-1.5 w-full">
      <div
        className={`
          group/item relative flex items-center justify-between p-2 rounded-xl border transition-all duration-300 w-full
          ${isChecked
            ? "border-indigo-500/30 bg-gradient-to-r from-indigo-500/10 via-purple-500/5 to-transparent shadow-[0_4px_15px_rgba(99,102,241,0.04)]"
            : "border-transparent hover:bg-slate-100/40 dark:hover:bg-[#121420]/30 hover:scale-[1.01] active:scale-[0.99]"
          }
        `}
      >
        {isChecked && (
          <div className="absolute right-0 top-2 bottom-2 w-[3px] bg-indigo-500 rounded-l-full shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
        )}

        <div className="flex items-center gap-2.5 w-full">
          {hasChildren ? (
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="p-1.5 rounded-lg hover:bg-slate-200/50 dark:hover:bg-[#121420]/80 text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-all duration-200 shrink-0"
            >
              {isOpen ? <FiChevronUp className="w-4.5 h-4.5" /> : <FiChevronDown className="w-4.5 h-4.5" />}
            </button>
          ) : (
            <div className="w-[30px] h-[30px] shrink-0 flex items-center justify-center relative">
              {level > 1 && (
                <span className="absolute right-0 w-3 h-[1px] bg-slate-200 dark:bg-[#1f2235] group-hover/item:bg-indigo-500/30 transition-colors" />
              )}
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-650 group-hover/item:bg-indigo-500 group-hover/item:scale-125 transition-all duration-300" />
            </div>
          )}

          <input
            type="radio"
            id={`radio-${node.id}`}
            name={name}
            checked={isChecked}
            onChange={() => onSelect(Number(node.id))}
            className="w-4 h-4 text-indigo-500 border-slate-200 dark:border-[#1f2235] focus:ring-indigo-500/20 cursor-pointer shrink-0 accent-indigo-500"
          />

          <span className="shrink-0 text-slate-400 group-hover/item:text-slate-600 dark:group-hover/item:text-slate-300 transition-colors">
            {hasChildren ? (
              isOpen ? (
                <FiFolderMinus className="w-4 h-4 text-indigo-500/80" />
              ) : (
                <FiFolderPlus className="w-4 h-4 text-slate-400" />
              )
            ) : (
              <FiFileText className="w-4 h-4 text-slate-350 dark:text-slate-600" />
            )}
          </span>

          <label
            htmlFor={`radio-${node.id}`}
            className={`text-xs sm:text-sm font-bold select-none truncate transition-colors duration-200 cursor-pointer ${
              isChecked ? "text-indigo-600 dark:text-indigo-400" : "text-slate-700 dark:text-slate-200"
            }`}
          >
            {node.name}
          </label>

          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md shrink-0 tracking-wide ${getLevelBadgeClass(level)}`}>
            سطح {level}
          </span>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {hasChildren && isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className={`
              overflow-hidden border-r mr-[14px] pr-2 transition-colors duration-300
              ${(hasActiveChild || isChecked) 
                ? "border-dashed border-indigo-400 dark:border-indigo-500/40" 
                : "border-dashed border-slate-200 dark:border-[#1f2235]/60"
              }
            `}
          >
            <div className="pt-1.5 space-y-1">
              {node.children.map((child) => (
                <TreeItem
                  key={child.id}
                  node={child}
                  level={level + 1}
                  name={name}
                  selectedValue={selectedValue}
                  searchQuery={searchQuery}
                  onSelect={onSelect}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}