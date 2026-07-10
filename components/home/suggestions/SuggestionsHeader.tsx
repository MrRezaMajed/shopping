"use client";

import { FC } from "react";
import Link from "next/link";

interface SuggestionsHeaderProps {
  title: string;
}

const SuggestionsHeader: FC<SuggestionsHeaderProps> = ({ title }) => {
  return (
    <div className="flex items-center justify-between my-1 px-1 select-none">
      <div className="flex items-center gap-3">
        <div className="w-1.5 h-6 bg-brand-500 rounded-full animate-pulse" />
        <h2 className="text-lg font-extrabold text-slate-800 dark:text-zinc-50">
          {title}
        </h2>
      </div>
      <Link
        href="#"
        className="text-xs font-bold text-brand-500 hover:text-brand-600 dark:text-brand-400 dark:hover:text-brand-300 transition-colors"
      >
        مشاهده همه
      </Link>
    </div>
  );
};

export default SuggestionsHeader;