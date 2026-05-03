import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { ListingWithLocation } from "@/types";

interface ListingsFilter {
  area_id?: string;
  intent?: "sale" | "rent";
  status?: string;
}

async function fetchListings(filter: ListingsFilter = {}): Promise<ListingWithLocation[]> {
  const params = new URLSearchParams();
  if (filter.area_id) params.set("area_id", filter.area_id);
  if (filter.intent) params.set("intent", filter.intent);
  if (filter.status) params.set("status", filter.status);
  const res = await fetch(`/api/listings?${params}`);
  if (!res.ok) throw new Error("Failed to fetch listings");
  return res.json();
}

export function useListings(filter?: ListingsFilter) {
  return useQuery({
    queryKey: ["listings", filter],
    queryFn: () => fetchListings(filter),
  });
}

export function useAdminListings() {
  return useQuery({
    queryKey: ["listings", "all"],
    queryFn: () => fetchListings({ status: "pending" }),
  });
}

export function useVerifyListing() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, verified }: { id: string; verified: boolean }) =>
      fetch(`/api/listings/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ verified, status: verified ? "active" : "pending" }) }).then((r) => r.json()),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["listings"] }),
  });
}

export function useRemoveListing() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => fetch(`/api/listings/${id}`, { method: "DELETE" }).then((r) => r.json()),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["listings"] }),
  });
}
