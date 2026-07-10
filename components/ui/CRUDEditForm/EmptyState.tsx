// کامپوننت وضعیت تهی بخش‌ها

import React from "react";
import { FiInbox } from "react-icons/fi";

interface EmptyStateProps {
  label: string;
}

export const EmptyState = React.memo(function EmptyState({ label }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-8 text-slate-350 dark:text-slate-600">
      <FiInbox className="w-6 h-6" />
      <p className="text-xs font-bold">{label}</p>
    </div>
  );
});