"use client";

interface Props {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  id?: string;
  disabled?: boolean;
}

export function AppleToggle({ checked, onChange, label, id, disabled }: Props) {
  return (
    <label
      htmlFor={id}
      className={[
        "inline-flex items-center gap-3 select-none",
        disabled ? "opacity-[0.38] cursor-not-allowed" : "cursor-pointer",
      ].join(" ")}
    >
      {label && <span className="text-body text-text-primary">{label}</span>}
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={[
          "relative flex-shrink-0 w-[51px] h-[31px] rounded-[31px]",
          "transition-colors duration-[280ms] ease-in-out",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-apple-blue focus-visible:ring-offset-2",
          checked ? "bg-apple-green" : "bg-[#E5E5EA]",
        ].join(" ")}
      >
        <span
          className={[
            "absolute top-[2px] w-[27px] h-[27px] bg-white rounded-full",
            "shadow-[0_2px_4px_rgba(0,0,0,0.25)]",
            "transition-transform duration-[280ms] ease-in-out",
            checked ? "translate-x-[20px]" : "translate-x-[2px]",
          ].join(" ")}
          aria-hidden
        />
      </button>
    </label>
  );
}
