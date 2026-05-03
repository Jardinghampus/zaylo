"use client";

interface Option<T extends string> {
  value: T;
  label: string;
}

interface Props<T extends string> {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

export function AppleSegmented<T extends string>({ options, value, onChange, className = "" }: Props<T>) {
  const activeIndex = options.findIndex((o) => o.value === value);

  return (
    <div
      className={`relative flex rounded-[9px] bg-[#E9E9EB] p-[2px] h-9 ${className}`}
      role="tablist"
    >
      {/* Sliding indicator */}
      <div
        className="absolute top-[2px] bottom-[2px] bg-white rounded-[7px] shadow-[0_1px_3px_rgba(0,0,0,0.15)] transition-all duration-fast ease-apple pointer-events-none"
        style={{
          left: `calc(${(activeIndex / options.length) * 100}% + 2px)`,
          width: `calc(${(1 / options.length) * 100}% - 4px)`,
        }}
        aria-hidden
      />
      {options.map((opt) => (
        <button
          key={opt.value}
          role="tab"
          aria-selected={opt.value === value}
          onClick={() => onChange(opt.value)}
          className={[
            "relative z-10 flex-1 flex items-center justify-center text-[13px] font-medium",
            "transition-colors duration-fast ease-apple select-none",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-apple-blue focus-visible:ring-inset",
            opt.value === value
              ? "text-text-primary"
              : "text-[rgba(60,60,67,0.6)]",
          ].join(" ")}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
