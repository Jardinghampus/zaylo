"use client";
import { forwardRef, ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost" | "tinted" | "destructive";
type Size = "sm" | "md" | "lg";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  fullWidth?: boolean;
}

const variantStyles: Record<Variant, string> = {
  primary:     "bg-apple-blue text-white hover:brightness-90 active:brightness-75",
  secondary:   "bg-[#F5F5F7] border border-black/10 text-text-primary hover:bg-[#E8E8ED]",
  ghost:       "bg-transparent text-apple-blue hover:bg-[rgba(0,113,227,0.06)]",
  tinted:      "bg-[rgba(0,113,227,0.10)] text-apple-blue hover:bg-[rgba(0,113,227,0.16)]",
  destructive: "bg-[rgba(255,59,48,0.10)] text-apple-red border border-[rgba(255,59,48,0.20)] hover:bg-[rgba(255,59,48,0.16)]",
};

const sizeStyles: Record<Size, string> = {
  sm: "h-[30px] px-4 text-[13px]",
  md: "h-[38px] px-5 text-[15px]",
  lg: "h-[50px] px-7 text-[17px]",
};

export const AppleButton = forwardRef<HTMLButtonElement, Props>(
  ({ variant = "primary", size = "md", loading, fullWidth, className = "", children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={[
          "inline-flex items-center justify-center gap-2 rounded-pill font-semibold",
          "tracking-[-0.02em] select-none cursor-pointer",
          "transition-all duration-fast ease-apple",
          "active:scale-97 disabled:opacity-[0.38] disabled:cursor-not-allowed",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-apple-blue focus-visible:ring-offset-2",
          variantStyles[variant],
          sizeStyles[size],
          fullWidth ? "w-full" : "",
          className,
        ].join(" ")}
        {...props}
      >
        {loading ? (
          <span className="inline-flex items-center gap-2">
            <Spinner size={size} />
            <span>{children}</span>
          </span>
        ) : children}
      </button>
    );
  }
);
AppleButton.displayName = "AppleButton";

function Spinner({ size }: { size: Size }) {
  const s = size === "sm" ? 12 : size === "lg" ? 18 : 15;
  return (
    <svg
      width={s} height={s}
      viewBox="0 0 24 24"
      fill="none"
      className="animate-spin"
      aria-hidden
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" strokeOpacity="0.25" />
      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}
