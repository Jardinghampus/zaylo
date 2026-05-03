"use client";
import { useState } from "react";
import { PlusIcon, XIcon, Trash2Icon } from "lucide-react";
import { AppleButton } from "@/components/ui/AppleButton";
import { useAreas, useAddArea, useDeleteArea, useAddSubArea, useDeleteSubArea } from "@/hooks/useAreas";

export function AreaManager() {
  const { data: areas = [], isLoading } = useAreas();
  const addArea = useAddArea();
  const deleteArea = useDeleteArea();
  const addSubArea = useAddSubArea();
  const deleteSubArea = useDeleteSubArea();

  const [newAreaName, setNewAreaName] = useState("");
  const [subInputs, setSubInputs] = useState<Record<string, string>>({});

  const handleAddArea = async () => {
    if (!newAreaName.trim()) return;
    await addArea.mutateAsync(newAreaName.trim());
    setNewAreaName("");
  };

  const handleAddSub = async (areaId: string) => {
    const name = subInputs[areaId]?.trim();
    if (!name) return;
    await addSubArea.mutateAsync({ areaId, name });
    setSubInputs((s) => ({ ...s, [areaId]: "" }));
  };

  return (
    <div className="space-y-4">
      {/* Add new area */}
      <div className="flex gap-3 items-center">
        <input
          value={newAreaName}
          onChange={(e) => setNewAreaName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAddArea()}
          placeholder="New area name…"
          className="flex-1 h-[44px] px-4 rounded-md border border-[var(--separator-thick)] text-[17px] bg-white focus:outline-none focus:border-apple-blue"
        />
        <AppleButton variant="primary" size="md" loading={addArea.isPending} onClick={handleAddArea}>
          <PlusIcon size={15} aria-hidden />
          Add Area
        </AppleButton>
      </div>

      {isLoading && <p className="text-subhead text-text-secondary">Loading…</p>}

      {areas.map((area) => (
        <div key={area.id} className="bg-white border border-[var(--separator)] rounded-xl p-4 shadow-card space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-headline">{area.name}</h3>
            <button
              onClick={() => deleteArea.mutate(area.id)}
              className="flex items-center gap-1.5 text-apple-red text-footnote hover:opacity-70 transition-opacity disabled:opacity-40"
              disabled={deleteArea.isPending}
              aria-label={`Remove ${area.name}`}
            >
              <Trash2Icon size={13} aria-hidden />
              Remove
            </button>
          </div>

          {/* Sub-area chips */}
          <div className="flex flex-wrap gap-2">
            {area.sub_areas.map((sub) => (
              <div
                key={sub.id}
                className="flex items-center gap-1.5 h-[30px] px-3 rounded-pill bg-[var(--fill-quaternary)] border border-[var(--separator)] text-subhead"
              >
                {sub.name}
                <button
                  onClick={() => deleteSubArea.mutate({ areaId: area.id, subId: sub.id })}
                  className="text-text-tertiary hover:text-apple-red transition-colors"
                  aria-label={`Remove ${sub.name}`}
                >
                  <XIcon size={12} strokeWidth={2.5} />
                </button>
              </div>
            ))}
          </div>

          {/* Add sub-area inline */}
          <div className="flex gap-2">
            <input
              value={subInputs[area.id] ?? ""}
              onChange={(e) => setSubInputs((s) => ({ ...s, [area.id]: e.target.value }))}
              onKeyDown={(e) => e.key === "Enter" && handleAddSub(area.id)}
              placeholder="Add sub-area…"
              className="flex-1 h-[36px] px-3 rounded-md border border-[var(--separator-thick)] text-subhead bg-[var(--fill-quaternary)] focus:outline-none focus:border-apple-blue focus:bg-white transition-colors"
            />
            <button
              onClick={() => handleAddSub(area.id)}
              className="h-[36px] px-3 rounded-md bg-[var(--fill-tertiary)] text-subhead text-text-secondary hover:bg-[var(--fill-secondary)] transition-colors"
              aria-label="Add sub-area"
            >
              <PlusIcon size={14} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
