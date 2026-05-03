"use client";
import { useQuery } from "@tanstack/react-query";

interface Stats { totalListings: number; pendingVerification: number; activeRequests: number; }

export function StatsBar() {
  const { data } = useQuery<Stats>({
    queryKey: ["admin-stats"],
    queryFn: () => fetch("/api/admin/stats").then((r) => r.json()),
  });

  const stats = [
    { label: "Total Listings", value: data?.totalListings ?? "—" },
    { label: "Pending Verification", value: data?.pendingVerification ?? "—" },
    { label: "Active Requests", value: data?.activeRequests ?? "—" },
  ];

  return (
    <div className="grid grid-cols-3 gap-4 mb-8">
      {stats.map(({ label, value }) => (
        <div key={label} className="bg-white border border-[var(--separator)] rounded-xl p-4 shadow-card">
          <p className="text-[28px] font-semibold tabular-nums text-text-primary leading-none mb-1">{value}</p>
          <p className="text-footnote text-text-secondary">{label}</p>
        </div>
      ))}
    </div>
  );
}
