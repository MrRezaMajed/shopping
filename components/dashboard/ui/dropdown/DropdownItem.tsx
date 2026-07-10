import Link from "next/link";
import { ReactNode, MouseEvent } from "react";

interface DropdownItemProps {
  tag?: "button" | "a";
  href?: string;
  onClick?: () => void;
  onItemClick?: () => void;
  baseClassName?: string;
  className?: string;
  children: ReactNode;
}

export const DropdownItem = ({
  tag = "button",
  href,
  onClick,
  onItemClick,
  baseClassName = "block w-full  px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900",
  className = "",
  children,
}: DropdownItemProps) => {
  const combinedClasses = `${baseClassName} ${className}`.trim();

  const handleClick = (event: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    if (tag === "button") {
      event.preventDefault();
    }
    if (onClick) onClick();
    if (onItemClick) onItemClick();
  };

  if (tag === "a" && href) {
    return (
      <Link href={href} className={combinedClasses} onClick={handleClick}>
        {children}
      </Link>
    );
  }

  return (
    <button onClick={handleClick} className={combinedClasses} type="button">
      {children}
    </button>
  );
};
