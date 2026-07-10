// app/layout.tsx
import "./globals.css";

import { ReactNode } from "react";
import { Metadata } from "next";
import Providers from "./(home)/providers";
import { ThemeProvider } from "@/context/ThemeContext";

// ایمپورت کردن پرووایدر نوتیفیکیشن با آلیاس @
import { NotificationProvider } from "@/context/NotificationContext";

export const metadata: Metadata = {
  title: "فروشگاه آنلاین آمازون",
  description: "بهترین تجربه خرید آنلاین با آمازون",
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <ThemeProvider>
      <html 
        lang="fa" 
        dir="rtl" 
        className="scroll-smooth" // متغیرها و کلاس‌های اضافه فونت Next.js از اینجا حذف شدند
        suppressHydrationWarning
      >
        <body 
          className="
            flex flex-col min-h-screen
            bg-[#f7f8fa] text-slate-900 
            dark:bg-[#09090b] dark:text-zinc-100 
            selection:bg-brand-500/10 selection:text-brand-600
            dark:selection:bg-brand-500/20 dark:selection:text-brand-400
            transition-colors duration-300 antialiased
          "
        >
          {/* محصور کردن بخش Providers با پرووایدر نوتیفیکیشن سراسری */}
          <NotificationProvider>
            <Providers>
              {children}
            </Providers>
          </NotificationProvider>
        </body>
      </html>
    </ThemeProvider>
  );
}