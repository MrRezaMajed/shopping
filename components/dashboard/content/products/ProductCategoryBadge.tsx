interface ProductCategoryBadgeProps {
  categoryName: string;
  parentName?: string;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
  isChild?: boolean; // آیا زیردسته است؟
  indentLevel?: number; // سطح تورفتگی (0 برای والد، 1 برای فرزند، 2 برای نوه)
}

export default function ProductCategoryBadge({ 
  categoryName, 
  parentName,
  size = "md",
  showIcon = false,
  isChild = false,
  indentLevel = 0
}: ProductCategoryBadgeProps) {
  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base"
  };

  // margin راست برای تورفتگی
  const getIndentMargin = () => {
    if (!isChild) return "";
    return `mr-${indentLevel * 6}`; // هر سطح 24px فاصله
  };

  const getCategoryColor = (category: string) => {
    // رنگ‌های مختلف بر اساس دسته‌بندی
    const colors: Record<string, string> = {
      'الکترونیک': 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
      'موبایل': 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300',
      'لپ‌تاپ': 'bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
      'کامپیوتر': 'bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300',
      'تبلت': 'bg-fuchsia-50 dark:bg-fuchsia-900/30 text-fuchsia-700 dark:text-fuchsia-300',
      
      'لوازم خانگی': 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300',
      'آشپزخانه': 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300',
      'نور و روشنایی': 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
      'مبلمان': 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
      
      'پوشاک': 'bg-pink-50 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300',
      'کفش': 'bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300',
      'اکسسوری': 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300',
      
      'کتاب': 'bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300',
      'ورزشی': 'bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300',
      'بهداشتی': 'bg-cyan-50 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300',
    };

    for (const [key, value] of Object.entries(colors)) {
      if (categoryName.includes(key)) {
        return value;
      }
    }

    return 'bg-gray-50 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300';
  };

  return (
    <div className={`flex items-center gap-2 ${getIndentMargin()}`}>
      {/* آیکون پیکان برای زیردسته‌ها */}
      {isChild && (
        <svg className="w-3 h-3 text-gray-400 dark:text-gray-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
        </svg>
      )}
      
      <span className={`
        ${sizeClasses[size]} 
        ${getCategoryColor(categoryName)}
        rounded-lg font-medium inline-flex items-center gap-1.5
        border border-gray-200 dark:border-gray-700
        ${isChild ? 'opacity-90' : ''}
      `}>
        {showIcon && (
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
          </svg>
        )}
        {categoryName}
      </span>
      
      {parentName && (
        <span className="text-xs text-gray-500 dark:text-gray-400">
          ← {parentName}
        </span>
      )}
    </div>
  );
}