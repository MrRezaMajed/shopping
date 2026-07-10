// components/ui/DataTable/TableSkeleton.tsx

interface TableSkeletonProps {
  rows: number;
  columnsCount: number;
  hasActions?: boolean;
}

export default function TableSkeleton({
  rows,
  columnsCount,
  hasActions = false,
}: TableSkeletonProps) {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <tr key={rowIndex} className="animate-pulse">
          
          {/* Index */}
          <td className="px-6 py-4">
            <div className="w-8 h-8 mx-auto rounded-full bg-gray-200 dark:bg-gray-700" />
          </td>

          {/* Data Columns */}
          {Array.from({ length: columnsCount }).map((_, colIndex) => (
            <td key={colIndex} className="px-6 py-4">
              <div className="h-4 w-full max-w-[140px] rounded bg-gray-200 dark:bg-gray-700 mb-2" />
              <div className="h-3 w-2/3 rounded bg-gray-100 dark:bg-gray-600" />
            </td>
          ))}

          {/* Actions */}
          {hasActions && (
            <td className="px-6 py-4">
              <div className="flex justify-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gray-200 dark:bg-gray-700" />
                <div className="w-8 h-8 rounded-lg bg-gray-200 dark:bg-gray-700" />
              </div>
            </td>
          )}
        </tr>
      ))}
    </>
  );
}
