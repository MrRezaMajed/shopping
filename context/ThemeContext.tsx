// context/ThemeContext.tsx
"use client";

import {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";

type Theme = "light" | "dark" | "system";
type Accent = "indigo" | "emerald" | "rose" | "amber";

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: "light" | "dark";
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  accent: Accent;
  setAccent: (accent: Accent) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

const getSystemTheme = (): "light" | "dark" => {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [theme, setTheme] = useState<Theme>("system");
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");
  const [accent, setAccentState] = useState<Accent>("indigo");
  const [mounted, setMounted] = useState(false);

  // بارگذاری تنظیمات ذخیره‌شده کاربر (حفظ وضعیت آبرسانی SSR)
  useEffect(() => {
    setMounted(true);

    const savedTheme = localStorage.getItem("theme") as Theme | null;
    const savedAccent = localStorage.getItem("theme-accent") as Accent | null;

    setTheme(savedTheme || "system");
    setAccentState(savedAccent || "indigo");
  }, []);

  // اعمال تیره/روشن
  useEffect(() => {
    if (!mounted) return;

    const systemTheme = getSystemTheme();
    const activeTheme = theme === "system" ? systemTheme : theme;

    setResolvedTheme(activeTheme);

    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(activeTheme);

    localStorage.setItem("theme", theme);
  }, [theme, mounted]);

  // اعمال رنگ مایه اصلی (Accent Color) به تگ html سراسری
  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    root.setAttribute("data-accent", accent);
    localStorage.setItem("theme-accent", accent);
  }, [accent, mounted]);

  // گوش دادن به تغییر تم سیستمی
  useEffect(() => {
    if (theme !== "system") return;

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const listener = () => {
      setResolvedTheme(media.matches ? "dark" : "light");
      document.documentElement.classList.toggle("dark", media.matches);
    };

    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(resolvedTheme === "light" ? "dark" : "light");
  };

  const setAccent = (newAccent: Accent) => {
    setAccentState(newAccent);
  };

  // رندر مستقیم المان‌های فرزند برای جلوگیری از بروز صفحه سفید در SSR
  return (
    <ThemeContext.Provider
      value={{ theme, resolvedTheme, setTheme, toggleTheme, accent, setAccent }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context)
    throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};