import { useQuery } from "@tanstack/react-query";
import type { RequestWithAreas } from "@/types";

async function fetchRequests(intent?: string): Promise<RequestWithAreas[]> {
  const params = intent ? `?intent=${intent}` : "";
  const res = await fetch(`/api/requests${params}`);
  if (!res.ok) throw new Error("Failed to fetch requests");
  return res.json();
}

export function useRequests(intent?: string) {
  return useQuery({
    queryKey: ["requests", intent],
    queryFn: () => fetchRequests(intent),
  });
}
