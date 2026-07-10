"use client";

import { FC } from "react";
import FooterHeader from "./FooterHeader";
import FooterFeatures from "./FooterFeatures";
import FooterLinks from "./FooterLinks";
import FooterSocials from "./FooterSocials";
import FooterDescription from "./FooterDescription";
import FooterCopyright from "./FooterCopyright";

const Footer: FC = () => {
  return (
    <footer className="w-full bg-slate-50 dark:bg-zinc-950 border-t border-slate-200/50 dark:border-zinc-900/60 transition-colors duration-300 pt-10 pb-6 relative">
      {/* هاله نوری فوق‌العاده باریک و ملایم نئونی در مرز بالایی فوتر */}
      <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-red-500/25 to-transparent" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* ۱. هدر فوتر: لوگو و دکمه بازگشت به بالا */}
        <FooterHeader />

        {/* ۲. ویژگی‌های متمایز خرید با کارت‌های تعاملی و متحرک */}
        <FooterFeatures />

        {/* ۳. ستون‌های راهنما، لینک‌ها و شبکه‌های اجتماعی */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 pb-8 border-b border-slate-200/40 dark:border-zinc-900/50">
          {/* رندر ستون‌های سه‌گانه لینک با جابجایی افقی */}
          <FooterLinks />

          {/* بخش چهارم: شبکه‌های اجتماعی با ترنزیشن رنگ اختصاصی برندها */}
          <FooterSocials />
        </div>

        {/* ۴. توضیحات بیو و معرفی کوتاه برند */}
        <FooterDescription />

        {/* ۵. بخش نهایی کپی‌رایت */}
        <FooterCopyright />
      </div>
    </footer>
  );
};

export default Footer;