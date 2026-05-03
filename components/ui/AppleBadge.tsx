type Variant = "green" | "blue" | "grey" | "amber" | "red";

interface Props {
  variant?: Variant;
  children: React.ReactNode;
  className?: string;
}

const styles: Record<Variant, string> = {
  green: "bg-[rgba(52,199,89,0.12)] text-[#248A3D]",
  blue:  "bg-[rgba(0,113,227,0.10)] text-apple-blue",
  grey:  "bg-[var(--fill-tertiary)] text-text-secondary",
  amber: "bg-[rgba(255,149,0,0.12)] text-[#C93400]",
  red:   "bg-[rgba(255,59,48,0.10)] text-apple-red",
};

export function AppleBadge({ variant = "grey", children, className = "" }: Props) {
  return (
    <span
      className={[
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-pill",
        "text-caption1 font-medium whitespace-nowrap",
        styles[variant],
        className,
      ].join(" ")}
    >
      {children}
    </span>
  );
}
