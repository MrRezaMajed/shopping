// بخش توضیحات مجازی و شبکه‌های اجتماعی

"use client";

import { FC } from "react";
import { 
  FaInstagram, 
  FaTelegram, 
  FaWhatsapp, 
  FaLinkedin 
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { motion } from "framer-motion";

const FooterSocials: FC = () => {
  return (
    <div className="space-y-4">
      <h4 className="text-xs font-black text-slate-900 dark:text-zinc-50 border-r-2 border-red-500 dark:border-red-400 pr-2.5">
        با ما همراه باشید
      </h4>
      <p className="text-xs text-slate-500 dark:text-zinc-400 pr-2.5 leading-6 font-medium">
        جهت مطلع شدن از آخرین تخفیف‌ها و پیشنهادات ما را در صفحات مجازی دنبال کنید.
      </p>
      <div className="flex items-center gap-4 text-xl pr-2.5 pt-1">
        <motion.a 
          whileHover={{ scale: 1.15, rotate: 6 }}
          whileTap={{ scale: 0.9 }}
          href="#" 
          aria-label="Instagram" 
          className="text-slate-400 hover:text-pink-500 dark:text-zinc-500 dark:hover:text-pink-400 transition-all duration-300"
        >
          <FaInstagram />
        </motion.a>
        <motion.a 
          whileHover={{ scale: 1.15, rotate: -6 }}
          whileTap={{ scale: 0.9 }}
          href="#" 
          aria-label="Telegram" 
          className="text-slate-400 hover:text-sky-500 dark:text-zinc-500 dark:hover:text-sky-400 transition-all duration-300"
        >
          <FaTelegram />
        </motion.a>
        <motion.a 
          whileHover={{ scale: 1.15, rotate: 6 }}
          whileTap={{ scale: 0.9 }}
          href="#" 
          aria-label="Whatsapp" 
          className="text-slate-400 hover:text-emerald-500 dark:text-zinc-500 dark:hover:text-emerald-400 transition-all duration-300"
        >
          <FaWhatsapp />
        </motion.a>
        <motion.a 
          whileHover={{ scale: 1.15, rotate: -6 }}
          whileTap={{ scale: 0.9 }}
          href="#" 
          aria-label="Twitter X" 
          className="text-slate-400 hover:text-black dark:text-zinc-500 dark:hover:text-white transition-all duration-300"
        >
          <FaXTwitter />
        </motion.a>
        <motion.a 
          whileHover={{ scale: 1.15, rotate: 6 }}
          whileTap={{ scale: 0.9 }}
          href="#" 
          aria-label="Linkedin" 
          className="text-slate-400 hover:text-blue-600 dark:text-zinc-500 dark:hover:text-blue-500 transition-all duration-300"
        >
          <FaLinkedin />
        </motion.a>
      </div>
    </div>
  );
};

export default FooterSocials;