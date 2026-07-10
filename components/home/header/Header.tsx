"use client";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";
import SearchBox from "./SearchBox";
import HeaderActions from "./HeaderAction";
import { motion } from "framer-motion";

const Header: FC = () => {
  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/75 dark:bg-zinc-950/75 border-b border-slate-200/50 dark:border-zinc-800/50 transition-colors duration-300 shadow-[0_4px_30px_rgba(0,0,0,0.02)]">
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4 gap-4 md:gap-8">
          
          {/* لوگو به همراه افکت هاور فنری */}
          <motion.div 
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex-shrink-0 transition-transform duration-200"
          >
            <Link href="/" className="block">
              <Image
                src="/images/logo/3.png"
                alt="logo"
                width={110}
                height={36}
                priority
                className="object-contain dark:brightness-110"
              />
            </Link>
          </motion.div>

          {/* نوار جستجوی هوشمند در مرکز با پویانمایی فوکوس */}
          <div className="flex-1 max-w-2xl hidden md:block">
            <SearchBox />
          </div>

          {/* اکشن‌های هدر */}
          <div className="flex items-center gap-3">
            <HeaderActions />
          </div>

        </div>
      </section>
    </header>
  );
};

export default Header;