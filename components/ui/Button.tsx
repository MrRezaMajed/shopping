// components/ui/Button.tsx
import { forwardRef, ReactNode, ButtonHTMLAttributes, useState, MouseEvent } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "success"
  | "danger"
  | "warning"
  | "ghost"
  | "outline"
  | "glass";

export type ButtonSize = "sm" | "md" | "lg" | "xl";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  loading?: boolean;
  withShine?: boolean;
  withRipple?: boolean;
  withGlow?: boolean;
  iconRotate?: boolean | 90 | 180 | -90;
  iconScale?: boolean;
  iconTranslate?: "left" | "right" | "up" | "down" | false;
  hoverBg?: string;
  hoverText?: string;
  glass?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-blue-600 hover:bg-blue-700 text-white border-transparent " +
    "shadow-blue-600/30 dark:shadow-blue-800/40 " +
    "dark:bg-blue-700 dark:hover:bg-blue-800 " +
    "focus:ring-blue-500 dark:focus:ring-blue-400",

  secondary:
    "bg-gray-200 hover:bg-gray-300 text-gray-800 border-transparent " +
    "dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 " +
    "focus:ring-gray-500 dark:focus:ring-gray-400",

  success:
    "bg-emerald-600 hover:bg-emerald-700 text-white border-transparent " +
    "shadow-emerald-600/30 dark:shadow-emerald-900/40 " +
    "dark:bg-emerald-700 dark:hover:bg-emerald-800 " +
    "focus:ring-emerald-500 dark:focus:ring-emerald-400",

  danger:
    "bg-red-600 hover:bg-red-700 text-white border-transparent " +
    "shadow-red-600/30 dark:shadow-red-900/40 " +
    "dark:bg-red-700 dark:hover:bg-red-800 " +
    "focus:ring-red-500 dark:focus:ring-red-400",

  warning:
    "bg-amber-500 hover:bg-amber-600 text-white border-transparent " +
    "shadow-amber-500/30 dark:shadow-amber-900/40 " +
    "dark:bg-amber-600 dark:hover:bg-amber-700 " +
    "focus:ring-amber-500 dark:focus:ring-amber-400",

  ghost:
    "bg-transparent hover:bg-gray-100 text-gray-700 " +
    "border border-gray-200 " +
    "dark:hover:bg-gray-800/70 dark:text-gray-300 " +
    "dark:border-gray-700 " +
    "focus:ring-gray-400 dark:focus:ring-gray-600",

  outline:
    "bg-transparent hover:bg-gray-100 text-gray-700 " +
    "border-2 border-gray-300 " +
    "dark:hover:bg-gray-800/50 dark:text-gray-300 " +
    "dark:border-gray-600 " +
    "focus:ring-gray-400 dark:focus:ring-gray-500",

  glass:
    "bg-white/20 dark:bg-gray-800/30 backdrop-blur-md " +
    "border border-white/30 dark:border-gray-700/50 " +
    "text-gray-700 dark:text-gray-300 " +
    "hover:bg-white/40 dark:hover:bg-gray-800/50 hover:shadow-lg " +
    "focus:ring-gray-400 dark:focus:ring-gray-500",
};

const glowClasses: Record<ButtonVariant, string> = {
  primary: "shadow-[0_0_20px_rgba(37,99,235,0.25)] hover:shadow-[0_0_35px_rgba(37,99,235,0.45)]",
  secondary: "shadow-[0_0_20px_rgba(156,163,175,0.2)] hover:shadow-[0_0_35px_rgba(156,163,175,0.35)]",
  success: "shadow-[0_0_20px_rgba(16,185,129,0.25)] hover:shadow-[0_0_35px_rgba(16,185,129,0.45)]",
  danger: "shadow-[0_0_20px_rgba(220,38,38,0.25)] hover:shadow-[0_0_35px_rgba(220,38,38,0.45)]",
  warning: "shadow-[0_0_20px_rgba(245,158,11,0.25)] hover:shadow-[0_0_35px_rgba(245,158,11,0.45)]",
  ghost: "shadow-none",
  outline: "shadow-none",
  glass: "shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_35px_rgba(255,255,255,0.2)]",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs rounded-lg gap-1.5 min-h-[32px]",
  md: "px-4 py-2.5 text-sm rounded-xl gap-2 min-h-[40px]",
  lg: "px-6 py-3 text-base rounded-xl gap-2.5 min-h-[48px]",
  xl: "px-8 py-4 text-lg rounded-2xl gap-3 min-h-[56px]",
};

