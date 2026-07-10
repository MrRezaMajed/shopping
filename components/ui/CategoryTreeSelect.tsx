"use client";

import { useState, useEffect } from "react";
import { Category } from "@prisma/client";
import { buildCategoryTree } from "@/lib/category/buildCategoryTree";

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
interface CategoryTreeSelectProps {
  categories: Category[];
  selectedId: number | null;
  onSelect: (id: number | null) => void;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  maxHeight?: string;
  className?: string;
}

// ---------- Helper Functions ----------
function calculateMaxDepth(tree: CategoryTree[]): number {
  const findDepth = (node: CategoryTree, currentDepth = 0): number => {
    if (!node.children || node.children.length === 0) {
      return currentDepth;
    }
    return Math.max(...node.children.map(child => 
      findDepth(child, currentDepth + 1)
    ));
  };
  
  return Math.max(...tree.map(node => findDepth(node)));
}

function getCategoryLevel(categoryId: number, categories: Category[]): number {
  const category = categories.find(c => c.id === categoryId);
  if (!category) return 0;
  
  let level = 0;
  let current = category;
  
  while (current.parentId) {
    level++;
    const parent = categories.find(c => c.id === current.parentId);
    if (!parent) break;
    current = parent;
  }
  
  return level;
}

// ---------- TreeNode Component ----------
interface TreeNodeProps {
  category: CategoryTree;
  selectedId: number | null;
  onSelect: (id: number) => void;
  disabledIds: number[];
  level?: number;
  categories: Category[];
}

