// کارت نئونی افکت نور پردازی ماوس (Spotlight Card)

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SpotlightCardProps {
  children: React.ReactNode;
  glowColor?: string;
}

export const SpotlightCard = React.memo(function SpotlightCard({
  children,
  glowColor = "rgba(99, 102, 241, 0.15)",
}: SpotlightCardProps) {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => setCoords({ x, y }));
  }, []);

  useEffect(() => () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative group/card rounded-2xl p-[1px] overflow-hidden bg-slate-200/50 dark:bg-[#1f2235]/50 shadow-sm transition-transform duration-350 hover:-translate-y-1"
    >
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute pointer-events-none -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full blur-2xl z-0"
            style={{
              left: `${coords.x}px`,
              top: `${coords.y}px`,
              background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
            }}
          />
        )}
      </AnimatePresence>
      <div className="relative z-10 bg-white/95 dark:bg-[#0c0d14]/95 p-4 rounded-[15px] flex items-center justify-between">
        {children}
      </div>
    </div>
  );
});