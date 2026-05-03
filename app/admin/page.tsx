import { StatsBar } from "@/components/admin/StatsBar";

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-title1 mb-6">Dashboard</h1>
      <StatsBar />
      <p className="text-subhead text-text-secondary">
        Use the sidebar to manage listings, requests, and areas.
      </p>
    </div>
  );
}
