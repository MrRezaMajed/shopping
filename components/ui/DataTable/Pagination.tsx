"use client";

import { useState, useEffect } from "react";
import { FiChevronLeft, FiChevronRight, FiMoreHorizontal } from "react-icons/fi";
import { toPersianNumber } from "@/lib/utils/persianNumbers";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showPageInfo?: boolean;
  showPageSize?: boolean;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
  className?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  showPageInfo = false,
  showPageSize = false,
  onPageSizeChange,
  pageSizeOptions = [5, 10, 15, 20, 50],
  className = "",
}: PaginationProps) {
  const [pageNumbers, setPageNumbers] = useState<(number | string)[]>([]);

  useEffect(() => {
    const calculatePageNumbers = () => {
      const pages: (number | string)[] = [];

      if (totalPages <= 7) {
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i);
        }
        return pages;
      }

      pages.push(1);

      if (currentPage <= 4) {
        for (let i = 2; i <= 5; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push("...");
        for (let i = totalPages - 4; i <= totalPages; i++) {
          if (i > 1) pages.push(i);
        }
      } else {
        pages.push("...");
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push("...");
        pages.push(totalPages);
      }

      return pages;
    };

    setPageNumbers(calculatePageNumbers());
  }, [currentPage, totalPages]);

  if (totalPages <= 1) return null;

  return (
    <div
      className={`w-full flex justify-center ${className}`}
      dir="rtl"
    >
      <div
        className="
         rounded-3xl py-0.5
        bg-white/60 dark:bg-gray-900
        backdrop-blur-2xl
        border border-white/30 dark:border-gray-900
        shadow-[0_10px_40px_rgba(0,0,0,0.08)]
        transition-all duration-300
      "
      >
        <div className="flex flex-col items-center">
          
          {/* Controls */}
          <div className="flex items-center gap-3">

            {/* Previous */}
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`
                flex items-center justify-center w-8 h-8 rounded-2xl
                backdrop-blur-md
                transition-all duration-300
                ${
                  currentPage === 1
                    ? "opacity-40 bg-gray-200/50 dark:bg-gray-800/50 text-gray-400 "
                    : "bg-white/70 dark:bg-slate-800/70 border border-white/30 dark:border-gray-900 text-gray-700 dark:text-gray-300 hover:scale-105 hover:shadow-lg hover:border-blue-500/60 hover:text-blue-600 dark:hover:text-blue-400"
                }
              `}
              aria-label="صفحه قبلی"
            >
              <FiChevronRight className="w-5 h-5" />
            </button>

            {/* Page Numbers */}
            <div className="flex items-center gap-2 mx-2">
              {pageNumbers.map((pageNum, index) =>
                pageNum === "..." ? (
                  <div
                    key={`dots-${index}`}
                    className="flex items-center justify-center w-8 h-8 text-gray-400 dark:text-gray-500"
                  >
                    <FiMoreHorizontal className="w-4 h-4" />
                  </div>
                ) : (
                  <button
                    key={`page-${pageNum}-${index}`}
                    onClick={() => onPageChange(pageNum as number)}
                    className={`
                      flex items-center justify-center w-8 h-8
                      rounded-2xl text-sm font-medium
                      backdrop-blur-md
                      transition-all duration-300
                      ${
                        currentPage === pageNum
                          ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white scale-105"
                          : "text-gray-700 dark:text-gray-300 hover:scale-105 dark:hover:bg-gray-800 hover:shadow-lg hover:border-blue-500/60 hover:text-blue-600 dark:hover:text-blue-400"
                      }
                    `}
                  >
                    {toPersianNumber(pageNum as number)}
                  </button>
                )
              )}
            </div>

            {/* Next */}
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`
                flex items-center justify-center w-8 h-8 rounded-2xl
                backdrop-blur-md
                transition-all duration-300
                ${
                  currentPage === totalPages
                    ? "opacity-40 bg-gray-200/50 dark:bg-gray-800/50 text-gray-400 "
                    : "bg-white/70 dark:bg-slate-800/70 border border-white/30 dark:border-gray-900 text-gray-700 dark:text-gray-300 hover:scale-105 hover:shadow-lg hover:border-blue-500/60 hover:text-blue-600 dark:hover:text-blue-400"
                }
              `}
              aria-label="صفحه بعدی"
            >
              <FiChevronLeft className="w-5 h-5" />
            </button>
          </div>

          {/* Page Info */}
          {showPageInfo && (
            <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              صفحه {toPersianNumber(currentPage)} از{" "}
              {toPersianNumber(totalPages)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}