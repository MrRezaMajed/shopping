import { useMemo, useState } from "react";
import { getValueByPath, compareValues } from "./utils";

export function useSort<T>(data: T[]) {
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);

  const sortedData = useMemo(() => {
    if (!sortConfig) return data;

    return [...data].sort((a, b) =>
      compareValues(
        getValueByPath(a, sortConfig.key),
        getValueByPath(b, sortConfig.key),
        sortConfig.direction
      )
    );
  }, [data, sortConfig]);

  return { sortedData, sortConfig, setSortConfig };
}
