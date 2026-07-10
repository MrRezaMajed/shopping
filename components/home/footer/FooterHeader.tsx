// بخش لوگو و دکمه برگشت به بالا

"use client";

import { FC } from "react";
import Image from "next/image";
import { FaChevronUp } from "react-icons/fa";
import { motion } from "framer-motion";

const FooterHeader: FC = () => {
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200/40 dark:border-zinc-900/50 pb-6 mb-8">
      <div className="flex-shrink-0 transition-transform duration-300 hover:scale-[1.02]">
        <Image
          src="/images/logo/3.png"
          alt="logo"
          width={100}
          height={32}
          className="object-contain dark:brightness-110"
        />
      </div>
      
      <motion.button
        whileHover={{ scale: 1.04, y: -2 }}
        whileTap={{ scale: 0.96 }}
        onClick={handleScrollToTop}
        className="group flex items-center gap-2 px-4 py-2.5 text-xs font-extrabold text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-100 border border-slate-200 dark:border-zinc-800 rounded-xl hover:bg-white dark:hover:bg-zinc-900/60 transition-colors duration-300 shadow-sm"
      >
        برگشت به بالا
        <motion.span
          animate={{ y: [0, -3, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <FaChevronUp className="text-[10px] text-red-500 dark:text-red-400" />
        </motion.span>
      </motion.button>
    </div>
  );
};

export default FooterHeader;