// بازگرداندن کلاس حیاتی overflow-hidden به هسته اصلی کلاس‌های دکمه
const baseClasses =
  "group relative inline-flex items-center justify-center font-medium " +
  "transition-all duration-300 ease-out transform-gpu overflow-hidden " + // اضافه شدن مجدد overflow-hidden برای برش لایه‌های انیمیشن در مرز دکمه
  "hover:scale-[1.03] active:scale-[0.97] " +
  "disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 disabled:active:scale-100 " +
  "focus:outline-none focus:ring-2 focus:ring-offset-2 " +
  "focus:ring-offset-white dark:focus:ring-offset-gray-900";

interface RippleState {
  x: number;
  y: number;
  id: number;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      iconLeft,
      iconRight,
      loading = false,
      withShine = false,
      withRipple = false,
      withGlow = false,
      iconRotate = false,
      iconScale = false,
      iconTranslate = false,
      hoverBg,
      hoverText,
      glass = false,
      children,
      className = "",
      disabled,
      type = "button",
      onClick,
      ...props
    },
    ref
  ) => {
    const [ripples, setRipples] = useState<RippleState[]>([]);
    const isDisabled = disabled || loading;
    const finalVariant = glass ? "glass" : variant;

    const handleTriggerRipple = (event: MouseEvent<HTMLButtonElement>) => {
      if (!withRipple || isDisabled) return;

      const rect = event.currentTarget.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const newRipple: RippleState = {
        x,
        y,
        id: Date.now(),
      };

      setRipples((prev) => [...prev, newRipple]);

      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
      }, 600);
    };

    const handleButtonClick = (event: MouseEvent<HTMLButtonElement>) => {
      handleTriggerRipple(event);
      if (onClick) onClick(event);
    };

    const getIconRotate = () => {
      if (iconRotate === 90) return "group-hover:rotate-90";
      if (iconRotate === 180) return "group-hover:rotate-180";
      if (iconRotate === -90) return "group-hover:-rotate-90";
      if (iconRotate === true) return "group-hover:rotate-12";
      return "";
    };

    const getIconTranslate = () => {
      if (iconTranslate === "left") return "group-hover:-translate-x-1";
      if (iconTranslate === "right") return "group-hover:translate-x-1";
      if (iconTranslate === "up") return "group-hover:-translate-y-1";
      if (iconTranslate === "down") return "group-hover:translate-y-1";
      return "";
    };

    const rotateClass = getIconRotate();
    const translateClass = getIconTranslate();

    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          baseClasses,
          variantClasses[finalVariant as ButtonVariant],
          sizeClasses[size],
          withGlow && glowClasses[finalVariant as ButtonVariant],
          loading && "cursor-wait",
          hoverBg && `hover:${hoverBg}`,
          hoverText && `hover:${hoverText}`,
          className
        )}
        disabled={isDisabled}
        onClick={handleButtonClick}
        aria-busy={loading ? "true" : undefined}
        aria-live={loading ? "polite" : undefined}
        {...props}
      >
        {/* Shine Effect */}
        {withShine && !loading && (
          <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 pointer-events-none" />
        )}

        {/* Dynamic Ripple Effect */}
        {withRipple && !loading && (
          <span className="absolute inset-0 overflow-hidden pointer-events-none">
            {ripples.map((ripple) => (
              <span
                key={ripple.id}
                className="absolute bg-white/30 rounded-full animate-ping pointer-events-none"
                style={{
                  width: "100px",
                  height: "100px",
                  left: ripple.x - 50,
                  top: ripple.y - 50,
                  transform: "scale(0)",
                  animation: "ripple 600ms linear",
                }}
              />
            ))}
          </span>
        )}

        {/* Spinner */}
        {loading && (
          <svg
            className="animate-spin h-4 w-4 flex-shrink-0 z-10 mr-2"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        )}

        {/* Content */}
        <span className="relative z-10 inline-flex items-center justify-center gap-2">
          {!loading && iconLeft && (
            <span
              className={cn(
                "flex-shrink-0 transition-all duration-300",
                rotateClass,
                translateClass,
                iconScale && "group-hover:scale-110"
              )}
            >
              {iconLeft}
            </span>
          )}
          <span>{children}</span>
          {!loading && iconRight && (
            <span
              className={cn(
                "flex-shrink-0 transition-all duration-300",
                rotateClass,
                translateClass,
                iconScale && "group-hover:scale-110"
              )}
            >
              {iconRight}
            </span>
          )}
        </span>
      </button>
    );
  }
);

Button.displayName = "Button";