// app/dashboard/categories/components/CategoryLoading.tsx
import { FC } from "react";

export const CategoryLoading: FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-semibold text-slate-500 dark:text-zinc-400">
          در حال بارگذاری ساختار درختی...
        </p>
      </div>
    </div>
  );
};