function TreeNode({
  category,
  selectedId,
  onSelect,
  disabledIds,
  level = 0,
  categories,
}: TreeNodeProps) {
  const hasChildren = category.children.length > 0;
  const isDisabled = disabledIds.includes(category.id);
  const isSelected = selectedId === category.id;
  const actualLevel = getCategoryLevel(category.id, categories);

  // استایل‌های سطوح مختلف برای RTL
  const getLevelStyle = () => {
    switch (actualLevel) {
      case 0: // سطح 1 در نمایش
        return {
          margin: "mr-0",
          prefix: "└──",
          nameStyle: "text-gray-900 dark:text-white font-bold text-base",
          levelStyle: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
          bgStyle: "bg-blue-50 dark:bg-blue-900/20"
        };
      case 1: // سطح 2 در نمایش
        return {
          margin: "mr-6",
          prefix: "└──",
          nameStyle: "text-gray-800 dark:text-gray-200 font-medium text-sm",
          levelStyle: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
          bgStyle: "bg-green-50 dark:bg-green-900/20"
        };
      case 2: // سطح 3 در نمایش
        return {
          margin: "mr-12",
          prefix: "└──",
          nameStyle: "text-gray-700 dark:text-gray-300 text-sm",
          levelStyle: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
          bgStyle: "bg-red-50 dark:bg-red-900/20"
        };
      default:
        return {
          margin: `mr-${(actualLevel) * 6}`,
          prefix: "└──",
          nameStyle: "text-gray-600 dark:text-gray-400 text-sm",
          levelStyle: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400",
          bgStyle: "bg-gray-50 dark:bg-gray-900/20"
        };
    }
  };

  const levelStyle = getLevelStyle();

  return (
    <div className={`mb-3 ${levelStyle.margin}`}>
      {/* دسته‌بندی اصلی */}
      <div className="flex items-center">
        {/* چک‌باکس */}
        <input
          type="radio"
          disabled={isDisabled}
          checked={isSelected}
          onChange={() => !isDisabled && onSelect(category.id)}
          className="w-5 h-5 text-blue-600 bg-white border-gray-300 rounded-full focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
        />
        
        {/* پیشوند درختی */}
        <span className="mx-3 text-gray-500 font-mono text-lg">{levelStyle.prefix}</span>
        
        {/* نام دسته‌بندی */}
        <button
          type="button"
          onClick={() => !isDisabled && onSelect(category.id)}
          disabled={isDisabled}
          className={`text-right px-4 py-3 rounded-xl transition-all duration-200 flex-1 flex items-center justify-between ${
            isSelected 
              ? `${levelStyle.bgStyle} border-2 ${
                  actualLevel === 0 ? 'border-blue-300 dark:border-blue-600' :
                  actualLevel === 1 ? 'border-green-300 dark:border-green-600' :
                  'border-red-300 dark:border-red-600'
                }` 
              : 'hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700'
          } ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          <span className={`text-right ${levelStyle.nameStyle}`}>
            {category.name}
          </span>
          
          {/* سطح */}
          <span className={`text-xs px-3 py-1.5 rounded-full font-bold ${levelStyle.levelStyle}`}>
            سطح {actualLevel + 1}
          </span>
        </button>
      </div>

      {/* فرزندان */}
      {hasChildren && (
        <div className="mt-3 space-y-3">
          {category.children.map(child => (
            <TreeNode
              key={child.id}
              category={child}
              selectedId={selectedId}
              onSelect={onSelect}
              disabledIds={disabledIds}
              level={level + 1}
              categories={categories}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ---------- Main Component ----------
export default function CategoryTreeSelect({
  categories,
  selectedId,
  onSelect,
  label = "دسته‌بندی",
  required = false,
  disabled = false,
  maxHeight = "max-h-96",
  className = "",
}: CategoryTreeSelectProps) {
  const categoryTree = buildCategoryTree(categories);
  const totalCategories = categories.length;
  const maxDepth = calculateMaxDepth(categoryTree);

  const handleSelectCategory = (id: number) => {
    if (!disabled) {
      onSelect(id);
    }
  };

  const handleClearSelection = () => {
    if (!disabled) {
      onSelect(null);
    }
  };

  // دسته‌بندی‌های سطح اصلی (parentId = null)
  const mainCategories = categoryTree.filter(cat => !cat.parentId);

  return (
    <div dir="rtl" className={`space-y-4 ${className}`}>
      {/* Label */}
      <div className="flex justify-between items-center">
        <label className="block text-lg font-bold text-gray-900 dark:text-white">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        
        {selectedId && !disabled && (
          <button
            type="button"
            onClick={handleClearSelection}
            className="text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors bg-red-50 dark:bg-red-900/20 px-3 py-1.5 rounded-lg"
          >
            حذف انتخاب
          </button>
        )}
      </div>

      {/* Tree Container */}
      <div className={`border-2 border-gray-300 dark:border-gray-700 
        bg-white dark:bg-gray-800 rounded-xl p-6 
        overflow-y-auto ${maxHeight} ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
      >
        {/* هدر */}
        <div className="mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
            دسته‌بندی والد
          </h3>
          <div className="flex flex-wrap gap-3">
            <span className="text-sm px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 rounded-full font-bold">
              {totalCategories} دسته‌بندی
            </span>
            <span className="text-sm px-4 py-2 bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-400 rounded-full font-bold">
              {maxDepth + 1} سطح
            </span>
            {selectedId && (
              <span className="text-sm px-4 py-2 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 rounded-full font-bold">
                ✓ انتخاب شده
              </span>
            )}
          </div>
        </div>

        {/* والد اصلی */}
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border-2 border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <input
              type="radio"
              disabled={disabled}
              checked={selectedId === null}
              onChange={() => !disabled && onSelect(null)}
              className="w-6 h-6 text-blue-600 bg-white border-gray-300 rounded-full focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <span className="mx-4 text-gray-500 font-mono text-xl">└──</span>
            <button
              type="button"
              onClick={() => !disabled && onSelect(null)}
              disabled={disabled}
              className={`text-right px-5 py-4 rounded-xl transition-all duration-200 flex-1 flex items-center justify-between ${
                selectedId === null 
                  ? 'bg-blue-100 dark:bg-blue-900 border-2 border-blue-300 dark:border-blue-600' 
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                والد اصلي
              </span>
              <span className="text-sm px-4 py-2 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-400 rounded-full font-bold">
                والد
              </span>
            </button>
          </div>
        </div>

        {/* لیست دسته‌بندی‌ها */}
        <div className="space-y-4">
          {mainCategories.length > 0 ? (
            mainCategories.map(category => (
              <TreeNode
                key={category.id}
                category={category}
                selectedId={selectedId}
                onSelect={handleSelectCategory}
                disabledIds={disabled ? categories.map(c => c.id) : []}
                categories={categories}
              />
            ))
          ) : (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400 text-lg">
              هیچ دسته‌بندی‌ای یافت نشد
            </div>
          )}
        </div>

        {/* نمایش دسته‌بندی انتخاب شده */}
        {selectedId && (
          <div className="mt-8 pt-6 border-t-2 border-gray-200 dark:border-gray-700">
            <div className="bg-gradient-to-l from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 border-2 border-green-200 dark:border-green-800 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    دسته‌بندی انتخاب شده:
                  </p>
                  <p className="text-xl font-bold text-green-700 dark:text-green-400">
                    {categories.find(c => c.id === selectedId)?.name}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    سطح: {getCategoryLevel(selectedId, categories) + 1}
                  </p>
                </div>
                <div className="text-3xl text-green-600 dark:text-green-400">
                  ✓
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* راهنمای سطوح */}
      <div className="bg-gradient-to-l from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900/20 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
        <p className="text-sm font-bold text-gray-800 dark:text-gray-300 mb-3 text-right">
          راهنمای سطوح دسته‌بندی:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
            <div className="text-right flex-1">
              <span className="text-sm font-bold text-gray-800 dark:text-gray-300">سطح ۱</span>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">دسته‌بندی اصلی</p>
            </div>
            <span className="w-5 h-5 rounded-full bg-blue-500 mr-3"></span>
          </div>
          <div className="flex items-center p-3 bg-green-50 dark:bg-green-900/30 rounded-lg">
            <div className="text-right flex-1">
              <span className="text-sm font-bold text-gray-800 dark:text-gray-300">سطح ۲</span>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">دسته‌بندی فرعی</p>
            </div>
            <span className="w-5 h-5 rounded-full bg-green-500 mr-3"></span>
          </div>
          <div className="flex items-center p-3 bg-red-50 dark:bg-red-900/30 rounded-lg">
            <div className="text-right flex-1">
              <span className="text-sm font-bold text-gray-800 dark:text-gray-300">سطح ۳</span>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">دسته‌بندی زیرفرعی</p>
            </div>
            <span className="w-5 h-5 rounded-full bg-red-500 mr-3"></span>
          </div>
        </div>
      </div>
    </div>
  );
}