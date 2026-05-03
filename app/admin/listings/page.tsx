import { ListingTable } from "@/components/admin/ListingTable";

export const metadata = { title: "Listings — Zaylo Admin" };

export default function AdminListings() {
  return (
    <div>
      <h1 className="text-title1 mb-6">Listings</h1>
      <ListingTable />
    </div>
  );
}
