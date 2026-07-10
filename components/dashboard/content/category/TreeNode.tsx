"use client";

import { Dispatch, SetStateAction } from "react";
import { HiChevronDown } from "react-icons/hi";

// ---------- Types ----------
export interface CategoryTree {
  id: number;
  name: string;
  slug: string;
  status: "ACTIVE" | "INACTIVE";
  parentId?: number | null;
  children: CategoryTree[];
}

// ---------- Props ----------
interface TreeNodeProps {
  category: CategoryTree;
  selectedId: number | null;
  setSelectedId: Dispatch<SetStateAction<number | null>>;
  disabledIds: number[];
  expandedIds: number[];
  setExpandedIds: Dispatch<SetStateAction<number[]>>;
  level?: number;
}

// ---------- Helpers ----------
function hasSelectedDescendant(
  node: CategoryTree,
  selectedId: number | null
): boolean {
  if (!selectedId) return false;
  if (node.id === selectedId) return true;
  return node.children.some(child =>
    hasSelectedDescendant(child, selectedId)
  );
}

function getLevelBadgeClasses(level: number): string {
  switch (level) {
    case 0:
      return "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300";
    case 1:
      return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300";
    case 2:
      return "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300";
    default:
      return "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300";
  }
}

// ---------- Component ----------
export function TreeNode({
  category,
  selectedId,
  setSelectedId,
  disabledIds,
  expandedIds,
  setExpandedIds,
  level = 0,
}: TreeNodeProps) {
  const hasChildren = category.children.length > 0;
  const isDisabled = disabledIds.includes(category.id);

  // آیا این نود باز است؟
  const isOpen = expandedIds.includes(category.id);

  // highlight مسیر انتخاب‌شده
  const isInSelectedPath = hasSelectedDescendant(category, selectedId);

  const toggleOpen = () => {
    if (isOpen) {
      setExpandedIds(expandedIds.filter(id => id !== category.id));
    } else {
      setExpandedIds([...expandedIds, category.id]);
    }
  };

  return (
    <div className="select-none">
      {/* Row */}
      <div
        className={`flex items-center gap-2 rounded-md px-2 py-1
          transition
          ${isInSelectedPath ? "bg-blue-100 dark:bg-blue-800" : ""}
          hover:bg-gray-200 dark:hover:bg-gray-700
          ${isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        `}
        style={{ marginRight: level * 12 }}
      >
        {hasChildren && (
          <button
            type="button"
            onClick={toggleOpen}
            className="p-1 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            <HiChevronDown
              size={18}
              className={`transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </button>
        )}

        <input
          type="radio"
          disabled={isDisabled}
          checked={selectedId === category.id}
          onChange={() => setSelectedId(category.id)}
          className="accent-blue-600"
        />

        <span className="text-sm text-gray-800 dark:text-gray-100">
          {category.name}
        </span>

        <span
          className={`text-[10px] px-2 py-0.5 rounded-full font-medium
            ${getLevelBadgeClasses(level)}
          `}
        >
          سطح {level + 1}
        </span>
      </div>

      {/* Children */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out
          ${isOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"}
        `}
      >
        <div className="mt-1 space-y-1 border-r border-gray-300 dark:border-gray-700 pr-2">
          {category.children.map(child => (
            <TreeNode
              key={child.id}
              category={child}
              selectedId={selectedId}
              setSelectedId={setSelectedId}
              disabledIds={[...disabledIds, category.id]}
              expandedIds={expandedIds}
              setExpandedIds={setExpandedIds}
              level={level + 1}
            />
          ))}
        </div>
      </div>
    </div>
  );
}