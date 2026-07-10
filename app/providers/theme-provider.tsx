"use client";
import React,{ useEffect, ReactNode } from "react";
import { ThemeProvider } from "next-themes";

interface ThemeProviderWrapperProps {
  children: ReactNode;
}

export default function ThemeProviderWrapper({ children }: ThemeProviderWrapperProps) {
  const [mounted, setMounted] = React.useState(false);

  useEffect(() => {
    setMounted(true);
    localStorage.removeItem("theme");
    localStorage.removeItem("resolvedTheme");
  }, []);

  if (!mounted) return null; // تا قبل از mount هیچ چیزی رندر نشود

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem storageKey="theme">
      {children}
    </ThemeProvider>
  );
}
