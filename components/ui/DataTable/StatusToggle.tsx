"use client";

import { useState, useCallback } from "react";

interface StatusToggleProps {
  checked: boolean;
  onChange: () => Promise<void> | void;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
}

export default function StatusToggle({
  checked,
  onChange,
  size = "md",
  disabled = false,
  loading = false,
}: StatusToggleProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = useCallback(async () => {
    if (disabled || isLoading || loading) return;
    setIsLoading(true);
    try {
      await onChange();
    } catch (error) {
      console.error("Error toggling status:", error);
    } finally {
      setIsLoading(false);
    }
  }, [onChange, disabled, isLoading, loading]);

  const sizeClasses = { sm: "w-9 h-5 text-xs", md: "w-11 h-6 text-sm", lg: "w-14 h-7 text-base" };
  const dotSizeClasses = { sm: "w-3 h-3", md: "w-4 h-4", lg: "w-5 h-5" };
  const isActuallyLoading = isLoading || loading;

  return (
    <div className="flex flex-col items-start gap-1">
      <label className={`relative inline-flex items-center cursor-pointer ${isActuallyLoading ? 'opacity-70' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
        <input
          type="checkbox"
          className="sr-only peer"
          checked={checked}
          onChange={handleChange}
          disabled={disabled || isActuallyLoading}
          aria-label={checked ? "غیرفعال کردن" : "فعال کردن"}
        />
        <div className={`${sizeClasses[size]} rounded-full transition-all duration-300 ${checked ? 'bg-green-500 dark:bg-green-600' : 'bg-red-500 dark:bg-red-600'} ${isActuallyLoading ? 'animate-pulse' : ''} hover:opacity-90`}>
          <span className={`${dotSizeClasses[size]} absolute top-1 rounded-full bg-white shadow-lg transition-all duration-300 ${checked ? 'right-1' : 'left-1'}`} />
        </div>
      </label>
    </div>
  );
}
