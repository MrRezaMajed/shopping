"use client";
import React, { FC, useState } from "react";
import Link from "next/link";
import { FaNewspaper, FaSignOutAlt, FaUser, FaUserCircle } from "react-icons/fa";
import { FcLike } from "react-icons/fc";
import { motion, AnimatePresence } from "framer-motion";

interface UserProfileProps {
  signout: typeof import("next-auth/react").signOut;
}

const UserProfile: FC<UserProfileProps> = ({ signout }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await signout({ redirect: false });
  };

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {/* دکمه پروفایل */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-10 h-10 flex items-center justify-center rounded-2xl bg-slate-50 hover:bg-slate-100 active:scale-95 dark:bg-zinc-900 dark:hover:bg-zinc-800/80 border border-slate-200/40 dark:border-zinc-800/60 text-slate-700 hover:text-slate-900 dark:text-zinc-200 dark:hover:text-zinc-100 transition-colors duration-300"
        type="button"
      >
        <FaUser className="text-sm" />
      </motion.button>

      {/* منوی پروفایل کشویی با استایل متحرک سه بعدی */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 380, damping: 25 }}
            className="absolute left-0 mt-2 w-52 bg-white dark:bg-zinc-950/95 backdrop-blur-2xl border border-slate-150/80 dark:border-zinc-800/80 shadow-2xl dark:shadow-[0_25px_50px_rgba(0,0,0,0.5)] rounded-2xl p-2 z-50 origin-top-left"
          >
            <Link
              href="/profile"
              className="flex items-center gap-2.5 px-3 py-2.5 text-xs font-bold text-slate-700 hover:text-slate-950 hover:bg-slate-50 dark:text-zinc-300 dark:hover:text-zinc-50 dark:hover:bg-zinc-900/60 rounded-xl transition-all"
            >
              <FaUserCircle className="text-base text-slate-400 dark:text-zinc-500" /> پروفایل کاربری
            </Link>

            <Link
              href="/profile/orders"
              className="flex items-center gap-2.5 px-3 py-2.5 text-xs font-bold text-slate-700 hover:text-slate-950 hover:bg-slate-50 dark:text-zinc-300 dark:hover:text-zinc-50 dark:hover:bg-zinc-900/60 rounded-xl transition-all"
            >
              <FaNewspaper className="text-base text-slate-400 dark:text-zinc-500" /> سفارشات من
            </Link>

            <Link
              href="/profile/favorites"
              className="flex items-center gap-2.5 px-3 py-2.5 text-xs font-bold text-slate-700 hover:text-slate-950 hover:bg-slate-50 dark:text-zinc-300 dark:hover:text-zinc-50 dark:hover:bg-zinc-900/60 rounded-xl transition-all"
            >
              <FcLike className="text-base" /> لیست علاقه‌مندی‌ها
            </Link>

            <div className="my-1.5 border-t border-slate-100 dark:border-zinc-900" />

            <button
              onClick={handleLogout}
              className="flex items-center gap-2.5 px-3 py-2.5 w-full text-right text-xs font-extrabold text-red-600 hover:bg-red-50/50 dark:text-red-400 dark:hover:bg-red-950/20 rounded-xl transition-all"
            >
              <FaSignOutAlt className="text-sm" /> خروج از حساب
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserProfile;