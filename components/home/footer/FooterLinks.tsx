// ستون‌های راهنمای خرید و خدمات مشتریان

// components/home/footer/FooterLinks.tsx
"use client";

import { FC } from "react";

interface FooterLinkSection {
  title: string;
  links: { label: string; href: string }[];
}

const linkSections: FooterLinkSection[] = [
  {
    title: "راهنمای خرید",
    links: [
      { label: "نحوه ثبت سفارش", href: "#" },
      { label: "رویه ارسال سفارش", href: "#" },
      { label: "شیوه‌های پرداخت", href: "#" },
      { label: "پیگیری سفارشات", href: "#" },
    ],
  },
  {
    title: "خدمات مشتریان",
    links: [
      { label: "پاسخ به پرسش‌های متداول", href: "#" },
      { label: "رویه‌های بازگرداندن کالا", href: "#" },
      { label: "شرایط استفاده و قوانین", href: "#" },
      { label: "حریم خصوصی کاربران", href: "#" },
    ],
  },
  {
    title: "با آمازون",
    links: [
      { label: "درباره ما", href: "#" },
      { label: "تماس با ما", href: "#" },
      { label: "فرصت‌های شغلی", href: "#" },
      { label: "همکاری با سازمان‌ها", href: "#" },
    ],
  },
];

const FooterLinks: FC = () => {
  return (
    <>
      {linkSections.map((section, idx) => (
        <div key={idx} className="space-y-4">
          <h4 className="text-xs font-black text-slate-900 dark:text-zinc-50 border-r-2 border-red-500 dark:border-red-400 pr-2.5">
            {section.title}
          </h4>
          <ul className="space-y-3 pr-2.5">
            {section.links.map((link, linkIdx) => (
              <li key={linkIdx} className="group/link">
                <a
                  href={link.href}
                  className="inline-block text-xs text-slate-500 dark:text-zinc-400 hover:text-red-500 dark:hover:text-red-400 transition-all duration-300 font-semibold group-hover/link:-translate-x-1"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </>
  );
};

export default FooterLinks;