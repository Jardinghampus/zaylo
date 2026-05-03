import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export const metadata = { title: "Admin — Zaylo" };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { userId, sessionClaims } = await auth();
  if (!userId || (sessionClaims?.publicMetadata as { role?: string })?.role !== "admin") {
    redirect("/");
  }
  return (
    <div className="flex min-h-dvh bg-bg-secondary">
      <AdminSidebar />
      <main className="flex-1 p-6 md:p-8 overflow-auto">{children}</main>
    </div>
  );
}
