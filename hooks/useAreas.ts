import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { AreaWithSubAreas } from "@/types";

async function fetchAreas(): Promise<AreaWithSubAreas[]> {
  const res = await fetch("/api/areas");
  if (!res.ok) throw new Error("Failed to fetch areas");
  return res.json();
}

export function useAreas() {
  return useQuery({ queryKey: ["areas"], queryFn: fetchAreas, staleTime: 5 * 60 * 1000 });
}

export function useAddArea() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (name: string) =>
      fetch("/api/areas", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name }) }).then((r) => r.json()),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["areas"] }),
  });
}

export function useDeleteArea() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => fetch(`/api/areas/${id}`, { method: "DELETE" }).then((r) => r.json()),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["areas"] }),
  });
}

export function useAddSubArea() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ areaId, name }: { areaId: string; name: string }) =>
      fetch(`/api/areas/${areaId}/subareas`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name }) }).then((r) => r.json()),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["areas"] }),
  });
}

export function useDeleteSubArea() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ areaId, subId }: { areaId: string; subId: string }) =>
      fetch(`/api/areas/${areaId}/subareas/${subId}`, { method: "DELETE" }).then((r) => r.json()),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["areas"] }),
  });
}
