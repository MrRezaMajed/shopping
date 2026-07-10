"use client";

import { Category } from "@prisma/client";


interface CategoryTreeProps {
  categories: Category[];
  selectedParentId: number | null;
  onParentSelect: (id: number | null) => void;
  label?: string;
  required?: boolean;
}

export default function CategoryTree({
  categories,
  selectedParentId,
  onParentSelect,
  label = "دسته‌بندی",
  required = false,
}: CategoryTreeProps) {
  // ساختار درختی
  const buildTree = (parentId: number | null = null) => {
    return categories
      .filter(category => category.parentId === parentId)
      .map(category => ({
        ...category,
        children: buildTree(category.id),
      }));
  };

  const tree = buildTree();

  // کامپوننت TreeNode بازگشتی
  const TreeNode = ({ node, level = 0 }: { node: any; level?: number }) => {
    const hasChildren = node.children && node.children.length > 0;

    return (
      <div className="mb-2" style={{ marginRight: `${level * 20}px` }}>
        <div className="flex items-center gap-2 p-2 rounded text-gray-900 hover:bg-gray-100
         dark:text-gray-100 dark:hover:bg-gray-800">
          <input
            type="radio"
            id={`category-${node.id}`}
            checked={selectedParentId === node.id}
            onChange={() => onParentSelect(node.id)}
            className="w-4 h-4 text-blue-600"
          />
          <label
            htmlFor={`category-${node.id}`}
            className="flex-1 cursor-pointer text-sm"
          >
            {node.name}
          </label>
          {/*{hasChildren && <span className="text-xs text-gray-500">({node.children.length})</span>}*/}
        </div>
        
        {hasChildren && (
          <div className="mt-1">
            {node.children.map((child: any) => (
              <TreeNode key={child.id} node={child} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-3">
    
      
      <div className="border border-gray-300 dark:border-gray-700 rounded-lg p-4 max-h-64 overflow-y-auto scrollbar-hidden ">
        
        {/* درخت دسته‌بندی‌ها */}
        {tree.map(node => (
          <TreeNode key={node.id} node={node} />
        ))}
        
        {tree.length === 0 && (
          <p className="text-center text-gray-500 py-4">هیچ دسته‌بندی‌ای یافت نشد</p>
        )}
      </div>
      
      {/* نمایش انتخاب فعلی */}
      {selectedParentId !== null && (
        <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            انتخاب شده:{" "}
            <span className="font-medium">
              {categories.find(c => c.id === selectedParentId)?.name}
            </span>
          </p>
        </div>
      )}
      
      {selectedParentId === null && (
        <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-900/20 rounded-lg">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            انتخاب شده: <span className="font-medium">والد اصلی</span>
          </p>
        </div>
      )}
    </div>
  );
}