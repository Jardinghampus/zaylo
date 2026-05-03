"use client";
import { useState } from "react";
import { AppleSegmented } from "@/components/ui/AppleSegmented";
import { AppleBadge } from "@/components/ui/AppleBadge";
import { useRequests } from "@/hooks/useRequests";
import { formatPrice, formatDate, whatsAppLink } from "@/lib/utils/format";

export default function AdminRequests() {
  const [intent, setIntent] = useState<"all" | "buy" | "rent">("all");
  const { data: requests = [], isLoading } = useRequests(intent === "all" ? undefined : intent);

  return (
    <div>
      <div className="flex items-center justify-between mb-6 gap-4">
        <h1 className="text-title1">Requests</h1>
        <AppleSegmented
          options={[{ value: "all", label: "All" }, { value: "buy", label: "Buying" }, { value: "rent", label: "Renting" }]}
          value={intent}
          onChange={setIntent}
          className="w-[220px]"
        />
      </div>

      <div className="bg-white border border-[var(--separator)] rounded-xl shadow-card overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-text-secondary text-subhead">Loading…</div>
        ) : requests.length === 0 ? (
          <div className="p-12 text-center text-text-tertiary text-body">No requests</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[var(--separator)] bg-[var(--fill-quaternary)]">
                  {["Intent", "Property", "Areas", "Budget", "Name", "Date", "Contact"].map((h) => (
                    <th key={h} className="px-4 py-3 text-caption1 text-text-secondary font-medium uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {requests.map((r) => (
                  <tr key={r.id} className="border-b border-[var(--separator)] last:border-0 hover:bg-[var(--fill-quaternary)] transition-colors">
                    <td className="px-4 py-3">
                      <AppleBadge variant={r.intent === "buy" ? "green" : "blue"}>
                        {r.intent === "buy" ? "Buying" : "Renting"}
                      </AppleBadge>
                    </td>
                    <td className="px-4 py-3 text-subhead whitespace-nowrap">
                      {r.bedrooms === "Studio" ? "Studio" : `${r.bedrooms}BR`} {r.property_type}
                    </td>
                    <td className="px-4 py-3 text-subhead text-text-secondary">
                      {r.areas.map((a) => a.name).join(", ") || "—"}
                    </td>
                    <td className="px-4 py-3 text-subhead tabular-nums whitespace-nowrap">
                      {r.budget_min && r.budget_max
                        ? `${formatPrice(r.budget_min)} – ${formatPrice(r.budget_max)}`
                        : r.budget_min ? `From ${formatPrice(r.budget_min)}`
                        : r.budget_max ? `Up to ${formatPrice(r.budget_max)}`
                        : "—"}
                    </td>
                    <td className="px-4 py-3 text-subhead whitespace-nowrap">{r.requester_name}</td>
                    <td className="px-4 py-3 text-caption1 text-text-tertiary whitespace-nowrap">
                      {r.created_at ? formatDate(r.created_at) : ""}
                    </td>
                    <td className="px-4 py-3">
                      <a
                        href={whatsAppLink(r.whatsapp)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 h-8 px-3 rounded-pill bg-whatsapp text-white text-caption1 font-medium hover:brightness-95 transition-all"
                      >
                        WhatsApp
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
