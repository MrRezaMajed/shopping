interface ProductStatusBadgeProps {
  status: "ACTIVE" | "INACTIVE" | "DRAFT" | "OUT_OF_STOCK" | "ARCHIVED";
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
  showText?: boolean;
}

export default function ProductStatusBadge({ 
  status, 
  size = "md",
  showIcon = true,
  showText = true
}: ProductStatusBadgeProps) {
  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-1.5 text-base"
  };

  const statusConfig = {
    ACTIVE: {
      label: "فعال",
      icon: (
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      ),
      color: "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200",
      iconColor: "text-green-600 dark:text-green-400"
    },
    INACTIVE: {
      label: "غیرفعال",
      icon: (
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      ),
      color: "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200",
      iconColor: "text-red-600 dark:text-red-400"
    },
    DRAFT: {
      label: "پیش‌نویس",
      icon: (
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
        </svg>
      ),
      color: "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200",
      iconColor: "text-yellow-600 dark:text-yellow-400"
    },
    OUT_OF_STOCK: {
      label: "ناموجود",
      icon: (
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
        </svg>
      ),
      color: "bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200",
      iconColor: "text-orange-600 dark:text-orange-400"
    },
    ARCHIVED: {
      label: "آرشیو شده",
      icon: (
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
        </svg>
      ),
      color: "bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200",
      iconColor: "text-gray-600 dark:text-gray-400"
    }
  };

  const config = statusConfig[status] || statusConfig.INACTIVE;

  return (
    <div className={`
      ${sizeClasses[size]} 
      ${config.color}
      rounded-full font-medium inline-flex items-center gap-1.5
    `}>
      {showIcon && (
        <span className={config.iconColor}>
          {config.icon}
        </span>
      )}
      {showText && config.label}
    </div>
  );
}