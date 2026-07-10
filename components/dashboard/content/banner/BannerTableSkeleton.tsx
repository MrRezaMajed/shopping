export default function BannerTableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="overflow-x-auto rounded-xl border mt-5" dir="rtl">
      <table className="min-w-full text-sm divide-y">
        <thead className="bg-zinc-100 dark:bg-zinc-800">
          <tr>
            <th className="px-2 py-2">#</th>
            <th className="px-2 py-2 text-right">عنوان</th>
            <th className="px-2 py-2 text-right">لینک</th>
            <th className="px-2 py-2 text-center">تصویر</th>
            <th className="px-2 py-2 text-center">وضعیت</th>
            <th className="px-2 py-2 text-center">موقعیت</th>
            <th className="px-2 py-2 text-center">تاریخ ایجاد</th>
            <th className="px-2 py-2 text-center">عملیات</th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-zinc-900">
          {Array.from({ length: rows }).map((_, i) => (
            <tr
              key={i}
              className="animate-pulse hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <td className="text-center py-2">
                <div className="h-2 w-6 bg-gray-300 dark:bg-zinc-700 rounded mx-auto" />
              </td>
              <td className="py-2">
                <div className="h-4 w-40 bg-gray-300 dark:bg-zinc-700 rounded" />
              </td>
              <td className="py-2">
                <div className="h-2 w-48 bg-gray-300 dark:bg-zinc-700 rounded" />
              </td>
              <td className="text-center py-2">
                <div className="w-20 h-[60px] bg-gray-300 dark:bg-zinc-700 rounded mx-auto" />
              </td>
              <td className="text-center py-2">
                <div className="h-2 w-6 bg-gray-300 dark:bg-zinc-700 rounded mx-auto" />
              </td>
              <td className="text-center py-2">
                <div className="h-2 w-16 bg-gray-300 dark:bg-zinc-700 rounded mx-auto" />
              </td>
              <td className="text-center py-2">
                <div className="h-2 w-16 bg-gray-300 dark:bg-zinc-700 rounded mx-auto" />
              </td>
              <td className="text-center py-2">
                <div className="h-2 w-20 bg-gray-300 dark:bg-zinc-700 rounded mx-auto" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}