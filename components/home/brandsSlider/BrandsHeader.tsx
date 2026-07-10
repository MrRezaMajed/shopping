// هدر و عنوان بخش برندها

import { FC } from "react";

interface BrandsHeaderProps {
  title?: string;
}

const BrandsHeader: FC<BrandsHeaderProps> = ({ title = "برندهای ویژه" }) => {
  return (
    <div className="flex items-center gap-2 border-r-4 border-red-500 pr-3 select-none">
      <h2 className="text-xl font-extrabold text-gray-900 dark:text-zinc-50 tracking-tight">
        {title}
      </h2>
    </div>
  );
};

export default BrandsHeader;