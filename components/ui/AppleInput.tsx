"use client";
import { forwardRef, InputHTMLAttributes, useState, ReactNode } from "react";

interface Props extends Omit<InputHTMLAttributes<HTMLInputElement>, "prefix"> {
  label: string;
  error?: string;
  prefix?: ReactNode;
  suffix?: ReactNode;
  onClear?: () => void;
}

export const AppleInput = forwardRef<HTMLInputElement, Props>(
  ({ label, error, prefix, suffix, onClear, className = "", value, ...props }, ref) => {
    const [focused, setFocused] = useState(false);
    const hasValue = Boolean(value ?? props.defaultValue ?? "");
    const floated = focused || hasValue;

    return (
      <div className={`relative ${className}`}>
        <div
          className={[
            "relative flex items-center h-[52px] rounded-md bg-white",
            "border transition-all duration-fast ease-apple",
            error
              ? "border-apple-red shadow-[0_0_0_3.5px_rgba(255,59,48,0.15)]"
              : focused
              ? "border-apple-blue shadow-[0_0_0_3.5px_rgba(0,113,227,0.15)]"
              : "border-[var(--separator-thick)]",
          ].join(" ")}
        >
          {prefix && (
            <span className="pl-4 text-text-secondary flex-shrink-0">{prefix}</span>
          )}
          <div className="relative flex-1 h-full">
            <label
              className={[
                "absolute left-4 transition-all duration-fast ease-apple pointer-events-none",
                "text-text-tertiary",
                floated
                  ? "top-[7px] text-[11px] font-medium"
                  : "top-1/2 -translate-y-1/2 text-[17px]",
                prefix ? "left-2" : "",
              ].join(" ")}
            >
              {label}
            </label>
            <input
              ref={ref}
              value={value}
              onFocus={(e) => { setFocused(true); props.onFocus?.(e); }}
              onBlur={(e) => { setFocused(false); props.onBlur?.(e); }}
              className={[
                "absolute inset-0 bg-transparent outline-none text-text-primary text-[17px]",
                "px-4 pb-0",
                floated ? "pt-[22px]" : "pt-0",
                prefix ? "pl-2" : "",
              ].join(" ")}
              {...props}
            />
          </div>
          {onClear && hasValue && (
            <button
              type="button"
              onClick={onClear}
              className="pr-3 text-text-tertiary hover:text-text-secondary transition-colors"
              aria-label="Clear"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"/>
              </svg>
            </button>
          )}
          {suffix && <span className="pr-4 text-text-secondary flex-shrink-0">{suffix}</span>}
        </div>
        {error && (
          <p className="mt-1 text-caption1 text-apple-red" role="alert">{error}</p>
        )}
      </div>
    );
  }
);
AppleInput.displayName = "AppleInput";
