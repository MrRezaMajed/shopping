
import Footer from "@/components/home/footer/Footer";
import Header from "@/components/home/header/Header";
import Navbar from "@/components/home/navbar/Navbar";
import { ReactNode } from "react";

interface HomeLayoutProps {
  children: ReactNode;
}

export default function HomeLayout({ children }: HomeLayoutProps) {
  return (
    <>
      {/* 
        بخش هدر و نوبار ثابت (Fixed) 
        با اولویت لایه‌بندی بالا بدون تعریف تگ‌های تکراری html/body
      */}
      <div className="
        fixed top-0 left-0 right-0 z-[99999] w-full transition-all duration-300 transform-gpu
        bg-white/95 dark:bg-[#09090b]/95 backdrop-blur-md
        shadow-sm dark:shadow-zinc-950/20 
        border-b border-gray-200/50 dark:border-zinc-800/50
      ">
        <Header />
        <Navbar />
      </div>

      {/* بخش بدنه محتوا با اعمال افست پدینگ بالا */}
      <main className="flex-1 w-full bg-gray-100 dark:bg-gray-800 dark:text-gray-25 transition-colors duration-300 pt-[128px]">
        {children}
      </main>

      {/* بخش فوتر */}
      <Footer />
    </>
  );
}