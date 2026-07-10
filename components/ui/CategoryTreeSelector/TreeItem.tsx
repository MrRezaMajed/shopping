// گره‌های بازشونده و تو در توی درختی (Recursive Tree Item Node)

import React, { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronDown, FiChevronUp, FiFolderMinus, FiFolderPlus, FiFileText } from "react-icons/fi";
import { TreeNode } from "./types";

interface TreeItemProps {
  node: TreeNode;
  level: number;
  name: string;
  selectedValue: any;
  searchQuery: string;
  onSelect: (id: number) => void;
}

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

export const TreeItem = React.memo(function TreeItem({
  node,
  level,
  name,
  selectedValue,
  searchQuery,
  onSelect,
}: TreeItemProps) {
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
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-650 group-hover/item:bg-indigo-50 group-hover/item:scale-125 transition-all duration-300" />
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
}) as (props: TreeItemProps) => React.ReactElement;