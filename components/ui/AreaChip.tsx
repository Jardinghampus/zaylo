"use client";
import { CheckIcon } from "lucide-react";

interface Props {
  label: string;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
}

export function AreaChip({ label, selected, onClick, className = "" }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "inline-flex items-center gap-1.5 h-[34px] px-[14px] rounded-pill",
        "text-subhead transition-all duration-fast ease-apple select-none",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-apple-blue",
        selected
          ? "bg-[rgba(0,113,227,0.10)] border border-[rgba(0,113,227,0.30)] text-apple-blue"
          : "bg-[var(--fill-quaternary)] border border-transparent text-text-primary hover:bg-[var(--fill-tertiary)]",
        className,
      ].join(" ")}
      aria-pressed={selected}
    >
      {selected && (
        <CheckIcon
          size={13}
          strokeWidth={2.5}
          className="flex-shrink-0 animate-[scaleIn_160ms_var(--ease-apple)_both]"
          aria-hidden
        />
      )}
      {label}
    </button>
  );
}
