import { AreaManager } from "@/components/admin/AreaManager";

export const metadata = { title: "Areas — Zaylo Admin" };

export default function AdminAreas() {
  return (
    <div>
      <h1 className="text-title1 mb-6">Areas</h1>
      <AreaManager />
    </div>
  );
}
