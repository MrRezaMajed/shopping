import React from "react";
import { Column } from "./types";

interface CRUDListHeaderProps<T> {
  columns: Column<T>[];
  hiddenOnMobile: string[];
}

function CRUDListHeaderInner<T>({ columns, hiddenOnMobile }: CRUDListHeaderProps<T>) {
  const isHidden = (key: string) => hiddenOnMobile.includes(key);

  return (
    <thead>
      <tr className="text-slate-400 dark:text-slate-500 text-[11px] font-bold tracking-wide uppercase">
        <th className="pb-3 px-4 text-center w-12 font-medium">#</th>
        {columns.map((c) => (
          <th
            key={String(c.key)}
            className={`pb-3 px-4 text-right whitespace-nowrap font-semibold ${
              isHidden(String(c.key)) ? "hidden lg:table-cell" : ""
            }`}
          >
            {c.label}
          </th>
        ))}
        <th className="pb-3 px-4 text-center w-32 font-semibold">عملیات</th>
      </tr>
    </thead>
  );
}

export const CRUDListHeader = React.memo(CRUDListHeaderInner) as <T>(
  props: CRUDListHeaderProps<T>
) => React.JSX.Element;