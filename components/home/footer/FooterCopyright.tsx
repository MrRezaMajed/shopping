// بخش حق کپی‌رایت نهایی فوتر

import { FC } from "react";

const FooterCopyright: FC = () => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 py-6 text-slate-400 dark:text-zinc-500 text-[11px] font-semibold">
      <div>
        کلیه حقوق این وبسایت متعلق به شرکت آمازون می‌باشد.
      </div>
    </div>
  );
};

export default FooterCopyright;