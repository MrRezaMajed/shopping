"use client";
import { FC, useEffect, useState } from "react";
import UserProfile from "./UserProfile";
import CartDropdown from "./CartDropdown";
import ThemeToggle from "./ThemeToggle";
import { useSession, signIn, signOut } from "next-auth/react";
import { FaSignInAlt } from "react-icons/fa";
import { motion } from "framer-motion";

const HeaderActions: FC = () => {
  const { data: session } = useSession();
  const [isRender, setIsRender] = useState(false);

  useEffect(() => {
    const handle = requestAnimationFrame(() => setIsRender(true));
    return () => cancelAnimationFrame(handle);
  }, []);

  if (!isRender) return null;

  return (
    <section className="flex items-center gap-4">
      {/* دکمه تم زنده با چرخش ملایم */}
      <ThemeToggle />

      {/* خط جداکننده مدرن */}
      <div className="h-6 w-[1.5px] bg-slate-200/80 dark:bg-zinc-800" />

      {/* بخش کاربری با تاپ متحرک */}
      <div className="flex items-center">
        {session ? (
          <UserProfile signout={signOut} />
        ) : (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => signIn()}
            className="flex items-center justify-center gap-2 px-4.5 py-2 text-xs font-extrabold text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 dark:text-zinc-200 dark:hover:text-zinc-50 dark:bg-zinc-900 dark:hover:bg-zinc-800/80 rounded-2xl border border-slate-200/40 dark:border-zinc-800/60 shadow-sm transition-colors duration-300"
          >
            <FaSignInAlt className="text-sm" />
            <span className="hidden sm:inline">ورود / ثبت‌نام</span>
          </motion.button>
        )}
      </div>

      {/* سبد خرید متحرک */}
      <div className="relative">
        <CartDropdown />
      </div>
    </section>
  );
};

export default HeaderActions;