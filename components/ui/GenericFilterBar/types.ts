export type FilterField =
  | { type: "search"; key: string; placeholder?: string }
  | {
      type: "select";
      key: string;
      placeholder?: string;
      options: { label: string; value: string | number }[];
    };

export interface GenericFilterBarProps<T extends Record<string, any>> {
  fields: FilterField[];
  filters: T;
  onChange: (filters: T) => void;
  className?: string;
}