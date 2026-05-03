"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboardIcon, ListIcon, UsersIcon, MapPinIcon } from "lucide-react";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboardIcon, exact: true },
  { href: "/admin/listings", label: "Listings", icon: ListIcon },
  { href: "/admin/requests", label: "Requests", icon: UsersIcon },
  { href: "/admin/areas", label: "Areas", icon: MapPinIcon },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-[200px] min-h-screen border-r border-[var(--separator)] bg-white flex-shrink-0">
      <div className="px-4 py-5 border-b border-[var(--separator)]">
        <span className="text-headline font-bold text-text-primary tracking-[-0.02em]">Zaylo</span>
        <span className="ml-1.5 text-caption1 text-text-tertiary">Admin</span>
      </div>
      <nav className="flex-1 py-2" aria-label="Admin navigation">
        {NAV.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={[
                "flex items-center gap-3 px-4 py-2.5 text-subhead transition-colors",
                "hover:bg-[var(--fill-quaternary)]",
                active
                  ? "text-apple-blue font-medium bg-[rgba(0,113,227,0.06)]"
                  : "text-text-secondary",
              ].join(" ")}
              aria-current={active ? "page" : undefined}
            >
              <Icon size={16} aria-hidden />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="px-4 py-4 border-t border-[var(--separator)]">
        <Link href="/" className="text-caption1 text-text-tertiary hover:text-text-secondary transition-colors">
          ← Back to site
        </Link>
      </div>
    </aside>
  );
}
