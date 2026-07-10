// دکمه ثبت آیتم جدید

import React from "react";
import { FiPlus } from "react-icons/fi";
import { Button } from "@/components/ui/Button";

interface CreateButtonProps {
  onClick: () => void;
  label: string;
}

export const CreateButton = React.memo(function CreateButton({ onClick, label }: CreateButtonProps) {
  return (
    <Button
      onClick={onClick}
      variant="success"
      withShine
      withGlow
      iconLeft={<FiPlus className="h-4 w-4" />}
      iconRotate={90}
      size="md"
      className="shadow-emerald-500/15 font-semibold rounded-xl px-5"
    >
      <span className="flex items-center gap-1.5">
        {label}
        <kbd className="hidden sm:inline-flex items-center justify-center px-1.5 py-0.5 rounded border border-emerald-500/30 bg-emerald-500/10 text-[9px] font-mono mr-1">C</kbd>
      </span>
    </Button>
  );
});