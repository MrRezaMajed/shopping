// بخش بیو و معرفی کوتاه برند

import { FC } from "react";

const FooterDescription: FC = () => {
  return (
    <div className="py-8 border-b border-slate-200/40 dark:border-zinc-900/50">
      <div className="font-black text-sm text-slate-800 dark:text-zinc-100">
        فروشگاه اینترنتی آمازون
      </div>
      <p className="text-xs text-slate-500 dark:text-zinc-400 mt-3.5 leading-6 text-justify font-medium">
        ما همواره در آمازون تلاش می‌کنیم با ارائه بهترین خدمات پس از فروش، گستره وسیعی از کالاهای اورجینال و تخفیف‌های واقعی، شایسته‌ترین خدمات را به مشتریان گرانقدر خود ارائه دهیم. خرید مطمئن، امن و سریع را با ما تجربه کنید.
      </p>
    </div>
  );
};

export default FooterDescription;