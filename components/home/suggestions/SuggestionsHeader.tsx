"use client";

import { FC } from "react";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";

interface SuggestionsHeaderProps {
  title: string;
}

const SuggestionsHeader: FC<SuggestionsHeaderProps> = ({ title }) => {
  return (
    <div className="flex items-center justify-between py-2 px-1 select-none">
      <div className="flex items-center gap-3">
        {/* نشانگر زنده و پالس متحرک */}
        <div className="relative flex h-6 w-1.5 items-center justify-center">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-5 w-1.5 bg-brand-500"></span>
        </div>
        <h2 className="text-lg font-black tracking-tight text-slate-800 dark:text-zinc-50">
          {title}
        </h2>
      </div>
      <Link
        href="#"
        className="group/link flex items-center gap-1 text-xs font-bold text-brand-500 hover:text-brand-600 dark:text-brand-400 dark:hover:text-brand-300 transition-colors"
      >
        <span>مشاهده همه</span>
        <FiArrowLeft className="text-sm transition-transform duration-300 group-hover/link:-translate-x-1" />
      </Link>
    </div>
  );
};

export default SuggestionsHeader;