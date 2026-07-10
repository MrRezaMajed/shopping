export const getValueByPath = (obj: any, path: string) =>
  path.split(".").reduce((acc, key) => acc?.[key], obj);

export const compareValues = (
  a: any,
  b: any,
  direction: "asc" | "desc"
) => {
  if (a == null) return 1;
  if (b == null) return -1;
  if (a < b) return direction === "asc" ? -1 : 1;
  if (a > b) return direction === "asc" ? 1 : -1;
  return 0;
};

export const getRowIndex = (
  page: number,
  limit: number,
  index: number
) => (page - 1) * limit + index + 1;
