// هدر جدول (محل نمایش عنوان ستون‌ها)

import React from "react";
import { Column } from "./types";

interface CRUDListHeaderProps<T> {
  columns: Column<T>[];
  hiddenOnMobile: string[];
}

export const CRUDListHeader = React.memo(function CRUDListHeader<T>({
  columns,
  hiddenOnMobile,
}: CRUDListHeaderProps<T>) {
  const isHidden = (key: string) => hiddenOnMobile.includes(key);

  return (
    <thead>
      <tr className="text-slate-400 dark:text-slate-400 text-xs font-semibold tracking-wider">
        <th className="pb-4 px-4 text-center w-14">#</th>
        {columns.map((c) => (
          <th
            key={String(c.key)}
            className={`pb-4 px-4 text-right whitespace-nowrap ${
              isHidden(String(c.key)) ? "hidden lg:table-cell" : ""
            }`}
          >
            {c.label}
          </th>
        ))}
        <th className="pb-4 px-4 text-center w-36">عملیات</th>
      </tr>
    </thead>
  );
}) as <T>(props: CRUDListHeaderProps<T>) => React.ReactElement;