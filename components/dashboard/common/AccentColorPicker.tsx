// components/dashboard/common/AccentColorPicker.tsx
"use client";

import React from "react";
import { useTheme } from "../../../context/ThemeContext";
import { motion } from "framer-motion";
import { FiCheck } from "react-icons/fi";

type Accent = "indigo" | "emerald" | "rose" | "amber";

interface AccentOption {
  id: Accent;
  name: string;
  colorClass: string;
  glowClass: string;
}

export const AccentColorPicker: React.FC = () => {
  const { accent, setAccent } = useTheme();

  const accentOptions: AccentOption[] = [
    { 
      id: "indigo", 
      name: "نیلگون", 
      colorClass: "bg-[#465fff]", 
      glowClass: "shadow-[0_0_12px_rgba(70,95,255,0.4)]" 
    },
    { 
      id: "emerald", 
      name: "زمردین", 
      colorClass: "bg-[#10b981]", 
      glowClass: "shadow-[0_0_12px_rgba(16,185,129,0.4)]" 
    },
    { 
      id: "rose", 
      name: "یاقوتی", 
      colorClass: "bg-[#f43f5e]", 
      glowClass: "shadow-[0_0_12px_rgba(244,63,94,0.4)]" 
    },
    { 
      id: "amber", 
      name: "کهربایی", 
      colorClass: "bg-[#f59e0b]", 
      glowClass: "shadow-[0_0_12px_rgba(245,158,11,0.4)]" 
    },
  ];

  return (
    <div className="flex items-center gap-1.5 p-1 bg-slate-100/50 dark:bg-[#121420]/30 border border-slate-200/60 dark:border-[#1f2235]/65 rounded-full backdrop-blur-xl">
      {accentOptions.map((option) => {
        const isActive = accent === option.id;

        return (
          <button
            key={option.id}
            onClick={() => setAccent(option.id)}
            title={`تم ${option.name}`}
            aria-label={`تغییر تم به ${option.name}`}
            className="relative w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 focus:outline-none"
          >
            {/* دایره رنگی پویا */}
            <span
              className={`w-5 h-5 rounded-full transition-all duration-350 ${option.colorClass} ${
                isActive ? `${option.glowClass} scale-110` : "hover:scale-105 opacity-80 hover:opacity-100"
              }`}
            />

            {/* نشانگر تأیید برای تم فعال */}
            {isActive && (
              <motion.span
                layoutId="activeAccentCheck"
                className="absolute inset-0 flex items-center justify-center text-white text-[10px]"
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                <FiCheck className="stroke-[3.5px] drop-shadow-sm" />
              </motion.span>
            )}
          </button>
        );
      })}
    </div>
  );
};