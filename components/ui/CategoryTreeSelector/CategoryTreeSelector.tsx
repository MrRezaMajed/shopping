// کامپوننت تجمیع‌کننده والد درختی

"use client";
import { useState, useMemo } from "react";
import { useFormikContext } from "formik";
import { AnimatePresence } from "framer-motion";
import { TreeSelectorProps, TreeNode } from "./types";
import { SearchBox } from "./SearchBox";
import { ActivePathTrail } from "./ActivePathTrail";
import { TreeItem } from "./TreeItem";

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
        <SearchBox query={searchQuery} onQueryChange={setSearchQuery} />

        <AnimatePresence>
          <ActivePathTrail path={selectedPath} />
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