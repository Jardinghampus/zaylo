"use client";
import { useState } from "react";
import { ExternalLinkIcon, ShieldCheckIcon, Trash2Icon } from "lucide-react";
import { AppleButton } from "@/components/ui/AppleButton";
import { AppleBadge } from "@/components/ui/AppleBadge";
import { AppleModal } from "@/components/ui/AppleModal";
import { formatPrice, formatDate } from "@/lib/utils/format";
import { useListings, useVerifyListing, useRemoveListing } from "@/hooks/useListings";

export function ListingTable() {
  const [filter, setFilter] = useState<"all" | "pending" | "active" | "removed">("all");
  const [confirmId, setConfirmId] = useState<string | null>(null);

  // Fetch all statuses
  const { data: pending = [], isLoading: p1 } = useListings({ status: "pending" });
  const { data: active = [], isLoading: p2 } = useListings({ status: "active" });
  const { data: removed = [], isLoading: p3 } = useListings({ status: "removed" });

  const verify = useVerifyListing();
  const remove = useRemoveListing();

  const all = [...pending, ...active, ...removed].sort(
    (a, b) => new Date(b.created_at!).getTime() - new Date(a.created_at!).getTime()
  );

  const filtered = filter === "all" ? all
    : filter === "pending" ? pending
    : filter === "active" ? active
    : removed;

  const isLoading = p1 || p2 || p3;

  return (
    <div>
      {/* Filter tabs */}
      <div className="flex gap-1 mb-5 p-1 bg-[var(--fill-quaternary)] rounded-lg w-fit">
        {(["all", "pending", "active", "removed"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={[
              "px-4 py-1.5 rounded-md text-subhead transition-all duration-fast capitalize",
              filter === f
                ? "bg-white shadow-sm text-text-primary font-medium"
                : "text-text-secondary hover:text-text-primary",
            ].join(" ")}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="bg-white border border-[var(--separator)] rounded-xl overflow-hidden shadow-card">
        {isLoading ? (
          <div className="p-8 text-center text-text-secondary text-subhead">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-text-tertiary text-body">No listings</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[var(--separator)] bg-[var(--fill-quaternary)]">
                  {["Property", "Location", "Prices", "Owner", "Status", "Date", "Actions"].map((h) => (
                    <th key={h} className="px-4 py-3 text-caption1 text-text-secondary font-medium uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((listing) => (
                  <tr key={listing.id} className="border-b border-[var(--separator)] last:border-0 hover:bg-[var(--fill-quaternary)] transition-colors">
                    <td className="px-4 py-3 text-subhead font-medium whitespace-nowrap">
                      {listing.bedrooms === "Studio" ? "Studio" : `${listing.bedrooms}BR`} {listing.property_type}
                    </td>
                    <td className="px-4 py-3 text-subhead text-text-secondary whitespace-nowrap">
                      {(listing as { sub_area?: { name: string }; area?: { name: string } }).sub_area?.name
                        ? `${(listing as { sub_area?: { name: string } }).sub_area!.name}, `
                        : ""}
                      {(listing as { area?: { name: string } }).area?.name ?? "—"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {listing.list_for_sale && listing.sale_price && (
                        <p className="text-subhead tabular-nums">{formatPrice(listing.sale_price)}</p>
                      )}
                      {listing.list_for_rent && listing.rent_price && (
                        <p className="text-caption1 text-text-secondary tabular-nums">{formatPrice(listing.rent_price)}/yr</p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-subhead whitespace-nowrap">{listing.owner_name}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <StatusBadge status={listing.status ?? "pending"} verified={listing.verified ?? false} />
                    </td>
                    <td className="px-4 py-3 text-caption1 text-text-tertiary whitespace-nowrap">
                      {listing.created_at ? formatDate(listing.created_at) : ""}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {listing.title_deed_url && (
                          <a href={listing.title_deed_url} target="_blank" rel="noopener noreferrer"
                            className="p-1.5 rounded-md hover:bg-[var(--fill-tertiary)] transition-colors text-text-secondary"
                            aria-label="View title deed">
                            <ExternalLinkIcon size={14} />
                          </a>
                        )}
                        {listing.status !== "removed" && (
                          <>
                            <AppleButton
                              size="sm"
                              variant={listing.verified ? "secondary" : "tinted"}
                              loading={verify.isPending && verify.variables?.id === listing.id}
                              onClick={() => verify.mutate({ id: listing.id, verified: !listing.verified })}
                            >
                              <ShieldCheckIcon size={12} aria-hidden />
                              {listing.verified ? "Unverify" : "Verify"}
                            </AppleButton>
                            <button
                              onClick={() => setConfirmId(listing.id)}
                              className="p-1.5 rounded-md hover:bg-[rgba(255,59,48,0.08)] text-apple-red transition-colors"
                              aria-label="Remove listing"
                            >
                              <Trash2Icon size={14} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AppleModal open={!!confirmId} onClose={() => setConfirmId(null)} title="Remove Listing">
        <p className="text-body text-text-secondary mb-5">This listing will be removed and hidden from public view.</p>
        <div className="flex gap-3">
          <AppleButton variant="secondary" size="md" fullWidth onClick={() => setConfirmId(null)}>Cancel</AppleButton>
          <AppleButton
            variant="destructive"
            size="md"
            fullWidth
            loading={remove.isPending}
            onClick={async () => {
              if (confirmId) { await remove.mutateAsync(confirmId); setConfirmId(null); }
            }}
          >
            Remove
          </AppleButton>
        </div>
      </AppleModal>
    </div>
  );
}

function StatusBadge({ status, verified }: { status: string; verified: boolean }) {
  if (status === "removed") return <AppleBadge variant="red">Removed</AppleBadge>;
  if (verified) return <AppleBadge variant="green"><ShieldCheckIcon size={10} aria-hidden />Verified</AppleBadge>;
  return <AppleBadge variant="amber">Pending</AppleBadge>;
}
