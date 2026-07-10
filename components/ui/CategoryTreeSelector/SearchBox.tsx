// بخش کادر جستجوی فیلتر سریع

import React from "react";
import { FiSearch, FiX } from "react-icons/fi";

interface SearchBoxProps {
  query: string;
  onQueryChange: (query: string) => void;
}

export const SearchBox = React.memo(function SearchBox({
  query,
  onQueryChange,
}: SearchBoxProps) {
  return (
    <div className="relative flex items-center bg-slate-50 dark:bg-[#121420]/50 rounded-xl px-3 py-2 border border-slate-100 dark:border-[#1f2235]/50 focus-within:border-indigo-500/50 focus-within:ring-2 focus-within:ring-indigo-500/10 transition-all">
      <FiSearch className="text-slate-400 dark:text-slate-500 w-4 h-4 shrink-0" />
      <input
        type="text"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        placeholder="جستجوی سریع دسته‌بندی..."
        className="w-full bg-transparent border-none outline-none text-xs text-slate-700 dark:text-slate-350 pr-2 focus:ring-0 placeholder-slate-400 dark:placeholder-slate-600 font-semibold"
      />
      {query && (
        <button
          type="button"
          onClick={() => onQueryChange("")}
          className="text-slate-400 hover:text-rose-500 transition-colors"
        >
          <FiX className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
});