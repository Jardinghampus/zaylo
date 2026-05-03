import { ReactNode, HTMLAttributes } from "react";

interface Props extends HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
  children: ReactNode;
}

const paddingMap = { none: "", sm: "p-3", md: "p-4", lg: "p-6" };

export function AppleCard({ interactive, padding = "md", className = "", children, ...props }: Props) {
  return (
    <div
      className={[
        "bg-white border border-[var(--separator)] rounded-xl shadow-card",
        paddingMap[padding],
        interactive ? "card-interactive cursor-pointer" : "",
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </div>
  );
}
